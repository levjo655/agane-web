import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


type Knife = {

id:string;
title:string;
maker:string;
images:string[];
price:number;
status:string;

};



type Collaboration = {

id:string;
title:string;
maker:string;
description?:string;
quantity:number;
status:string;

};





export default function Home(){


const navigate = useNavigate();


const [knives,setKnives] =
useState<Knife[]>([]);


const [collabs,setCollabs] =
useState<Collaboration[]>([]);






useEffect(()=>{


fetch(
"http://localhost:8080/api/knives"
)

.then(res=>res.json())

.then(data=>{

setKnives(data);

});




fetch(
"http://localhost:8080/api/collaborations"
)

.then(res=>res.json())

.then(data=>{

setCollabs(data);

});



},[]);





const featured =
knives.slice(0,3);






return (

<div className="
bg-agane-bg
text-agane-text
">







{/* HERO */}


<section className="
min-h-screen
flex
items-center
px-6
">




<div className="
max-w-5xl
mx-auto
">


<p className="
uppercase
tracking-[0.4em]
text-sm
opacity-60
mb-8
">

Ågane Workshop

</p>





<h1 className="
text-7xl
font-serif
leading-tight
">

Exceptional knives.
<br/>

Created with master craftsmen.

</h1>




<p className="
mt-8
max-w-xl
text-lg
opacity-70
">

A curated collection of handcrafted blades,
created through collaborations with exceptional
blacksmiths around the world.

</p>






<button

onClick={()=>navigate("/collection")}

className="
mt-10
border
px-10
py-4
hover:bg-black
hover:text-white
transition
"

>

Explore Collection

</button>




</div>


</section>









{/* FEATURED */}



<section className="
px-6
py-24
">


<div className="
max-w-7xl
mx-auto
">


<h2 className="
text-5xl
font-serif
mb-12
">

Featured Collection

</h2>





<div className="
grid
md:grid-cols-3
gap-10
">


{featured.map(knife=>(


<div

key={knife.id}

className="
bg-white
border
overflow-hidden
"

>


<img

src={
`http://localhost:8080${knife.images[0]}`
}

className="
h-96
w-full
object-cover
"

/>



<div className="
p-6
">


<h3 className="
text-2xl
font-serif
">

{knife.title}

</h3>


<p className="
mt-2
opacity-70
">

{knife.maker}

</p>


</div>



</div>


))}


</div>



</div>



</section>









{/* COLLABS */}



<section className="
px-6
py-24
bg-white
">


<div className="
max-w-7xl
mx-auto
">


<h2 className="
text-5xl
font-serif
mb-6
">

Upcoming Collaborations

</h2>



<p className="
max-w-xl
opacity-70
mb-12
">

Limited releases created together with
exceptional makers.

</p>






<div className="
grid
md:grid-cols-2
gap-10
">


{collabs.map(collab=>(


<div

key={collab.id}

className="
border
p-10
"

>


<h3 className="
text-3xl
font-serif
">

{collab.title}

</h3>


<p className="
mt-3
">

{collab.maker}

</p>



<p className="
mt-6
opacity-70
">

{collab.description}

</p>



<div className="
mt-8
border
inline-block
px-5
py-2
">

{collab.quantity} blades

</div>



</div>


))}


</div>



</div>


</section>









{/* CRAFT */}



<section className="
px-6
py-32
">


<div className="
max-w-5xl
mx-auto
">


<h2 className="
text-5xl
font-serif
">

The Craft

</h2>



<p className="
mt-8
text-lg
opacity-70
">

From Japanese natural stones to final polishing,
every blade receives individual attention.
Ågane exists between tradition and modern craft.

</p>



</div>


</section>









</div>

);


}