import { Router } from "express";
import { prisma } from "../prisma";


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

      error:"Failed fetching knives"

    });


  }

});









// ==========================
// GET SINGLE KNIFE BY SLUG
// ==========================

router.get("/:slug", async(req,res)=>{


  try{


    const knife =
      await prisma.knife.findUnique({

        where:{

          slug:req.params.slug

        },


        include:{

          maker:true

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

      "GET KNIFE ERROR:",
      error

    );



    res.status(500).json({

      error:"Failed loading knife"

    });


  }


});









// ==========================
// CREATE KNIFE
// ==========================

router.post("/", async(req,res)=>{


try{


if(!req.body.makerId){


return res.status(400).json({

error:"Maker is required"

});


}






const knife =
await prisma.knife.create({

data:{


title:req.body.title,


slug:req.body.slug,



maker:{

connect:{

id:req.body.makerId

}

},




origin:req.body.origin || null,


steel:req.body.steel || null,


bladeType:req.body.bladeType || null,


length:req.body.length || null,


handle:req.body.handle || null,





weight:
req.body.weight &&
!isNaN(Number(req.body.weight))
?
Number(req.body.weight)
:
null,






price:
req.body.price &&
!isNaN(Number(req.body.price))
?
Number(req.body.price)
:
0,






description:req.body.description || null,






images:req.body.images || [],





status:req.body.status || "available"



},


include:{

maker:true

}


});






res.json(knife);




}catch(error){


console.error(

"CREATE KNIFE ERROR:",
error

);



res.status(500).json({

error:"Failed creating knife"

});


}


});









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


title:req.body.title,


slug:req.body.slug,



maker:{

connect:{

id:req.body.makerId

}

},




origin:req.body.origin || null,


steel:req.body.steel || null,


bladeType:req.body.bladeType || null,


length:req.body.length || null,


handle:req.body.handle || null,





weight:
req.body.weight &&
!isNaN(Number(req.body.weight))
?
Number(req.body.weight)
:
null,






price:
req.body.price &&
!isNaN(Number(req.body.price))
?
Number(req.body.price)
:
0,






description:req.body.description || null,





images:req.body.images || [],





status:req.body.status || "available"



},


include:{

maker:true

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





}catch(error){



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