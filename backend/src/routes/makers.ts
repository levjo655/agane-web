import { Router } from "express";
import { prisma } from "../prisma";
import upload from "../middleware/upload";
import fs from "fs";
import path from "path";

const router = Router();


// ==========================
// GET ALL MAKERS
// ==========================

router.get("/", async (_req, res) => {

  try {

    const makers =
      await prisma.maker.findMany({

        orderBy: {
          createdAt: "desc"
        }

      });

    res.json(makers);

  } catch (error) {

    console.error(
      "GET MAKERS ERROR:",
      error
    );

    res.status(500).json({
      error: String(error)
    });

  }

});


// ==========================
// GET SINGLE MAKER
// BY ID OR SLUG
// ==========================

router.get("/:id", async (req, res) => {

  try {

    const identifier =
      Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;


    const maker =
      await prisma.maker.findFirst({

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

          knives: true,

          collaborations: true

        }

      });


    if (!maker) {

      return res.status(404).json({
        error: "Maker not found"
      });

    }


    res.json(maker);

  } catch (error) {

    console.error(
      "GET MAKER ERROR:",
      error
    );

    res.status(500).json({
      error: String(error)
    });

  }

});


// ==========================
// CREATE MAKER
// ==========================

router.post(
  "/",
  upload.single("image"),
  async (req, res) => {

    try {

      console.log(
        "CREATE MAKER BODY:",
        req.body
      );


      const file =
        req.file;


      const image =
        file
          ? `/uploads/${file.filename}`
          : req.body.image || null;


      const maker =
        await prisma.maker.create({

          data: {

            name:
              req.body.name,

            slug:
              req.body.slug,

            country:
              req.body.country || null,

            bio:
              req.body.bio || null,

            image,

            website:
              req.body.website || null,

            instagram:
              req.body.instagram || null

          }

        });


      res.json(maker);

    } catch (error) {

      console.error(
        "CREATE MAKER ERROR:",
        error
      );

      res.status(500).json({
        error: String(error)
      });

    }

  }
);


// ==========================
// UPDATE MAKER
// ==========================

router.put(
  "/:id",
  upload.single("image"),
  async (req, res) => {

    try {

      const makerId =
        Array.isArray(req.params.id)
          ? req.params.id[0]
          : req.params.id;


      const existingMaker =
        await prisma.maker.findUnique({

          where: {
            id: makerId
          }

        });


      if (!existingMaker) {

        return res.status(404).json({
          error: "Maker not found"
        });

      }


      const file =
        req.file;


      let image =
        existingMaker.image;


      // New uploaded image
      if (file) {

        image =
          `/uploads/${file.filename}`;


        // Delete old image
        if (existingMaker.image) {

          try {

            const oldPath =
              path.join(
                __dirname,
                "../../",
                existingMaker.image
              );


            if (fs.existsSync(oldPath)) {

              fs.unlinkSync(oldPath);

            }

          } catch (error) {

            console.error(
              "OLD MAKER IMAGE DELETE ERROR:",
              error
            );

          }

        }

      }


      // Allow explicit image value
      if (
        !file &&
        req.body.image !== undefined
      ) {

        image =
          req.body.image || null;

      }


      const maker =
        await prisma.maker.update({

          where: {

            id: makerId

          },

          data: {

            name:
              req.body.name,

            slug:
              req.body.slug,

            country:
              req.body.country || null,

            bio:
              req.body.bio || null,

            image,

            website:
              req.body.website || null,

            instagram:
              req.body.instagram || null

          }

        });


      res.json(maker);

    } catch (error) {

      console.error(
        "UPDATE MAKER ERROR:",
        error
      );

      res.status(500).json({
        error: String(error)
      });

    }

  }
);


// ==========================
// DELETE MAKER
// ==========================

router.delete("/:id", async (req, res) => {

  try {

    const makerId =
      Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;


    const maker =
      await prisma.maker.findUnique({

        where: {
          id: makerId
        }

      });


    if (!maker) {

      return res.status(404).json({
        error: "Maker not found"
      });

    }


    // Delete maker image
    if (maker.image) {

      try {

        const imagePath =
          path.join(
            __dirname,
            "../../",
            maker.image
          );


        if (fs.existsSync(imagePath)) {

          fs.unlinkSync(imagePath);

        }

      } catch (error) {

        console.error(
          "MAKER IMAGE DELETE ERROR:",
          error
        );

      }

    }


    await prisma.maker.delete({

      where: {

        id: makerId

      }

    });


    res.json({

      message: "Maker deleted"

    });

  } catch (error) {

    console.error(
      "DELETE MAKER ERROR:",
      error
    );

    res.status(500).json({

      error: String(error)

    });

  }

});


export default router;