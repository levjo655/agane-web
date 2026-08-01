import { useEffect, useState } from "react";
import { Link } from "react-router-dom";



type Knife = {

  id:string;

  slug:string;

  title:string;

  maker:string;

  steel?:string;

  description?:string;

  price:number;

  status:string;

  images:any;

};







export default function Collection(){



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
        "COLLECTION DATA:",
        data
      );


      if(Array.isArray(data)){

        setKnives(data);

      }


    })


    .catch(err=>{


      console.log(
        "COLLECTION ERROR:",
        err
      );


    })


    .finally(()=>{


      setLoading(false);


    });



  },[]);









  const available =
    knives.filter(
      knife =>
        knife.status === "available"
    );





  const archive =
    knives.filter(
      knife =>
        knife.status !== "available"
    );









  return (

    <main className="
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






        <header className="
          mb-20
        ">


          <h1 className="
            text-6xl
            font-serif
          ">

            Collection

          </h1>




          <p className="
            mt-6
            max-w-xl
            opacity-70
          ">

            A collection of handcrafted
            knives created together with
            exceptional makers.

          </p>


        </header>









        {loading && (

          <p>

            Loading collection...

          </p>

        )}












        {/* AVAILABLE PIECES */}



        {!loading && (



        <section>


          <h2 className="
            text-4xl
            font-serif
            mb-10
          ">

            Available Pieces

          </h2>






          <div className="
            grid
            md:grid-cols-3
            gap-10
          ">






          {available.map((knife)=>(



            <article

              key={knife.id}

              className="
                bg-white
                border
                border-agane-border
                overflow-hidden
                group
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
                    group-hover:scale-105
                    transition
                    duration-500
                  "

                />


              )}









              <div className="
                p-8
              ">






                <p className="
                  text-xs
                  uppercase
                  tracking-[0.3em]
                  opacity-60
                ">

                  {knife.maker}

                </p>







                <h3 className="
                  text-3xl
                  font-serif
                  mt-3
                ">

                  {knife.title}

                </h3>







                {knife.steel && (


                  <p className="
                    mt-4
                    opacity-70
                  ">

                    {knife.steel}

                  </p>


                )}









                <div className="
                  mt-8
                  border-t
                  pt-5
                  flex
                  justify-between
                  items-center
                ">



                  <span>

                    {knife.price} SEK

                  </span>






                  <Link

                    to={`/collection/${knife.slug}`}

                    className="
                      text-sm
                      hover:opacity-60
                      transition
                    "

                  >

                    View →

                  </Link>




                </div>







              </div>





            </article>



          ))}




          </div>





        </section>



        )}














        {/* ARCHIVE */}



        {!loading && archive.length > 0 && (



        <section className="
          mt-32
        ">



          <h2 className="
            text-4xl
            font-serif
            mb-10
          ">

            Archive

          </h2>







          <div className="
            grid
            md:grid-cols-3
            gap-10
          ">






          {archive.map((knife)=>(



            <article

              key={knife.id}

              className="
                opacity-80
                border
                bg-white
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
                    h-80
                    object-cover
                  "

                />


              )}









              <div className="
                p-6
              ">





                <p className="
                  text-xs
                  tracking-widest
                ">

                  SOLD

                </p>






                <Link

                  to={`/collection/${knife.slug}`}

                >


                  <h3 className="
                    text-2xl
                    font-serif
                    mt-3
                  ">

                    {knife.title}

                  </h3>


                </Link>







                <p className="
                  mt-2
                ">

                  {knife.maker}

                </p>







              </div>







            </article>



          ))}




          </div>






        </section>



        )}





      </div>



    </main>


  );

}