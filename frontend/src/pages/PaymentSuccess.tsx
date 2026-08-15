import { Link } from "react-router-dom";


export default function PaymentSuccess() {

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
          text-6xl
          font-serif
          mt-6
        ">

          Payment received.

        </h1>


        <p className="
          mt-8
          text-lg
          leading-relaxed
          opacity-70
        ">

          Thank you for your purchase.
          Your payment has been successfully
          received.

        </p>


        <p className="
          mt-4
          opacity-60
        ">

          Your order is now being processed.

        </p>


        <Link
          to="/shop"
          className="
            inline-block
            mt-10
            border
            px-8
            py-4
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