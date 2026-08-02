import {
  useEffect,
  useState
} from "react";

import {
  useAuth0
} from "@auth0/auth0-react";

import {
  useNavigate
} from "react-router-dom";





type Maker = {

  id:string;

  name:string;

  slug:string;

  country?:string;

  bio?:string;

};





type Knife = {

  id:string;

  title:string;

  price:number;

  status:string;

  images:string[];

  maker?:Maker;

};





type Collaboration = {

  id:string;

  title:string;

  quantity:number;

  status:string;

  description?:string;

  maker?:Maker;

};








export default function Admin(){



const navigate =
useNavigate();



const {
user,
logout
}=useAuth0();





const [loading,setLoading]
=
useState(true);



const [makers,setMakers]
=
useState<Maker[]>([]);



const [knives,setKnives]
=
useState<Knife[]>([]);



const [collaborations,setCollaborations]
=
useState<Collaboration[]>([]);










async function loadData(){


try{


// MAKERS

const makersResponse =
await fetch(
"http://localhost:8080/api/makers"
);


const makersData =
await makersResponse.json();


if(Array.isArray(makersData)){

setMakers(makersData);

}








// KNIVES

const knivesResponse =
await fetch(
"http://localhost:8080/api/knives"
);


const knivesData =
await knivesResponse.json();


if(Array.isArray(knivesData)){

setKnives(knivesData);

}








// COLLABORATIONS

const collabResponse =
await fetch(
"http://localhost:8080/api/collaborations"
);


const collabData =
await collabResponse.json();


if(Array.isArray(collabData)){

setCollaborations(collabData);

}





}catch(error){


console.log(
"ADMIN LOAD ERROR",
error
);


}
finally{


setLoading(false);


}



}







useEffect(()=>{


loadData();


},[]);








async function deleteKnife(id:string){


if(!confirm("Delete knife?"))
return;



await fetch(

`http://localhost:8080/api/knives/${id}`,

{

method:"DELETE"

}

);



setKnives(prev=>

prev.filter(
knife=>knife.id!==id
)

);



}









async function deleteCollaboration(id:string){


if(!confirm("Delete collaboration?"))
return;



await fetch(

`http://localhost:8080/api/collaborations/${id}`,

{

method:"DELETE"

}

);



setCollaborations(prev=>

prev.filter(
item=>item.id!==id
)

);



}









return (

<main className="
min-h-screen
bg-agane-bg
text-agane-text
px-6
py-16
">


<div className="
max-w-7xl
mx-auto
">







<header className="
flex
justify-between
items-center
mb-16
">


<div>

<h1 className="
text-5xl
font-serif
">

Ågane Workshop

</h1>


<p className="
mt-3
opacity-70
">

Welcome {user?.name}

</p>


</div>




<button

onClick={()=>logout()}

className="
border
px-6
py-3
"

>

Logout

</button>



</header>








{
loading && (

<p>

Loading...

</p>

)

}









{/* MAKERS */}



<section>


<div className="
flex
justify-between
items-center
mb-10
">


<h2 className="
text-4xl
font-serif
">

Makers

</h2>



<button

onClick={()=>navigate(
"/admin/maker/new"
)}

className="
border
px-6
py-3
"

>

+ Add Maker

</button>


</div>







<div className="
grid
md:grid-cols-3
gap-10
">


{

makers.map(maker=>(


<article

key={maker.id}

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

{maker.name}

</h3>



<p className="
mt-3
opacity-60
">

{maker.country}

</p>



<p className="
mt-4
opacity-70
">

{maker.bio}

</p>


</article>


))

}



</div>



</section>









{/* KNIVES */}



<section className="
mt-32
">



<div className="
flex
justify-between
items-center
mb-10
">


<h2 className="
text-4xl
font-serif
">

Knives

</h2>



<button

onClick={()=>navigate(
"/admin/new"
)}

className="
border
px-6
py-3
"

>

+ Add Knife

</button>



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
p-6
"

>


{
knife.images?.[0] && (

<img

src={
"http://localhost:8080"+knife.images[0]
}

className="
h-64
w-full
object-cover
"

/>

)

}




<h3 className="
text-2xl
font-serif
mt-5
">

{knife.title}

</h3>




<p>

Maker:

{" "}

{knife.maker?.name || "Unknown"}

</p>



<p>

{knife.price} SEK

</p>



<button

onClick={()=>deleteKnife(knife.id)}

className="
mt-5
border
border-red-600
text-red-600
px-4
py-2
"

>

Delete

</button>



</article>


))

}



</div>


</section>









{/* COLLABORATIONS */}



<section className="
mt-32
">


<div className="
flex
justify-between
items-center
mb-10
">


<h2 className="
text-4xl
font-serif
">

Collaborations

</h2>




<button

onClick={()=>navigate(
"/admin/collaboration/new"
)}

className="
border
px-6
py-3
"

>

+ Add Collaboration

</button>



</div>






<div className="
grid
md:grid-cols-2
gap-10
">


{

collaborations.map(collab=>(


<article

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



<p>

Maker:

{" "}

{collab.maker?.name || "Unknown"}

</p>



<p>

{collab.quantity} pieces

</p>



<button

onClick={()=>deleteCollaboration(collab.id)}

className="
mt-5
border
border-red-600
text-red-600
px-4
py-2
"

>

Delete

</button>



</article>


))

}



</div>



</section>









</div>


</main>


);


}