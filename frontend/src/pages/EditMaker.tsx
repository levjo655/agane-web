import {
  useEffect,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";


type Maker = {

  id: string;

  name: string;

  slug: string;

  country?: string;

  bio?: string;

  image?: string | null;

  website?: string;

  instagram?: string;

};


export default function EditMaker() {


  const {
    id
  } = useParams();


  const navigate =
    useNavigate();


  const [maker, setMaker] =
    useState<Maker | null>(null);


  const [name, setName] =
    useState("");

  const [slug, setSlug] =
    useState("");

  const [country, setCountry] =
    useState("");

  const [bio, setBio] =
    useState("");

  const [website, setWebsite] =
    useState("");

  const [instagram, setInstagram] =
    useState("");

  const [image, setImage] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);


  // ==========================
  // LOAD MAKER
  // ==========================

  useEffect(() => {

    async function loadMaker() {

      try {

        const response =
          await fetch(
            `http://localhost:8080/api/makers/${id}`
          );


        if (!response.ok) {

          throw new Error(
            "Maker not found"
          );

        }


        const data =
          await response.json();


        setMaker(data);

        setName(data.name || "");

        setSlug(data.slug || "");

        setCountry(
          data.country || ""
        );

        setBio(
          data.bio || ""
        );

        setWebsite(
          data.website || ""
        );

        setInstagram(
          data.instagram || ""
        );


      } catch (error) {

        console.error(
          "LOAD MAKER ERROR",
          error
        );

        alert(
          "Failed loading maker"
        );

        navigate(
          "/admin"
        );

      } finally {

        setLoading(false);

      }

    }


    if (id) {

      loadMaker();

    }

  }, [id, navigate]);


  // ==========================
  // SAVE MAKER
  // ==========================

  async function handleSubmit(
    event: React.FormEvent
  ) {

    event.preventDefault();


    if (!id) {

      return;

    }


    setSaving(true);


    try {

      const formData =
        new FormData();


      formData.append(
        "name",
        name
      );

      formData.append(
        "slug",
        slug
      );

      formData.append(
        "country",
        country
      );

      formData.append(
        "bio",
        bio
      );

      formData.append(
        "website",
        website
      );

      formData.append(
        "instagram",
        instagram
      );


      if (image) {

        formData.append(
          "image",
          image
        );

      }


      const response =
        await fetch(
          `http://localhost:8080/api/makers/${id}`,
          {
            method: "PUT",
            body: formData
          }
        );


      if (!response.ok) {

        throw new Error(
          "Failed updating maker"
        );

      }


      alert(
        "Maker updated successfully"
      );


      navigate(
        "/admin"
      );


    } catch (error) {

      console.error(
        "UPDATE MAKER ERROR",
        error
      );

      alert(
        "Failed updating maker"
      );

    } finally {

      setSaving(false);

    }

  }


  // ==========================
  // LOADING
  // ==========================

  if (loading) {

    return (

      <main className="
        min-h-screen
        bg-agane-bg
        flex
        items-center
        justify-center
      ">

        Loading maker...

      </main>

    );

  }


  if (!maker) {

    return (

      <main className="
        min-h-screen
        bg-agane-bg
        flex
        items-center
        justify-center
      ">

        Maker not found

      </main>

    );

  }


  return (

    <main className="
      min-h-screen
      bg-agane-bg
      text-agane-text
      px-6
      py-16
    ">


      <div className="
        max-w-4xl
        mx-auto
      ">


        {/* HEADER */}

        <div className="
          mb-12
        ">

          <button
            onClick={() =>
              navigate("/admin")
            }
            className="
              opacity-60
              hover:opacity-100
              mb-6
            "
          >

            ← Back to Admin

          </button>


          <p className="
            text-xs
            uppercase
            tracking-[0.3em]
            opacity-50
          ">

            Admin

          </p>


          <h1 className="
            text-5xl
            font-serif
            mt-3
          ">

            Edit Maker

          </h1>

        </div>


        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="
            bg-white
            border
            p-10
          "
        >


          {/* NAME */}

          <div className="
            mb-7
          ">

            <label className="
              block
              text-sm
              mb-2
            ">

              Name

            </label>


            <input
              value={name}
              onChange={event =>
                setName(
                  event.target.value
                )
              }
              required
              className="
                w-full
                border
                px-4
                py-3
                outline-none
              "
            />

          </div>


          {/* SLUG */}

          <div className="
            mb-7
          ">

            <label className="
              block
              text-sm
              mb-2
            ">

              Slug

            </label>


            <input
              value={slug}
              onChange={event =>
                setSlug(
                  event.target.value
                )
              }
              required
              className="
                w-full
                border
                px-4
                py-3
                outline-none
              "
            />

          </div>


          {/* COUNTRY */}

          <div className="
            mb-7
          ">

            <label className="
              block
              text-sm
              mb-2
            ">

              Country

            </label>


            <input
              value={country}
              onChange={event =>
                setCountry(
                  event.target.value
                )
              }
              className="
                w-full
                border
                px-4
                py-3
                outline-none
              "
            />

          </div>


          {/* BIO */}

          <div className="
            mb-7
          ">

            <label className="
              block
              text-sm
              mb-2
            ">

              Biography

            </label>


            <textarea
              value={bio}
              onChange={event =>
                setBio(
                  event.target.value
                )
              }
              rows={6}
              className="
                w-full
                border
                px-4
                py-3
                outline-none
                resize-none
              "
            />

          </div>


          {/* WEBSITE */}

          <div className="
            mb-7
          ">

            <label className="
              block
              text-sm
              mb-2
            ">

              Website

            </label>


            <input
              value={website}
              onChange={event =>
                setWebsite(
                  event.target.value
                )
              }
              className="
                w-full
                border
                px-4
                py-3
                outline-none
              "
            />

          </div>


          {/* INSTAGRAM */}

          <div className="
            mb-7
          ">

            <label className="
              block
              text-sm
              mb-2
            ">

              Instagram

            </label>


            <input
              value={instagram}
              onChange={event =>
                setInstagram(
                  event.target.value
                )
              }
              className="
                w-full
                border
                px-4
                py-3
                outline-none
              "
            />

          </div>


          {/* CURRENT IMAGE */}

          {maker.image && (

            <div className="
              mb-7
            ">

              <label className="
                block
                text-sm
                mb-3
              ">

                Current Image

              </label>


              <img
                src={
                  `http://localhost:8080${maker.image}`
                }
                alt={maker.name}
                className="
                  w-64
                  h-64
                  object-cover
                  border
                "
              />

            </div>

          )}


          {/* NEW IMAGE */}

          <div className="
            mb-10
          ">

            <label className="
              block
              text-sm
              mb-2
            ">

              Replace Image

            </label>


            <input
              type="file"
              accept="image/*"
              onChange={event => {

                setImage(
                  event.target.files?.[0] ||
                  null
                );

              }}
              className="
                w-full
                border
                px-4
                py-3
              "
            />

          </div>


          {/* ACTIONS */}

          <div className="
            flex
            gap-4
          ">


            <button
              type="button"
              onClick={() =>
                navigate("/admin")
              }
              className="
                border
                px-8
                py-3
              "
            >

              Cancel

            </button>


            <button
              type="submit"
              disabled={saving}
              className="
                bg-black
                text-white
                px-8
                py-3
                disabled:opacity-50
              "
            >

              {saving
                ? "Saving..."
                : "Save Changes"
              }

            </button>


          </div>


        </form>


      </div>


    </main>

  );

}