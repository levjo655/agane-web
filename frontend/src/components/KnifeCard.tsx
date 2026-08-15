import { Link } from "react-router-dom";

interface Knife {
  id: string;
  title: string;
  maker: string;
  steel?: string;
  description: string;
  price: number;
  image: string;
  status: string;
  slug: string;
}

export default function KnifeCard(
  { knife }: { knife: Knife }
) {

  function statusBadge(status: string) {

    if (status === "sold") {

      return (
        <span
          className="
            absolute
            top-4
            left-4
            bg-black
            text-white
            px-4
            py-1
            text-xs
            tracking-[0.25em]
          "
        >
          SOLD
        </span>
      );

    }

    if (status === "archive") {

      return (
        <span
          className="
            absolute
            top-4
            left-4
            border
            border-black
            bg-white
            px-4
            py-1
            text-xs
            tracking-[0.25em]
          "
        >
          ARCHIVE
        </span>
      );

    }

    return (
      <span
        className="
          absolute
          top-4
          left-4
          border
          bg-white
          px-4
          py-1
          text-xs
          tracking-[0.25em]
        "
      >
        AVAILABLE
      </span>
    );
  }

  return (

    <article
      className="
        group
        bg-white
        border
        border-agane-border
        overflow-hidden
        transition
        hover:-translate-y-1
        duration-300
      "
    >

      {/* IMAGE */}

      <Link to={`/shop/${knife.slug}`}>

        <div
          className="
            overflow-hidden
            relative
          "
        >

          {statusBadge(knife.status)}

          <img
            src={
              knife.image ||
              "/images/placeholder.jpg"
            }
            alt={knife.title}
            className="
              w-full
              h-80
              object-cover
              transition
              duration-500
              group-hover:scale-105
            "
          />

        </div>

      </Link>


      {/* INFORMATION */}

      <div className="p-6">

        <p
          className="
            text-xs
            uppercase
            tracking-[0.25em]
            mb-3
            opacity-60
          "
        >
          {knife.maker}
        </p>


        <Link to={`/shop/${knife.slug}`}>

          <h2
            className="
              text-2xl
              font-serif
              mb-3
              hover:opacity-60
              transition
            "
          >
            {knife.title}
          </h2>

        </Link>


        {knife.steel && (

          <p
            className="
              text-sm
              mb-3
              opacity-60
            "
          >
            {knife.steel}
          </p>

        )}


        <p
          className="
            text-sm
            leading-relaxed
            mb-4
            opacity-80
          "
        >
          {knife.description}
        </p>


        {/* PRICE / VIEW */}

        <div
          className="
            flex
            justify-between
            items-center
            pt-4
            border-t
            border-agane-border
          "
        >

          <span>
            {knife.status === "available"
              ? `${knife.price} SEK`
              : knife.status === "sold"
                ? "SOLD"
                : "ARCHIVE"
            }
          </span>


          <Link
            to={`/shop/${knife.slug}`}
            className="
              text-sm
              tracking-wide
              hover:opacity-60
              transition
            "
          >
            View →
          </Link>

        </div>

      </div>

    </article>

  );
}