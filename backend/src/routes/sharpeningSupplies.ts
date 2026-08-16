import { Router } from "express";
import { prisma } from "../prisma";
import upload from "../middleware/upload";
import fs from "fs";
import path from "path";

const router = Router();


// ==================================================
// HELPERS
// ==================================================

function createSlug(title: string) {

  return title
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

}


async function createUniqueSlug(
  title: string,
  currentId?: string
) {

  const baseSlug =
    createSlug(title) || "sharpening-supply";

  let slug = baseSlug;
  let counter = 1;

  while (true) {

    const existing =
      await prisma.sharpeningSupply.findFirst({

        where: {

          slug,

          ...(currentId
            ? {
                NOT: {
                  id: currentId
                }
              }
            : {})

        }

      });


    if (!existing) {

      return slug;

    }


    counter++;

    slug =
      `${baseSlug}-${counter}`;

  }

}


// ==================================================
// GET ALL SHARPENING SUPPLIES
// ==================================================

router.get(
  "/",
  async (_req, res) => {

    try {

      const supplies =
        await prisma.sharpeningSupply.findMany({

          orderBy: {
            createdAt: "desc"
          }

        });


      return res.json(
        supplies
      );

    } catch (error) {

      console.error(
        "GET SHARPENING SUPPLIES ERROR:",
        error
      );


      return res.status(500).json({

        error:
          "Failed fetching sharpening supplies"

      });

    }

  }
);


// ==================================================
// GET SINGLE SHARPENING SUPPLY
// ==================================================

router.get(
  "/:identifier",
  async (req, res) => {

    try {

      const identifier =
        Array.isArray(
          req.params.identifier
        )
          ? req.params.identifier[0]
          : req.params.identifier;


      console.log(
        "GET SHARPENING SUPPLY IDENTIFIER:",
        identifier
      );


      const supply =
        await prisma.sharpeningSupply.findFirst({

          where: {

            OR: [

              {
                id: identifier
              },

              {
                slug: identifier
              }

            ]

          }

        });


      if (!supply) {

        console.log(
          "SHARPENING SUPPLY NOT FOUND:",
          identifier
        );


        return res.status(404).json({

          error:
            "Sharpening supply not found"

        });

      }


      return res.json(
        supply
      );

    } catch (error) {

      console.error(
        "GET SHARPENING SUPPLY ERROR:",
        error
      );


      return res.status(500).json({

        error:
          "Failed loading sharpening supply"

      });

    }

  }
);


// ==================================================
// CREATE SHARPENING SUPPLY
// ==================================================

router.post(
  "/",
  upload.array("images", 10),
  async (req, res) => {

    try {

      console.log(
        "CREATE SHARPENING SUPPLY BODY:",
        req.body
      );


      // ==================================================
      // TITLE
      // ==================================================

      if (
        !req.body.title ||
        !req.body.title.trim()
      ) {

        return res.status(400).json({

          error:
            "Sharpening supply title is required"

        });

      }


      // ==================================================
      // CATEGORY
      // ==================================================

      if (
        !req.body.category ||
        !req.body.category.trim()
      ) {

        return res.status(400).json({

          error:
            "Category is required"

        });

      }


      // ==================================================
      // PRICE
      // ==================================================

      const price =
        req.body.price !== undefined &&
        req.body.price !== "" &&
        !isNaN(
          Number(req.body.price)
        )
          ? Number(req.body.price)
          : 0;


      if (price <= 0) {

        return res.status(400).json({

          error:
            "A valid price is required"

        });

      }


      // ==================================================
      // STOCK
      // ==================================================

      const stock =
        req.body.stock !== undefined &&
        req.body.stock !== "" &&
        !isNaN(
          Number(req.body.stock)
        )
          ? Math.floor(
              Number(req.body.stock)
            )
          : 0;


      if (stock < 0) {

        return res.status(400).json({

          error:
            "Stock cannot be negative"

        });

      }


      // ==================================================
      // SLUG
      // ==================================================

      const slug =
        await createUniqueSlug(
          req.body.title
        );


      console.log(
        "GENERATED SLUG:",
        slug
      );


      // ==================================================
      // IMAGES
      // ==================================================

      const files =
        req.files as Express.Multer.File[];


      const imagePaths: string[] =
        files?.map(
          file =>
            `/uploads/${file.filename}`
        ) || [];


      // ==================================================
      // STATUS
      // ==================================================

      let status =
        req.body.status ||
        "available";


      if (stock === 0) {

        status =
          "sold-out";

      }


      // ==================================================
      // CREATE
      // ==================================================

      const supply =
        await prisma.sharpeningSupply.create({

          data: {

            title:
              req.body.title.trim(),

            slug,

            category:
              req.body.category.trim(),

            description:
              req.body.description?.trim() ||
              null,

            price,

            stock,

            images:
              imagePaths,

            status

          }

        });


      console.log(
        "SHARPENING SUPPLY CREATED:",
        supply.id,
        supply.title,
        supply.slug,
        supply.price,
        supply.stock,
        supply.status
      );


      return res.status(201).json(
        supply
      );

    } catch (error) {

      console.error(
        "CREATE SHARPENING SUPPLY ERROR:",
        error
      );


      return res.status(500).json({

        error:
          "Failed creating sharpening supply"

      });

    }

  }
);


// ==================================================
// UPDATE SHARPENING SUPPLY
// ==================================================

router.put(
  "/:id",
  upload.array("images", 10),
  async (req, res) => {

    try {

      const supplyId =
        Array.isArray(req.params.id)
          ? req.params.id[0]
          : req.params.id;


      // ==================================================
      // FIND SUPPLY
      // ==================================================

      const supply =
        await prisma.sharpeningSupply.findUnique({

          where: {
            id: supplyId
          }

        });


      if (!supply) {

        return res.status(404).json({

          error:
            "Sharpening supply not found"

        });

      }


      // ==================================================
      // TITLE
      // ==================================================

      if (
        !req.body.title ||
        !req.body.title.trim()
      ) {

        return res.status(400).json({

          error:
            "Sharpening supply title is required"

        });

      }


      // ==================================================
      // CATEGORY
      // ==================================================

      if (
        !req.body.category ||
        !req.body.category.trim()
      ) {

        return res.status(400).json({

          error:
            "Category is required"

        });

      }


      // ==================================================
      // PRICE
      // ==================================================

      const price =
        req.body.price !== undefined &&
        req.body.price !== "" &&
        !isNaN(
          Number(req.body.price)
        )
          ? Number(req.body.price)
          : 0;


      if (price <= 0) {

        return res.status(400).json({

          error:
            "A valid price is required"

        });

      }


      // ==================================================
      // STOCK
      // ==================================================

      const stock =
        req.body.stock !== undefined &&
        req.body.stock !== "" &&
        !isNaN(
          Number(req.body.stock)
        )
          ? Math.floor(
              Number(req.body.stock)
            )
          : supply.stock;


      if (stock < 0) {

        return res.status(400).json({

          error:
            "Stock cannot be negative"

        });

      }


      // ==================================================
      // EXISTING IMAGES
      // ==================================================

      let existingImages: string[] = [];


      if (req.body.existingImages) {

        try {

          const parsed =
            JSON.parse(
              req.body.existingImages
            );


          if (Array.isArray(parsed)) {

            existingImages =
              parsed.filter(

                (
                  image
                ): image is string =>

                  typeof image ===
                  "string"

              );

          }

        } catch {

          existingImages = [];

        }

      }


      // ==================================================
      // NEW IMAGES
      // ==================================================

      const files =
        req.files as Express.Multer.File[];


      const newImages: string[] =
        files?.map(

          file =>
            `/uploads/${file.filename}`

        ) || [];


      const finalImages: string[] = [

        ...existingImages,

        ...newImages

      ];


      // ==================================================
      // OLD IMAGES
      // ==================================================

      const oldImages: string[] =

        Array.isArray(supply.images)

          ? supply.images.filter(

              (
                image
              ): image is string =>

                typeof image ===
                "string"

            )

          : [];


      // ==================================================
      // SLUG
      // ==================================================

      let slug =
        req.body.slug?.trim();


      if (!slug) {

        slug =
          await createUniqueSlug(
            req.body.title,
            supplyId
          );

      } else {

        slug =
          await createUniqueSlug(
            slug,
            supplyId
          );

      }


      // ==================================================
      // STATUS
      // ==================================================

      let status =
        req.body.status ||
        "available";


      if (stock === 0) {

        status =
          "sold-out";

      }


      // ==================================================
      // UPDATE
      // ==================================================

      const updatedSupply =
        await prisma.sharpeningSupply.update({

          where: {

            id:
              supplyId

          },

          data: {

            title:
              req.body.title.trim(),

            slug,

            category:
              req.body.category.trim(),

            description:
              req.body.description?.trim() ||
              null,

            price,

            stock,

            images:
              finalImages,

            status

          }

        });


      // ==================================================
      // DELETE REMOVED IMAGES
      // ==================================================

      const removedImages: string[] =
        oldImages.filter(

          image =>
            !existingImages.includes(
              image
            )

        );


      removedImages.forEach(
        (image: string) => {

          try {

            const filePath =
              path.join(
                __dirname,
                "../../",
                image
              );


            if (
              fs.existsSync(
                filePath
              )
            ) {

              fs.unlinkSync(
                filePath
              );

            }

          } catch (error) {

            console.error(
              "IMAGE DELETE ERROR:",
              error
            );

          }

        }
      );


      console.log(
        "SHARPENING SUPPLY UPDATED:",
        updatedSupply.id,
        updatedSupply.title,
        updatedSupply.slug,
        updatedSupply.price,
        updatedSupply.stock,
        updatedSupply.status
      );


      return res.json(
        updatedSupply
      );

    } catch (error) {

      console.error(
        "UPDATE SHARPENING SUPPLY ERROR:",
        error
      );


      return res.status(500).json({

        error:
          "Failed updating sharpening supply"

      });

    }

  }
);


// ==================================================
// DELETE SHARPENING SUPPLY
// ==================================================

router.delete(
  "/:id",
  async (req, res) => {

    try {

      const supplyId =
        Array.isArray(req.params.id)
          ? req.params.id[0]
          : req.params.id;


      // ==================================================
      // FIND SUPPLY
      // ==================================================

      const supply =
        await prisma.sharpeningSupply.findUnique({

          where: {

            id:
              supplyId

          }

        });


      if (!supply) {

        return res.status(404).json({

          error:
            "Sharpening supply not found"

        });

      }


      // ==================================================
      // DELETE IMAGES
      // ==================================================

      const images: string[] =

        Array.isArray(supply.images)

          ? supply.images.filter(

              (
                image
              ): image is string =>

                typeof image ===
                "string"

            )

          : [];


      images.forEach(
        (image: string) => {

          try {

            const filePath =
              path.join(
                __dirname,
                "../../",
                image
              );


            if (
              fs.existsSync(
                filePath
              )
            ) {

              fs.unlinkSync(
                filePath
              );

            }

          } catch (error) {

            console.error(
              "IMAGE DELETE ERROR:",
              error
            );

          }

        }
      );


      // ==================================================
      // DELETE DATABASE RECORD
      // ==================================================

      await prisma.sharpeningSupply.delete({

        where: {

          id:
            supplyId

        }

      });


      console.log(
        "SHARPENING SUPPLY DELETED:",
        supplyId
      );


      return res.json({

        message:
          "Sharpening supply deleted"

      });

    } catch (error) {

      console.error(
        "DELETE SHARPENING SUPPLY ERROR:",
        error
      );


      return res.status(500).json({

        error:
          "Failed deleting sharpening supply"

      });

    }

  }
);


export default router;