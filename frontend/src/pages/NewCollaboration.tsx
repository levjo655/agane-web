import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function NewCollaboration(){


  const navigate = useNavigate();



  const [form,setForm] = useState({

    maker:"",
    title:"",
    description:"",
    quantity:"",
    releaseDate:"",
    image:""

  });




  const handleChange = (
    e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  )=>{


    setForm({

      ...form,

      [e.target.name]:e.target.value

    });


  };





  const handleSubmit = async(
    e:React.FormEvent
  )=>{


    e.preventDefault();



    try{


      const response =
        await fetch(
          "http://localhost:8080/api/collaborations",
          {

            method:"POST",

            headers:{
              "Content-Type":"application/json"
            },


            body:JSON.stringify({

              ...form,

              quantity:Number(form.quantity)

            })

          }
        );



      if(!response.ok){

        throw new Error(
          "Failed creating collaboration"
        );

      }



      navigate("/admin");



    }catch(error){


      console.log(error);


      alert(
        "Could not create collaboration"
      );


    }



  };






  return (

    <div className="
      min-h-screen
      bg-agane-bg
      text-agane-text
      px-6
      py-20
    ">


      <div className="
        max-w-3xl
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




          <input

            name="maker"

            placeholder="Maker"

            value={form.maker}

            onChange={handleChange}

            className="
              w-full
              border
              p-4
            "

          />





          <input

            name="title"

            placeholder="Collection title"

            value={form.title}

            onChange={handleChange}

            className="
              w-full
              border
              p-4
            "

          />






          <textarea

            name="description"

            placeholder="Description"

            value={form.description}

            onChange={handleChange}

            className="
              w-full
              border
              p-4
              h-40
            "

          />







          <input

            name="quantity"

            type="number"

            placeholder="Number of knives"

            value={form.quantity}

            onChange={handleChange}

            className="
              w-full
              border
              p-4
            "

          />







          <input

            name="releaseDate"

            type="date"

            value={form.releaseDate}

            onChange={handleChange}

            className="
              w-full
              border
              p-4
            "

          />







          <input

            name="image"

            placeholder="Image URL"

            value={form.image}

            onChange={handleChange}

            className="
              w-full
              border
              p-4
            "

          />







          <button

            className="
              border
              px-10
              py-4
              hover:bg-black
              hover:text-white
              transition
            "

          >

            Create Collaboration

          </button>





        </form>



      </div>


    </div>


  );

}