import { Router } from "express";
import multer from "multer";
import { prisma } from "../prisma";


const router = Router();




// ==========================
// IMAGE STORAGE
// ==========================


const storage = multer.diskStorage({

destination:(_req,_file,cb)=>{

cb(null,"uploads/");

},


filename:(_req,file,cb)=>{


const filename =
Date.now()
+
"-"
+
file.originalname.replace(/\s+/g,"-");


cb(null,filename);


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

include:{

maker:true

},


orderBy:{

createdAt:"desc"

}


});



res.json(collaborations);



}catch(error){


console.error(
"GET COLLABORATIONS ERROR:",
error
);



res.status(500).json({

error:"Failed fetching collaborations"

});


}


});









// ==========================
// GET SINGLE COLLABORATION
// ==========================


router.get("/:id", async(req,res)=>{


try{


const collaboration =
await prisma.collaboration.findUnique({

where:{

id:req.params.id

},


include:{

maker:true

}


});





if(!collaboration){


return res.status(404).json({

error:"Collaboration not found"

});


}




res.json(collaboration);



}catch(error){


console.error(
"GET COLLABORATION ERROR:",
error
);



res.status(500).json({

error:"Failed loading collaboration"

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


title:req.body.title,


makerId:req.body.makerId || null,


description:req.body.description || null,


quantity:Number(req.body.quantity),


status:req.body.status || "upcoming",


releaseDate:req.body.releaseDate
?
new Date(req.body.releaseDate)
:
null,


image:imagePath


},


include:{

maker:true

}


});




res.json(collaboration);



}catch(error){


console.error(

"CREATE COLLABORATION ERROR:",
error

);



res.status(500).json({

error:"Failed creating collaboration"

});


}


}

);









// ==========================
// UPDATE COLLABORATION
// ==========================


router.put("/:id", async(req,res)=>{


try{


const collaboration =
await prisma.collaboration.update({

where:{

id:req.params.id

},


data:{


title:req.body.title,


makerId:req.body.makerId || null,


description:req.body.description || null,


quantity:Number(req.body.quantity),


status:req.body.status || "upcoming",


releaseDate:req.body.releaseDate
?
new Date(req.body.releaseDate)
:
null



},


include:{

maker:true

}


});




res.json(collaboration);



}catch(error){


console.error(

"UPDATE COLLABORATION ERROR:",
error

);



res.status(500).json({

error:"Failed updating collaboration"

});


}


});









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


console.error(

"DELETE COLLABORATION ERROR:",
error

);



res.status(500).json({

error:"Failed deleting collaboration"

});


}


});








export default router;