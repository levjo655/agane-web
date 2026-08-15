import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Maker = {
  id: string;
  name: string;
  slug: string;
};

type Knife = {
  id: string;
  slug: string;
  title: string;
  maker: Maker;
  steel?: string;
  price: number;
  status: string;
  images: string[];
};

export default function Shop() {
  const [knives, setKnives] = useState<Knife[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadKnives() {
      try {
        const response = await fetch(
          "http://localhost:8080/api/knives"
        );

        if (!response.ok) {
          throw new Error("Failed loading knives");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setKnives(data);
        }
      } catch (error) {
        console.error("SHOP ERROR", error);
      } finally {
        setLoading(false);
      }
    }

    loadKnives();
  }, []);

  if (loading) {
    return (
      <main
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-agane-bg
          text-agane-text
        "
      >
        Loading shop...
      </main>
    );
  }

  const available = knives.filter(
    knife => knife.status === "available"
  );

  const archive = knives.filter(
    knife => knife.status !== "available"
  );

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
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <header className="mb-20">

          <p
            className="
              text-xs
              uppercase
              tracking-[0.35em]
              opacity-50
              mb-5
            "
          >
            Ågane
          </p>

          <h1
            className="
              text-6xl
              md:text-7xl
              font-serif
            "
          >
            Shop
          </h1>

          <p
            className="
              mt-6
              max-w-2xl
              text-lg
              leading-relaxed
              opacity-70
            "
          >
            Handcrafted knives created in collaboration
            with exceptional makers.
          </p>

        </header>


        {/* AVAILABLE */}

        <section>

          <div
            className="
              flex
              justify-between
              items-end
              mb-10
            "
          >

            <div>

              <p
                className="
                  text-xs
                  uppercase
                  tracking-[0.3em]
                  opacity-50
                  mb-3
                "
              >
                Available now
              </p>

              <h2
                className="
                  text-4xl
                  font-serif
                "
              >
                Available Pieces
              </h2>

            </div>

            <p className="text-sm opacity-50">
              {available.length} pieces
            </p>

          </div>


          {available.length > 0 ? (

            <div
              className="
                grid
                md:grid-cols-2
                lg:grid-cols-3
                gap-10
              "
            >

              {available.map(knife => (

                <Link
                  key={knife.id}
                  to={`/shop/${knife.slug}`}
                  className="
                    bg-white
                    border
                    overflow-hidden
                    group
                    block
                  "
                >

                  {/* IMAGE */}

                  {knife.images?.[0] ? (

                    <div className="overflow-hidden">

                      <img
                        src={`http://localhost:8080${knife.images[0]}`}
                        alt={knife.title}
                        className="
                          w-full
                          h-96
                          object-cover
                          group-hover:scale-105
                          transition
                          duration-500
                        "
                      />

                    </div>

                  ) : (

                    <div
                      className="
                        w-full
                        h-96
                        flex
                        items-center
                        justify-center
                        bg-agane-bg
                        opacity-60
                      "
                    >
                      No image
                    </div>

                  )}


                  {/* INFO */}

                  <div className="p-8">

                    <p
                      className="
                        text-xs
                        uppercase
                        tracking-[0.3em]
                        opacity-60
                      "
                    >
                      {knife.maker.name}
                    </p>

                    <h3
                      className="
                        text-3xl
                        font-serif
                        mt-4
                      "
                    >
                      {knife.title}
                    </h3>

                    {knife.steel && (

                      <p className="mt-4 opacity-70">
                        {knife.steel}
                      </p>

                    )}

                    <div
                      className="
                        mt-8
                        border-t
                        pt-5
                        flex
                        justify-between
                        items-center
                      "
                    >

                      <span>
                        {knife.price} SEK
                      </span>

                      <span
                        className="
                          text-sm
                          uppercase
                          tracking-widest
                          opacity-60
                        "
                      >
                        View →
                      </span>

                    </div>

                  </div>

                </Link>

              ))}

            </div>

          ) : (

            <div
              className="
                border
                p-12
                text-center
                opacity-60
              "
            >
              No knives currently available.
            </div>

          )}

        </section>


        {/* ARCHIVE */}

        {archive.length > 0 && (

          <section className="mt-32">

            <div
              className="
                flex
                justify-between
                items-end
                mb-10
              "
            >

              <div>

                <p
                  className="
                    text-xs
                    uppercase
                    tracking-[0.3em]
                    opacity-50
                    mb-3
                  "
                >
                  Past pieces
                </p>

                <h2
                  className="
                    text-4xl
                    font-serif
                  "
                >
                  Archive
                </h2>

              </div>

              <p className="text-sm opacity-50">
                {archive.length} pieces
              </p>

            </div>


            <div
              className="
                grid
                md:grid-cols-2
                lg:grid-cols-3
                gap-10
              "
            >

              {archive.map(knife => (

                <Link
                  key={knife.id}
                  to={`/shop/${knife.slug}`}
                  className="
                    bg-white
                    border
                    overflow-hidden
                    block
                    opacity-75
                    hover:opacity-100
                    transition
                  "
                >

                  {knife.images?.[0] ? (

                    <div className="overflow-hidden">

                      <img
                        src={`http://localhost:8080${knife.images[0]}`}
                        alt={knife.title}
                        className="
                          w-full
                          h-80
                          object-cover
                        "
                      />

                    </div>

                  ) : (

                    <div
                      className="
                        w-full
                        h-80
                        flex
                        items-center
                        justify-center
                        bg-agane-bg
                        opacity-60
                      "
                    >
                      No image
                    </div>

                  )}


                  <div className="p-6">

                    <p
                      className="
                        text-xs
                        uppercase
                        tracking-widest
                        opacity-50
                      "
                    >
                      {knife.status}
                    </p>

                    <h3
                      className="
                        text-2xl
                        font-serif
                        mt-3
                      "
                    >
                      {knife.title}
                    </h3>

                    <p className="mt-3 opacity-60">
                      {knife.maker.name}
                    </p>

                  </div>

                </Link>

              ))}

            </div>

          </section>

        )}

      </div>
    </main>
  );
}