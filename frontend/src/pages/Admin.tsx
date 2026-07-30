import { useState } from "react";
import Header from "../components/Header";


export default function Admin() {

  const [title, setTitle] = useState("");
  const [maker, setMaker] = useState("");
  const [steel, setSteel] = useState("");
  const [price, setPrice] = useState("");


  async function createKnife() {

    await fetch(
      "http://localhost:8080/api/knives",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({

          title,
          maker,
          steel,
          price:Number(price),

          slug:title
            .toLowerCase()
            .replaceAll(" ","-"),

          description:
            "Hand selected Ågane knife.",

          image:""

        })
      }
    );


    alert("Knife created");

  }



  return (

    <div className="
      min-h-dvh
      bg-agane-bg
      text-agane-text
    ">

      <Header />


      <main className="
        max-w-xl
        mx-auto
        py-20
        px-6
      ">


        <h1 className="
          text-4xl
          font-serif
          mb-10
        ">
          Ågane Admin
        </h1>


        <input
          placeholder="Knife name"
          className="border p-3 w-full mb-4"
          onChange={
            e=>setTitle(e.target.value)
          }
        />


        <input
          placeholder="Maker"
          className="border p-3 w-full mb-4"
          onChange={
            e=>setMaker(e.target.value)
          }
        />


        <input
          placeholder="Steel"
          className="border p-3 w-full mb-4"
          onChange={
            e=>setSteel(e.target.value)
          }
        />


        <input
          placeholder="Price"
          className="border p-3 w-full mb-4"
          onChange={
            e=>setPrice(e.target.value)
          }
        />


        <button
          onClick={createKnife}
          className="
            border
            px-8
            py-3
            hover:bg-black
            hover:text-white
          "
        >
          Create Knife
        </button>


      </main>

    </div>

  );
}