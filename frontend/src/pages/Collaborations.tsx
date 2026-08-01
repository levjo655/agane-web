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


.catch(err=>{

console.log(
"COLLAB PAGE ERROR",
err
);


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



<h1 className="
text-6xl
font-serif
mb-16
">

Upcoming Collaborations

</h1>







<div className="
grid
md:grid-cols-3
gap-10
">



{collaborations.map(collab=>(


<article

key={collab.id}

className="
bg-white
border
overflow-hidden
"

>




{collab.image && (

<img

src={
`http://localhost:8080${collab.image}`
}

className="
w-full
h-80
object-cover
"

/>

)}





<div className="
p-8
">



<p className="
uppercase
tracking-[0.25em]
text-xs
opacity-60
">

{collab.maker}

</p>





<h2 className="
text-3xl
font-serif
mt-4
">

{collab.title}

</h2>






<p className="
mt-5
opacity-70
">

{collab.description}

</p>






<div className="
mt-6
border-t
pt-4
">

{collab.quantity} blades

</div>






<span className="
inline-block
mt-5
border
px-4
py-2
">

{collab.status}

</span>





</div>





</article>


))}



</div>





</div>


</main>

);


}