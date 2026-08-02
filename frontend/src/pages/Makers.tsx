import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";



type Maker = {

id:string;

name:string;

slug:string;

country?:string;

bio?:string;

image?:string;

knives?:any[];

collaborations?:any[];

};






export default function Makers(){


const navigate =
useNavigate();



const [makers,setMakers]
=
useState<Maker[]>([]);



const [loading,setLoading]
=
useState(true);






useEffect(()=>{


async function loadMakers(){


try{


const response =
await fetch(

"http://localhost:8080/api/makers"

);



const data =
await response.json();



if(Array.isArray(data)){

setMakers(data);

}



}catch(error){


console.log(
"LOAD MAKERS ERROR",
error
);


}
finally{


setLoading(false);


}


}



loadMakers();


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


<h1 className="
text-6xl
font-serif
">

Makers

</h1>



<p className="
mt-5
max-w-xl
opacity-70
text-lg
">

The craftsmen behind Ågane.
Exploring the stories, traditions and
bladesmiths shaping Japanese knife culture.

</p>



</header>









{loading && (

<p>

Loading makers...

</p>

)}









<div className="
grid
md:grid-cols-3
gap-10
">






{makers.map(maker=>(



<article

key={maker.id}

className="
bg-white
border
p-8
cursor-pointer
hover:shadow-xl
transition
"

onClick={()=>navigate(
`/makers/${maker.slug}`
)}

>







{maker.image && (

<img

src={

"http://localhost:8080"
+
maker.image

}

className="
h-64
w-full
object-cover
mb-6
"

/>


)}









<h2 className="
text-3xl
font-serif
">

{maker.name}

</h2>







<p className="
uppercase
tracking-widest
text-xs
mt-3
opacity-60
">

{maker.country}

</p>







<p className="
mt-5
opacity-70
line-clamp-4
">

{maker.bio}

</p>








<div className="
mt-8
flex
gap-8
text-sm
">


<span>

{maker.knives?.length || 0}

<br/>

Knives

</span>



<span>

{maker.collaborations?.length || 0}

<br/>

Collaborations

</span>



</div>






<button

className="
mt-8
border
px-6
py-3
"

>

View Maker

</button>






</article>



))}





</div>







</div>


</main>

);


}