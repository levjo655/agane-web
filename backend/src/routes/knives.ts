import { Router } from "express";
import multer from "multer";
import { prisma } from "../prisma";


const router = Router();

// ==========================
// UPDATE KNIFE
// ==========================


router.put("/:id", async(req,res)=>{


try{


const knife =

await prisma.knife.update({


where:{

id:req.params.id

},



data:{


title:
req.body.title,


slug:
req.body.slug,


maker:
req.body.maker,


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
req.body.weight
?
Number(req.body.weight)
:
null,


description:
req.body.description || null,


price:
Number(req.body.price),



status:
req.body.status || "available"



}



});




res.json(knife);



}catch(error){


console.error(
"UPDATE KNIFE ERROR:",
error
);



res.status(500).json({

error:"Failed updating knife"

});



}


});



// ==========================
// IMAGE STORAGE
// ==========================


const storage = multer.diskStorage({

  destination: (_req, _file, cb) => {

    cb(null, "uploads/");

  },


  filename: (_req, file, cb) => {


    const uniqueName =
      Date.now() +
      "-" +
      file.originalname
        .replace(/\s+/g, "-");


    cb(null, uniqueName);


  }


});



const upload = multer({

  storage,

  limits:{

    fileSize:10 * 1024 * 1024

  }

});







// ==========================
// GET ALL KNIVES
// ==========================


router.get("/", async (_req,res)=>{


  try{


    const knives =
      await prisma.knife.findMany({

        orderBy:{

          createdAt:"desc"

        }

      });



    res.json(knives);



  }

  catch(error){


    console.error(
      "FETCH KNIVES ERROR:",
      error
    );


    res.status(500).json({

      error:"Failed to fetch knives"

    });


  }


});









// ==========================
// CREATE KNIFE
// ==========================


router.post(

"/",

upload.array("images",10),


async(req,res)=>{


try{



const files =
  req.files as Express.Multer.File[];





const imagePaths =

files?.map(

(file)=>

`/uploads/${file.filename}`

)

|| [];







const price =

req.body.price &&
!isNaN(Number(req.body.price))

?

Number(req.body.price)

:

0;






const weight =

req.body.weight &&
!isNaN(Number(req.body.weight))

?

Number(req.body.weight)

:

null;








const knife =

await prisma.knife.create({

data:{



title:

req.body.title,




slug:

req.body.slug,




maker:

req.body.maker,




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




weight,






description:

req.body.description || null,





price,





status:

req.body.status || "available",





images:

imagePaths



}



});






res.json(knife);






}



catch(error:any){



console.error(

"CREATE KNIFE ERROR:",

error

);



res.status(500).json({

error:error.message

});



}



}



);
// ==========================
// GET SINGLE KNIFE BY SLUG
// ==========================


router.get("/:slug", async(req,res)=>{


  try{


    const knife =
      await prisma.knife.findUnique({

        where:{

          slug:req.params.slug

        }

      });





    if(!knife){


      return res.status(404).json({

        error:"Knife not found"

      });


    }





    res.json(knife);





  }catch(error){



    console.error(
      "DETAIL KNIFE ERROR:",
      error
    );



    res.status(500).json({

      error:"Failed fetching knife"

    });


  }


});









// ==========================
// DELETE KNIFE
// ==========================


router.delete("/:id", async(req,res)=>{


try{


await prisma.knife.delete({

where:{

id:req.params.id

}

});



res.json({

message:"Knife deleted"

});



}



catch(error){


console.error(

"DELETE KNIFE ERROR:",

error

);



res.status(500).json({

error:"Failed deleting knife"

});


}



});








export default router;