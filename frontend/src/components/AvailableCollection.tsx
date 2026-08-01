import KnifeCard from "./KnifeCard";


interface Knife {

  id:string;

  title:string;

  maker:string;

  steel?:string;

  description:string;

  price:number;

  image:string;

  status:string;

}



export default function AvailableCollection(
  {
    knives
  }:{
    knives:Knife[]
  }
){


  const available =
    knives.filter(
      knife =>
        knife.status === "available"
    );



  return (

    <section
      className="
        px-6
        py-24
      "
    >



      <div className="
        max-w-7xl
        mx-auto
      ">



        <div className="
          mb-14
        ">


          <p className="
            uppercase
            text-xs
            tracking-[0.4em]
            opacity-60
            mb-4
          ">

            Collection

          </p>




          <h2 className="
            text-5xl
            font-serif
          ">

            Available Now

          </h2>


        </div>







        <div className="
          grid
          md:grid-cols-3
          gap-10
        ">


          {available.map((knife)=>(


            <KnifeCard

              key={knife.id}

              knife={knife}

            />


          ))}



        </div>





      </div>


    </section>


  );

}