
import {
  useEffect,
  useState
} from "react";

import {
  Link,
  useSearchParams
} from "react-router-dom";


type Knife = {

  id: string;

  title: string;

  slug: string;

  images: string[];

  maker?: {

    id: string;

    name: string;

  };

};


type PaymentData = {

  sessionId: string;

  paymentStatus: string;

  amount: number;

  currency: string;

  customerEmail: string | null;

  customerName: string | null;

  orderId: string | null;

  knife: Knife | null;

};


export default function PaymentSuccess() {


  const [
    searchParams
  ] = useSearchParams();


  const sessionId =
    searchParams.get(
      "session_id"
    );


  const [
    payment,
    setPayment
  ] =
    useState<PaymentData | null>(
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



  // ==========================
  // LOAD PAYMENT
  // ==========================

  useEffect(() => {

    async function loadPayment() {

      if (!sessionId) {

        setError(
          "Payment session not found."
        );

        setLoading(false);

        return;

      }


      try {

        const response =
          await fetch(
            `http://localhost:8080/api/stripe/session/${sessionId}`
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.error ||
            "Failed loading payment"
          );

        }


        setPayment(data);

      } catch (error) {

        console.error(
          "PAYMENT SUCCESS ERROR:",
          error
        );


        setError(
          error instanceof Error
            ? error.message
            : "Failed loading payment"
        );

      } finally {

        setLoading(false);

      }

    }


    loadPayment();

  }, [sessionId]);



  // ==========================
  // LOADING
  // ==========================

  if (loading) {

    return (

      <main
        className="
          min-h-screen
          bg-agane-bg
          text-agane-text
          flex
          items-center
          justify-center
        "
      >

        <p className="
          text-sm
          uppercase
          tracking-[0.3em]
          opacity-50
        ">

          Confirming payment...

        </p>

      </main>

    );

  }



  // ==========================
  // ERROR
  // ==========================

  if (error || !payment) {

    return (

      <main
        className="
          min-h-screen
          bg-agane-bg
          text-agane-text
          flex
          items-center
          justify-center
          px-6
        "
      >

        <div className="
          max-w-xl
          text-center
        ">

          <p className="
            text-xs
            uppercase
            tracking-[0.35em]
            opacity-50
          ">

            Ågane

          </p>


          <h1 className="
            text-5xl
            md:text-6xl
            font-serif
            mt-6
          ">

            Payment Confirmation

          </h1>


          <p className="
            mt-6
            opacity-60
          ">

            {error ||
              "We couldn't load your payment."}

          </p>


          <Link
            to="/shop"
            className="
              inline-block
              mt-10
              border
              border-black
              px-8
              py-4
              uppercase
              tracking-widest
              text-sm
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
        max-w-5xl
        mx-auto
      ">


        {/* ==========================
            SUCCESS HEADER
        ========================== */}

        <div className="
          text-center
          mb-16
        ">

          <p className="
            text-xs
            uppercase
            tracking-[0.4em]
            opacity-50
          ">

            Ågane

          </p>


          <div className="
            mt-8
            text-5xl
          ">

            ✓

          </div>


          <h1 className="
            text-5xl
            md:text-7xl
            font-serif
            mt-6
          ">

            Payment Successful

          </h1>


          <p className="
            mt-6
            text-lg
            opacity-60
          ">

            Thank you for your purchase.

          </p>

        </div>



        {/* ==========================
            ORDER
        ========================== */}

        <div className="
          border
          bg-white
        ">


          {/* KNIFE */}

          {payment.knife && (

            <div className="
              grid
              md:grid-cols-2
            ">


              {/* IMAGE */}

              <div className="
                bg-agane-bg
                overflow-hidden
              ">

                {payment.knife.images?.[0] ? (

                  <img
                    src={
                      `http://localhost:8080${payment.knife.images[0]}`
                    }
                    alt={
                      payment.knife.title
                    }
                    className="
                      w-full
                      h-[500px]
                      object-cover
                    "
                  />

                ) : (

                  <div className="
                    w-full
                    h-[500px]
                    flex
                    items-center
                    justify-center
                    opacity-40
                  ">

                    No image

                  </div>

                )}

              </div>


              {/* INFORMATION */}

              <div className="
                p-10
                md:p-14
                flex
                flex-col
                justify-center
              ">

                <p className="
                  text-xs
                  uppercase
                  tracking-[0.3em]
                  opacity-50
                ">

                  Purchased

                </p>


                <h2 className="
                  text-4xl
                  md:text-5xl
                  font-serif
                  mt-5
                ">

                  {payment.knife.title}

                </h2>


                {payment.knife.maker && (

                  <p className="
                    mt-4
                    opacity-60
                  ">

                    Made by{" "}

                    {payment.knife.maker.name}

                  </p>

                )}


                <div className="
                  mt-10
                  border-t
                ">


                  <div className="
                    flex
                    justify-between
                    py-5
                    border-b
                  ">

                    <span className="opacity-50">
                      Amount
                    </span>

                    <span>
                      {payment.amount}{" "}
                      {payment.currency.toUpperCase()}
                    </span>

                  </div>


                  {payment.orderId && (

                    <div className="
                      flex
                      justify-between
                      py-5
                      border-b
                    ">

                      <span className="opacity-50">
                        Order
                      </span>

                      <span className="
                        text-xs
                        break-all
                        ml-8
                        text-right
                      ">

                        {payment.orderId}

                      </span>

                    </div>

                  )}


                  {payment.customerEmail && (

                    <div className="
                      flex
                      justify-between
                      gap-8
                      py-5
                    ">

                      <span className="opacity-50">
                        Confirmation
                      </span>

                      <span className="
                        text-right
                        break-all
                      ">

                        {payment.customerEmail}

                      </span>

                    </div>

                  )}

                </div>

              </div>

            </div>

          )}


        </div>



        {/* ==========================
            MESSAGE
        ========================== */}

        <div className="
          text-center
          max-w-2xl
          mx-auto
          mt-14
        ">

          <p className="
            leading-relaxed
            opacity-70
          ">

            Your payment has been received and your
            knife has been reserved for you. We will
            be in touch with the next steps regarding
            delivery.

          </p>


          <Link
            to="/shop"
            className="
              inline-block
              mt-8
              border
              border-black
              px-8
              py-4
              uppercase
              tracking-widest
              text-sm
              hover:bg-black
              hover:text-white
              transition
            "
          >

            Return to Shop

          </Link>

        </div>


      </div>

    </main>

  );

}
