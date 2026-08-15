import { Router } from "express";
import { prisma } from "../prisma";
import upload from "../middleware/upload";
import fs from "fs";
import path from "path";

const router = Router();


// ==========================
// GET ALL COLLABORATIONS
// ==========================

router.get("/", async (_req, res) => {

  try {

    const collaborations =
      await prisma.collaboration.findMany({

        include: {
          maker: true
        },

        orderBy: {
          createdAt: "desc"
        }

      });


    res.json(collaborations);

  } catch (error) {

    console.error(
      "GET COLLABORATIONS ERROR:",
      error
    );

    res.status(500).json({
      error: "Failed fetching collaborations"
    });

  }

});


// ==========================
// GET SINGLE COLLABORATION
// ==========================

router.get("/:id", async (req, res) => {

  try {

    const collaborationId =
      Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;


    const collaboration =
      await prisma.collaboration.findUnique({

        where: {
          id: collaborationId
        },

        include: {
          maker: true
        }

      });


    if (!collaboration) {

      return res.status(404).json({
        error: "Collaboration not found"
      });

    }


    res.json(collaboration);

  } catch (error) {

    console.error(
      "GET COLLABORATION ERROR:",
      error
    );

    res.status(500).json({
      error: "Failed loading collaboration"
    });

  }

});


// ==========================
// CREATE COLLABORATION
// ==========================

router.post(
  "/",
  upload.single("image"),
  async (req, res) => {

    try {

      const imagePath =
        req.file
          ? `/uploads/${req.file.filename}`
          : null;


      const quantity =
        Number(req.body.quantity);


      const collaboration =
        await prisma.collaboration.create({

          data: {

            title:
              req.body.title,

            makerId:
              req.body.makerId || null,

            description:
              req.body.description || null,

            quantity:
              Number.isNaN(quantity)
                ? 0
                : quantity,

            status:
              req.body.status ||
              "upcoming",

            releaseDate:
              req.body.releaseDate
                ? new Date(
                    req.body.releaseDate
                  )
                : null,

            image:
              imagePath

          },

          include: {
            maker: true
          }

        });


      res.json(collaboration);

    } catch (error) {

      console.error(
        "CREATE COLLABORATION ERROR:",
        error
      );

      res.status(500).json({
        error: "Failed creating collaboration"
      });

    }

  }
);


// ==========================
// UPDATE COLLABORATION
// ==========================

router.put(
  "/:id",
  upload.single("image"),
  async (req, res) => {

    try {

      const collaborationId =
        Array.isArray(req.params.id)
          ? req.params.id[0]
          : req.params.id;


      // ==========================
      // FIND EXISTING
      // ==========================

      const existing =
        await prisma.collaboration.findUnique({

          where: {
            id: collaborationId
          }

        });


      if (!existing) {

        return res.status(404).json({

          error:
            "Collaboration not found"

        });

      }


      // ==========================
      // IMAGE LOGIC
      // ==========================

      let image =
        existing.image;


      const removeImage =
        req.body.removeImage === "true";


      // --------------------------
      // REMOVE IMAGE
      // --------------------------

      if (
        removeImage &&
        existing.image
      ) {

        try {

          const oldPath =
            path.join(
              __dirname,
              "../../",
              existing.image
            );


          if (
            fs.existsSync(oldPath)
          ) {

            fs.unlinkSync(
              oldPath
            );

          }

        } catch (error) {

          console.error(
            "REMOVE COLLAB IMAGE ERROR:",
            error
          );

        }


        image = null;

      }


      // --------------------------
      // NEW IMAGE
      // --------------------------

      if (req.file) {

        // If there is an old image,
        // delete it first.

        if (existing.image) {

          try {

            const oldPath =
              path.join(
                __dirname,
                "../../",
                existing.image
              );


            if (
              fs.existsSync(oldPath)
            ) {

              fs.unlinkSync(
                oldPath
              );

            }

          } catch (error) {

            console.error(
              "OLD COLLAB IMAGE DELETE ERROR:",
              error
            );

          }

        }


        image =
          `/uploads/${req.file.filename}`;

      }


      // ==========================
      // QUANTITY
      // ==========================

      const quantity =
        Number(req.body.quantity);


      // ==========================
      // UPDATE
      // ==========================

      const collaboration =
        await prisma.collaboration.update({

          where: {

            id:
              collaborationId

          },

          data: {

            title:
              req.body.title,

            makerId:
              req.body.makerId ||
              null,

            description:
              req.body.description ||
              null,

            quantity:
              Number.isNaN(quantity)
                ? 0
                : quantity,

            status:
              req.body.status ||
              "upcoming",

            releaseDate:
              req.body.releaseDate
                ? new Date(
                    req.body.releaseDate
                  )
                : null,

            image

          },

          include: {

            maker: true

          }

        });


      res.json(
        collaboration
      );


    } catch (error) {

      console.error(
        "UPDATE COLLABORATION ERROR:",
        error
      );


      res.status(500).json({

        error:
          "Failed updating collaboration"

      });

    }

  }
);


// ==========================
// DELETE COLLABORATION
// ==========================

router.delete(
  "/:id",
  async (req, res) => {

    try {

      const collaborationId =
        Array.isArray(req.params.id)
          ? req.params.id[0]
          : req.params.id;


      const collaboration =
        await prisma.collaboration.findUnique({

          where: {

            id:
              collaborationId

          }

        });


      if (!collaboration) {

        return res.status(404).json({

          error:
            "Collaboration not found"

        });

      }


      // ==========================
      // DELETE IMAGE
      // ==========================

      if (collaboration.image) {

        try {

          const imagePath =
            path.join(
              __dirname,
              "../../",
              collaboration.image
            );


          if (
            fs.existsSync(imagePath)
          ) {

            fs.unlinkSync(
              imagePath
            );

          }

        } catch (error) {

          console.error(
            "COLLAB IMAGE DELETE ERROR:",
            error
          );

        }

      }


      // ==========================
      // DELETE DATABASE RECORD
      // ==========================

      await prisma.collaboration.delete({

        where: {

          id:
            collaborationId

        }

      });


      res.json({

        message:
          "Collaboration deleted"

      });


    } catch (error) {

      console.error(
        "DELETE COLLABORATION ERROR:",
        error
      );


      res.status(500).json({

        error:
          "Failed deleting collaboration"

      });

    }

  }
);


export default router;