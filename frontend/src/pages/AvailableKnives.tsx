import { useEffect, useState } from "react";
import Header from "../components/Header";
import KnifeCard from "../components/KnifeCard";


interface Knife {
  id: string;
  title: string;
  maker: string;
  steel?: string;
  description: string;
  price: number;
  image: string;
  status: string;
}



export default function AvailableKnives() {


  const [knives, setKnives] = useState<Knife[]>([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {

    fetch("http://localhost:8080/api/knives")
      .then((res) => res.json())
      .then((data) => {

        setKnives(data);
        setLoading(false);

      })
      .catch((error) => {

        console.error(
          "Failed to fetch knives:",
          error
        );

        setLoading(false);

      });

  }, []);




  return (

    <div
      className="
        min-h-dvh
        flex
        flex-col
        bg-agane-bg
        text-agane-text
      "
    >

      <Header />



      <main
        className="
          flex-grow
          max-w-7xl
          mx-auto
          px-6
          py-24
          w-full
        "
      >


        {/* PAGE HEADER */}

        <section
          className="
            text-center
            mb-20
          "
        >

          <p
            className="
              uppercase
              tracking-[0.3em]
              text-sm
              mb-6
              opacity-70
            "
          >
            Curated selection
          </p>


          <h1
            className="
              text-5xl
              md:text-6xl
              font-serif
              mb-6
            "
          >
            Available Knives
          </h1>


          <p
            className="
              max-w-xl
              mx-auto
              text-lg
              leading-relaxed
              opacity-80
            "
          >
            Exceptional Japanese knives from selected makers,
            finished and prepared through traditional sharpening
            techniques.
          </p>


        </section>




        {/* PRODUCTS */}

        {loading ? (

          <div
            className="
              text-center
              py-20
              opacity-70
            "
          >
            Loading knives...
          </div>


        ) : knives.length === 0 ? (


          <div
            className="
              text-center
              py-20
              opacity-70
            "
          >
            No knives currently available.
          </div>


        ) : (


          <section
            className="
              grid
              md:grid-cols-2
              lg:grid-cols-3
              gap-10
            "
          >

            {knives
              .filter(
                (knife) =>
                  knife.status === "available"
              )
              .map((knife) => (

                <KnifeCard
                  key={knife.id}
                  knife={knife}
                />

              ))}


          </section>


        )}


      </main>


    </div>

  );

}