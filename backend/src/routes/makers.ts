import { Router } from "express";
import { prisma } from "../prisma";


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


  } catch(error) {

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

router.get("/:id", async(req,res)=>{


  try {


    const maker =
      await prisma.maker.findFirst({

        where: {

          OR: [

            {
              id:req.params.id
            },

            {
              slug:req.params.id
            }

          ]

        },


        include: {

          knives:true,

          collaborations:true

        }


      });




    if(!maker){

      return res.status(404).json({

        error:"Maker not found"

      });

    }



    res.json(maker);



  } catch(error) {


    console.error(
      "GET MAKER ERROR:",
      error
    );


    res.status(500).json({

      error:String(error)

    });


  }


});









// ==========================
// CREATE MAKER
// ==========================

router.post("/", async(req,res)=>{


  try {


    console.log(
      "CREATE MAKER BODY:",
      req.body
    );



    const maker =
      await prisma.maker.create({

        data:{


          name:
          req.body.name,



          slug:
          req.body.slug,



          country:
          req.body.country || null,



          bio:
          req.body.bio || null,



          image:
          req.body.image || null,



          website:
          req.body.website || null,



          instagram:
          req.body.instagram || null



        }


      });





    res.json(maker);



  } catch(error) {


    console.error(
      "CREATE MAKER ERROR:",
      error
    );



    res.status(500).json({

      error:String(error)

    });



  }


});









// ==========================
// UPDATE MAKER
// ==========================

router.put("/:id", async(req,res)=>{


  try {


    const maker =
      await prisma.maker.update({

        where:{

          id:req.params.id

        },


        data:{


          name:
          req.body.name,



          slug:
          req.body.slug,



          country:
          req.body.country || null,



          bio:
          req.body.bio || null,



          image:
          req.body.image || null,



          website:
          req.body.website || null,



          instagram:
          req.body.instagram || null



        }


      });



    res.json(maker);



  } catch(error) {


    console.error(
      "UPDATE MAKER ERROR:",
      error
    );



    res.status(500).json({

      error:String(error)

    });



  }


});









// ==========================
// DELETE MAKER
// ==========================

router.delete("/:id", async(req,res)=>{


  try {


    await prisma.maker.delete({

      where:{

        id:req.params.id

      }

    });



    res.json({

      message:"Maker deleted"

    });



  } catch(error) {


    console.error(
      "DELETE MAKER ERROR:",
      error
    );



    res.status(500).json({

      error:String(error)

    });


  }


});









export default router;