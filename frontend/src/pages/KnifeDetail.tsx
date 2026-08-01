import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


type Knife = {

  id:string;

  title:string;

  maker:string;

  steel?:string;

  origin?:string;

  length?:string;

  handle?:string;

  weight?:number;

  description?:string;

  price:number;

  status:string;

  images:string[];

};





export default function KnifeDetail(){


  const { slug } =
    useParams();



  const [knife,setKnife] =
    useState<Knife | null>(null);



  const [loading,setLoading] =
    useState(true);





  useEffect(()=>{


    if(!slug) return;



    fetch(
      `http://localhost:8080/api/knives/${slug}`
    )


    .then(res=>res.json())


    .then(data=>{


      console.log(
        "DETAIL:",
        data
      );


      setKnife(data);


    })


    .catch(err=>{


      console.log(
        "DETAIL ERROR",
        err
      );


    })


    .finally(()=>{


      setLoading(false);


    });



  },[slug]);







  if(loading){


    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
      ">

        Loading...

      </div>

    );


  }





  if(!knife){


    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
      ">

        Knife not found

      </div>

    );

  }









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






        <div className="
          grid
          lg:grid-cols-2
          gap-16
          items-start
        ">





          {/* IMAGE GALLERY */}


          <section>


            <img

              src={
                `http://localhost:8080${knife.images[0]}`
              }

              alt={knife.title}

              className="
                w-full
                h-[700px]
                object-cover
              "

            />




            <div className="
              grid
              grid-cols-4
              gap-4
              mt-6
            ">


              {knife.images.map((image,index)=>(


                <img

                  key={index}

                  src={
                    `http://localhost:8080${image}`
                  }

                  className="
                    h-28
                    w-full
                    object-cover
                  "

                />


              ))}



            </div>



          </section>









          {/* DETAILS */}



          <section>


            <p className="
              uppercase
              tracking-[0.3em]
              text-sm
              opacity-60
            ">

              {knife.maker}

            </p>






            <h1 className="
              text-6xl
              font-serif
              mt-6
            ">

              {knife.title}

            </h1>







            <div className="
              mt-8
              flex
              gap-4
            ">


              <span className="
                border
                px-4
                py-2
                text-sm
              ">


                {knife.status}


              </span>



            </div>









            <p className="
              mt-10
              text-3xl
              font-serif
            ">

              {knife.price} SEK

            </p>









            <p className="
              mt-10
              leading-relaxed
              opacity-80
            ">

              {knife.description}

            </p>









            {/* SPECS */}



            <div className="
              mt-12
              border-t
              pt-8
              space-y-4
            ">



              {knife.steel && (

                <div className="
                  flex
                  justify-between
                ">

                  <span>
                    Steel
                  </span>

                  <span>
                    {knife.steel}
                  </span>

                </div>

              )}







              {knife.origin && (

                <div className="
                  flex
                  justify-between
                ">

                  <span>
                    Origin
                  </span>

                  <span>
                    {knife.origin}
                  </span>

                </div>

              )}







              {knife.length && (

                <div className="
                  flex
                  justify-between
                ">

                  <span>
                    Blade
                  </span>

                  <span>
                    {knife.length}
                  </span>

                </div>

              )}








              {knife.handle && (

                <div className="
                  flex
                  justify-between
                ">

                  <span>
                    Handle
                  </span>

                  <span>
                    {knife.handle}
                  </span>

                </div>

              )}







            </div>









            <button className="
              mt-12
              border
              border-agane-text
              px-10
              py-4
              hover:bg-agane-text
              hover:text-white
              transition
            ">

              Inquire about this knife →

            </button>





          </section>





        </div>







      </div>





    </main>


  );

}