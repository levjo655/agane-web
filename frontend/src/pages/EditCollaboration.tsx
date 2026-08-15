import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Maker = {
  id: string;
  name: string;
  country?: string;
};

type Collaboration = {
  id: string;
  title: string;
  makerId?: string | null;
  description?: string | null;
  quantity: number;
  status: string;
  releaseDate?: string | null;
  image?: string | null;
  maker?: Maker | null;
};

export default function EditCollaboration() {

  const { id } = useParams();

  const navigate = useNavigate();


  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");


  const [makers, setMakers] =
    useState<Maker[]>([]);


  const [currentImage, setCurrentImage] =
    useState<string | null>(null);

  const [newImage, setNewImage] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState("");


  // This tells the backend that the
  // existing image should be deleted.
  const [removeImage, setRemoveImage] =
    useState(false);


  const [form, setForm] = useState({

    title: "",
    makerId: "",
    description: "",
    quantity: "",
    status: "upcoming",
    releaseDate: ""

  });


  // ==========================
  // LOAD DATA
  // ==========================

  useEffect(() => {

    async function loadData() {

      try {

        const [
          collaborationResponse,
          makersResponse
        ] = await Promise.all([

          fetch(
            `http://localhost:8080/api/collaborations/${id}`
          ),

          fetch(
            "http://localhost:8080/api/makers"
          )

        ]);


        if (!collaborationResponse.ok) {

          throw new Error(
            "Failed loading collaboration"
          );

        }


        const collaboration:
          Collaboration =
          await collaborationResponse.json();


        const makersData =
          await makersResponse.json();


        if (Array.isArray(makersData)) {

          setMakers(makersData);

        }


        setForm({

          title:
            collaboration.title || "",

          makerId:
            collaboration.makerId ||
            collaboration.maker?.id ||
            "",

          description:
            collaboration.description ||
            "",

          quantity:
            collaboration.quantity
              ?.toString() || "",

          status:
            collaboration.status ||
            "upcoming",

          releaseDate:
            collaboration.releaseDate
              ? collaboration.releaseDate
                  .split("T")[0]
              : ""

        });


        setCurrentImage(
          collaboration.image || null
        );


      } catch (error) {

        console.error(
          "LOAD COLLABORATION ERROR",
          error
        );

        setError(
          "Failed loading collaboration"
        );


      } finally {

        setLoading(false);

      }

    }


    if (id) {

      loadData();

    }

  }, [id]);


  // ==========================
  // FORM UPDATE
  // ==========================

  function handleChange(
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
  // IMAGE CHANGE
  // ==========================

  function handleImageChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    const file =
      e.target.files?.[0];


    if (!file) {

      return;

    }


    setNewImage(file);

    setRemoveImage(false);


    setPreview(
      URL.createObjectURL(file)
    );

  }


  // ==========================
  // REMOVE IMAGE
  // ==========================

  function handleRemoveImage() {

    setRemoveImage(true);

    setCurrentImage(null);

    setNewImage(null);

    setPreview("");

  }


  // ==========================
  // SUBMIT
  // ==========================

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setSaving(true);

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


      formData.append(
        "releaseDate",
        form.releaseDate
      );


      // Tell backend to remove
      // the existing image.
      formData.append(
        "removeImage",
        removeImage
          ? "true"
          : "false"
      );


      // If a new image was selected,
      // send it to the backend.
      if (newImage) {

        formData.append(
          "image",
          newImage
        );

      }


      const response =
        await fetch(

          `http://localhost:8080/api/collaborations/${id}`,

          {

            method: "PUT",

            body: formData

          }

        );


      if (!response.ok) {

        const data =
          await response.json()
            .catch(() => null);


        throw new Error(

          data?.error ||
          "Failed updating collaboration"

        );

      }


      navigate("/admin");


    } catch (error) {

      console.error(
        "UPDATE COLLABORATION ERROR",
        error
      );


      setError(

        error instanceof Error
          ? error.message
          : "Failed updating collaboration"

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
        text-agane-text
        p-20
      ">

        Loading collaboration...

      </main>

    );

  }


  // ==========================
  // PAGE
  // ==========================

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

          Edit Collaboration

        </h1>


        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >


          {/* TITLE */}

          <input
            name="title"
            placeholder="Collaboration title"
            value={form.title}
            onChange={handleChange}
            required
            className="
              border
              border-agane-text
              p-4
              bg-transparent
              w-full
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
              onChange={handleChange}
              required
              className="
                border
                border-agane-text
                p-4
                bg-transparent
                w-full
              "
            >

              <option value="">
                Select Maker
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
            onChange={handleChange}
            className="
              border
              border-agane-text
              p-4
              bg-transparent
              w-full
              h-48
            "
          />


          {/* QUANTITY */}

          <input
            name="quantity"
            type="number"
            min="1"
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleChange}
            required
            className="
              border
              border-agane-text
              p-4
              bg-transparent
              w-full
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
              onChange={handleChange}
              className="
                border
                border-agane-text
                p-4
                bg-transparent
                w-full
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
              onChange={handleChange}
              className="
                border
                border-agane-text
                p-4
                bg-transparent
                w-full
              "
            />

          </div>


          {/* ==========================
              IMAGE
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
              mb-5
            ">

              Collaboration Image

            </label>



            {/* CURRENT IMAGE */}

            {currentImage && !preview && (

              <div className="mb-8">

                <p className="
                  text-xs
                  uppercase
                  tracking-widest
                  opacity-50
                  mb-3
                ">

                  Current Image

                </p>


                <img
                  src={
                    `http://localhost:8080${currentImage}`
                  }
                  alt={form.title}
                  className="
                    w-full
                    max-w-xl
                    h-80
                    object-cover
                    border
                  "
                />


                {/* REMOVE BUTTON */}

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="
                    mt-4
                    border
                    border-red-600
                    text-red-600
                    px-5
                    py-3
                    hover:bg-red-600
                    hover:text-white
                    transition
                  "
                >

                  Remove Image

                </button>

              </div>

            )}



            {/* IMAGE REMOVED MESSAGE */}

            {removeImage && !preview && (

              <div className="
                mb-6
                border
                border-red-600
                p-4
              ">

                <p className="
                  text-red-600
                  text-sm
                ">

                  Image will be removed when you
                  save the collaboration.

                </p>


                <button
                  type="button"
                  onClick={() => {

                    setRemoveImage(false);

                    // Reload the image from backend
                    // so it can be restored.
                    if (id) {

                      fetch(
                        `http://localhost:8080/api/collaborations/${id}`
                      )
                        .then(res => res.json())
                        .then(data => {

                          setCurrentImage(
                            data.image || null
                          );

                        })
                        .catch(error => {

                          console.error(
                            error
                          );

                        });

                    }

                  }}
                  className="
                    mt-3
                    underline
                    text-sm
                  "
                >

                  Keep Image

                </button>

              </div>

            )}



            {/* NEW IMAGE */}

            <div>

              <p className="
                text-xs
                uppercase
                tracking-widest
                opacity-50
                mb-3
              ">

                Replace Image

              </p>


              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="
                  block
                  w-full
                "
              />

            </div>



            {/* NEW IMAGE PREVIEW */}

            {preview && (

              <div className="mt-8">

                <p className="
                  text-xs
                  uppercase
                  tracking-widest
                  opacity-50
                  mb-3
                ">

                  New Image Preview

                </p>


                <img
                  src={preview}
                  alt="New collaboration"
                  className="
                    w-full
                    max-w-xl
                    h-80
                    object-cover
                    border
                  "
                />


                <button
                  type="button"
                  onClick={() => {

                    setNewImage(null);

                    setPreview("");

                  }}
                  className="
                    mt-4
                    border
                    px-5
                    py-3
                  "
                >

                  Cancel New Image

                </button>

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


          {/* BUTTON */}

          <button
            type="submit"
            disabled={saving}
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

            {saving
              ? "Saving..."
              : "Update Collaboration"
            }

          </button>


        </form>

      </div>

    </main>

  );

}