import { useState } from "react";
import { useNavigate } from "react-router-dom";



export default function NewCollaboration(){


const navigate = useNavigate();



const [loading,setLoading] =
useState(false);



const [error,setError] =
useState("");





const [form,setForm] =
useState({

  maker:"",
  title:"",
  description:"",
  quantity:"",
  status:"upcoming",
  releaseDate:""

});





const [image,setImage] =
useState<File | null>(null);







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


setLoading(true);

setError("");



try{


const formData =
new FormData();



Object.entries(form)
.forEach(([key,value])=>{


formData.append(
key,
value
);


});





if(image){


formData.append(
"image",
image
);


}





const response =
await fetch(

"http://localhost:8080/api/collaborations",

{

method:"POST",

body:formData

}

);





if(!response.ok){

throw new Error(
"Failed creating collaboration"
);

}




navigate("/admin");





}catch(err){


console.log(err);


setError(
"Something went wrong"
);



}finally{


setLoading(false);


}



}









return (


<div className="
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

New Collaboration

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





{[

["maker","Maker"],
["title","Collaboration Title"],
["quantity","Number of Blades"],
["releaseDate","Release Date"]

].map(([name,label])=>(


<input

key={name}

name={name}

placeholder={label}

type={
name==="releaseDate"
?
"date"
:
"text"
}

value={
form[name as keyof typeof form]
}

onChange={handleChange}

className="
border
border-agane-text
p-4
bg-transparent
"

/>


))}



</div>









<textarea

name="description"

placeholder="
Collaboration description...
"

value={form.description}

onChange={handleChange}

className="
border
border-agane-text
p-4
w-full
h-40
bg-transparent
"

/>










<div>


<label className="
block
mb-3
">

Status

</label>



<select

name="status"

value={form.status}

onChange={handleChange}

className="
border
border-agane-text
p-4
w-full
bg-transparent
"

>


<option value="upcoming">

Upcoming

</option>


<option value="active">

Active

</option>


<option value="completed">

Completed

</option>



</select>



</div>









<div className="
border
border-agane-text
p-6
">


<label>

Upload Collaboration Image


<input

type="file"

accept="image/*"

onChange={(e)=>
setImage(
e.target.files?.[0] || null
)
}

className="
block
mt-4
"

/>


</label>


</div>









{error && (

<p className="
text-red-600
">

{error}

</p>

)}







<button

disabled={loading}

className="
bg-black
text-white
px-12
py-4
border
border-black
hover:bg-transparent
hover:text-black
transition
"

>


{
loading
?
"Saving..."
:
"Create Collaboration"
}


</button>






</form>






</div>


</div>


);


}