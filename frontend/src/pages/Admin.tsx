import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";


type Knife = {

  id:string;

  title:string;

  maker:string;

  steel?:string;

  price:number;

  images:string[];

  status:string;

};



type Collaboration = {

  id:string;

  maker:string;

  title:string;

  description?:string;

  quantity:number;

  status:string;

};





export default function Admin(){


const navigate = useNavigate();


const {
  user,
  logout
} = useAuth0();



const [loading,setLoading] =
useState(true);



const [knives,setKnives] =
useState<Knife[]>([]);



const [collaborations,setCollaborations] =
useState<Collaboration[]>([]);







function statusBadge(status:string){


if(status==="sold"){

return (

<span className="
border
px-4
py-1
text-sm
">

SOLD

</span>

);

}



if(status==="archive"){

return (

<span className="
border
px-4
py-1
text-sm
">

ARCHIVE

</span>

);

}



return (

<span className="
border
px-4
py-1
text-sm
">

AVAILABLE

</span>

);


}








useEffect(()=>{


fetch(
"http://localhost:8080/api/knives"
)

.then(res=>res.json())

.then(data=>{


console.log("KNIVES:",data);


if(Array.isArray(data)){

setKnives(data);

}


})

.catch(err=>{

console.log(err);

});






fetch(
"http://localhost:8080/api/collaborations"
)

.then(res=>res.json())

.then(data=>{


console.log("COLLABS:",data);


if(Array.isArray(data)){

setCollaborations(data);

}


})

.catch(err=>console.log(err))


.finally(()=>{

setLoading(false);

});



},[]);








return (

<div className="
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

Welcome back {user?.name}

</p>


</div>





<button

onClick={()=>logout({
logoutParams:{
returnTo:window.location.origin
}
})}

className="
border
px-6
py-3
"

>

Logout

</button>



</header>








<div className="
flex
justify-between
mb-12
">


<h2 className="
text-3xl
font-serif
">

Knife Collection

</h2>



<button

onClick={()=>navigate("/admin/new")}

className="
border
px-8
py-3
"

>

+ Add Knife

</button>



</div>







{loading && (

<p>
Loading...
</p>

)}







<div className="
grid
md:grid-cols-3
gap-10
">


{knives.map(knife=>(


<div

key={knife.id}

className="
bg-white
border
p-6
"

>


{knife.images?.[0] && (

<img

src={
`http://localhost:8080${knife.images[0]}`
}

className="
h-72
w-full
object-cover
"

/>

)}



<h3 className="
text-2xl
font-serif
mt-5
">

{knife.title}

</h3>


<p>

{knife.maker}

</p>


<p className="mt-4">

{knife.price} SEK

</p>


{statusBadge(knife.status)}


</div>


))}


</div>






</div>


</div>

);


}