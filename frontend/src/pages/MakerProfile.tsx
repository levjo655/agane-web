import {
  useEffect,
  useState
} from "react";

import {
  useParams,
  Link
} from "react-router-dom";


// ==========================
// TYPES
// ==========================

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

  title: string;

  slug: string;

  images?: string[];

  price: number;

  status: string;

};


type Collaboration = {

  id: string;

  title: string;

  description?: string | null;

  quantity: number;

  status: string;

  releaseDate?: string | null;

  image?: string | null;

};


type MakerProfileData = {

  maker: Maker;

  knives?: Knife[];

  collaborations?: Collaboration[];

};


// ==========================
// COMPONENT
// ==========================

export default function MakerProfile() {

  const { maker } = useParams();


  const [data, setData] =
    useState<MakerProfileData | null>(null);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  // ==========================
  // LOAD MAKER
  // ==========================

  useEffect(() => {

    async function loadMaker() {

      if (!maker) {

        setError("Maker not found");

        setLoading(false);

        return;

      }


      try {

        const response =
          await fetch(
            `http://localhost:8080/api/makers/${maker}`
          );


        if (!response.ok) {

          throw new Error(
            "Failed loading maker"
          );

        }


        const result =
          await response.json();


        console.log(
          "MAKER PROFILE DATA:",
          result
        );


        setData(result);


      } catch (error) {

        console.error(
          "MAKER ERROR",
          error
        );


        setError(
          "Failed loading maker"
        );


      } finally {

        setLoading(false);

      }

    }


    loadMaker();

  }, [maker]);


  // ==========================
  // LOADING
  // ==========================

  if (loading) {

    return (

      <main className="
        min-h-screen
        bg-agane-bg
        text-agane-text
        flex
        items-center
        justify-center
      ">

        Loading maker...

      </main>

    );

  }


  // ==========================
  // ERROR
  // ==========================

  if (
    error ||
    !data ||
    !data.maker
  ) {

    return (

      <main className="
        min-h-screen
        bg-agane-bg
        text-agane-text
        flex
        items-center
        justify-center
      ">

        <div className="
          text-center
        ">

          <h1 className="
            text-5xl
            font-serif
          ">

            Maker not found

          </h1>


          <Link
            to="/"
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

            Back to Ågane

          </Link>

        </div>

      </main>

    );

  }


  // ==========================
  // SAFE ARRAYS
  // ==========================

  const knives =
    Array.isArray(data.knives)
      ? data.knives
      : [];


  const collaborations =
    Array.isArray(data.collaborations)
      ? data.collaborations
      : [];


  // ==========================
  // PAGE
  // ==========================

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
            HEADER
        ========================== */}

        <header className="
          mb-20
        ">

          <p className="
            uppercase
            tracking-[0.4em]
            opacity-60
            text-sm
          ">

            Master Bladesmith

          </p>


          <h1 className="
            text-6xl
            md:text-7xl
            font-serif
            mt-5
          ">

            {data.maker.name}

          </h1>


          {data.maker.country && (

            <p className="
              mt-4
              opacity-70
            ">

              {data.maker.country}

            </p>

          )}


          {data.maker.bio && (

            <p className="
              mt-8
              max-w-2xl
              text-lg
              leading-relaxed
              opacity-70
            ">

              {data.maker.bio}

            </p>

          )}


          {/* WEBSITE / INSTAGRAM */}

          {(data.maker.website ||
            data.maker.instagram) && (

            <div className="
              flex
              gap-6
              mt-8
              text-sm
              uppercase
              tracking-widest
            ">


              {data.maker.website && (

                <a
                  href={
                    data.maker.website
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    hover:opacity-50
                    transition
                  "
                >

                  Website →

                </a>

              )}


              {data.maker.instagram && (

                <a
                  href={
                    data.maker.instagram.startsWith(
                      "http"
                    )
                      ? data.maker.instagram
                      : `https://instagram.com/${data.maker.instagram.replace("@", "")}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    hover:opacity-50
                    transition
                  "
                >

                  Instagram →

                </a>

              )}

            </div>

          )}

        </header>


        {/* ==========================
            KNIVES
        ========================== */}

        <section>

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
                mb-3
              ">

                Work

              </p>


              <h2 className="
                text-4xl
                font-serif
              ">

                Knives

              </h2>

            </div>


            <p className="
              text-sm
              opacity-50
            ">

              {knives.length} pieces

            </p>

          </div>


          {knives.length === 0 && (

            <div className="
              border
              p-12
              text-center
              opacity-60
            ">

              No knives listed yet.

            </div>

          )}


          {knives.length > 0 && (

            <div className="
              grid
              md:grid-cols-2
              lg:grid-cols-3
              gap-10
            ">

              {knives.map(
                knife => (

                  <Link
                    key={knife.id}
                    to={`/shop/${knife.slug}`}
                    className="
                      block
                      group
                    "
                  >

                    <article className="
                      bg-white
                      border
                      overflow-hidden
                    ">


                      {/* IMAGE */}

                      {knife.images?.[0] ? (

                        <div className="
                          overflow-hidden
                        ">

                          <img
                            src={
                              `http://localhost:8080${knife.images[0]}`
                            }
                            alt={
                              knife.title
                            }
                            className="
                              w-full
                              h-96
                              object-cover
                              group-hover:scale-105
                              transition
                              duration-700
                            "
                          />

                        </div>

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


                      {/* INFO */}

                      <div className="
                        p-7
                      ">

                        <p className="
                          text-xs
                          uppercase
                          tracking-[0.3em]
                          opacity-50
                        ">

                          {knife.status}

                        </p>


                        <h3 className="
                          text-3xl
                          font-serif
                          mt-3
                        ">

                          {knife.title}

                        </h3>


                        <div className="
                          mt-6
                          flex
                          justify-between
                          items-center
                        ">

                          <span>

                            {knife.price} SEK

                          </span>


                          <span className="
                            text-sm
                            uppercase
                            tracking-widest
                            group-hover:opacity-50
                            transition
                          ">

                            View →

                          </span>

                        </div>

                      </div>

                    </article>

                  </Link>

                )
              )}

            </div>

          )}

        </section>


        {/* ==========================
            COLLABORATIONS
        ========================== */}

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
                mb-3
              ">

                Ågane

              </p>


              <h2 className="
                text-4xl
                font-serif
              ">

                Collaborations

              </h2>

            </div>


            <p className="
              text-sm
              opacity-50
            ">

              {collaborations.length}

            </p>

          </div>


          {collaborations.length === 0 && (

            <div className="
              border
              p-12
              text-center
              opacity-60
            ">

              No collaborations yet.

            </div>

          )}


          {collaborations.length > 0 && (

            <div className="
              grid
              md:grid-cols-2
              lg:grid-cols-3
              gap-10
            ">

              {collaborations.map(
                collab => (

                  <Link
                    key={collab.id}
                    to={`/collaborations/${collab.id}`}
                    className="
                      block
                      group
                    "
                  >

                    <article className="
                      bg-white
                      border
                      overflow-hidden
                    ">


                      {/* IMAGE */}

                      {collab.image ? (

                        <div className="
                          overflow-hidden
                        ">

                          <img
                            src={
                              `http://localhost:8080${collab.image}`
                            }
                            alt={
                              collab.title
                            }
                            className="
                              w-full
                              h-80
                              object-cover
                              group-hover:scale-105
                              transition
                              duration-700
                            "
                          />

                        </div>

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


                      {/* INFO */}

                      <div className="
                        p-7
                      ">

                        <p className="
                          text-xs
                          uppercase
                          tracking-[0.3em]
                          opacity-50
                        ">

                          {getStatusLabel(
                            collab.status
                          )}

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
                            mt-4
                            opacity-60
                            leading-relaxed
                            line-clamp-3
                          ">

                            {
                              collab.description
                            }

                          </p>

                        )}


                        <div className="
                          mt-6
                          border-t
                          pt-5
                          flex
                          justify-between
                        ">

                          <span className="
                            text-sm
                            opacity-60
                          ">

                            {collab.quantity} pieces

                          </span>


                          <span className="
                            text-sm
                            uppercase
                            tracking-widest
                            group-hover:opacity-50
                            transition
                          ">

                            View →

                          </span>

                        </div>

                      </div>

                    </article>

                  </Link>

                )
              )}

            </div>

          )}

        </section>

      </div>

    </main>

  );

}


// ==========================
// STATUS LABEL
// ==========================

function getStatusLabel(
  status: string
) {

  switch (status) {

    case "upcoming":
      return "Upcoming";

    case "available":
      return "Available";

    case "sold":
      return "Sold";

    default:
      return status;

  }

}