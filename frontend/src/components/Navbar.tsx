import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      className="
        relative
        w-full
        px-6
        py-8
        bg-agane-bg
        text-agane-text
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          flex
          justify-between
          items-center
        "
      >

        {/* LEFT LINKS */}

        <div
          className="
            hidden
            md:flex
            gap-10
            text-sm
            tracking-wide
          "
        >

          <Link
            to="/shop"
            className="
              hover:opacity-50
              transition
            "
          >
            Shop
          </Link>


          <Link
            to="/collaborations"
            className="
              hover:opacity-50
              transition
            "
          >
            Collaborations
          </Link>


          <Link
            to="/makers"
            className="
              hover:opacity-50
              transition
            "
          >
            Makers
          </Link>

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