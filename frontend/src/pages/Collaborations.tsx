import { useEffect, useState } from "react";



type Collaboration = {

  id:string;

  maker:string;

  title:string;

  description?:string;

  quantity:number;

  status:string;

  releaseDate?:string;

  image?:string;

};





export default function Collaborations(){



const [collaborations,setCollaborations] =
useState<Collaboration[]>([]);



const [loading,setLoading] =
useState(true);








useEffect(()=>{


fetch(
"http://localhost:8080/api/collaborations"
)


.then(res=>res.json())


.then(data=>{


if(Array.isArray(data)){


setCollaborations(data);


}


})


.catch(error=>{


console.log(
"COLLAB PAGE ERROR",
error
);


})


.finally(()=>{


setLoading(false);


});



},[]);









return (

<main className="
min-h-screen
bg-agane-bg
text-agane-text
px-6
py-20
">



<div className="
max-w-7xl
mx-auto
">







<header className="
mb-20
">


<p className="
uppercase
tracking-[0.4em]
text-sm
opacity-60
">

Ågane Collaborations

</p>




<h1 className="
text-6xl
font-serif
mt-6
">

Exceptional makers.
Limited creations.

</h1>





<p className="
mt-8
max-w-xl
opacity-70
text-lg
">

Exclusive collaborations with
bladesmiths creating unique
handcrafted pieces.

</p>



</header>









{loading && (

<p>

Loading collaborations...

</p>

)}









<div className="
grid
md:grid-cols-2
gap-12
">





{collaborations.map(collab=>(



<article

key={collab.id}

className="
bg-white
border
border-agane-border
overflow-hidden
group
"

>





{collab.image && (

<img

src={
`http://localhost:8080${collab.image}`
}

alt={collab.title}

className="
w-full
h-[450px]
object-cover
group-hover:scale-105
transition
duration-500
"

/>

)}





<div className="
p-10
">





<p className="
uppercase
tracking-[0.3em]
text-xs
opacity-60
">

{collab.maker}

</p>






<h2 className="
text-4xl
font-serif
mt-4
">

{collab.title}

</h2>







<p className="
mt-6
leading-relaxed
opacity-80
">

{collab.description}

</p>








<div className="
mt-10
border-t
pt-6
flex
justify-between
">





<div>


<p className="
text-xs
uppercase
opacity-50
">

Edition

</p>


<p>

{collab.quantity} pieces

</p>


</div>







<div>


<p className="
text-xs
uppercase
opacity-50
">

Status

</p>


<p>

{collab.status}

</p>


</div>




</div>








</div>







</article>



))}



</div>








</div>


</main>


);


}