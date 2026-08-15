import {
  useEffect,
  useState
} from "react";

import {
  Link
} from "react-router-dom";


// ==========================
// TYPES
// ==========================

type Maker = {

  id: string;

  name: string;

  slug: string;

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

export default function Collaborations() {


  const [
    collaborations,
    setCollaborations
  ] = useState<Collaboration[]>([]);


  const [loading, setLoading] =
    useState(true);


  // ==========================
  // LOAD COLLABORATIONS
  // ==========================

  useEffect(() => {


    async function loadCollaborations() {


      try {


        const response =
          await fetch(
            "http://localhost:8080/api/collaborations"
          );


        if (!response.ok) {

          throw new Error(
            "Failed loading collaborations"
          );

        }


        const data =
          await response.json();


        if (Array.isArray(data)) {

          setCollaborations(data);

        }


      } catch (error) {


        console.error(
          "COLLABORATIONS ERROR",
          error
        );


      } finally {

        setLoading(false);

      }

    }


    loadCollaborations();


  }, []);


  // ==========================
  // GROUP BY STATUS
  // ==========================

  const upcoming =
    collaborations.filter(
      collaboration =>
        collaboration.status === "upcoming"
    );


  const available =
    collaborations.filter(
      collaboration =>
        collaboration.status === "available"
    );


  const archive =
    collaborations.filter(
      collaboration =>
        collaboration.status !== "upcoming" &&
        collaboration.status !== "available"
    );


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

        Loading collaborations...

      </main>

    );

  }


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
            text-xs
            uppercase
            tracking-[0.35em]
            opacity-50
            mb-5
          ">

            Ågane

          </p>


          <h1 className="
            text-6xl
            md:text-7xl
            font-serif
          ">

            Collaborations

          </h1>


          <p className="
            mt-6
            max-w-2xl
            text-lg
            leading-relaxed
            opacity-70
          ">

            Limited collections created together
            with exceptional makers.

          </p>


        </header>


        {/* ==========================
            UPCOMING
        ========================== */}

        {upcoming.length > 0 && (

          <CollaborationSection
            label="Coming soon"
            title="Upcoming"
            collaborations={upcoming}
          />

        )}


        {/* ==========================
            AVAILABLE
        ========================== */}

        {available.length > 0 && (

          <CollaborationSection
            label="Current"
            title="Available"
            collaborations={available}
          />

        )}


        {/* ==========================
            ARCHIVE
        ========================== */}

        {archive.length > 0 && (

          <CollaborationSection
            label="Past work"
            title="Archive"
            collaborations={archive}
            archived
          />

        )}


        {/* ==========================
            EMPTY
        ========================== */}

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


      </div>

    </main>

  );

}


// ==========================
// SECTION
// ==========================

function CollaborationSection({

  label,

  title,

  collaborations,

  archived = false

}: {

  label: string;

  title: string;

  collaborations: Collaboration[];

  archived?: boolean;

}) {


  return (

    <section className="
      mb-32
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

            {label}

          </p>


          <h2 className="
            text-4xl
            font-serif
          ">

            {title}

          </h2>

        </div>


        <p className="
          text-sm
          opacity-50
        ">

          {collaborations.length} collaborations

        </p>


      </div>


      <div className="
        grid
        md:grid-cols-2
        lg:grid-cols-3
        gap-10
      ">


        {collaborations.map(
          collaboration => (

            <CollaborationCard
              key={collaboration.id}
              collaboration={collaboration}
              archived={archived}
            />

          )
        )}


      </div>


    </section>

  );

}


// ==========================
// COLLABORATION CARD
// ==========================

function CollaborationCard({

  collaboration,

  archived = false

}: {

  collaboration: Collaboration;

  archived?: boolean;

}) {


  return (

    <Link
      to={`/collaborations/${collaboration.id}`}
      className="
        block
        group
      "
    >


      <article className={`
        bg-white
        border
        overflow-hidden
        transition
        ${archived
          ? "opacity-75 hover:opacity-100"
          : "hover:shadow-lg"
        }
      `}>


        {/* ==========================
            IMAGE
        ========================== */}

        <div className="
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
                h-[420px]
                object-cover
                group-hover:scale-105
                transition
                duration-700
              "
            />

          ) : (

            <div className="
              w-full
              h-[420px]
              flex
              items-center
              justify-center
              bg-agane-bg
              opacity-50
            ">

              No image

            </div>

          )}


        </div>


        {/* ==========================
            INFO
        ========================== */}

        <div className="
          p-8
        ">


          {/* MAKER */}

          {collaboration.maker && (

            <Link
              to={`/makers/${collaboration.maker.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="
                text-xs
                uppercase
                tracking-[0.3em]
                opacity-50
                hover:opacity-100
              "
            >

              {collaboration.maker.name}

            </Link>

          )}


          {/* TITLE */}

          <h3 className="
            text-3xl
            font-serif
            mt-4
            group-hover:opacity-60
            transition
          ">

            {collaboration.title}

          </h3>


          {/* DESCRIPTION */}

          {collaboration.description && (

            <p className="
              mt-4
              opacity-60
              leading-relaxed
              line-clamp-3
            ">

              {collaboration.description}

            </p>

          )}


          {/* FOOTER */}

          <div className="
            mt-8
            border-t
            pt-5
            flex
            justify-between
            items-center
          ">


            <div>


              <p className="
                text-xs
                uppercase
                tracking-[0.25em]
                opacity-50
              ">

                {getStatusLabel(
                  collaboration.status
                )}

              </p>


              {collaboration.releaseDate && (

                <p className="
                  mt-2
                  text-sm
                  opacity-60
                ">

                  {new Date(
                    collaboration.releaseDate
                  ).toLocaleDateString(
                    "en-GB",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    }
                  )}

                </p>

              )}


            </div>


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