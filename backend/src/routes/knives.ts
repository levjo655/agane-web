import { Router } from "express";
import { prisma } from "../prisma";
import upload from "../middleware/upload";
import fs from "fs";
import path from "path";

const router = Router();


// ==========================
// GET ALL KNIVES
// ==========================

router.get("/", async (_req, res) => {

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
      error: "Failed fetching knives"
    });

  }

});


// ==========================
// GET SINGLE KNIFE
// ==========================

router.get("/:identifier", async (req, res) => {

  try {

    const identifier =
      Array.isArray(req.params.identifier)
        ? req.params.identifier[0]
        : req.params.identifier;


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

      return res.status(404).json({
        error: "Knife not found"
      });

    }


    res.json(knife);

  } catch (error) {

    console.error(
      "GET KNIFE ERROR:",
      error
    );

    res.status(500).json({
      error: "Failed loading knife"
    });

  }

});


// ==========================
// CREATE KNIFE
// ==========================

router.post(
  "/",
  upload.array("images", 10),
  async (req, res) => {

    try {

      if (!req.body.makerId) {

        return res.status(400).json({
          error: "Maker is required"
        });

      }


      const files =
        req.files as Express.Multer.File[];


      const imagePaths: string[] =
        files?.map(
          file => `/uploads/${file.filename}`
        ) || [];


      const knife =
        await prisma.knife.create({

          data: {

            title:
              req.body.title,

            slug:
              req.body.slug,

            maker: {

              connect: {
                id: req.body.makerId
              }

            },

            origin:
              req.body.origin || null,

            steel:
              req.body.steel || null,

            bladeType:
              req.body.bladeType || null,

            length:
              req.body.length || null,

            handle:
              req.body.handle || null,

            weight:
              req.body.weight &&
              !isNaN(Number(req.body.weight))
                ? Number(req.body.weight)
                : null,

            price:
              req.body.price &&
              !isNaN(Number(req.body.price))
                ? Number(req.body.price)
                : 0,

            description:
              req.body.description || null,

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


      res.json(knife);

    } catch (error) {

      console.error(
        "CREATE KNIFE ERROR:",
        error
      );

      res.status(500).json({
        error: "Failed creating knife"
      });

    }

  }
);


// ==========================
// UPDATE KNIFE
// ==========================

router.put(
  "/:id",
  upload.array("images", 10),
  async (req, res) => {

    try {

      const knifeId =
        Array.isArray(req.params.id)
          ? req.params.id[0]
          : req.params.id;


      const knife =
        await prisma.knife.findUnique({

          where: {
            id: knifeId
          }

        });


      if (!knife) {

        return res.status(404).json({
          error: "Knife not found"
        });

      }


      // ==========================
      // EXISTING IMAGES
      // ==========================

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
                (image): image is string =>
                  typeof image === "string"
              );

          }

        } catch {

          existingImages = [];

        }

      }


      // ==========================
      // NEW IMAGES
      // ==========================

      const files =
        req.files as Express.Multer.File[];


      const newImages: string[] =
        files?.map(
          file => `/uploads/${file.filename}`
        ) || [];


      const finalImages: string[] = [

        ...existingImages,

        ...newImages

      ];


      // ==========================
      // OLD IMAGES
      // ==========================

      const oldImages: string[] =
        Array.isArray(knife.images)
          ? knife.images.filter(
              (image): image is string =>
                typeof image === "string"
            )
          : [];


      // ==========================
      // UPDATE DATABASE
      // ==========================

      const updatedKnife =
        await prisma.knife.update({

          where: {

            id: knifeId

          },

          data: {

            title:
              req.body.title,

            slug:
              req.body.slug,

            maker: {

              connect: {

                id: req.body.makerId

              }

            },

            origin:
              req.body.origin || null,

            steel:
              req.body.steel || null,

            bladeType:
              req.body.bladeType || null,

            length:
              req.body.length || null,

            handle:
              req.body.handle || null,

            weight:
              req.body.weight &&
              !isNaN(Number(req.body.weight))
                ? Number(req.body.weight)
                : null,

            price:
              req.body.price &&
              !isNaN(Number(req.body.price))
                ? Number(req.body.price)
                : 0,

            description:
              req.body.description || null,

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


      // ==========================
      // DELETE REMOVED IMAGE FILES
      // ==========================

      const removedImages: string[] =
        oldImages.filter(
          image =>
            !existingImages.includes(image)
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
              fs.existsSync(filePath)
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


      res.json(
        updatedKnife
      );

    } catch (error) {

      console.error(
        "UPDATE KNIFE ERROR:",
        error
      );

      res.status(500).json({
        error: "Failed updating knife"
      });

    }

  }
);


// ==========================
// DELETE KNIFE
// ==========================

router.delete(
  "/:id",
  async (req, res) => {

    try {

      const knifeId =
        Array.isArray(req.params.id)
          ? req.params.id[0]
          : req.params.id;


      const knife =
        await prisma.knife.findUnique({

          where: {

            id: knifeId

          }

        });


      if (!knife) {

        return res.status(404).json({
          error: "Knife not found"
        });

      }


      // ==========================
      // DELETE IMAGE FILES
      // ==========================

      const images: string[] =
        Array.isArray(knife.images)
          ? knife.images.filter(
              (image): image is string =>
                typeof image === "string"
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
              fs.existsSync(filePath)
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


      // ==========================
      // DELETE KNIFE
      // ==========================

      await prisma.knife.delete({

        where: {

          id: knifeId

        }

      });


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