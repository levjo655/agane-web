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
    createSlug(title) || "knife";

  let slug = baseSlug;
  let counter = 1;

  while (true) {

    const existing =
      await prisma.knife.findFirst({

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
// GET ALL KNIVES
// ==================================================

router.get(
  "/",
  async (_req, res) => {

    try {

      const knives =
        await prisma.knife.findMany({

          include: {
            maker: true
          },

          orderBy: {
            createdAt: "desc"
          }

        });


      res.json(knives);

    } catch (error) {

      console.error(
        "GET KNIVES ERROR:",
        error
      );


      res.status(500).json({

        error:
          "Failed fetching knives"

      });

    }

  }
);


// ==================================================
// GET SINGLE KNIFE
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
        "GET KNIFE IDENTIFIER:",
        identifier
      );


      const knife =
        await prisma.knife.findFirst({

          where: {

            OR: [

              {
                id: identifier
              },

              {
                slug: identifier
              }

            ]

          },

          include: {
            maker: true
          }

        });


      if (!knife) {

        console.log(
          "KNIFE NOT FOUND:",
          identifier
        );


        return res.status(404).json({

          error:
            "Knife not found"

        });

      }


      console.log(
        "RETURNING KNIFE:",
        knife.id,
        knife.title,
        knife.slug,
        knife.price
      );


      res.json(knife);

    } catch (error) {

      console.error(
        "GET KNIFE ERROR:",
        error
      );


      res.status(500).json({

        error:
          "Failed loading knife"

      });

    }

  }
);


// ==================================================
// CREATE KNIFE
// ==================================================

router.post(
  "/",
  upload.array("images", 10),
  async (req, res) => {

    try {

      console.log(
        "CREATE KNIFE BODY:",
        req.body
      );


      // ------------------------------------------
      // VALIDATE MAKER
      // ------------------------------------------

      if (!req.body.makerId) {

        return res.status(400).json({

          error:
            "Maker is required"

        });

      }


      // ------------------------------------------
      // VALIDATE TITLE
      // ------------------------------------------

      if (
        !req.body.title ||
        !req.body.title.trim()
      ) {

        return res.status(400).json({

          error:
            "Knife title is required"

        });

      }


      // ------------------------------------------
      // CHECK MAKER EXISTS
      // ------------------------------------------

      const maker =
        await prisma.maker.findUnique({

          where: {
            id: req.body.makerId
          }

        });


      if (!maker) {

        return res.status(400).json({

          error:
            "Maker not found"

        });

      }


      // ------------------------------------------
      // CREATE SLUG
      // ------------------------------------------

      const slug =
        await createUniqueSlug(
          req.body.title
        );


      console.log(
        "GENERATED SLUG:",
        slug
      );


      // ------------------------------------------
      // IMAGES
      // ------------------------------------------

      const files =
        req.files as Express.Multer.File[];


      const imagePaths: string[] =
        files?.map(
          file =>
            `/uploads/${file.filename}`
        ) || [];


      // ------------------------------------------
      // PRICE
      // ------------------------------------------

      const price =
        req.body.price &&
        !isNaN(
          Number(req.body.price)
        )
          ? Number(req.body.price)
          : 0;


      // ------------------------------------------
      // WEIGHT
      // ------------------------------------------

      const weight =
        req.body.weight &&
        !isNaN(
          Number(req.body.weight)
        )
          ? Number(req.body.weight)
          : null;


      // ------------------------------------------
      // CREATE KNIFE
      // ------------------------------------------

      const knife =
        await prisma.knife.create({

          data: {

            title:
              req.body.title.trim(),

            slug,

            maker: {

              connect: {
                id: req.body.makerId
              }

            },

            origin:
              req.body.origin?.trim() ||
              null,

            steel:
              req.body.steel?.trim() ||
              null,

            bladeType:
              req.body.bladeType?.trim() ||
              null,

            length:
              req.body.length?.trim() ||
              null,

            handle:
              req.body.handle?.trim() ||
              null,

            weight,

            price,

            description:
              req.body.description?.trim() ||
              null,

            images:
              imagePaths,

            status:
              req.body.status ||
              "available"

          },

          include: {

            maker: true

          }

        });


      console.log(
        "KNIFE CREATED:",
        knife.id,
        knife.title,
        knife.slug,
        knife.price
      );


      res.status(201).json(
        knife
      );

    } catch (error) {

      console.error(
        "CREATE KNIFE ERROR:",
        error
      );


      res.status(500).json({

        error:
          "Failed creating knife"

      });

    }

  }
);


// ==================================================
// UPDATE KNIFE
// ==================================================

router.put(
  "/:id",
  upload.array("images", 10),
  async (req, res) => {

    try {

      const knifeId =
        Array.isArray(req.params.id)
          ? req.params.id[0]
          : req.params.id;


      // ------------------------------------------
      // FIND KNIFE
      // ------------------------------------------

      const knife =
        await prisma.knife.findUnique({

          where: {
            id: knifeId
          }

        });


      if (!knife) {

        return res.status(404).json({

          error:
            "Knife not found"

        });

      }


      // ------------------------------------------
      // VALIDATE MAKER
      // ------------------------------------------

      if (!req.body.makerId) {

        return res.status(400).json({

          error:
            "Maker is required"

        });

      }


      // ------------------------------------------
      // EXISTING IMAGES
      // ------------------------------------------

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


      // ------------------------------------------
      // NEW IMAGES
      // ------------------------------------------

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


      // ------------------------------------------
      // OLD IMAGES
      // ------------------------------------------

      const oldImages: string[] =

        Array.isArray(knife.images)

          ? knife.images.filter(

              (
                image
              ): image is string =>

                typeof image ===
                "string"

            )

          : [];


      // ------------------------------------------
      // SLUG
      // ------------------------------------------

      let slug =
        req.body.slug?.trim();


      if (!slug) {

        slug =
          await createUniqueSlug(
            req.body.title,
            knifeId
          );

      } else {

        slug =
          await createUniqueSlug(
            slug,
            knifeId
          );

      }


      // ------------------------------------------
      // PRICE
      // ------------------------------------------

      const price =
        req.body.price &&
        !isNaN(
          Number(req.body.price)
        )
          ? Number(req.body.price)
          : 0;


      // ------------------------------------------
      // WEIGHT
      // ------------------------------------------

      const weight =
        req.body.weight &&
        !isNaN(
          Number(req.body.weight)
        )
          ? Number(req.body.weight)
          : null;


      // ------------------------------------------
      // UPDATE
      // ------------------------------------------

      const updatedKnife =
        await prisma.knife.update({

          where: {

            id:
              knifeId

          },

          data: {

            title:
              req.body.title?.trim(),

            slug,

            maker: {

              connect: {

                id:
                  req.body.makerId

              }

            },

            origin:
              req.body.origin?.trim() ||
              null,

            steel:
              req.body.steel?.trim() ||
              null,

            bladeType:
              req.body.bladeType?.trim() ||
              null,

            length:
              req.body.length?.trim() ||
              null,

            handle:
              req.body.handle?.trim() ||
              null,

            weight,

            price,

            description:
              req.body.description?.trim() ||
              null,

            images:
              finalImages,

            status:
              req.body.status ||
              "available"

          },

          include: {

            maker: true

          }

        });


      // ------------------------------------------
      // DELETE REMOVED IMAGES
      // ------------------------------------------

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
        "KNIFE UPDATED:",
        updatedKnife.id,
        updatedKnife.title,
        updatedKnife.slug
      );


      res.json(
        updatedKnife
      );

    } catch (error) {

      console.error(
        "UPDATE KNIFE ERROR:",
        error
      );


      res.status(500).json({

        error:
          "Failed updating knife"

      });

    }

  }
);


// ==================================================
// DELETE KNIFE
// ==================================================

router.delete(
  "/:id",
  async (req, res) => {

    try {

      const knifeId =
        Array.isArray(req.params.id)
          ? req.params.id[0]
          : req.params.id;


      // ------------------------------------------
      // FIND KNIFE
      // ------------------------------------------

      const knife =
        await prisma.knife.findUnique({

          where: {

            id:
              knifeId

          }

        });


      if (!knife) {

        return res.status(404).json({

          error:
            "Knife not found"

        });

      }


      // ------------------------------------------
      // DELETE IMAGES
      // ------------------------------------------

      const images: string[] =

        Array.isArray(knife.images)

          ? knife.images.filter(

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


      // ------------------------------------------
      // DELETE DATABASE RECORD
      // ------------------------------------------

      await prisma.knife.delete({

        where: {

          id:
            knifeId

        }

      });


      console.log(
        "KNIFE DELETED:",
        knifeId
      );


      res.json({

        message:
          "Knife deleted"

      });

    } catch (error) {

      console.error(
        "DELETE KNIFE ERROR:",
        error
      );


      res.status(500).json({

        error:
          "Failed deleting knife"

      });

    }

  }
);


export default router;