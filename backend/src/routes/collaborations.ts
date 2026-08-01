import { Router } from "express";
import multer from "multer";
import { prisma } from "../prisma";


const router = Router();




// ==========================
// IMAGE STORAGE
// ==========================


const storage = multer.diskStorage({


  destination: (_req, _file, cb)=>{


    cb(
      null,
      "uploads/"
    );


  },



  filename: (_req,file,cb)=>{


    const uniqueName =

      Date.now()
      +
      "-"
      +
      file.originalname
      .replace(/\s+/g,"-");



    cb(
      null,
      uniqueName
    );


  }


});



const upload = multer({
  storage
});







// ==========================
// GET ALL COLLABORATIONS
// ==========================


router.get("/", async(_req,res)=>{


try{


const collaborations =

await prisma.collaboration.findMany({


orderBy:{


createdAt:"desc"


}


});




res.json(collaborations);



}catch(error){


console.error(
"FETCH COLLAB ERROR:",
error
);



res.status(500).json({

error:"Failed fetching collaborations"

});


}



});









// ==========================
// CREATE COLLABORATION
// ==========================


router.post(

"/",

upload.single("image"),


async(req,res)=>{


try{





const imagePath =

req.file

?

`/uploads/${req.file.filename}`

:

null;








const collaboration =

await prisma.collaboration.create({

data:{



maker:

req.body.maker,




title:

req.body.title,




description:

req.body.description || null,




quantity:

Number(req.body.quantity),




status:

req.body.status || "upcoming",




releaseDate:

req.body.releaseDate

?

new Date(req.body.releaseDate)

:

null,




image:

imagePath



}


});







res.json(collaboration);






}catch(error){


console.error(

"CREATE COLLAB ERROR:",

error

);



res.status(500).json({

error:"Failed creating collaboration"

});


}



}


);









// ==========================
// DELETE COLLABORATION
// ==========================


router.delete("/:id", async(req,res)=>{


try{


await prisma.collaboration.delete({

where:{

id:req.params.id

}

});




res.json({

message:"Collaboration deleted"

});



}catch(error){



console.error(error);



res.status(500).json({

error:"Failed deleting collaboration"

});



}



});






export default router;