import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewMaker() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    country: "",
    bio: "",
    website: "",
    instagram: ""
  });

  const [image, setImage] = useState<File | null>(null);

  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  // ==========================
  // HANDLE TEXT INPUT
  // ==========================

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  }


  // ==========================
  // HANDLE IMAGE
  // ==========================

  function handleImageChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setImage(file);

    setPreview(
      URL.createObjectURL(file)
    );

  }


  // ==========================
  // SUBMIT
  // ==========================

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      const formData = new FormData();


      // TEXT FIELDS

      formData.append(
        "name",
        form.name
      );

      formData.append(
        "slug",
        form.slug
      );

      formData.append(
        "country",
        form.country
      );

      formData.append(
        "bio",
        form.bio
      );

      formData.append(
        "website",
        form.website
      );

      formData.append(
        "instagram",
        form.instagram
      );


      // IMAGE

      if (image) {

        formData.append(
          "image",
          image
        );

      }


      const response = await fetch(
        "http://localhost:8080/api/makers",
        {
          method: "POST",
          body: formData
        }
      );


      if (!response.ok) {

        const data =
          await response.json().catch(
            () => null
          );

        throw new Error(
          data?.error ||
          "Failed creating maker"
        );

      }


      navigate("/admin");


    } catch (error) {

      console.error(
        "CREATE MAKER ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong creating maker"
      );

    } finally {

      setLoading(false);

    }

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


        {/* ==========================
            HEADER
        ========================== */}

        <h1 className="
          text-5xl
          font-serif
          mb-12
        ">

          Add Maker

        </h1>


        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >


          {/* ==========================
              BASIC INFORMATION
          ========================== */}

          <div className="
            grid
            md:grid-cols-2
            gap-6
          ">


            <input
              name="name"
              placeholder="Maker Name"
              value={form.name}
              onChange={handleChange}
              required
              className="
                border
                border-agane-text
                p-4
                w-full
                bg-transparent
              "
            />


            <input
              name="slug"
              placeholder="Slug"
              value={form.slug}
              onChange={handleChange}
              required
              className="
                border
                border-agane-text
                p-4
                w-full
                bg-transparent
              "
            />


            <input
              name="country"
              placeholder="Country"
              value={form.country}
              onChange={handleChange}
              className="
                border
                border-agane-text
                p-4
                w-full
                bg-transparent
              "
            />


            <input
              name="website"
              placeholder="Website"
              value={form.website}
              onChange={handleChange}
              className="
                border
                border-agane-text
                p-4
                w-full
                bg-transparent
              "
            />


            <input
              name="instagram"
              placeholder="Instagram"
              value={form.instagram}
              onChange={handleChange}
              className="
                border
                border-agane-text
                p-4
                w-full
                bg-transparent
              "
            />


          </div>


          {/* ==========================
              IMAGE UPLOAD
          ========================== */}

          <div className="
            border
            border-agane-text
            p-6
          ">


            <label className="
              block
              uppercase
              text-xs
              tracking-widest
              mb-4
            ">

              Maker Image

            </label>


            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="
                block
                w-full
              "
            />


            <p className="
              text-sm
              opacity-50
              mt-3
            ">

              JPG, PNG or WebP

            </p>


            {/* PREVIEW */}

            {preview && (

              <div className="mt-8">

                <p className="
                  text-xs
                  uppercase
                  tracking-widest
                  opacity-50
                  mb-3
                ">

                  Preview

                </p>


                <img
                  src={preview}
                  alt="Maker preview"
                  className="
                    w-64
                    h-64
                    object-cover
                    border
                  "
                />

              </div>

            )}

          </div>


          {/* ==========================
              BIO
          ========================== */}

          <textarea
            name="bio"
            placeholder="Maker biography..."
            value={form.bio}
            onChange={handleChange}
            className="
              border
              border-agane-text
              p-4
              w-full
              h-48
              bg-transparent
            "
          />


          {/* ==========================
              ERROR
          ========================== */}

          {error && (

            <p className="
              text-red-600
            ">

              {error}

            </p>

          )}


          {/* ==========================
              SAVE
          ========================== */}

          <button
            disabled={loading}
            type="submit"
            className="
              bg-black
              text-white
              px-12
              py-4
              border
              border-black
              hover:bg-transparent
              hover:text-black
              transition
              disabled:opacity-50
            "
          >

            {loading
              ? "Saving..."
              : "Save Maker"
            }

          </button>


        </form>


      </div>

    </main>

  );

}