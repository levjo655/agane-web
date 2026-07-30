import Header from "../components/Header"
import Footer from "../components/Footer";
import { collabs } from "../data/collabs";




export default function Home() {

  return (

    <div className="min-h-dvh flex flex-col bg-agane-bg text-agane-text">

      <Header />


      <main className="flex-grow">


        {/* HERO */}

        <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">

          <p className="uppercase tracking-[0.3em] text-sm mb-6">
            Japanese natural stone sharpening
          </p>


          <h1 className="text-6xl md:text-7xl font-serif mb-8">
            Ågane
          </h1>


          <p className="max-w-xl text-lg leading-relaxed mb-10">
            Preserving the soul of exceptional Japanese knives through
            traditional sharpening techniques and meaningful collaborations.
          </p>


          <a
            href="#gallery"
            className="
              border
              border-agane-text
              px-8
              py-3
              tracking-wide
              hover:bg-agane-text
              hover:text-white
              transition
            "
          >
            Explore
          </a>


        </section>



        {/* ABOUT */}


        <section className="py-24 px-6 max-w-6xl mx-auto">


          <div className="
            grid
            md:grid-cols-2
            gap-16
            items-center
          ">


            <img
              src="/images/agane_main_pic.jpg"
              alt="Ågane sharpening"
              className="
                w-full
                rounded-lg
                object-cover
              "
            />


            <div className="space-y-6 text-lg leading-relaxed">


              <h2 className="text-4xl font-serif">
                Hello
              </h2>


              <p>
                My name is Levjo Cibuku, and I’m the sharpener behind Ågane.
              </p>


              <p>
                What started as an obsession with Japanese knives grew into a
                journey of understanding steel, geometry, and the craft behind
                every blade.
              </p>


              <p>
                Today Ågane combines traditional sharpening techniques with
                collaborations alongside exceptional blacksmiths, bringing out
                the true character of each knife.
              </p>


            </div>


          </div>


        </section>




        {/* COLLABS */}


        <section
          id="gallery"
          className="py-24 px-6 bg-agane-surface"
        >


          <h2 className="
            text-4xl
            font-serif
            text-center
            mb-14
          ">
            Featured Collaborations
          </h2>



          <div className="
            grid
            md:grid-cols-3
            gap-8
            max-w-6xl
            mx-auto
          ">


            {collabs.slice(0,3).map((collab)=>(


              <article
                key={collab.id}
                className="
                  bg-agane-card
                  border
                  border-agane-border
                  overflow-hidden
                "
              >


                <img
                  src={collab.images[0]}
                  alt={collab.name}
                  className="
                    w-full
                    h-64
                    object-cover
                  "
                />


                <div className="p-6">


                  <h3 className="
                    text-2xl
                    font-serif
                    mb-3
                  ">
                    {collab.name}
                  </h3>


                  <p className="text-sm leading-relaxed">
                    {collab.description}
                  </p>


                </div>


              </article>


            ))}


          </div>


        </section>




        {/* SERVICES */}



        <section className="
          py-24
          px-6
          max-w-6xl
          mx-auto
        ">


          <h2 className="
            text-4xl
            font-serif
            text-center
            mb-14
          ">
            Sharpening Services
          </h2>



          <div className="
            grid
            md:grid-cols-3
            gap-8
          ">


            {[
              {
                title:"Edge Sharpening",
                image:"/images/edge_sharpening.jpeg",
                text:"Precision sharpening on Japanese whetstones."
              },
              {
                title:"Bevel Polishing",
                image:"/images/bevel_sharpening.jpg",
                text:"Refining blade geometry for performance and beauty."
              },
              {
                title:"Full Stone Polish",
                image:"/images/full_stone_sharpening.jpg",
                text:"Complete restoration using natural stones."
              }

            ].map(service=>(


              <div
                key={service.title}
                className="
                  border
                  border-agane-border
                  bg-white
                  overflow-hidden
                "
              >

                <img
                  src={service.image}
                  className="w-full h-52 object-cover"
                />


                <div className="p-6 text-center">


                  <h3 className="text-xl font-serif mb-3">
                    {service.title}
                  </h3>


                  <p className="text-sm">
                    {service.text}
                  </p>


                </div>


              </div>


            ))}


          </div>


        </section>





        {/* CONTACT */}


        <section className="
          py-24
          text-center
          bg-agane-surface
        ">


          <h2 className="
            text-4xl
            font-serif
            mb-8
          ">
            Get in Touch
          </h2>


          <p>
            info@agane.se
          </p>


          <p>
            @agane.knives
          </p>


        </section>


      </main>


      <Footer />

    </div>

  );
}