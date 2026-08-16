
import {
  useEffect,
  useState
} from "react";

import {
  Link,
  useParams
} from "react-router-dom";


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


function formatCategory(
  category: string
) {

  const categories: Record<string, string> = {

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


export default function SharpeningSupplyDetail() {


  const { slug } =
    useParams();


  const [
    supply,
    setSupply
  ] =
    useState<SharpeningSupply | null>(
      null
    );


  const [
    loading,
    setLoading
  ] =
    useState(true);


  const [
    error,
    setError
  ] =
    useState("");


  const [
    activeImage,
    setActiveImage
  ] =
    useState(0);


  const [
    checkoutLoading,
    setCheckoutLoading
  ] =
    useState(false);


  // ==================================================
  // LOAD SUPPLY
  // ==================================================

  useEffect(() => {

    async function loadSupply() {

      try {

        setLoading(true);

        setError("");


        const response =
          await fetch(
            `http://localhost:8080/api/sharpening-supplies/${slug}`
          );


        if (!response.ok) {

          throw new Error(
            "Sharpening supply not found"
          );

        }


        const data =
          await response.json();


        setSupply(data);

        setActiveImage(0);


      } catch (error) {

        console.error(
          "SHARPENING SUPPLY DETAIL ERROR:",
          error
        );


        setError(
          "Failed loading sharpening supply"
        );


      } finally {

        setLoading(false);

      }

    }


    if (slug) {

      loadSupply();

    }

  }, [slug]);


  // ==================================================
  // STRIPE CHECKOUT
  // ==================================================

  async function handleCheckout() {

    if (!supply) {

      return;

    }


    if (
      supply.status !== "available"
    ) {

      return;

    }


    try {

      setCheckoutLoading(true);


      const response =
        await fetch(
          "http://localhost:8080/api/stripe/create-supply-checkout",
          {
            method: "POST",

            headers: {

              "Content-Type":
                "application/json"

            },

            body: JSON.stringify({

              supplyId:
                supply.id

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


      window.location.href =
        data.url;


    } catch (error) {

      console.error(
        "SUPPLY CHECKOUT ERROR:",
        error
      );


      alert(

        error instanceof Error
          ? error.message
          : "Unable to start checkout. Please try again."

      );


      setCheckoutLoading(false);

    }

  }


  // ==================================================
  // LOADING
  // ==================================================

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

            Loading product...

          </p>

        </div>

      </main>

    );

  }


  // ==================================================
  // ERROR
  // ==================================================

  if (
    error ||
    !supply
  ) {

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

            Product not found

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


        {/* BACK */}

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


        {/* PRODUCT */}

        <section className="
          grid
          lg:grid-cols-2
          gap-16
          items-start
        ">


          {/* ==================================================
              IMAGE GALLERY
          ================================================== */}

          <div>

            <div className="
              bg-white
              border
              overflow-hidden
            ">

              {supply.images?.length > 0 ? (

                <img
                  src={
                    `http://localhost:8080${supply.images[activeImage]}`
                  }
                  alt={
                    supply.title
                  }
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

            {supply.images &&
              supply.images.length > 1 && (

              <div className="
                grid
                grid-cols-4
                gap-4
                mt-4
              ">

                {supply.images.map(
                  (
                    image,
                    index
                  ) => (

                    <button
                      key={`${image}-${index}`}
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
                          `${supply.title} ${index + 1}`
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


          {/* ==================================================
              INFORMATION
          ================================================== */}

          <div>

            <p className="
              text-xs
              uppercase
              tracking-[0.35em]
              opacity-50
            ">

              Sharpening Supplies

            </p>


            <h1 className="
              text-6xl
              font-serif
              mt-5
              leading-tight
            ">

              {supply.title}

            </h1>


            {/* CATEGORY */}

            <p className="
              mt-5
              opacity-60
            ">

              {formatCategory(
                supply.category
              )}

            </p>


            {/* PRICE / STATUS */}

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

                {supply.status === "available"

                  ? `${supply.price} SEK`

                  : supply.status.toUpperCase()

                }

              </span>


              <span className="
                text-xs
                uppercase
                tracking-[0.25em]
                opacity-50
              ">

                {supply.status}

              </span>

            </div>


            {/* DESCRIPTION */}

            {supply.description && (

              <div className="
                mt-10
              ">

                <p className="
                  leading-relaxed
                  text-lg
                  opacity-80
                ">

                  {supply.description}

                </p>

              </div>

            )}


            {/* PURCHASE */}

            {supply.status === "available" ? (

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

                    : `Purchase This Product — ${supply.price} SEK`

                  }

                </button>


                <p className="
                  text-xs
                  text-center
                  opacity-40
                  mt-4
                ">

                  Secure checkout powered by Stripe

                </p>

              </div>

            ) : (

              <div className="
                mt-10
                border
                py-5
                text-center
              ">

                <p className="
                  text-sm
                  uppercase
                  tracking-[0.25em]
                  opacity-60
                ">

                  This product is not currently available

                </p>

              </div>

            )}

          </div>

        </section>

      </div>

    </main>

  );

}

