import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


type Maker = {

id:string;

name:string;

country?:string;

};



export default function NewCollaboration(){


const navigate = useNavigate();


const [makers,setMakers] =
useState<Maker[]>([]);



const [form,setForm] = useState({

title:"",

makerId:"",

description:"",

quantity:"",

status:"upcoming",

releaseDate:""

});



const [image,setImage] =
useState<File | null>(null);






useEffect(()=>{


async function loadMakers(){


try{


const res =
await fetch(
"http://localhost:8080/api/makers"
);


const data =
await res.json();


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








function update(
e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
){


setForm({

...form,

[e.target.name]:e.target.value

});


}









async function handleSubmit(
e:React.FormEvent
){


e.preventDefault();



try{


const formData =
new FormData();



formData.append(
"title",
form.title
);



formData.append(
"makerId",
form.makerId
);



formData.append(
"description",
form.description
);



formData.append(
"quantity",
form.quantity
);



formData.append(
"status",
form.status
);



if(form.releaseDate){

formData.append(
"releaseDate",
form.releaseDate
);

}



if(image){

formData.append(
"image",
image
);

}







const res =
await fetch(

"http://localhost:8080/api/collaborations",

{

method:"POST",

body:formData

}

);





if(!res.ok){

const error =
await res.json();


console.log(error);


throw new Error(
"Failed creating collaboration"
);

}




navigate("/admin");



}catch(error){


console.error(
"CREATE COLLAB ERROR",
error
);


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
max-w-xl
mx-auto
">


<h1 className="
text-5xl
font-serif
mb-10
">

New Collaboration

</h1>





<form
onSubmit={handleSubmit}
className="
space-y-6
"
>





<input

name="title"

placeholder="Collaboration title"

value={form.title}

onChange={update}

className="
border
p-3
w-full
"

/>








<select

name="makerId"

value={form.makerId}

onChange={update}

className="
border
p-3
w-full
"

>


<option value="">

Select maker

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








<textarea

name="description"

placeholder="Description"

value={form.description}

onChange={update}

className="
border
p-3
w-full
"

/>









<input

name="quantity"

type="number"

placeholder="Quantity"

value={form.quantity}

onChange={update}

className="
border
p-3
w-full
"

/>








<select

name="status"

value={form.status}

onChange={update}

className="
border
p-3
w-full
"

>


<option value="upcoming">

Upcoming

</option>


<option value="available">

Available

</option>


<option value="sold">

Sold

</option>


</select>









<input

type="date"

name="releaseDate"

value={form.releaseDate}

onChange={update}

className="
border
p-3
w-full
"

/>









<input

type="file"

accept="image/*"

onChange={(e)=>

setImage(
e.target.files?.[0] || null
)

}

/>








<button

className="
border
px-8
py-3
"

>

Create Collaboration

</button>





</form>



</div>


</main>

);


}