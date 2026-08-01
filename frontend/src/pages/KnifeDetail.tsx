import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


type Knife = {

  id:string;

  slug:string;

  title:string;

  maker:string;

  origin?:string;

  steel?:string;

  bladeType?:string;

  length?:string;

  handle?:string;

  weight?:number;

  description?:string;

  price:number;

  status:string;

  images:string[];

};





export default function KnifeDetail(){


const { slug } =
useParams();



const [knife,setKnife] =
useState<Knife | null>(null);



const [loading,setLoading] =
useState(true);



const [activeImage,setActiveImage] =
useState("");







useEffect(()=>{


async function loadKnife(){


try{


const response =
await fetch(

`http://localhost:8080/api/knives/${slug}`

);



const data =
await response.json();



setKnife(data);



if(data.images?.length){

setActiveImage(
data.images[0]
);

}



}catch(error){


console.log(
"DETAIL ERROR",
error
);


}finally{


setLoading(false);


}


}



loadKnife();



},[slug]);








if(loading){

return (

<div className="
min-h-screen
flex
items-center
justify-center
">

Loading...

</div>

);


}







if(!knife){

return (

<div className="
min-h-screen
flex
items-center
justify-center
">

Knife not found

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







<div className="
grid
lg:grid-cols-2
gap-16
">







{/* IMAGE AREA */}



<div>



<div className="
bg-white
overflow-hidden
">

<img

src={
`http://localhost:8080${activeImage}`
}

alt={knife.title}

className="
w-full
h-[700px]
object-cover
"

/>

</div>







<div className="
flex
gap-4
mt-6
">


{knife.images?.map(image=>(


<button

key={image}

onClick={()=>setActiveImage(image)}

className="
border
overflow-hidden
"

>


<img

src={
`http://localhost:8080${image}`
}

className="
w-24
h-24
object-cover
"

/>


</button>



))}



</div>




</div>









{/* INFO */}



<div className="
flex
flex-col
justify-center
">






<p className="
uppercase
tracking-[0.35em]
text-sm
opacity-60
">

{knife.maker}

</p>






<h1 className="
text-6xl
font-serif
mt-6
">

{knife.title}

</h1>







<div className="
mt-10
grid
grid-cols-2
gap-8
border-y
py-10
">



<div>

<p className="
text-xs
uppercase
opacity-50
">

Steel

</p>


<p className="mt-2">

{knife.steel || "-"}

</p>


</div>







<div>

<p className="
text-xs
uppercase
opacity-50
">

Origin

</p>


<p className="mt-2">

{knife.origin || "-"}

</p>


</div>






<div>

<p className="
text-xs
uppercase
opacity-50
">

Blade

</p>


<p className="mt-2">

{knife.length || "-"}

</p>


</div>







<div>

<p className="
text-xs
uppercase
opacity-50
">

Handle

</p>


<p className="mt-2">

{knife.handle || "-"}

</p>


</div>






<div>

<p className="
text-xs
uppercase
opacity-50
">

Weight

</p>


<p className="mt-2">

{knife.weight
?
`${knife.weight}g`
:
"-"
}

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


<p className="mt-2">

{knife.status.toUpperCase()}

</p>


</div>






</div>









<p className="
mt-10
leading-relaxed
opacity-80
">

{knife.description}

</p>









<div className="
mt-12
flex
items-center
justify-between
">



<span className="
text-3xl
font-serif
">

{knife.price} SEK

</span>







<button

className="
border
px-10
py-4
hover:bg-black
hover:text-white
transition
"

>

Contact Ågane →

</button>




</div>






</div>






</div>






</div>



</main>



);


}