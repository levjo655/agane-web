import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header
      className="
        w-full
        px-8
        py-8
        bg-agane-bg
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto
          grid
          grid-cols-3
          items-center
        "
      >

        {/* LEFT NAV */}
        <nav
          className="
            flex
            gap-8
            text-sm
            tracking-wide
            font-serif
          "
        >
          <Link
            to="/"
            className="hover:opacity-60 transition"
          >
            Home
          </Link>

          <Link
            to="/knives"
            className="hover:opacity-60 transition"
          >
            Knives
          </Link>
        </nav>


        {/* CENTER LOGO */}
        <Link
          to="/"
          className="
            flex
            justify-center
          "
        >
          <img
            src="/agane_logo.png"
            alt="Ågane"
            className="
              h-20
              w-20
              object-contain
            "
          />
        </Link>


        {/* RIGHT NAV */}
        <nav
          className="
            flex
            justify-end
            gap-8
            text-sm
            tracking-wide
            font-serif
          "
        >

          <Link
            to="/sharpening"
            className="hover:opacity-60 transition"
          >
            Sharpening
          </Link>

          <Link
            to="/contact"
            className="hover:opacity-60 transition"
          >
            Contact
          </Link>

        </nav>


      </div>

    </header>
  );
}