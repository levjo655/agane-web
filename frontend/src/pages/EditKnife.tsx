import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


export default function EditKnife(){


const { id } = useParams();

const navigate = useNavigate();



const [loading,setLoading] =
useState(true);


const [saving,setSaving] =
useState(false);



const [error,setError] =
useState("");



const [form,setForm] = useState({

title:"",
slug:"",
maker:"",
origin:"",
steel:"",
bladeType:"",
length:"",
handle:"",
weight:"",
description:"",
price:"",
status:"available"

});





useEffect(()=>{


async function loadKnife(){


try{


const response =
await fetch(

`http://localhost:8080/api/knives/${id}`

);



const knife =
await response.json();




setForm({

title:knife.title || "",

slug:knife.slug || "",

maker:knife.maker || "",

origin:knife.origin || "",

steel:knife.steel || "",

bladeType:knife.bladeType || "",

length:knife.length || "",

handle:knife.handle || "",

weight:
knife.weight || "",

description:
knife.description || "",

price:
knife.price || "",

status:
knife.status || "available"


});



}catch(error){


console.log(error);

setError(
"Failed loading knife"
);



}finally{


setLoading(false);


}


}



loadKnife();



},[id]);









function handleChange(
e:
React.ChangeEvent<
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


setSaving(true);


try{


const response =
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





if(!response.ok){

throw new Error();

}



navigate("/admin");




}catch(error){


console.log(error);

setError(
"Failed updating knife"
);



}finally{


setSaving(false);


}


}










if(loading){

return (

<div className="
p-20
">

Loading knife...

</div>

)

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
space-y-8
"

>






<div className="
grid
md:grid-cols-2
gap-6
">


{
[
["title","Knife Name"],
["slug","Slug"],
["maker","Maker"],
["origin","Origin"],
["steel","Steel"],
["bladeType","Blade Type"],
["length","Blade Length"],
["handle","Handle"],
["weight","Weight"],
["price","Price SEK"]

].map(([name,label])=>(


<input

key={name}

name={name}

placeholder={label}

value={
form[name as keyof typeof form]
}

onChange={handleChange}

className="
border
p-4
bg-transparent
"

/>


))

}



</div>








<select

name="status"

value={form.status}

onChange={handleChange}

className="
border
p-4
bg-transparent
w-full
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

placeholder="Description"

className="
border
p-4
bg-transparent
w-full
h-48
"

/>







{error && (

<p className="
text-red-600
">

{error}

</p>

)}








<button

disabled={saving}

className="
border
px-12
py-4
hover:bg-black
hover:text-white
transition
"

>

{

saving
?
"Saving..."
:
"Update Knife"

}

</button>






</form>





</div>


</main>

);


}