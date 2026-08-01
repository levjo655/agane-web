import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";



type Knife = {

  id:string;

  title:string;

  maker:string;

  steel?:string;

  price:number | string;

  images:string[];

  status:string;

};



type Collaboration = {

  id:string;

  maker:string;

  title:string;

  description?:string;

  quantity:number;

  status:string;

};





export default function Admin(){


const navigate = useNavigate();


const {
  user,
  logout
} = useAuth0();





const [loading,setLoading] =
useState(true);



const [knives,setKnives] =
useState<Knife[]>([]);



const [collaborations,setCollaborations] =
useState<Collaboration[]>([]);





async function loadData(){


try{


const knivesResponse =
await fetch(
"http://localhost:8080/api/knives"
);



const knivesData =
await knivesResponse.json();



if(Array.isArray(knivesData)){

setKnives(knivesData);

}





const collabResponse =
await fetch(
"http://localhost:8080/api/collaborations"
);



const collabData =
await collabResponse.json();




if(Array.isArray(collabData)){

setCollaborations(collabData);

}



}catch(error){


console.log(
"ADMIN LOAD ERROR",
error
);


}finally{


setLoading(false);


}


}








useEffect(()=>{


loadData();


},[]);









function statusBadge(status:string){



if(status==="sold"){

return (

<span className="
inline-block
bg-black
text-white
px-4
py-1
text-xs
tracking-widest
">

SOLD

</span>

);

}





if(status==="archive"){

return (

<span className="
inline-block
border
px-4
py-1
text-xs
tracking-widest
">

ARCHIVE

</span>

);

}





return (

<span className="
inline-block
border
px-4
py-1
text-xs
tracking-widest
">

AVAILABLE

</span>

);


}









async function deleteKnife(id:string){


const confirmDelete =
window.confirm(
"Delete this knife?"
);



if(!confirmDelete)
return;




try{


await fetch(

`http://localhost:8080/api/knives/${id}`,

{

method:"DELETE"

}

);



setKnives(prev=>

prev.filter(
knife=>knife.id!==id
)

);



}catch(error){


console.log(
"DELETE KNIFE ERROR",
error
);


}


}









async function deleteCollaboration(id:string){


const confirmDelete =
window.confirm(
"Delete this collaboration?"
);



if(!confirmDelete)
return;




try{


await fetch(

`http://localhost:8080/api/collaborations/${id}`,

{

method:"DELETE"

}

);



setCollaborations(prev=>

prev.filter(
collab=>collab.id!==id
)

);



}catch(error){


console.log(
"DELETE COLLAB ERROR",
error
);


}


}









return (


<main className="
min-h-screen
bg-agane-bg
text-agane-text
px-6
py-16
">


<div className="
max-w-7xl
mx-auto
">






<header className="
flex
justify-between
items-center
mb-16
">



<div>


<h1 className="
text-5xl
font-serif
">

Ågane Workshop

</h1>



<p className="
mt-3
opacity-70
">

Welcome back {user?.name}

</p>



</div>







<button

onClick={()=>logout({

logoutParams:{

returnTo:
window.location.origin

}

})}

className="
border
px-6
py-3
"

>

Logout

</button>



</header>









{loading && (

<p>

Loading...

</p>

)}









{/* KNIVES */}



<section>



<div className="
flex
justify-between
items-center
mb-10
">


<h2 className="
text-4xl
font-serif
">

Knife Collection

</h2>



<button

onClick={()=>navigate("/admin/new")}

className="
border
px-8
py-3
"

>

+ Add Knife

</button>



</div>







<div className="
grid
md:grid-cols-3
gap-10
">



{knives.map(knife=>(



<article

key={knife.id}

className="
bg-white
border
p-6
"

>



{knife.images?.[0] && (

<img

src={
`http://localhost:8080${knife.images[0]}`
}

className="
h-72
w-full
object-cover
"

/>

)}




<h3 className="
text-2xl
font-serif
mt-5
">

{knife.title}

</h3>




<p>

{knife.maker}

</p>



<p className="
mt-3
">

{knife.price} SEK

</p>



<div className="
mt-4
">

{statusBadge(
knife.status
)}

</div>





<div className="
mt-6
flex
gap-3
">



<button

onClick={()=>navigate(
`/admin/knife/${knife.id}/edit`
)}

className="
border
px-5
py-2
"

>

Edit

</button>





<button

onClick={()=>deleteKnife(
knife.id
)}

className="
border
border-red-600
text-red-600
px-5
py-2
"

>

Delete

</button>



</div>



</article>


))}



</div>



</section>









{/* COLLABORATIONS */}



<section className="
mt-32
">



<div className="
flex
justify-between
items-center
mb-10
">


<h2 className="
text-4xl
font-serif
">

Collaborations

</h2>



<button

onClick={()=>navigate(
"/admin/collaboration/new"
)}

className="
border
px-8
py-3
"

>

+ Add Collaboration

</button>



</div>









<div className="
grid
md:grid-cols-2
gap-10
">





{collaborations.map(collab=>(



<article

key={collab.id}

className="
bg-white
border
p-8
"

>



<h3 className="
text-3xl
font-serif
">

{collab.title}

</h3>



<p className="mt-3">

Maker:
{" "}
{collab.maker}

</p>



<p>

{collab.quantity} knives

</p>




<p className="
mt-5
opacity-70
">

{collab.description}

</p>





<div className="
mt-8
flex
gap-3
">



<button

onClick={()=>navigate(
`/admin/collaboration/${collab.id}/edit`
)}

className="
border
px-5
py-2
"

>

Edit

</button>





<button

onClick={()=>deleteCollaboration(
collab.id
)}

className="
border
border-red-600
text-red-600
px-5
py-2
"

>

Delete

</button>



</div>





</article>



))}





</div>





</section>









</div>


</main>


);


}