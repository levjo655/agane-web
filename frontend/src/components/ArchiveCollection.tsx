import KnifeCard from "./KnifeCard";


interface Knife {

  id:string;

  title:string;

  maker:string;

  steel?:string;

  description:string;

  price:number;

  image:string;

  status:string;

}




export default function ArchiveCollection(
{
knives
}:{
knives:Knife[]
}

){


const archive =
knives.filter(
knife =>
knife.status === "sold" ||
knife.status === "archive"
);




return (

<section
className="
bg-black
text-white
px-6
py-24
"
>



<div className="
max-w-7xl
mx-auto
">



<p className="
uppercase
text-xs
tracking-[0.4em]
opacity-60
mb-4
">

Archive

</p>




<h2 className="
text-5xl
font-serif
mb-14
">

Previous Pieces

</h2>





<div className="
grid
md:grid-cols-3
gap-10
">


{archive.map((knife)=>(


<KnifeCard

key={knife.id}

knife={knife}

/>


))}



</div>


</div>


</section>


);


}