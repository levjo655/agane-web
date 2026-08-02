import {
  useEffect,
  useState
} from "react";

import {
  Link
} from "react-router-dom";





type Maker = {

  id:string;

  name:string;

  slug:string;

};





type Knife = {

  id:string;

  slug:string;

  title:string;

  maker:Maker;

  price:number;

  status:string;

  images:string[];

};





type Collaboration = {

  id:string;

  title:string;

  maker:Maker;

  description?:string;

  quantity:number;

  status:string;

};







function getImageUrl(image?:string){

  if(!image){

    return "/knives/hero-knife.jpeg";

  }


  if(image.startsWith("/uploads")){

    return `http://localhost:8080${image}`;

  }


  return `/knives/${image}`;

}









export default function Home(){



const [knives,setKnives] =
useState<Knife[]>([]);



const [collaborations,setCollaborations] =
useState<Collaboration[]>([]);








useEffect(()=>{


async function loadData(){


try{


const knivesResponse =
await fetch(
"http://localhost:8080/api/knives"
);



const knivesData =
await knivesResponse.json();



if(Array.isArray(knivesData)){


setKnives(
knivesData.slice(0,6)
);


}







const collabResponse =
await fetch(
"http://localhost:8080/api/collaborations"
);



const collabData =
await collabResponse.json();



if(Array.isArray(collabData)){


setCollaborations(
collabData.slice(0,3)
);


}



}catch(error){


console.log(
"HOME LOAD ERROR",
error
);


}



}



loadData();



},[]);









return (


<main className="
min-h-screen
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
max-w-7xl
mx-auto
grid
lg:grid-cols-2
gap-16
items-center
w-full
">





<div>



<img

src="/knives/agane_logo.png"

alt="Ågane"

className="
w-40
mb-10
"

/>





<p className="
uppercase
tracking-[0.4em]
text-sm
opacity-60
mb-8
">

Handcrafted Knives
&
Exclusive Collaborations

</p>






<h1 className="
text-6xl
lg:text-7xl
font-serif
leading-tight
">

Rare knives.
<br/>

Exceptional makers.

</h1>







<p className="
mt-8
max-w-xl
text-lg
opacity-80
">

Ågane brings together exceptional
bladesmiths and collectors through
limited handmade knife collaborations.

</p>







<div className="
mt-12
flex
gap-6
">



<Link

to="/collection"

className="
border
px-10
py-4
"

>

Explore Collection

</Link>





<Link

to="/collaborations"

className="
px-10
py-4
"

>

Upcoming Collabs →

</Link>



</div>



</div>









<div className="
h-[650px]
overflow-hidden
">


<img

src="/knives/hero-knife.jpeg"

alt="Ågane handcrafted knife"

className="
w-full
h-full
object-cover
"

/>


</div>





</div>


</section>









{/* INTRO */}



<section className="
px-6
py-32
">


<div className="
max-w-5xl
mx-auto
text-center
">


<h2 className="
text-5xl
font-serif
">

Crafted with purpose.
Collected for a lifetime.

</h2>




<p className="
mt-8
opacity-70
text-lg
">

Every Ågane knife represents
craftsmanship, collaboration
and the pursuit of perfection.

</p>


</div>


</section>









{/* KNIVES */}



<section className="
px-6
py-32
">


<div className="
max-w-7xl
mx-auto
">


<div className="
flex
justify-between
items-end
mb-16
">


<h2 className="
text-5xl
font-serif
">

Featured Knives

</h2>



<Link to="/collection">

View all →

</Link>


</div>









<div className="
grid
md:grid-cols-3
gap-10
">


{

knives.map(knife=>(


<article

key={knife.id}

className="
bg-white
border
overflow-hidden
group
"

>


<Link

to={`/collection/${knife.slug}`}

>


<img

src={
getImageUrl(
knife.images?.[0]
)
}

alt={knife.title}

className="
w-full
h-96
object-cover
group-hover:scale-105
transition
duration-500
"

/>


</Link>







<div className="
p-7
">


<Link

to={`/makers/${knife.maker.slug}`}

className="
uppercase
tracking-[0.3em]
text-xs
opacity-60
"

>

{knife.maker?.name}

</Link>







<h3 className="
text-3xl
font-serif
mt-4
">

{knife.title}

</h3>







<div className="
mt-6
border-t
pt-5
flex
justify-between
">


<span>

{
knife.status==="available"
?
`${knife.price} SEK`
:
"SOLD"
}

</span>




<Link

to={`/collection/${knife.slug}`}

>

View →

</Link>



</div>


</div>


</article>


))


}



</div>



</div>


</section>









{/* COLLABS */}



<section className="
px-6
py-32
bg-white
">


<div className="
max-w-7xl
mx-auto
">


<h2 className="
text-5xl
font-serif
mb-16
">

Featured Collaborations

</h2>





<div className="
grid
md:grid-cols-3
gap-10
">



{

collaborations.map(collab=>(


<article

key={collab.id}

className="
border
p-8
"

>


<p className="
uppercase
tracking-[0.3em]
text-xs
opacity-60
">

{collab.maker?.name}

</p>




<h3 className="
text-3xl
font-serif
mt-4
">

{collab.title}

</h3>




<p className="
mt-5
opacity-70
">

{collab.description}

</p>




<p className="
mt-6
">

Limited to {collab.quantity} pieces

</p>




</article>


))


}



</div>


</div>


</section>







</main>


);


}