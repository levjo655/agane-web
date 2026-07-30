interface Knife {
  id: string;
  title: string;
  maker: string;
  steel?: string;
  description: string;
  price: number;
  image: string;
}


export default function KnifeCard({ knife }: { knife: Knife }) {

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

      <div className="overflow-hidden">

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


        <h2
          className="
            text-2xl
            font-serif
            mb-3
          "
        >
          {knife.title}
        </h2>


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
            {knife.price} SEK
          </span>


          <button
            className="
              text-sm
              tracking-wide
              hover:opacity-60
            "
          >
            View →
          </button>

        </div>


      </div>


    </article>

  );
}