import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();


// GET ALL COLLABORATIONS

router.get("/", async(req,res)=>{

  try{

    const collaborations =
      await prisma.collaboration.findMany({
        orderBy:{
          createdAt:"desc"
        }
      });


    res.json(collaborations);


  }catch(error){

    console.log(error);

    res.status(500).json({
      error:"Failed loading collaborations"
    });

  }

});




// CREATE COLLABORATION

router.post("/", async(req,res)=>{


  try{


    const collaboration =
      await prisma.collaboration.create({

        data:{

          maker:req.body.maker,

          title:req.body.title,

          description:req.body.description,

          quantity:Number(req.body.quantity),

          status:req.body.status || "upcoming",

          releaseDate:
            req.body.releaseDate
            ? new Date(req.body.releaseDate)
            : null,

          image:req.body.image || null

        }

      });



    res.json(collaboration);



  }catch(error){


    console.log(error);


    res.status(500).json({
      error:"Failed creating collaboration"
    });


  }


});



export default router;