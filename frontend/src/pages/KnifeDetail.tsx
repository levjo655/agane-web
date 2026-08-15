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

  origin?: string;

  steel?: string;

  bladeType?: string;

  length?: string;

  handle?: string;

  weight?: number;

  price: number;

  description?: string;

  images: string[];

  status: string;

  maker?: Maker;

};


export default function KnifeDetail() {


  const { slug } =
    useParams();


  const [knife, setKnife] =
    useState<Knife | null>(null);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  const [activeImage, setActiveImage] =
    useState(0);


  // ==========================
  // LOAD KNIFE
  // ==========================

  useEffect(() => {


    async function loadKnife() {


      try {


        const response =
          await fetch(
            `http://localhost:8080/api/knives/${slug}`
          );


        if (!response.ok) {

          throw new Error(
            "Knife not found"
          );

        }


        const data =
          await response.json();


        setKnife(data);


      } catch (error) {


        console.error(
          "KNIFE DETAIL ERROR",
          error
        );


        setError(
          "Failed loading knife"
        );


      } finally {


        setLoading(false);

      }

    }


    if (slug) {

      loadKnife();

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
        text-agane-text
        flex
        items-center
        justify-center
      ">

        Loading knife...

      </main>

    );

  }


  // ==========================
  // ERROR
  // ==========================

  if (error || !knife) {

    return (

      <main className="
        min-h-screen
        bg-agane-bg
        text-agane-text
        flex
        items-center
        justify-center
        px-6
      ">

        <div className="
          text-center
        ">

          <h1 className="
            text-5xl
            font-serif
          ">

            Knife not found

          </h1>


          <p className="
            mt-5
            opacity-60
          ">

            We couldn't find the knife you're looking for.

          </p>


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

            ← Back to Shop

          </Link>


        </div>

      </main>

    );

  }


  const images =
    Array.isArray(knife.images)
      ? knife.images
      : [];


  const currentImage =
    images[activeImage];


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
            BACK
        ========================== */}

        <Link
          to="/shop"
          className="
            inline-block
            mb-12
            text-sm
            opacity-60
            hover:opacity-100
            transition
          "
        >

          ← Back to Shop

        </Link>


        {/* ==========================
            PRODUCT
        ========================== */}

        <section className="
          grid
          lg:grid-cols-2
          gap-16
          items-start
        ">


          {/* ==========================
              IMAGE GALLERY
          ========================== */}

          <div>


            <div className="
              bg-white
              border
              overflow-hidden
            ">


              {currentImage ? (

                <img
                  src={
                    `http://localhost:8080${currentImage}`
                  }
                  alt={knife.title}
                  className="
                    w-full
                    h-[700px]
                    object-cover
                  "
                />

              ) : (

                <div className="
                  w-full
                  h-[700px]
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


            {/* THUMBNAILS */}

            {images.length > 1 && (

              <div className="
                grid
                grid-cols-5
                gap-3
                mt-4
              ">


                {images.map(
                  (image, index) => (

                    <button
                      key={image + index}
                      type="button"
                      onClick={() =>
                        setActiveImage(index)
                      }
                      className={`
                        border
                        overflow-hidden
                        ${
                          activeImage === index
                            ? "ring-2 ring-black"
                            : "opacity-60 hover:opacity-100"
                        }
                        transition
                      `}
                    >

                      <img
                        src={
                          `http://localhost:8080${image}`
                        }
                        alt={`${knife.title} ${index + 1}`}
                        className="
                          w-full
                          h-24
                          object-cover
                        "
                      />

                    </button>

                  )
                )}


              </div>

            )}


          </div>


          {/* ==========================
              INFORMATION
          ========================== */}

          <div>


            {/* STATUS */}

            <p className="
              text-xs
              uppercase
              tracking-[0.35em]
              opacity-50
            ">

              {knife.status}

            </p>


            {/* TITLE */}

            <h1 className="
              text-6xl
              font-serif
              mt-5
              leading-tight
            ">

              {knife.title}

            </h1>


            {/* MAKER */}

            {knife.maker && (

              <Link
                to={`/makers/${knife.maker.slug}`}
                className="
                  inline-block
                  mt-5
                  text-lg
                  opacity-60
                  hover:opacity-100
                  transition
                "
              >

                By {knife.maker.name} →

              </Link>

            )}


            {/* PRICE */}

            <div className="
              mt-10
              text-2xl
            ">

              {knife.status === "available"
                ? `${knife.price} SEK`
                : "SOLD"
              }

            </div>


            {/* DESCRIPTION */}

            {knife.description && (

              <div className="
                mt-10
                max-w-xl
              ">

                <p className="
                  leading-relaxed
                  text-lg
                  opacity-75
                  whitespace-pre-line
                ">

                  {knife.description}

                </p>

              </div>

            )}


            {/* SPECS */}

            <div className="
              mt-12
              border-t
            ">


              <h2 className="
                text-xs
                uppercase
                tracking-[0.3em]
                opacity-50
                mt-8
                mb-6
              ">

                Specifications

              </h2>


              <div className="
                divide-y
                border-b
              ">


                {knife.steel && (

                  <div className="
                    py-4
                    flex
                    justify-between
                    gap-8
                  ">

                    <span className="
                      opacity-50
                    ">

                      Steel

                    </span>

                    <span>

                      {knife.steel}

                    </span>

                  </div>

                )}


                {knife.origin && (

                  <div className="
                    py-4
                    flex
                    justify-between
                    gap-8
                  ">

                    <span className="
                      opacity-50
                    ">

                      Origin

                    </span>

                    <span>

                      {knife.origin}

                    </span>

                  </div>

                )}


                {knife.bladeType && (

                  <div className="
                    py-4
                    flex
                    justify-between
                    gap-8
                  ">

                    <span className="
                      opacity-50
                    ">

                      Blade Type

                    </span>

                    <span>

                      {knife.bladeType}

                    </span>

                  </div>

                )}


                {knife.length && (

                  <div className="
                    py-4
                    flex
                    justify-between
                    gap-8
                  ">

                    <span className="
                      opacity-50
                    ">

                      Length

                    </span>

                    <span>

                      {knife.length}

                    </span>

                  </div>

                )}


                {knife.handle && (

                  <div className="
                    py-4
                    flex
                    justify-between
                    gap-8
                  ">

                    <span className="
                      opacity-50
                    ">

                      Handle

                    </span>

                    <span>

                      {knife.handle}

                    </span>

                  </div>

                )}


                {knife.weight !== undefined &&
                  knife.weight !== null && (

                    <div className="
                      py-4
                      flex
                      justify-between
                      gap-8
                    ">

                      <span className="
                        opacity-50
                      ">

                        Weight

                      </span>

                      <span>

                        {knife.weight} g

                      </span>

                    </div>

                  )}


              </div>


            </div>


            {/* MAKER CARD */}

            {knife.maker && (

              <div className="
                mt-12
                border
                bg-white
                p-8
              ">


                <p className="
                  text-xs
                  uppercase
                  tracking-[0.3em]
                  opacity-50
                ">

                  The Maker

                </p>


                <div className="
                  flex
                  items-center
                  gap-6
                  mt-6
                ">


                  {knife.maker.image ? (

                    <img
                      src={
                        `http://localhost:8080${knife.maker.image}`
                      }
                      alt={knife.maker.name}
                      className="
                        w-24
                        h-24
                        object-cover
                        border
                      "
                    />

                  ) : (

                    <div className="
                      w-24
                      h-24
                      border
                      flex
                      items-center
                      justify-center
                      opacity-30
                    ">

                      No Image

                    </div>

                  )}


                  <div>


                    <h3 className="
                      text-2xl
                      font-serif
                    ">

                      {knife.maker.name}

                    </h3>


                    {knife.maker.country && (

                      <p className="
                        mt-2
                        opacity-60
                      ">

                        {knife.maker.country}

                      </p>

                    )}


                    <Link
                      to={`/makers/${knife.maker.slug}`}
                      className="
                        inline-block
                        mt-4
                        text-sm
                        hover:opacity-50
                        transition
                      "
                    >

                      View Maker →

                    </Link>


                  </div>


                </div>


              </div>

            )}


          </div>


        </section>


      </div>


    </main>

  );

}