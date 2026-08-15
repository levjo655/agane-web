import {
  useEffect,
  useState
} from "react";

import {
  Link,
  useParams
} from "react-router-dom";


// ==========================
// TYPES
// ==========================

type Maker = {
  id: string;
  name: string;
  slug: string;
  country?: string;
};


type Collaboration = {
  id: string;
  title: string;
  description?: string | null;
  quantity: number;
  status: string;
  image?: string | null;
  releaseDate?: string | null;
  maker?: Maker | null;
};


// ==========================
// PAGE
// ==========================

export default function CollaborationDetail() {

  const { id } = useParams();


  const [
    collaboration,
    setCollaboration
  ] = useState<Collaboration | null>(null);


  const [loading, setLoading] =
    useState(true);


  // ==========================
  // LOAD
  // ==========================

  useEffect(() => {

    async function loadCollaboration() {

      try {

        const response =
          await fetch(
            `http://localhost:8080/api/collaborations/${id}`
          );


        if (!response.ok) {

          throw new Error(
            "Collaboration not found"
          );

        }


        const data =
          await response.json();


        setCollaboration(data);


      } catch (error) {

        console.error(
          "COLLABORATION DETAIL ERROR",
          error
        );


      } finally {

        setLoading(false);

      }

    }


    if (id) {

      loadCollaboration();

    }

  }, [id]);


  // ==========================
  // LOADING
  // ==========================

  if (loading) {

    return (

      <main className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-agane-bg
        text-agane-text
      ">

        Loading collaboration...

      </main>

    );

  }


  // ==========================
  // NOT FOUND
  // ==========================

  if (!collaboration) {

    return (

      <main className="
        min-h-screen
        flex
        flex-col
        items-center
        justify-center
        bg-agane-bg
        text-agane-text
        px-6
      ">

        <h1 className="
          text-5xl
          font-serif
        ">

          Collaboration not found

        </h1>


        <Link
          to="/collaborations"
          className="
            mt-8
            border
            px-8
            py-3
          "
        >

          ← Back to Collaborations

        </Link>

      </main>

    );

  }


  // ==========================
  // STATUS
  // ==========================

  const statusLabel =
    getStatusLabel(
      collaboration.status
    );


  // ==========================
  // PAGE
  // ==========================

  return (

    <main className="
      min-h-screen
      bg-agane-bg
      text-agane-text
      px-6
      py-16
    ">


      <div className="
        max-w-7xl
        mx-auto
      ">


        {/* BACK */}

        <Link
          to="/collaborations"
          className="
            inline-block
            text-xs
            uppercase
            tracking-[0.3em]
            opacity-50
            hover:opacity-100
            mb-12
          "
        >

          ← Collaborations

        </Link>


        {/* ==========================
            HERO
        ========================== */}

        <div className="
          grid
          lg:grid-cols-2
          gap-16
          xl:gap-24
          items-center
        ">


          {/* IMAGE */}

          <div className="
            bg-white
            border
            overflow-hidden
          ">


            {collaboration.image ? (

              <img
                src={
                  `http://localhost:8080${collaboration.image}`
                }
                alt={collaboration.title}
                className="
                  w-full
                  h-[600px]
                  md:h-[700px]
                  object-cover
                "
              />

            ) : (

              <div className="
                h-[600px]
                md:h-[700px]
                flex
                items-center
                justify-center
                bg-white
                opacity-50
              ">

                No image available

              </div>

            )}

          </div>


          {/* INFORMATION */}

          <div>


            {/* MAKER */}

            {collaboration.maker && (

              <Link
                to={`/makers/${collaboration.maker.slug}`}
                className="
                  text-xs
                  uppercase
                  tracking-[0.35em]
                  opacity-50
                  hover:opacity-100
                "
              >

                {collaboration.maker.name}

              </Link>

            )}


            {/* TITLE */}

            <h1 className="
              text-5xl
              md:text-6xl
              lg:text-7xl
              font-serif
              mt-6
              leading-tight
            ">

              {collaboration.title}

            </h1>


            {/* COUNTRY */}

            {collaboration.maker?.country && (

              <p className="
                mt-5
                opacity-50
              ">

                {collaboration.maker.country}

              </p>

            )}


            {/* STATUS */}

            <div className="
              mt-8
            ">

              <span className="
                inline-block
                border
                px-4
                py-2
                text-xs
                uppercase
                tracking-[0.2em]
              ">

                {statusLabel}

              </span>

            </div>


            {/* DESCRIPTION */}

            {collaboration.description && (

              <div className="
                mt-10
              ">

                <p className="
                  text-xs
                  uppercase
                  tracking-[0.3em]
                  opacity-40
                  mb-4
                ">

                  The Collaboration

                </p>


                <p className="
                  text-lg
                  leading-relaxed
                  opacity-75
                  whitespace-pre-line
                ">

                  {collaboration.description}

                </p>

              </div>

            )}


            {/* DETAILS */}

            <div className="
              mt-12
              border-y
              py-10
              grid
              grid-cols-2
              gap-8
            ">


              {/* QUANTITY */}

              <div>

                <p className="
                  text-xs
                  uppercase
                  tracking-widest
                  opacity-40
                  mb-2
                ">

                  Edition

                </p>


                <p className="
                  text-xl
                  font-serif
                ">

                  {collaboration.quantity} pieces

                </p>

              </div>


              {/* RELEASE */}

              <div>

                <p className="
                  text-xs
                  uppercase
                  tracking-widest
                  opacity-40
                  mb-2
                ">

                  Release

                </p>


                <p className="
                  text-xl
                  font-serif
                ">

                  {collaboration.releaseDate
                    ? formatDate(
                        collaboration.releaseDate
                      )
                    : "Coming soon"
                  }

                </p>

              </div>


            </div>


            {/* CTA */}

            <div className="
              mt-10
            ">


              {collaboration.status === "available" ? (

                <Link
                  to="/shop"
                  className="
                    inline-block
                    border
                    px-10
                    py-4
                    hover:bg-black
                    hover:text-white
                    transition
                  "
                >

                  View Available Knives →

                </Link>

              ) : (

                <a
                  href="mailto:hello@agane.se"
                  className="
                    inline-block
                    border
                    px-10
                    py-4
                    hover:bg-black
                    hover:text-white
                    transition
                  "
                >

                  Contact Ågane →

                </a>

              )}

            </div>


          </div>


        </div>


        {/* ==========================
            MAKER
        ========================== */}

        {collaboration.maker && (

          <section className="
            mt-32
            pt-16
            border-t
          ">


            <p className="
              text-xs
              uppercase
              tracking-[0.3em]
              opacity-40
              mb-5
            ">

              The Maker

            </p>


            <div className="
              flex
              flex-col
              md:flex-row
              md:items-end
              justify-between
              gap-8
            ">


              <div>

                <h2 className="
                  text-5xl
                  font-serif
                ">

                  {collaboration.maker.name}

                </h2>


                {collaboration.maker.country && (

                  <p className="
                    mt-4
                    opacity-50
                  ">

                    {collaboration.maker.country}

                  </p>

                )}

              </div>


              <Link
                to={`/makers/${collaboration.maker.slug}`}
                className="
                  border
                  px-8
                  py-3
                  hover:bg-black
                  hover:text-white
                  transition
                "
              >

                View Maker →

              </Link>


            </div>


          </section>

        )}


      </div>

    </main>

  );

}


// ==========================
// HELPERS
// ==========================

function getStatusLabel(
  status: string
) {

  switch (status) {

    case "upcoming":
      return "Coming Soon";

    case "available":
      return "Available";

    case "sold":
      return "Sold";

    default:
      return status;

  }

}


function formatDate(
  date: string
) {

  return new Date(
    date
  ).toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "long",
      year: "numeric"
    }
  );

}