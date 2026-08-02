import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";



type Maker = {

id:string;

name:string;

slug:string;

country?:string;

bio?:string;

image?:string;

website?:string;

instagram?:string;

};





type Knife = {

id:string;

title:string;

slug:string;

images:string[];

price:number;

status:string;

};





type Collaboration = {

id:string;

title:string;

description?:string;

quantity:number;

status:string;

};








type MakerProfileData = {

maker:Maker;

knives:Knife[];

collaborations:Collaboration[];

};








export default function MakerProfile(){



const { maker } =
useParams();



const [data,setData] =
useState<MakerProfileData | null>(null);



const [loading,setLoading] =
useState(true);







useEffect(()=>{



async function loadMaker(){


try{


const response =
await fetch(

`http://localhost:8080/api/makers/${maker}`

);



const result =
await response.json();



setData(result);



}catch(error){


console.log(
"MAKER ERROR",
error
);


}finally{


setLoading(false);


}



}



loadMaker();



},[maker]);









if(loading){

return (

<div className="
p-20
">

Loading...

</div>

);

}







if(!data){

return (

<div className="
p-20
">

Maker not found

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


<p className="
uppercase
tracking-[0.4em]
opacity-60
text-sm
">

Master Bladesmith

</p>




<h1 className="
text-6xl
font-serif
mt-5
">

{data.maker.name}

</h1>





{data.maker.country && (

<p className="
mt-4
opacity-70
">

{data.maker.country}

</p>

)}



</header>








<section>


<h2 className="
text-4xl
font-serif
mb-10
">

Knives

</h2>





<div className="
grid
md:grid-cols-3
gap-10
">



{data.knives.map((knife)=>(



<article

key={knife.id}

className="
bg-white
border
overflow-hidden
"

>


{knife.images?.[0] && (

<img

src={
`http://localhost:8080${knife.images[0]}`
}

className="
w-full
h-96
object-cover
"

/>

)}





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
mt-3
">

{knife.price} SEK

</p>



<Link

to={`/collection/${knife.slug}`}

className="
block
mt-5
hover:opacity-60
"

>

View knife →

</Link>


</div>



</article>



))}



</div>


</section>









<section className="
mt-32
">



<h2 className="
text-4xl
font-serif
mb-10
">

Collaborations

</h2>





<div className="
grid
md:grid-cols-2
gap-10
">



{data.collaborations.map((collab)=>(



<div

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



<p className="
mt-4
">

{collab.description}

</p>



<p className="
mt-5
opacity-60
">

Limited to {collab.quantity} pieces

</p>



</div>



))}



</div>



</section>







</div>


</main>


);


}