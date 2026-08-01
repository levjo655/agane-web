interface Collaboration {

  id:string;

  maker:string;

  title:string;

  description?:string;

  quantity:number;

  status:string;

  releaseDate?:string;

  image?:string;

}



export default function UpcomingCollaborations(

{

collaborations

}:{

collaborations:Collaboration[]

}

){



const upcoming =
collaborations.filter(

collab =>
collab.status === "upcoming"

);





return (


<section

className="
bg-agane-bg
px-6
py-32
"

>



<div className="
max-w-7xl
mx-auto
">





<div className="
mb-16
">



<p className="
uppercase
text-xs
tracking-[0.4em]
opacity-60
mb-5
">

Future Releases

</p>




<h2 className="
text-5xl
font-serif
">

Upcoming Collaborations

</h2>




<p className="
mt-6
max-w-xl
opacity-70
leading-relaxed
">

Exclusive collaborations with selected
blacksmiths around the world.
Each release is limited and individually crafted.

</p>



</div>








<div className="
grid
md:grid-cols-2
gap-12
">



{upcoming.map((collab)=>(



<article

key={collab.id}

className="
border
border-agane-border
overflow-hidden
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
h-96
object-cover
"

/>

)}





<div className="
p-10
">





<p className="
uppercase
text-xs
tracking-[0.35em]
opacity-60
mb-4
">

{collab.maker}

</p>





<h3 className="
text-4xl
font-serif
">

{collab.title}

</h3>






<p className="
mt-6
leading-relaxed
opacity-80
">

{collab.description}

</p>







<div className="
mt-8
flex
justify-between
items-center
border-t
pt-6
">


<span>

Limited to

{" "}

<strong>

{collab.quantity}

</strong>

{" "}
blades

</span>





<span className="
uppercase
text-xs
tracking-widest
">

Coming Soon

</span>




</div>





</div>



</article>



))}



</div>





</div>


</section>



);


}