
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

  steel?: string;

  price: number;

  status: string;

  images: string[];

};


type SharpeningSupply = {

  id: string;

  slug: string;

  title: string;

  category: string;

  price: number;

  status: string;

  description?: string;

  images: string[];

};


// ==================================================
// CATEGORY LABEL
// ==================================================

function formatCategory(
  category: string
) {

  const categories: Record<
    string,
    string
  > = {

    stone:
      "Sharpening Stone",

    "sharpening-rod":
      "Sharpening Rod",

    strop:
      "Strop",

    compound:
      "Polishing Compound",

    flattening:
      "Flattening / Maintenance",

    accessory:
      "Sharpening Accessory",

    other:
      "Other"

  };


  return (
    categories[category] ||
    category
  );

}


// ==================================================
// SHOP
// ==================================================

export default function Shop() {


  const [
    knives,
    setKnives
  ] =
    useState<Knife[]>([]);


  const [
    supplies,
    setSupplies
  ] =
    useState<SharpeningSupply[]>([]);


  const [
    loading,
    setLoading
  ] =
    useState(true);


  // ==================================================
  // LOAD PRODUCTS
  // ==================================================

  useEffect(() => {

    async function loadShop() {

      try {

        setLoading(true);


        // ------------------------------------------
        // KNIVES
        // ------------------------------------------

        const knivesResponse =
          await fetch(
            "http://localhost:8080/api/knives"
          );


        if (!knivesResponse.ok) {

          throw new Error(
            "Failed loading knives"
          );

        }


        const knivesData =
          await knivesResponse.json();


        if (
          Array.isArray(
            knivesData
          )
        ) {

          setKnives(
            knivesData
          );

        }


        // ------------------------------------------
        // SHARPENING SUPPLIES
        // ------------------------------------------

        const suppliesResponse =
          await fetch(
            "http://localhost:8080/api/sharpening-supplies"
          );


        if (!suppliesResponse.ok) {

          throw new Error(
            "Failed loading sharpening supplies"
          );

        }


        const suppliesData =
          await suppliesResponse.json();


        if (
          Array.isArray(
            suppliesData
          )
        ) {

          setSupplies(
            suppliesData
          );

        }


      } catch (error) {

        console.error(
          "SHOP ERROR:",
          error
        );

      } finally {

        setLoading(false);

      }

    }


    loadShop();

  }, []);


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {

    return (

      <main
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-agane-bg
          text-agane-text
        "
      >

        <div className="
          text-center
        ">

          <p className="
            text-xs
            uppercase
            tracking-[0.35em]
            opacity-40
          ">

            Ågane

          </p>


          <p className="
            mt-4
          ">

            Loading shop...

          </p>

        </div>

      </main>

    );

  }


  // ==================================================
  // KNIFE FILTERING
  // ==================================================

  const available =
    knives.filter(
      knife =>
        knife.status ===
        "available"
    );


  const archive =
    knives.filter(
      knife =>
        knife.status !==
        "available"
    );


  // ==================================================
  // SUPPLY FILTERING
  // ==================================================

  const availableSupplies =
    supplies.filter(
      supply =>
        supply.status ===
        "available"
    );


  const unavailableSupplies =
    supplies.filter(
      supply =>
        supply.status !==
        "available" &&
        supply.status !==
        "hidden"
    );


  return (

    <main
      className="
        min-h-screen
        bg-agane-bg
        text-agane-text
        px-6
        py-20
      "
    >

      <div className="
        max-w-7xl
        mx-auto
      ">


        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="
          mb-20
        ">

          <p
            className="
              text-xs
              uppercase
              tracking-[0.35em]
              opacity-50
              mb-5
            "
          >

            Ågane

          </p>


          <h1
            className="
              text-6xl
              md:text-7xl
              font-serif
            "
          >

            Shop

          </h1>


          <p
            className="
              mt-6
              max-w-2xl
              text-lg
              leading-relaxed
              opacity-70
            "
          >

            Handcrafted knives, sharpening stones
            and selected tools for the pursuit of
            exceptional edges.

          </p>

        </header>


        {/* ==================================================
            AVAILABLE KNIVES
        ================================================== */}

        <section>

          <div
            className="
              flex
              justify-between
              items-end
              mb-10
            "
          >

            <div>

              <p
                className="
                  text-xs
                  uppercase
                  tracking-[0.3em]
                  opacity-50
                  mb-3
                "
              >

                Available now

              </p>


              <h2
                className="
                  text-4xl
                  font-serif
                "
              >

                Available Pieces

              </h2>

            </div>


            <p className="
              text-sm
              opacity-50
            ">

              {available.length} pieces

            </p>

          </div>


          {available.length > 0 ? (

            <div
              className="
                grid
                md:grid-cols-2
                lg:grid-cols-3
                gap-10
              "
            >

              {available.map(
                knife => (

                  <Link
                    key={knife.id}
                    to={`/shop/${knife.slug}`}
                    className="
                      bg-white
                      border
                      overflow-hidden
                      group
                      block
                    "
                  >

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
                            duration-500
                          "
                        />

                      </div>

                    ) : (

                      <div
                        className="
                          w-full
                          h-96
                          flex
                          items-center
                          justify-center
                          bg-agane-bg
                          opacity-60
                        "
                      >

                        No image

                      </div>

                    )}


                    {/* INFO */}

                    <div className="
                      p-8
                    ">

                      <p
                        className="
                          text-xs
                          uppercase
                          tracking-[0.3em]
                          opacity-60
                        "
                      >

                        {knife.maker?.name}

                      </p>


                      <h3
                        className="
                          text-3xl
                          font-serif
                          mt-4
                        "
                      >

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


                      <div
                        className="
                          mt-8
                          border-t
                          pt-5
                          flex
                          justify-between
                          items-center
                        "
                      >

                        <span>

                          {knife.price} SEK

                        </span>


                        <span
                          className="
                            text-sm
                            uppercase
                            tracking-widest
                            opacity-60
                          "
                        >

                          View →

                        </span>

                      </div>

                    </div>

                  </Link>

                )
              )}

            </div>

          ) : (

            <div
              className="
                border
                p-12
                text-center
                opacity-60
              "
            >

              No knives currently available.

            </div>

          )}

        </section>


        {/* ==================================================
            SHARPENING SUPPLIES
        ================================================== */}

        <section className="
          mt-32
        ">


          {/* SECTION HEADER */}

          <div
            className="
              flex
              justify-between
              items-end
              mb-10
            "
          >

            <div>

              <p
                className="
                  text-xs
                  uppercase
                  tracking-[0.3em]
                  opacity-50
                  mb-3
                "
              >

                Ågane Sharpening

              </p>


              <h2
                className="
                  text-4xl
                  md:text-5xl
                  font-serif
                "
              >

                Sharpening Supplies

              </h2>


              <p
                className="
                  mt-5
                  max-w-2xl
                  opacity-70
                  leading-relaxed
                "
              >

                Selected stones, rods, strops and
                sharpening equipment for maintaining
                and refining exceptional kitchen knives.

              </p>

            </div>


            <p className="
              text-sm
              opacity-50
            ">

              {availableSupplies.length} products

            </p>

          </div>


          {/* ==================================================
              AVAILABLE SUPPLIES
          ================================================== */}

          {availableSupplies.length > 0 ? (

            <div
              className="
                grid
                md:grid-cols-2
                lg:grid-cols-3
                gap-10
              "
            >

              {availableSupplies.map(
                supply => (

                  <Link
                    key={supply.id}
                    to={`/shop/supplies/${supply.slug}`}
                    className="
                      bg-white
                      border
                      overflow-hidden
                      group
                      block
                    "
                  >


                    {/* IMAGE */}

                    {supply.images?.[0] ? (

                      <div className="
                        overflow-hidden
                      ">

                        <img
                          src={
                            `http://localhost:8080${supply.images[0]}`
                          }
                          alt={
                            supply.title
                          }
                          className="
                            w-full
                            h-96
                            object-cover
                            group-hover:scale-105
                            transition
                            duration-500
                          "
                        />

                      </div>

                    ) : (

                      <div
                        className="
                          w-full
                          h-96
                          flex
                          items-center
                          justify-center
                          bg-agane-bg
                          opacity-60
                        "
                      >

                        No image

                      </div>

                    )}


                    {/* INFO */}

                    <div className="
                      p-8
                    ">


                      <p
                        className="
                          text-xs
                          uppercase
                          tracking-[0.3em]
                          opacity-60
                        "
                      >

                        {formatCategory(
                          supply.category
                        )}

                      </p>


                      <h3
                        className="
                          text-3xl
                          font-serif
                          mt-4
                        "
                      >

                        {supply.title}

                      </h3>


                      {supply.description && (

                        <p
                          className="
                            mt-4
                            opacity-60
                            leading-relaxed
                            line-clamp-2
                          "
                        >

                          {supply.description}

                        </p>

                      )}


                      <div
                        className="
                          mt-8
                          border-t
                          pt-5
                          flex
                          justify-between
                          items-center
                        "
                      >

                        <span>

                          {supply.price} SEK

                        </span>


                        <span
                          className="
                            text-sm
                            uppercase
                            tracking-widest
                            opacity-60
                          "
                        >

                          View →

                        </span>

                      </div>

                    </div>

                  </Link>

                )
              )}

            </div>

          ) : (

            <div
              className="
                border
                p-12
                text-center
                opacity-60
              "
            >

              No sharpening supplies
              currently available.

            </div>

          )}


          {/* ==================================================
              UNAVAILABLE SUPPLIES
          ================================================== */}

          {unavailableSupplies.length > 0 && (

            <div className="
              mt-20
            ">


              <div className="
                flex
                justify-between
                items-end
                mb-8
              ">

                <div>

                  <p
                    className="
                      text-xs
                      uppercase
                      tracking-[0.3em]
                      opacity-50
                      mb-3
                    "
                  >

                    Coming soon

                  </p>


                  <h3 className="
                    text-3xl
                    font-serif
                  ">

                    Other Supplies

                  </h3>

                </div>


                <p className="
                  text-sm
                  opacity-50
                ">

                  {unavailableSupplies.length}

                </p>

              </div>


              <div
                className="
                  grid
                  md:grid-cols-2
                  lg:grid-cols-3
                  gap-8
                "
              >

                {unavailableSupplies.map(
                  supply => (

                    <Link
                      key={supply.id}
                      to={`/shop/supplies/${supply.slug}`}
                      className="
                        bg-white
                        border
                        overflow-hidden
                        block
                        opacity-70
                        hover:opacity-100
                        transition
                      "
                    >


                      {/* IMAGE */}

                      {supply.images?.[0] ? (

                        <div className="
                          overflow-hidden
                        ">

                          <img
                            src={
                              `http://localhost:8080${supply.images[0]}`
                            }
                            alt={
                              supply.title
                            }
                            className="
                              w-full
                              h-72
                              object-cover
                            "
                          />

                        </div>

                      ) : (

                        <div
                          className="
                            w-full
                            h-72
                            flex
                            items-center
                            justify-center
                            bg-agane-bg
                            opacity-60
                          "
                        >

                          No image

                        </div>

                      )}


                      <div className="
                        p-6
                      ">


                        <p
                          className="
                            text-xs
                            uppercase
                            tracking-[0.3em]
                            opacity-50
                          "
                        >

                          {supply.status}

                        </p>


                        <h3
                          className="
                            text-2xl
                            font-serif
                            mt-3
                          "
                        >

                          {supply.title}

                        </h3>


                        <p className="
                          mt-3
                          opacity-60
                        ">

                          {formatCategory(
                            supply.category
                          )}

                        </p>

                      </div>

                    </Link>

                  )
                )}

              </div>

            </div>

          )}


          {/* ==================================================
              SHARPENING SERVICE
          ================================================== */}

          <div
            className="
              mt-16
              border
              p-10
              md:p-14
              flex
              flex-col
              md:flex-row
              md:items-center
              justify-between
              gap-8
            "
          >

            <div>

              <p
                className="
                  text-xs
                  uppercase
                  tracking-[0.3em]
                  opacity-50
                "
              >

                Professional service

              </p>


              <h3
                className="
                  text-3xl
                  font-serif
                  mt-3
                "
              >

                Knife Sharpening & Refinement

              </h3>


              <p
                className="
                  mt-4
                  opacity-70
                  max-w-2xl
                "
              >

                Professional stone sharpening,
                polishing and edge refinement for
                handmade kitchen knives.

              </p>

            </div>


            <a
              href="mailto:hello@agane.se"
              className="
                border
                px-8
                py-4
                text-sm
                uppercase
                tracking-widest
                whitespace-nowrap
                hover:bg-black
                hover:text-white
                transition
              "
            >

              Enquire →

            </a>

          </div>

        </section>


        {/* ==================================================
            ARCHIVE
        ================================================== */}

        {archive.length > 0 && (

          <section className="
            mt-32
          ">

            <div
              className="
                flex
                justify-between
                items-end
                mb-10
              "
            >

              <div>

                <p
                  className="
                    text-xs
                    uppercase
                    tracking-[0.3em]
                    opacity-50
                    mb-3
                  "
                >

                  Past pieces

                </p>


                <h2
                  className="
                    text-4xl
                    font-serif
                  "
                >

                  Archive

                </h2>

              </div>


              <p className="
                text-sm
                opacity-50
              ">

                {archive.length} pieces

              </p>

            </div>


            <div
              className="
                grid
                md:grid-cols-2
                lg:grid-cols-3
                gap-10
              "
            >

              {archive.map(
                knife => (

                  <Link
                    key={knife.id}
                    to={`/shop/${knife.slug}`}
                    className="
                      bg-white
                      border
                      overflow-hidden
                      block
                      opacity-75
                      hover:opacity-100
                      transition
                    "
                  >

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
                            h-80
                            object-cover
                          "
                        />

                      </div>

                    ) : (

                      <div
                        className="
                          w-full
                          h-80
                          flex
                          items-center
                          justify-center
                          bg-agane-bg
                          opacity-60
                        "
                      >

                        No image

                      </div>

                    )}


                    <div className="
                      p-6
                    ">

                      <p
                        className="
                          text-xs
                          uppercase
                          tracking-widest
                          opacity-50
                        "
                      >

                        {knife.status}

                      </p>


                      <h3
                        className="
                          text-2xl
                          font-serif
                          mt-3
                        "
                      >

                        {knife.title}

                      </h3>


                      <p className="
                        mt-3
                        opacity-60
                      ">

                        {knife.maker?.name}

                      </p>

                    </div>

                  </Link>

                )
              )}

            </div>

          </section>

        )}

      </div>

    </main>

  );

}
