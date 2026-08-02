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

  steel?:string;

  description?:string;

  price:number;

  status:string;

  images:string[];

};









export default function Collection(){



const [knives,setKnives]
=
useState<Knife[]>([]);




const [loading,setLoading]
=
useState(true);








useEffect(()=>{


async function loadKnives(){


try{


const response =
await fetch(

"http://localhost:8080/api/knives"

);




const data =
await response.json();




if(Array.isArray(data)){


setKnives(data);


}




}catch(error){


console.log(

"COLLECTION ERROR",

error

);



}finally{


setLoading(false);


}


}



loadKnives();


},[]);









const available =
knives.filter(

knife=>
knife.status==="available"

);




const archive =
knives.filter(

knife=>
knife.status!=="available"

);









if(loading){


return (

<div className="
min-h-screen
flex
items-center
justify-center
bg-agane-bg
">

Loading collection...

</div>

);


}









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


<h1 className="
text-6xl
font-serif
">

Collection

</h1>



<p className="
mt-6
max-w-xl
text-lg
opacity-70
">

A collection of handcrafted knives
created together with exceptional makers.

</p>



</header>









<section>


<h2 className="
text-4xl
font-serif
mb-10
">

Available Pieces

</h2>






<div className="
grid
md:grid-cols-3
gap-10
">



{

available.map(knife=>(


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


{

knife.images?.[0] && (


<img

src={
`http://localhost:8080${knife.images[0]}`
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


)

}



</Link>







<div className="
p-8
">





<Link

to={`/makers/${knife.maker.slug}`}

className="
text-xs
uppercase
tracking-[0.3em]
opacity-60
"

>

{knife.maker.name}

</Link>







<Link

to={`/collection/${knife.slug}`}

>


<h3 className="
text-3xl
font-serif
mt-4
">

{knife.title}

</h3>


</Link>







{

knife.steel && (


<p className="
mt-4
opacity-70
">

{knife.steel}

</p>


)

}







<div className="
mt-8
border-t
pt-5
flex
justify-between
">


<span>

{knife.price} SEK

</span>





<Link

to={`/collection/${knife.slug}`}

className="
hover:opacity-60
"

>

View →

</Link>



</div>






</div>





</article>


))


}



</div>



</section>









{

archive.length > 0 && (


<section className="
mt-32
">


<h2 className="
text-4xl
font-serif
mb-10
">

Archive

</h2>






<div className="
grid
md:grid-cols-3
gap-10
">



{

archive.map(knife=>(


<article

key={knife.id}

className="
bg-white
border
opacity-80
overflow-hidden
"

>



<Link

to={`/collection/${knife.slug}`}

>


{

knife.images?.[0] && (


<img

src={
`http://localhost:8080${knife.images[0]}`
}

alt={knife.title}

className="
w-full
h-80
object-cover
"

/>


)

}


</Link>







<div className="
p-6
">


<p className="
text-xs
tracking-widest
">

SOLD

</p>





<h3 className="
text-2xl
font-serif
mt-3
">

{knife.title}

</h3>






<Link

to={`/makers/${knife.maker.slug}`}

className="
block
mt-3
"

>

{knife.maker.name}

</Link>




</div>






</article>


))


}



</div>



</section>


)


}







</div>





</main>

);


}