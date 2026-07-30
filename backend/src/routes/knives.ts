import { Router } from "express";
import multer from "multer";
import path from "path";
import { prisma } from "../prisma";


const router = Router();



const storage = multer.diskStorage({

  destination: (_req, _file, cb) => {

    cb(null, "uploads/");

  },


  filename: (_req, file, cb) => {

    const uniqueName =
      Date.now() +
      "-" +
      file.originalname;


    cb(null, uniqueName);

  }

});


const upload = multer({
  storage
});





// GET ALL KNIVES

router.get("/", async (_req, res) => {

  try {

    const knives =
      await prisma.knife.findMany({
        orderBy:{
          createdAt:"desc"
        }
      });


    res.json(knives);


  } catch(error){

    console.error(error);

    res.status(500)
      .json({
        error:"Failed to fetch knives"
      });

  }

});






// CREATE KNIFE WITH IMAGES

router.post(
  "/",
  upload.array("images", 10),
  async (req,res)=>{


    try {


      const files =
        req.files as Express.Multer.File[];



      const imagePaths =
        files?.map(
          file =>
            `/uploads/${file.filename}`
        ) || [];



      const knife =
        await prisma.knife.create({

          data:{

            title:req.body.title,

            slug:req.body.slug,

            maker:req.body.maker,

            origin:req.body.origin,

            steel:req.body.steel,

            length:req.body.length,

            handle:req.body.handle,

            weight:
              req.body.weight
              ? Number(req.body.weight)
              : null,


            description:
              req.body.description,


            price:
              Number(req.body.price),


            images:imagePaths

          }

        });



      res.json(knife);


    } catch(error){


      console.error(error);


      res.status(500)
      .json({
        error:"Failed to create knife"
      });


    }


  }
);



export default router;