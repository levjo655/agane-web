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

  origin?: string;

  steel?: string;

  bladeType?: string;

  length?: string;

  handle?: string;

  weight?: number;

  description?: string;

  images: string[];

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


  const [checkoutLoading, setCheckoutLoading] =
    useState(false);


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
  // STRIPE CHECKOUT
  // ==========================

  async function handleCheckout() {

    if (!knife) {

      return;

    }


    try {

      setCheckoutLoading(true);


      const response =
        await fetch(
          "http://localhost:8080/api/stripe/create-checkout",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify({

              knifeId:
                knife.id

            })

          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.error ||
          "Failed creating checkout"
        );

      }


      if (!data.url) {

        throw new Error(
          "Stripe checkout URL missing"
        );

      }


      // Redirect customer to Stripe

      window.location.href =
        data.url;


    } catch (error) {

      console.error(
        "CHECKOUT ERROR:",
        error
      );


      alert(
        error instanceof Error
          ? error.message
          : "Unable to start checkout"
      );


    } finally {

      setCheckoutLoading(false);

    }

  }


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

          <p className="
            text-xs
            uppercase
            tracking-[0.3em]
            opacity-50
          ">

            Ågane

          </p>


          <h1 className="
            text-5xl
            font-serif
            mt-5
          ">

            Knife not found

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

            ← Back to Shop

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
            BACK TO SHOP
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
            KNIFE HERO
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


            {/* MAIN IMAGE */}

            <div className="
              bg-white
              border
              overflow-hidden
            ">

              {knife.images?.length > 0 ? (

                <img
                  src={
                    `http://localhost:8080${knife.images[activeImage]}`
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
                  opacity-30
                ">

                  No Image

                </div>

              )}

            </div>


            {/* THUMBNAILS */}

            {knife.images &&
              knife.images.length > 1 && (

              <div className="
                grid
                grid-cols-4
                gap-4
                mt-4
              ">

                {knife.images.map(
                  (image, index) => (

                    <button
                      key={image}
                      type="button"
                      onClick={() =>
                        setActiveImage(index)
                      }
                      className={`
                        border
                        overflow-hidden
                        transition
                        ${
                          activeImage === index
                            ? "border-black"
                            : "opacity-50 hover:opacity-100"
                        }
                      `}
                    >

                      <img
                        src={
                          `http://localhost:8080${image}`
                        }
                        alt={
                          `${knife.title} ${index + 1}`
                        }
                        className="
                          w-full
                          h-28
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


            <p className="
              text-xs
              uppercase
              tracking-[0.35em]
              opacity-50
            ">

              Knife

            </p>


            <h1 className="
              text-6xl
              font-serif
              mt-5
              leading-tight
            ">

              {knife.title}

            </h1>


            {/* ==========================
                MAKER
            ========================== */}

            {knife.maker && (

              <div className="
                mt-6
              ">

                <p className="
                  text-xs
                  uppercase
                  tracking-[0.25em]
                  opacity-40
                ">

                  Made by

                </p>


                <Link
                  to={`/makers/${knife.maker.slug}`}
                  className="
                    inline-block
                    mt-2
                    text-xl
                    font-serif
                    hover:opacity-50
                    transition
                  "
                >

                  {knife.maker.name} →

                </Link>

              </div>

            )}


            {/* ==========================
                PRICE / STATUS
            ========================== */}

            <div className="
              mt-10
              border-y
              py-6
              flex
              justify-between
              items-center
            ">


              <span className="
                text-2xl
              ">

                {knife.status === "available"
                  ? `${knife.price} SEK`
                  : knife.status.toUpperCase()
                }

              </span>


              <span className="
                text-xs
                uppercase
                tracking-[0.25em]
                opacity-50
              ">

                {knife.status}

              </span>


            </div>


            {/* ==========================
                DESCRIPTION
            ========================== */}

            {knife.description && (

              <div className="
                mt-10
              ">

                <p className="
                  leading-relaxed
                  text-lg
                  opacity-80
                ">

                  {knife.description}

                </p>

              </div>

            )}


            {/* ==========================
                SPECS
            ========================== */}

            <div className="
              mt-12
              border-t
            ">


              <p className="
                text-xs
                uppercase
                tracking-[0.3em]
                opacity-50
                py-5
              ">

                Specifications

              </p>


              {knife.steel && (

                <div className="
                  flex
                  justify-between
                  border-t
                  py-4
                ">

                  <span className="opacity-50">
                    Steel
                  </span>

                  <span>
                    {knife.steel}
                  </span>

                </div>

              )}


              {knife.origin && (

                <div className="
                  flex
                  justify-between
                  border-t
                  py-4
                ">

                  <span className="opacity-50">
                    Origin
                  </span>

                  <span>
                    {knife.origin}
                  </span>

                </div>

              )}


              {knife.bladeType && (

                <div className="
                  flex
                  justify-between
                  border-t
                  py-4
                ">

                  <span className="opacity-50">
                    Blade
                  </span>

                  <span>
                    {knife.bladeType}
                  </span>

                </div>

              )}


              {knife.length && (

                <div className="
                  flex
                  justify-between
                  border-t
                  py-4
                ">

                  <span className="opacity-50">
                    Length
                  </span>

                  <span>
                    {knife.length}
                  </span>

                </div>

              )}


              {knife.handle && (

                <div className="
                  flex
                  justify-between
                  border-t
                  py-4
                ">

                  <span className="opacity-50">
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
                  flex
                  justify-between
                  border-t
                  py-4
                ">

                  <span className="opacity-50">
                    Weight
                  </span>

                  <span>
                    {knife.weight} g
                  </span>

                </div>

              )}

            </div>


            {/* ==========================
                PURCHASE
            ========================== */}

            {knife.status === "available" && (

              <div className="
                mt-10
              ">

                <button
                  type="button"
                  onClick={
                    handleCheckout
                  }
                  disabled={
                    checkoutLoading
                  }
                  className="
                    w-full
                    bg-black
                    text-white
                    py-5
                    uppercase
                    tracking-[0.25em]
                    text-sm
                    hover:opacity-80
                    transition
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >

                  {checkoutLoading
                    ? "Redirecting to Checkout..."
                    : "Purchase This Knife"
                  }

                </button>

              </div>

            )}


          </div>


        </section>


        {/* ==========================
            MAKER SECTION
        ========================== */}

        {knife.maker && (

          <section className="
            mt-32
            border-t
            pt-20
          ">


            <div className="
              grid
              lg:grid-cols-2
              gap-16
              items-center
            ">


              {/* MAKER IMAGE */}

              {knife.maker.image ? (

                <div className="
                  bg-white
                  border
                  overflow-hidden
                ">

                  <img
                    src={
                      `http://localhost:8080${knife.maker.image}`
                    }
                    alt={
                      knife.maker.name
                    }
                    className="
                      w-full
                      h-[500px]
                      object-cover
                    "
                  />

                </div>

              ) : (

                <div className="
                  bg-white
                  border
                  h-[500px]
                  flex
                  items-center
                  justify-center
                  opacity-30
                ">

                  No Maker Image

                </div>

              )}


              {/* MAKER INFO */}

              <div>


                <p className="
                  text-xs
                  uppercase
                  tracking-[0.35em]
                  opacity-50
                ">

                  The Maker

                </p>


                <h2 className="
                  text-5xl
                  font-serif
                  mt-5
                ">

                  {knife.maker.name}

                </h2>


                {knife.maker.country && (

                  <p className="
                    mt-4
                    opacity-60
                  ">

                    {knife.maker.country}

                  </p>

                )}


                {knife.maker.bio && (

                  <p className="
                    mt-8
                    leading-relaxed
                    text-lg
                    opacity-75
                  ">

                    {knife.maker.bio}

                  </p>

                )}


                <Link
                  to={`/makers/${knife.maker.slug}`}
                  className="
                    inline-block
                    mt-8
                    border
                    px-7
                    py-3
                    hover:bg-black
                    hover:text-white
                    transition
                  "
                >

                  View Maker →

                </Link>


              </div>


            </div>


          </section>

        )}


      </div>


    </main>

  );

}