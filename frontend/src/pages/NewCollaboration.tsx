import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Maker = {
  id: string;
  name: string;
  country?: string;
};

export default function NewCollaboration() {

  const navigate = useNavigate();

  const [makers, setMakers] = useState<Maker[]>([]);

  const [form, setForm] = useState({
    title: "",
    makerId: "",
    description: "",
    quantity: "",
    status: "upcoming",
    releaseDate: ""
  });

  const [image, setImage] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // ==========================
  // LOAD MAKERS
  // ==========================

  useEffect(() => {

    async function loadMakers() {

      try {

        const res =
          await fetch(
            "http://localhost:8080/api/makers"
          );

        const data =
          await res.json();

        if (Array.isArray(data)) {
          setMakers(data);
        }

      } catch (error) {

        console.error(
          "LOAD MAKERS ERROR",
          error
        );

      }

    }

    loadMakers();

  }, []);


  // ==========================
  // FORM UPDATE
  // ==========================

  function update(
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value

    });

  }


  // ==========================
  // IMAGE
  // ==========================

  function handleImageChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    const file =
      e.target.files?.[0];

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

      const formData =
        new FormData();


      formData.append(
        "title",
        form.title
      );

      formData.append(
        "makerId",
        form.makerId
      );

      formData.append(
        "description",
        form.description
      );

      formData.append(
        "quantity",
        form.quantity
      );

      formData.append(
        "status",
        form.status
      );


      if (form.releaseDate) {

        formData.append(
          "releaseDate",
          form.releaseDate
        );

      }


      if (image) {

        formData.append(
          "image",
          image
        );

      }


      const res =
        await fetch(
          "http://localhost:8080/api/collaborations",
          {
            method: "POST",
            body: formData
          }
        );


      if (!res.ok) {

        const data =
          await res.json().catch(
            () => null
          );

        throw new Error(
          data?.error ||
          "Failed creating collaboration"
        );

      }


      navigate("/admin");


    } catch (error) {

      console.error(
        "CREATE COLLAB ERROR",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
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


        <h1 className="
          text-5xl
          font-serif
          mb-12
        ">

          New Collaboration

        </h1>


        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >


          {/* ==========================
              BASIC INFORMATION
          ========================== */}

          <input
            name="title"
            placeholder="Collaboration title"
            value={form.title}
            onChange={update}
            required
            className="
              border
              border-agane-text
              p-4
              w-full
              bg-transparent
            "
          />


          {/* MAKER */}

          <div>

            <label className="
              block
              uppercase
              text-xs
              tracking-widest
              mb-3
            ">

              Maker

            </label>


            <select
              name="makerId"
              value={form.makerId}
              onChange={update}
              required
              className="
                border
                border-agane-text
                p-4
                w-full
                bg-transparent
              "
            >

              <option value="">
                Select maker
              </option>


              {makers.map(maker => (

                <option
                  key={maker.id}
                  value={maker.id}
                >

                  {maker.name}

                </option>

              ))}

            </select>

          </div>


          {/* DESCRIPTION */}

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={update}
            className="
              border
              border-agane-text
              p-4
              w-full
              h-48
              bg-transparent
            "
          />


          {/* QUANTITY */}

          <input
            name="quantity"
            type="number"
            min="1"
            placeholder="Quantity"
            value={form.quantity}
            onChange={update}
            required
            className="
              border
              border-agane-text
              p-4
              w-full
              bg-transparent
            "
          />


          {/* STATUS */}

          <div>

            <label className="
              block
              uppercase
              text-xs
              tracking-widest
              mb-3
            ">

              Status

            </label>


            <select
              name="status"
              value={form.status}
              onChange={update}
              className="
                border
                border-agane-text
                p-4
                w-full
                bg-transparent
              "
            >

              <option value="upcoming">
                Upcoming
              </option>

              <option value="available">
                Available
              </option>

              <option value="sold">
                Sold
              </option>

            </select>

          </div>


          {/* RELEASE DATE */}

          <div>

            <label className="
              block
              uppercase
              text-xs
              tracking-widest
              mb-3
            ">

              Release Date

            </label>


            <input
              type="date"
              name="releaseDate"
              value={form.releaseDate}
              onChange={update}
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

              Collaboration Image

            </label>


            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="block w-full"
            />


            <p className="
              text-sm
              opacity-50
              mt-3
            ">

              JPG, PNG or WebP

            </p>


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
                  alt="Collaboration preview"
                  className="
                    w-full
                    max-w-xl
                    h-80
                    object-cover
                    border
                  "
                />

              </div>

            )}

          </div>


          {/* ERROR */}

          {error && (

            <p className="
              text-red-600
            ">

              {error}

            </p>

          )}


          {/* SAVE */}

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
              : "Create Collaboration"
            }

          </button>


        </form>

      </div>

    </main>

  );

}