import { useEffect,useState } from "react";
import { useNavigate,useParams } from "react-router-dom";



export default function EditKnife(){


const {
id
}=useParams();



const navigate =
useNavigate();





const [form,setForm]=useState({

title:"",
slug:"",
maker:"",
origin:"",
steel:"",
length:"",
handle:"",
weight:"",
description:"",
price:"",
status:"available"

});




const [loading,setLoading]=
useState(true);







useEffect(()=>{


fetch(
`http://localhost:8080/api/knives`
)


.then(res=>res.json())


.then(data=>{


const knife =
data.find(
(k:any)=>k.id===id
);



if(knife){


setForm({

title:knife.title,

slug:knife.slug,

maker:knife.maker,

origin:knife.origin || "",

steel:knife.steel || "",

length:knife.length || "",

handle:knife.handle || "",

weight:knife.weight || "",

description:knife.description || "",

price:knife.price,

status:knife.status

});


}



})


.finally(()=>{

setLoading(false);

});


},[id]);









function handleChange(
e:React.ChangeEvent<
HTMLInputElement |
HTMLTextAreaElement |
HTMLSelectElement
>
){


setForm({

...form,

[e.target.name]:
e.target.value

});


}










async function handleSubmit(
e:React.FormEvent
){


e.preventDefault();




await fetch(

`http://localhost:8080/api/knives/${id}`,

{

method:"PUT",

headers:{

"Content-Type":
"application/json"

},

body:
JSON.stringify(form)

}

);



navigate("/admin");



}









if(loading){

return <p>Loading...</p>;

}









return (

<div className="
min-h-screen
bg-agane-bg
px-6
py-16
">


<div className="
max-w-4xl
mx-auto
">



<h1 className="
text-5xl
font-serif
mb-12
">

Edit Knife

</h1>






<form

onSubmit={handleSubmit}

className="
space-y-6
"

>





{[

"title",
"slug",
"maker",
"origin",
"steel",
"length",
"handle",
"weight",
"price"

].map(field=>(


<input

key={field}

name={field}

value={
(form as any)[field]
}

onChange={handleChange}

placeholder={field}

className="
border
p-4
w-full
bg-transparent
"

/>


))}





<select

name="status"

value={form.status}

onChange={handleChange}

className="
border
p-4
w-full
bg-transparent
"

>


<option value="available">

Available

</option>


<option value="sold">

Sold

</option>


<option value="archive">

Archive

</option>


</select>








<textarea

name="description"

value={form.description}

onChange={handleChange}

className="
border
p-4
w-full
h-40
bg-transparent
"

/>







<button

className="
bg-black
text-white
px-12
py-4
"

>

Save Changes

</button>




</form>




</div>


</div>


);


}