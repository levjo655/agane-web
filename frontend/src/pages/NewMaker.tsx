import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function NewMaker(){


const navigate = useNavigate();


const [form,setForm] = useState({

name:"",
slug:"",
country:"",
bio:"",
image:"",
website:"",
instagram:""

});



const [loading,setLoading] =
useState(false);



function handleChange(
e:React.ChangeEvent<
HTMLInputElement |
HTMLTextAreaElement
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


setLoading(true);



try{


const response =
await fetch(

"http://localhost:8080/api/makers",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(form)

}

);



if(!response.ok){

throw new Error(
"Failed creating maker"
);

}



navigate("/admin");



}catch(error){


console.log(
"CREATE MAKER ERROR",
error
);


}finally{


setLoading(false);


}



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

Add Maker

</h1>






<form

onSubmit={handleSubmit}

className="
space-y-8
"

>




{[

["name","Maker Name"],

["slug","Slug"],

["country","Country"],

["image","Image URL"],

["website","Website"],

["instagram","Instagram"]

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
border-agane-text
p-4
w-full
bg-transparent
"

/>


))}





<textarea

name="bio"

placeholder="Maker biography..."

value={form.bio}

onChange={handleChange}

className="
border
border-agane-text
p-4
w-full
h-48
bg-transparent
"

/>






<button

disabled={loading}

className="
bg-black
text-white
px-12
py-4
"

>

{

loading
?
"Saving..."
:
"Save Maker"

}


</button>





</form>





</div>


</main>

);

}