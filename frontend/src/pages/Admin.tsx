import {
  useEffect,
  useState
} from "react";

import {
  useAuth0
} from "@auth0/auth0-react";

import {
  useNavigate
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

  image?: string | null;

};


type Knife = {

  id: string;

  title: string;

  price: number;

  status: string;

  images: string[];

  maker?: Maker;

};


type Collaboration = {

  id: string;

  title: string;

  quantity: number;

  status: string;

  description?: string;

  image?: string | null;

  releaseDate?: string | null;

  maker?: Maker;

};



// ==========================
// ADMIN
// ==========================

export default function Admin() {


  const navigate =
    useNavigate();


  const {
    user,
    logout
  } = useAuth0();


  const [loading, setLoading] =
    useState(true);


  const [makers, setMakers] =
    useState<Maker[]>([]);


  const [knives, setKnives] =
    useState<Knife[]>([]);


  const [collaborations, setCollaborations] =
    useState<Collaboration[]>([]);



  // ==========================
  // LOAD DATA
  // ==========================

  async function loadData() {

    try {


      // ==========================
      // MAKERS
      // ==========================

      const makersResponse =
        await fetch(
          "http://localhost:8080/api/makers"
        );


      const makersData =
        await makersResponse.json();


      if (Array.isArray(makersData)) {

        setMakers(makersData);

      }



      // ==========================
      // KNIVES
      // ==========================

      const knivesResponse =
        await fetch(
          "http://localhost:8080/api/knives"
        );


      const knivesData =
        await knivesResponse.json();


      if (Array.isArray(knivesData)) {

        setKnives(knivesData);

      }



      // ==========================
      // COLLABORATIONS
      // ==========================

      const collabResponse =
        await fetch(
          "http://localhost:8080/api/collaborations"
        );


      const collabData =
        await collabResponse.json();


      if (Array.isArray(collabData)) {

        setCollaborations(collabData);

      }


    } catch (error) {

      console.error(
        "ADMIN LOAD ERROR",
        error
      );


    } finally {

      setLoading(false);

    }

  }



  useEffect(() => {

    loadData();

  }, []);



  // ==========================
  // DELETE KNIFE
  // ==========================

  async function deleteKnife(
    id: string
  ) {


    if (
      !confirm(
        "Delete this knife?"
      )
    ) {

      return;

    }


    try {

      const response =
        await fetch(

          `http://localhost:8080/api/knives/${id}`,

          {
            method: "DELETE"
          }

        );


      if (!response.ok) {

        throw new Error(
          "Failed deleting knife"
        );

      }


      setKnives(prev =>

        prev.filter(
          knife =>
            knife.id !== id
        )

      );


    } catch (error) {

      console.error(
        "DELETE KNIFE ERROR",
        error
      );

    }

  }



  // ==========================
  // DELETE COLLABORATION
  // ==========================

  async function deleteCollaboration(
    id: string
  ) {


    if (
      !confirm(
        "Delete this collaboration?"
      )
    ) {

      return;

    }


    try {

      const response =
        await fetch(

          `http://localhost:8080/api/collaborations/${id}`,

          {
            method: "DELETE"
          }

        );


      if (!response.ok) {

        throw new Error(
          "Failed deleting collaboration"
        );

      }


      setCollaborations(prev =>

        prev.filter(
          item =>
            item.id !== id
        )

      );


    } catch (error) {

      console.error(
        "DELETE COLLABORATION ERROR",
        error
      );

    }

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
      py-16
    ">


      <div className="
        max-w-7xl
        mx-auto
      ">


        {/* ==========================
            HEADER
        ========================== */}

        <header className="
          flex
          justify-between
          items-center
          mb-16
        ">


          <div>

            <h1 className="
              text-5xl
              font-serif
            ">

              Ågane Workshop

            </h1>


            <p className="
              mt-3
              opacity-70
            ">

              Welcome{" "}
              {user?.name}

            </p>

          </div>



          <button
            onClick={() =>
              logout()
            }
            className="
              border
              px-6
              py-3
            "
          >

            Logout

          </button>


        </header>



        {/* ==========================
            LOADING
        ========================== */}

        {loading && (

          <p className="
            mb-12
          ">

            Loading...

          </p>

        )}



        {/* ==================================================
            MAKERS
        ================================================== */}

        <section>


          <div className="
            flex
            justify-between
            items-center
            mb-10
          ">


            <h2 className="
              text-4xl
              font-serif
            ">

              Makers

            </h2>



            <button
              onClick={() =>
                navigate(
                  "/admin/maker/new"
                )
              }
              className="
                border
                px-6
                py-3
              "
            >

              + Add Maker

            </button>


          </div>



          {makers.length === 0 ? (

            <p className="
              opacity-60
            ">

              No makers yet.

            </p>

          ) : (

            <div className="
              grid
              md:grid-cols-3
              gap-10
            ">


              {makers.map(
                maker => (

                  <article
                    key={maker.id}
                    className="
                      bg-white
                      border
                      p-8
                    "
                  >


                    {/* MAKER IMAGE */}

                    {maker.image && (

                      <img
                        src={
                          `http://localhost:8080${maker.image}`
                        }
                        alt={
                          maker.name
                        }
                        className="
                          h-56
                          w-full
                          object-cover
                          mb-6
                        "
                      />

                    )}



                    <h3 className="
                      text-3xl
                      font-serif
                    ">

                      {maker.name}

                    </h3>



                    {maker.country && (

                      <p className="
                        mt-3
                        opacity-60
                      ">

                        {maker.country}

                      </p>

                    )}



                    {maker.bio && (

                      <p className="
                        mt-4
                        opacity-70
                      ">

                        {maker.bio}

                      </p>

                    )}

                  </article>

                )
              )}

            </div>

          )}

        </section>



        {/* ==================================================
            KNIVES
        ================================================== */}

        <section className="
          mt-32
        ">


          <div className="
            flex
            justify-between
            items-center
            mb-10
          ">


            <h2 className="
              text-4xl
              font-serif
            ">

              Knives

            </h2>



            <button
              onClick={() =>
                navigate(
                  "/admin/new"
                )
              }
              className="
                border
                px-6
                py-3
              "
            >

              + Add Knife

            </button>


          </div>



          {knives.length === 0 ? (

            <p className="
              opacity-60
            ">

              No knives yet.

            </p>

          ) : (

            <div className="
              grid
              md:grid-cols-3
              gap-10
            ">


              {knives.map(
                knife => (

                  <article
                    key={knife.id}
                    className="
                      bg-white
                      border
                      p-6
                    "
                  >


                    {/* KNIFE IMAGE */}

                    {knife.images?.[0] && (

                      <img
                        src={
                          `http://localhost:8080${knife.images[0]}`
                        }
                        alt={
                          knife.title
                        }
                        className="
                          h-64
                          w-full
                          object-cover
                        "
                      />

                    )}



                    <h3 className="
                      text-2xl
                      font-serif
                      mt-5
                    ">

                      {knife.title}

                    </h3>



                    <p className="
                      mt-2
                    ">

                      Maker:{" "}

                      {knife.maker?.name ||
                        "Unknown"}

                    </p>



                    <p className="
                      mt-1
                    ">

                      {knife.price} SEK

                    </p>



                    <p className="
                      mt-1
                      opacity-60
                      capitalize
                    ">

                      {knife.status}

                    </p>



                    {/* ACTIONS */}

                    <div className="
                      mt-5
                      flex
                      gap-3
                    ">


                      <button
                        onClick={() =>
                          navigate(
                            `/admin/knife/${knife.id}/edit`
                          )
                        }
                        className="
                          border
                          px-4
                          py-2
                        "
                      >

                        Edit

                      </button>



                      <button
                        onClick={() =>
                          deleteKnife(
                            knife.id
                          )
                        }
                        className="
                          border
                          border-red-600
                          text-red-600
                          px-4
                          py-2
                        "
                      >

                        Delete

                      </button>


                    </div>


                  </article>

                )
              )}

            </div>

          )}

        </section>



        {/* ==================================================
            COLLABORATIONS
        ================================================== */}

        <section className="
          mt-32
        ">


          <div className="
            flex
            justify-between
            items-center
            mb-10
          ">


            <h2 className="
              text-4xl
              font-serif
            ">

              Collaborations

            </h2>



            <button
              onClick={() =>
                navigate(
                  "/admin/collaboration/new"
                )
              }
              className="
                border
                px-6
                py-3
              "
            >

              + Add Collaboration

            </button>


          </div>



          {collaborations.length === 0 ? (

            <p className="
              opacity-60
            ">

              No collaborations yet.

            </p>

          ) : (

            <div className="
              grid
              md:grid-cols-2
              gap-10
            ">


              {collaborations.map(
                collab => (

                  <article
                    key={collab.id}
                    className="
                      bg-white
                      border
                      p-8
                    "
                  >


                    {/* COLLAB IMAGE */}

                    {collab.image && (

                      <img
                        src={
                          `http://localhost:8080${collab.image}`
                        }
                        alt={
                          collab.title
                        }
                        className="
                          h-72
                          w-full
                          object-cover
                          mb-6
                        "
                      />

                    )}



                    <h3 className="
                      text-3xl
                      font-serif
                    ">

                      {collab.title}

                    </h3>



                    <p className="
                      mt-3
                    ">

                      Maker:{" "}

                      {collab.maker?.name ||
                        "Unknown"}

                    </p>



                    <p className="
                      mt-2
                    ">

                      {collab.quantity}{" "}

                      pieces

                    </p>



                    <p className="
                      mt-2
                      opacity-60
                      capitalize
                    ">

                      {collab.status}

                    </p>



                    {collab.releaseDate && (

                      <p className="
                        mt-2
                        opacity-60
                      ">

                        Release:{" "}

                        {new Date(
                          collab.releaseDate
                        ).toLocaleDateString()}

                      </p>

                    )}



                    {/* ACTIONS */}

                    <div className="
                      mt-6
                      flex
                      gap-3
                    ">


                      <button
                        onClick={() =>
                          navigate(
                            `/admin/collaboration/${collab.id}/edit`
                          )
                        }
                        className="
                          border
                          px-4
                          py-2
                        "
                      >

                        Edit

                      </button>



                      <button
                        onClick={() =>
                          deleteCollaboration(
                            collab.id
                          )
                        }
                        className="
                          border
                          border-red-600
                          text-red-600
                          px-4
                          py-2
                        "
                      >

                        Delete

                      </button>


                    </div>


                  </article>

                )
              )}

            </div>

          )}

        </section>


      </div>

    </main>

  );

}