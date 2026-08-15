import {
  useEffect,
  useState
} from "react";

import {
  Link,
  useParams
} from "react-router-dom";


type Maker = {

  id: string;

  name: string;

  slug: string;

  country?: string;

  bio?: string;

  image?: string;

  website?: string;

  instagram?: string;

};


type Knife = {

  id: string;

  slug: string;

  title: string;

  price: number;

  status: string;

  steel?: string;

  images: string[];

};


type Collaboration = {

  id: string;

  title: string;

  quantity: number;

  status: string;

  description?: string;

  image?: string;

  releaseDate?: string;

};





export default function MakerDetail() {


  const { slug } =
    useParams();


  const [maker, setMaker] =
    useState<Maker | null>(null);


  const [knives, setKnives] =
    useState<Knife[]>([]);


  const [collaborations, setCollaborations] =
    useState<Collaboration[]>([]);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");





  // ==========================
  // LOAD MAKER
  // ==========================

  useEffect(() => {


    async function loadMaker() {


      try {


        const response =
          await fetch(
            `http://localhost:8080/api/makers/${slug}`
          );


        if (!response.ok) {

          throw new Error(
            "Maker not found"
          );

        }


        const data =
          await response.json();


        setMaker(data);


        setKnives(
          Array.isArray(data.knives)
            ? data.knives
            : []
        );


        setCollaborations(
          Array.isArray(data.collaborations)
            ? data.collaborations
            : []
        );


      } catch (error) {


        console.error(
          "MAKER DETAIL ERROR",
          error
        );


        setError(
          "Failed loading maker"
        );


      } finally {


        setLoading(false);

      }

    }


    if (slug) {

      loadMaker();

    }


  }, [slug]);





  // ==========================
  // LOADING
  // ==========================

  if (loading) {


    return (

      <main className="
        min-h-screen
        bg-agane-bg
        flex
        items-center
        justify-center
        text-agane-text
      ">

        Loading maker...

      </main>

    );

  }





  // ==========================
  // ERROR
  // ==========================

  if (error || !maker) {


    return (

      <main className="
        min-h-screen
        bg-agane-bg
        text-agane-text
        flex
        items-center
        justify-center
      ">

        <div className="text-center">


          <h1 className="
            text-5xl
            font-serif
          ">

            Maker not found

          </h1>


          <Link
            to="/shop"
            className="
              inline-block
              mt-8
              border
              px-8
              py-3
              hover:bg-black
              hover:text-white
              transition
            "
          >

            Back to Shop

          </Link>


        </div>

      </main>

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


        {/* ==========================
            MAKER HERO
        ========================== */}

        <section className="
          grid
          lg:grid-cols-2
          gap-16
          items-center
        ">


          {/* IMAGE */}

          <div className="
            bg-white
            border
            overflow-hidden
          ">

            {maker.image ? (

              <img
                src={
                  `http://localhost:8080${maker.image}`
                }
                alt={maker.name}
                className="
                  w-full
                  h-[650px]
                  object-cover
                "
              />

            ) : (

              <div className="
                w-full
                h-[650px]
                flex
                items-center
                justify-center
                opacity-30
              ">

                No Image

              </div>

            )}

          </div>




          {/* INFORMATION */}

          <div>


            <p className="
              uppercase
              tracking-[0.35em]
              text-xs
              opacity-50
            ">

              Maker

            </p>


            <h1 className="
              text-6xl
              font-serif
              mt-5
            ">

              {maker.name}

            </h1>


            {maker.country && (

              <p className="
                mt-5
                text-lg
                opacity-60
              ">

                {maker.country}

              </p>

            )}


            {maker.bio && (

              <p className="
                mt-10
                max-w-xl
                leading-relaxed
                opacity-80
                text-lg
              ">

                {maker.bio}

              </p>

            )}


            {/* LINKS */}

            <div className="
              mt-10
              flex
              gap-6
              flex-wrap
            ">


              {maker.website && (

                <a
                  href={maker.website}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    border
                    px-6
                    py-3
                    hover:bg-black
                    hover:text-white
                    transition
                  "
                >

                  Website ↗

                </a>

              )}


              {maker.instagram && (

                <a
                  href={maker.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    border
                    px-6
                    py-3
                    hover:bg-black
                    hover:text-white
                    transition
                  "
                >

                  Instagram ↗

                </a>

              )}

            </div>


          </div>


        </section>





        {/* ==========================
            KNIVES
        ========================== */}

        {knives.length > 0 && (

          <section className="
            mt-32
          ">


            <div className="
              flex
              justify-between
              items-end
              mb-10
            ">


              <div>

                <p className="
                  text-xs
                  uppercase
                  tracking-[0.3em]
                  opacity-50
                ">

                  Shop

                </p>


                <h2 className="
                  text-4xl
                  font-serif
                  mt-3
                ">

                  Knives by {maker.name}

                </h2>

              </div>


              <span className="
                opacity-50
              ">

                {knives.length} piece
                {knives.length !== 1 ? "s" : ""}

              </span>


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


                  <Link
                    to={`/shop/${knife.slug}`}
                  >

                    {knife.images?.[0] ? (

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

                    ) : (

                      <div className="
                        w-full
                        h-96
                        flex
                        items-center
                        justify-center
                        bg-agane-bg
                        opacity-50
                      ">

                        No image

                      </div>

                    )}

                  </Link>


                  <div className="p-7">


                    <p className="
                      text-xs
                      uppercase
                      tracking-[0.25em]
                      opacity-50
                    ">

                      {knife.status}

                    </p>


                    <Link
                      to={`/shop/${knife.slug}`}
                    >

                      <h3 className="
                        text-3xl
                        font-serif
                        mt-3
                      ">

                        {knife.title}

                      </h3>

                    </Link>


                    {knife.steel && (

                      <p className="
                        mt-3
                        opacity-60
                      ">

                        {knife.steel}

                      </p>

                    )}


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


          </section>

        )}





        {/* ==========================
            COLLABORATIONS
        ========================== */}

        {collaborations.length > 0 && (

          <section className="
            mt-32
          ">


            <div className="mb-10">

              <p className="
                text-xs
                uppercase
                tracking-[0.3em]
                opacity-50
              ">

                Work together

              </p>


              <h2 className="
                text-4xl
                font-serif
                mt-3
              ">

                Collaborations

              </h2>

            </div>




            <div className="
              grid
              md:grid-cols-2
              gap-10
            ">


              {collaborations.map(collab => (

                <Link
                  key={collab.id}
                  to={`/collaborations/${collab.id}`}
                  className="block group"
                >

                  <article
                    className="
                      bg-white
                      border
                      overflow-hidden
                    "
                  >


                    {collab.image ? (

                      <img
                        src={
                          `http://localhost:8080${collab.image}`
                        }
                        alt={collab.title}
                        className="
                          w-full
                          h-80
                          object-cover
                          group-hover:scale-105
                          transition
                          duration-500
                        "
                      />

                    ) : (

                      <div className="
                        w-full
                        h-80
                        flex
                        items-center
                        justify-center
                        bg-agane-bg
                        opacity-50
                      ">

                        No image

                      </div>

                    )}


                    <div className="p-8">


                      <p className="
                        text-xs
                        uppercase
                        tracking-[0.25em]
                        opacity-50
                      ">

                        {collab.status}

                      </p>


                      <h3 className="
                        text-3xl
                        font-serif
                        mt-3
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


                      <div className="
                        mt-6
                        border-t
                        pt-5
                        flex
                        justify-between
                      ">

                        <span>

                          {collab.quantity} pieces

                        </span>


                        {collab.releaseDate && (

                          <span className="opacity-60">

                            {new Date(
                              collab.releaseDate
                            ).toLocaleDateString(
                              "en-GB"
                            )}

                          </span>

                        )}

                      </div>


                    </div>


                  </article>

                </Link>

              ))}


            </div>


          </section>

        )}





      </div>


    </main>

  );

}