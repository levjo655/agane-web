import {
  useEffect,
  useState
} from "react";

import {
  Link
} from "react-router-dom";


type Maker = {

  id: string;

  name: string;

  slug: string;

};


type Knife = {

  id: string;

  slug: string;

  title: string;

  maker: Maker;

  price: number;

  status: string;

  images: string[];

};


type Collaboration = {

  id: string;

  title: string;

  maker: Maker;

  description?: string;

  quantity: number;

  status: string;

};


function getImageUrl(image?: string) {


  if (!image) {

    return "/knives/hero-knife.jpeg";

  }


  if (image.startsWith("/uploads")) {

    return `http://localhost:8080${image}`;

  }


  return `/knives/${image}`;

}


export default function Home() {


  const [knives, setKnives] =
    useState<Knife[]>([]);


  const [collaborations, setCollaborations] =
    useState<Collaboration[]>([]);


  useEffect(() => {


    async function loadData() {


      try {


        // ==========================
        // LOAD KNIVES
        // ==========================

        const knivesResponse =
          await fetch(
            "http://localhost:8080/api/knives"
          );


        if (knivesResponse.ok) {

          const knivesData =
            await knivesResponse.json();


          if (Array.isArray(knivesData)) {

            setKnives(
              knivesData.slice(0, 6)
            );

          }

        }


        // ==========================
        // LOAD COLLABORATIONS
        // ==========================

        const collabResponse =
          await fetch(
            "http://localhost:8080/api/collaborations"
          );


        if (collabResponse.ok) {

          const collabData =
            await collabResponse.json();


          if (Array.isArray(collabData)) {

            setCollaborations(
              collabData.slice(0, 3)
            );

          }

        }


      } catch (error) {


        console.error(
          "HOME LOAD ERROR",
          error
        );


      }

    }


    loadData();


  }, []);


  return (

    <main className="
      min-h-screen
      bg-agane-bg
      text-agane-text
    ">


      {/* ==================================================
          HERO
      ================================================== */}

      <section className="
        min-h-screen
        flex
        items-center
        px-6
      ">


        <div className="
          max-w-7xl
          mx-auto
          grid
          lg:grid-cols-2
          gap-16
          items-center
          w-full
        ">


          {/* LEFT */}

          <div>


            <img
              src="/knives/agane_logo.png"
              alt="Ågane"
              className="
                w-40
                mb-10
              "
            />


            <p className="
              uppercase
              tracking-[0.4em]
              text-sm
              opacity-60
              mb-8
            ">

              Handcrafted Knives
              &
              Exclusive Collaborations

            </p>


            <h1 className="
              text-6xl
              lg:text-7xl
              font-serif
              leading-tight
            ">

              Rare knives.
              <br />

              Exceptional makers.

            </h1>


            <p className="
              mt-8
              max-w-xl
              text-lg
              opacity-80
            ">

              Ågane brings together exceptional
              bladesmiths and collectors through
              limited handmade knife collaborations.

            </p>


            <div className="
              mt-12
              flex
              gap-6
              flex-wrap
            ">


              <Link
                to="/shop"
                className="
                  border
                  px-10
                  py-4
                  hover:bg-black
                  hover:text-white
                  transition
                "
              >

                Explore Shop

              </Link>


              <Link
                to="/collaborations"
                className="
                  px-10
                  py-4
                  hover:opacity-50
                  transition
                "
              >

                Upcoming Collabs →

              </Link>


            </div>


          </div>


          {/* HERO IMAGE */}

          <div className="
            h-[650px]
            overflow-hidden
          ">


            <img
              src="/knives/hero-knife.jpeg"
              alt="Ågane handcrafted knife"
              className="
                w-full
                h-full
                object-cover
              "
            />


          </div>


        </div>


      </section>


      {/* ==================================================
          INTRO
      ================================================== */}

      <section className="
        px-6
        py-32
      ">


        <div className="
          max-w-5xl
          mx-auto
          text-center
        ">


          <h2 className="
            text-5xl
            font-serif
          ">

            Crafted with purpose.
            <br />

            Collected for a lifetime.

          </h2>


          <p className="
            mt-8
            opacity-70
            text-lg
          ">

            Every Ågane knife represents
            craftsmanship, collaboration
            and the pursuit of perfection.

          </p>


        </div>


      </section>


      {/* ==================================================
          FEATURED KNIVES
      ================================================== */}

      <section className="
        px-6
        py-32
      ">


        <div className="
          max-w-7xl
          mx-auto
        ">


          <div className="
            flex
            justify-between
            items-end
            mb-16
          ">


            <div>

              <p className="
                text-xs
                uppercase
                tracking-[0.3em]
                opacity-50
                mb-3
              ">

                The shop

              </p>


              <h2 className="
                text-5xl
                font-serif
              ">

                Featured Knives

              </h2>

            </div>


            <Link
              to="/shop"
              className="
                hover:opacity-50
                transition
              "
            >

              View all →

            </Link>


          </div>


          <div className="
            grid
            md:grid-cols-3
            gap-10
          ">


            {knives.map(knife => (

              <article
                key={knife.id}
                className="
                  bg-white
                  border
                  overflow-hidden
                  group
                "
              >


                {/* IMAGE */}

                <Link
                  to={`/shop/${knife.slug}`}
                >


                  <img
                    src={
                      getImageUrl(
                        knife.images?.[0]
                      )
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


                </Link>


                <div className="
                  p-7
                ">


                  {/* MAKER */}

                  <Link
                    to={`/makers/${knife.maker.slug}`}
                    className="
                      uppercase
                      tracking-[0.3em]
                      text-xs
                      opacity-60
                      hover:opacity-100
                    "
                  >

                    {knife.maker?.name}

                  </Link>


                  {/* TITLE */}

                  <Link
                    to={`/shop/${knife.slug}`}
                  >

                    <h3 className="
                      text-3xl
                      font-serif
                      mt-4
                      hover:opacity-60
                      transition
                    ">

                      {knife.title}

                    </h3>

                  </Link>


                  <div className="
                    mt-6
                    border-t
                    pt-5
                    flex
                    justify-between
                  ">


                    <span>

                      {knife.status === "available"
                        ? `${knife.price} SEK`
                        : "SOLD"
                      }

                    </span>


                    <Link
                      to={`/shop/${knife.slug}`}
                      className="
                        hover:opacity-50
                      "
                    >

                      View →

                    </Link>


                  </div>


                </div>


              </article>

            ))}


          </div>


        </div>


      </section>


      {/* ==================================================
          FEATURED COLLABORATIONS
      ================================================== */}

      <section className="
        px-6
        py-32
        bg-white
      ">


        <div className="
          max-w-7xl
          mx-auto
        ">


          <div className="
            flex
            justify-between
            items-end
            mb-16
          ">


            <div>


              <p className="
                text-xs
                uppercase
                tracking-[0.3em]
                opacity-50
                mb-3
              ">

                The makers

              </p>


              <h2 className="
                text-5xl
                font-serif
              ">

                Featured Collaborations

              </h2>


            </div>


            <Link
              to="/collaborations"
              className="
                hover:opacity-50
                transition
              "
            >

              View all →

            </Link>


          </div>


          <div className="
            grid
            md:grid-cols-3
            gap-10
          ">


            {collaborations.map(collab => (

              <Link
                key={collab.id}
                to={`/collaborations/${collab.id}`}
                className="
                  block
                  group
                "
              >


                <article className="
                  border
                  p-8
                  h-full
                  hover:shadow-lg
                  transition
                ">


                  <p className="
                    uppercase
                    tracking-[0.3em]
                    text-xs
                    opacity-60
                  ">

                    {collab.maker?.name}

                  </p>


                  <h3 className="
                    text-3xl
                    font-serif
                    mt-4
                    group-hover:opacity-60
                    transition
                  ">

                    {collab.title}

                  </h3>


                  {collab.description && (

                    <p className="
                      mt-5
                      opacity-70
                      leading-relaxed
                    ">

                      {collab.description}

                    </p>

                  )}


                  <p className="
                    mt-6
                  ">

                    Limited to {collab.quantity} pieces

                  </p>


                  <div className="
                    mt-8
                    pt-5
                    border-t
                    text-sm
                    uppercase
                    tracking-widest
                    opacity-60
                  ">

                    View collaboration →

                  </div>


                </article>


              </Link>

            ))}


          </div>


        </div>


      </section>


    </main>

  );

}