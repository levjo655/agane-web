import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";



type Maker = {

  id:string;

  name:string;

};





export default function NewKnife(){


const navigate = useNavigate();




const [loading,setLoading] =
useState(false);


const [error,setError] =
useState("");



const [makers,setMakers] =
useState<Maker[]>([]);




const [form,setForm] =
useState({

title:"",
slug:"",
makerId:"",
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





const [images,setImages] =
useState<FileList | null>(null);








// ==========================
// LOAD MAKERS
// ==========================


useEffect(()=>{


async function loadMakers(){


try{


const response =
await fetch(
"http://localhost:8080/api/makers"
);



const data =
await response.json();



if(Array.isArray(data)){

setMakers(data);

}



}catch(error){


console.log(
"LOAD MAKERS ERROR",
error
);


}


}



loadMakers();



},[]);









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







if(images){


Array.from(images)
.forEach(image=>{


formData.append(
"images",
image
);


});


}







const response =
await fetch(

"http://localhost:8080/api/knives",

{

method:"POST",

body:formData

}

);





if(!response.ok){

throw new Error(
"Failed creating knife"
);

}





navigate("/admin");




}catch(error){


console.log(
"CREATE KNIFE ERROR",
error
);



setError(
"Something went wrong creating knife"
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

Add New Knife

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


["title","Knife Name"],

["slug","Slug"],

["origin","Origin"],

["steel","Steel"],

["bladeType","Blade Type"],

["length","Blade Length"],

["handle","Handle Material"],

["weight","Weight"],

["price","Price SEK"]


].map(([name,label])=>(


<input

key={name}

name={name}

placeholder={label}

value={
form[
name as keyof typeof form
]
}

onChange={handleChange}

className="
border
border-agane-text
p-4
bg-transparent
w-full
"

/>


))}





</div>









{/* MAKER SELECT */}


<div>


<label className="
block
uppercase
text-xs
tracking-widest
mb-3
">

Maker

</label>




<select

name="makerId"

value={form.makerId}

onChange={handleChange}

className="
border
border-agane-text
p-4
bg-transparent
w-full
"

>



<option value="">

Select Maker

</option>



{makers.map(maker=>(


<option

key={maker.id}

value={maker.id}

>

{maker.name}

</option>


))}



</select>



</div>









{/* STATUS */}



<div>


<label className="
block
uppercase
text-xs
tracking-widest
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



</div>









<textarea

name="description"

placeholder="
Knife story / description...
"

value={form.description}

onChange={handleChange}

className="
border
border-agane-text
p-4
bg-transparent
w-full
h-48
"

/>









<div className="
border
border-agane-text
p-6
">


<label>

Knife Images


<input

type="file"

multiple

accept="image/*"

onChange={(e)=>

setImages(
e.target.files
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

type="submit"

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

"Saving Knife..."

:

"Save Knife"

}


</button>








</form>





</div>


</main>

);


}