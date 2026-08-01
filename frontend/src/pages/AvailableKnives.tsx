import { useEffect, useState } from "react";


type Knife = {

  id:string;

  title:string;

  maker:string;

  origin?:string;

  steel?:string;

  bladeType?:string;

  length?:string;

  price:number;

  description?:string;

  images:string[];

};



export default function AvailableKnives(){


  const [knives,setKnives] =
    useState<Knife[]>([]);


  const [loading,setLoading] =
    useState(true);





  useEffect(()=>{


    fetch(
      "http://localhost:8080/api/knives"
    )

    .then(res=>res.json())

    .then(data=>{


      console.log(
        "PUBLIC KNIVES:",
        data
      );


      if(Array.isArray(data)){

        setKnives(data);

      }


    })


    .catch(error=>{


      console.log(
        "ERROR:",
        error
      );


    })


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
      py-20
    ">


      <div className="
        max-w-7xl
        mx-auto
      ">




        <h1 className="
          text-5xl
          font-serif
          mb-6
        ">

          Available Knives

        </h1>



        <p className="
          mb-12
          opacity-70
          max-w-xl
        ">

          A curated collection of handmade knives
          from exceptional makers around the world.

        </p>







        {loading && (

          <div>

            Loading collection...

          </div>

        )}








        {!loading && knives.length === 0 && (

          <div className="
            opacity-60
          ">

            No knives available yet.

          </div>

        )}









        <div className="
          grid
          md:grid-cols-3
          gap-10
        ">



          {knives.map((knife)=>(


            <article

              key={knife.id}

              className="
                bg-white
                border
                overflow-hidden
                hover:shadow-xl
                transition
              "

            >






              {knife.images?.[0] && (

                <img

                  src={
                    `http://localhost:8080${knife.images[0]}`
                  }

                  alt={knife.title}

                  className="
                    w-full
                    h-96
                    object-cover
                  "

                />

              )}








              <div className="
                p-7
              ">



                <h2 className="
                  text-3xl
                  font-serif
                  mb-3
                ">

                  {knife.title}

                </h2>





                <p>
                  {knife.maker}
                </p>





                {knife.origin && (

                  <p className="mt-2">

                    {knife.origin}

                  </p>

                )}







                {knife.steel && (

                  <p className="
                    text-sm
                    mt-3
                  ">

                    {knife.steel}

                  </p>

                )}







                <div className="
                  mt-6
                  flex
                  justify-between
                  items-center
                ">



                  <span className="
                    text-xl
                    font-semibold
                  ">

                    {knife.price} SEK

                  </span>




                  <button

                    className="
                      underline
                    "

                  >

                    View

                  </button>



                </div>





              </div>



            </article>



          ))}




        </div>





      </div>


    </div>

  );

}