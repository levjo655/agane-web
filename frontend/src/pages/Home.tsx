import { useEffect, useState } from "react";
import { Link } from "react-router-dom";



type Knife = {

  id:string;

  slug:string;

  title:string;

  maker:string;

  price:number;

  status:string;

  images:string[];

};



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





export default function Home(){



const [knives,setKnives] =
  useState<Knife[]>([]);



const [collaborations,setCollaborations] =
  useState<Collaboration[]>([]);







useEffect(()=>{



  // LOAD KNIVES


  fetch(
    "http://localhost:8080/api/knives"
  )


  .then(res=>res.json())


  .then(data=>{


    if(Array.isArray(data)){


      setKnives(
        data.slice(0,6)
      );


    }


  })


  .catch(err=>{


    console.log(
      "HOME KNIFE ERROR",
      err
    );


  });








  // LOAD COLLABORATIONS


  fetch(
    "http://localhost:8080/api/collaborations"
  )


  .then(res=>res.json())


  .then(data=>{


    if(Array.isArray(data)){


      setCollaborations(
        data.slice(0,3)
      );


    }


  })


  .catch(err=>{


    console.log(
      "COLLAB HOME ERROR",
      err
    );


  });





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
 text-7xl
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
 leading-relaxed
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
 border-agane-text
 px-10
 py-4
 hover:bg-agane-text
 hover:text-white
 transition
"

>

Explore Collection

</Link>




<Link

to="/collaborations"

className="
 px-10
 py-4
 hover:opacity-60
"

>

Upcoming Collabs →

</Link>


</div>



</div>







<div className="
 h-[700px]
 overflow-hidden
">


<img

src="/hero-knife.jpeg"

alt="Ågane knife"

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









{/* COLLECTION */}



<section className="
px-6
py-32
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

Explore Collection

</h2>






<div className="
grid
md:grid-cols-3
gap-10
">



{knives.map((knife)=>(


<article

key={knife.id}

className="
bg-white
border
overflow-hidden
group
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
group-hover:scale-105
transition
"

/>


)}




<div className="
p-7
">


<p className="
text-xs
uppercase
tracking-[0.3em]
opacity-60
">

{knife.maker}

</p>



<h3 className="
text-3xl
font-serif
mt-3
">

{knife.title}

</h3>





<div className="
mt-6
flex
justify-between
border-t
pt-5
">


<span>

{knife.status==="available"
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


))}



</div>



</div>


</section>









{/* COLLABORATIONS */}



<section className="
px-6
py-32
bg-black
text-white
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
opacity-70
max-w-xl
mb-16
">

Limited releases created together with
exceptional bladesmiths.

</p>






<div className="
grid
md:grid-cols-3
gap-10
">





{collaborations.map((collab)=>(


<article

key={collab.id}

className="
border
border-white/20
p-8
"


>




{collab.image && (

<img

src={
`http://localhost:8080${collab.image}`
}

className="
w-full
h-72
object-cover
mb-8
"

/>

)}





<p className="
uppercase
tracking-[0.3em]
text-xs
opacity-60
">

Upcoming

</p>




<h3 className="
text-3xl
font-serif
mt-4
">

{collab.title}

</h3>



<p className="mt-3">

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
border-t
border-white/20
pt-5
flex
justify-between
">


<span>

{collab.quantity} blades

</span>



<span>

{collab.status}

</span>


</div>




</article>


))}




</div>



</div>


</section>







</main>


);


}