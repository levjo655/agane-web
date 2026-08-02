import { Link } from "react-router-dom";


export default function Navbar(){


  return (

    <nav className="
      relative
      w-full
      px-6
      py-8
      bg-agane-bg
      text-agane-text
    ">


      <div className="
        max-w-7xl
        mx-auto
        flex
        justify-between
        items-center
      ">





        {/* LEFT LINKS */}


        <div className="
          hidden
          md:flex
          gap-10
          text-sm
          tracking-wide
        ">


          <Link
            to="/collection"
            className="
              hover:opacity-50
              transition
            "
          >

            Collection

          </Link>




          <a
            href="#collaborations"
            className="
              hover:opacity-50
              transition
            "
          >

            Collaborations

          </a>





          <a
            href="#craft"
            className="
              hover:opacity-50
              transition
            "
          >

            Craft

          </a>


        </div>










        {/* CENTER LOGO */}


        <Link

          to="/"

          className="
            absolute
            left-1/2
            -translate-x-1/2
          "

        >

          <img
  src="/knives/agane_logo.png"
  alt="Ågane"
  className="h-12 w-auto"
/>

        </Link>









        {/* RIGHT */}


        <div className="ml-auto">


          <Link

            to="/admin"

            className="
              text-sm
              border
              px-5
              py-2
              hover:bg-black
              hover:text-white
              transition
            "

          >

            Admin

          </Link>


        </div>





      </div>


    </nav>


  );

}