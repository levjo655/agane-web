import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


type Maker = {
  id: string;
  name: string;
};


export default function EditKnife() {

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


  const [existingImages, setExistingImages] =
    useState<string[]>([]);


  const [newImages, setNewImages] =
    useState<FileList | null>(null);


  const [form, setForm] = useState({

    title: "",
    slug: "",
    makerId: "",
    origin: "",
    steel: "",
    bladeType: "",
    length: "",
    handle: "",
    weight: "",
    description: "",
    price: "",
    status: "available"

  });


  // ==========================
  // LOAD KNIFE + MAKERS
  // ==========================

  useEffect(() => {

    async function loadData() {

      try {

        const [
          knifeResponse,
          makersResponse
        ] = await Promise.all([

          fetch(
            `http://localhost:8080/api/knives/${id}`
          ),

          fetch(
            "http://localhost:8080/api/makers"
          )

        ]);


        if (!knifeResponse.ok) {

          throw new Error(
            "Failed loading knife"
          );

        }


        const knife =
          await knifeResponse.json();


        const makersData =
          await makersResponse.json();


        if (Array.isArray(makersData)) {

          setMakers(makersData);

        }


        setForm({

          title:
            knife.title || "",

          slug:
            knife.slug || "",

          makerId:
            knife.maker?.id || "",

          origin:
            knife.origin || "",

          steel:
            knife.steel || "",

          bladeType:
            knife.bladeType || "",

          length:
            knife.length || "",

          handle:
            knife.handle || "",

          weight:
            knife.weight !== null &&
            knife.weight !== undefined
              ? String(knife.weight)
              : "",

          description:
            knife.description || "",

          price:
            knife.price !== null &&
            knife.price !== undefined
              ? String(knife.price)
              : "",

          status:
            knife.status || "available"

        });


        setExistingImages(

          Array.isArray(knife.images)
            ? knife.images
            : []

        );


      } catch (error) {

        console.error(
          "EDIT KNIFE LOAD ERROR",
          error
        );

        setError(
          "Failed loading knife"
        );

      } finally {

        setLoading(false);

      }

    }


    loadData();

  }, [id]);


  // ==========================
  // FORM CHANGE
  // ==========================

  function handleChange(

    e:
      React.ChangeEvent<
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
  // REMOVE EXISTING IMAGE
  // ==========================

  function removeExistingImage(
    image: string
  ) {

    setExistingImages(

      prev =>
        prev.filter(
          item => item !== image
        )

    );

  }


  // ==========================
  // SAVE KNIFE
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
        "slug",
        form.slug
      );

      formData.append(
        "makerId",
        form.makerId
      );

      formData.append(
        "origin",
        form.origin
      );

      formData.append(
        "steel",
        form.steel
      );

      formData.append(
        "bladeType",
        form.bladeType
      );

      formData.append(
        "length",
        form.length
      );

      formData.append(
        "handle",
        form.handle
      );

      formData.append(
        "weight",
        form.weight
      );

      formData.append(
        "description",
        form.description
      );

      formData.append(
        "price",
        form.price
      );

      formData.append(
        "status",
        form.status
      );


      // Existing images we want to keep

      formData.append(

        "existingImages",

        JSON.stringify(
          existingImages
        )

      );


      // New images

      if (newImages) {

        Array.from(newImages).forEach(
          image => {

            formData.append(
              "images",
              image
            );

          }
        );

      }


      const response =
        await fetch(

          `http://localhost:8080/api/knives/${id}`,

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
          "Failed updating knife"
        );

      }


      navigate("/admin");


    } catch (error) {

      console.error(
        "UPDATE KNIFE ERROR",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed updating knife"
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
        px-6
        py-16
      ">

        <div className="
          max-w-4xl
          mx-auto
        ">

          <p>
            Loading knife...
          </p>

        </div>

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


        <button

          type="button"

          onClick={() =>
            navigate("/admin")
          }

          className="
            mb-8
            text-sm
            opacity-60
            hover:opacity-100
          "

        >

          ← Back to Workshop

        </button>


        <h1 className="
          text-5xl
          font-serif
          mb-12
        ">

          Edit Knife

        </h1>


        <form

          onSubmit={handleSubmit}

          className="
            space-y-8
          "

        >


          {/* BASIC INFORMATION */}

          <section>

            <h2 className="
              text-2xl
              font-serif
              mb-6
            ">

              Knife Information

            </h2>


            <div className="
              grid
              md:grid-cols-2
              gap-6
            ">


              {[
                ["title", "Knife Name"],
                ["slug", "Slug"],
                ["origin", "Origin"],
                ["steel", "Steel"],
                ["bladeType", "Blade Type"],
                ["length", "Blade Length"],
                ["handle", "Handle Material"],
                ["weight", "Weight"],
                ["price", "Price SEK"]
              ].map(([name, label]) => (

                <input

                  key={name}

                  name={name}

                  placeholder={label}

                  value={
                    form[
                      name as keyof typeof form
                    ]
                  }

                  onChange={handleChange}

                  className="
                    border
                    border-agane-text
                    p-4
                    bg-transparent
                    w-full
                  "

                />

              ))}


            </div>

          </section>


          {/* MAKER */}

          <section>

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

          </section>


          {/* STATUS */}

          <section>

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

              <option value="available">
                Available
              </option>

              <option value="sold">
                Sold
              </option>

              <option value="archive">
                Archive
              </option>

            </select>

          </section>


          {/* DESCRIPTION */}

          <section>

            <label className="
              block
              uppercase
              text-xs
              tracking-widest
              mb-3
            ">

              Description

            </label>


            <textarea

              name="description"

              value={form.description}

              onChange={handleChange}

              placeholder="
                Knife story / description...
              "

              className="
                border
                border-agane-text
                p-4
                bg-transparent
                w-full
                h-48
              "

            />

          </section>


          {/* EXISTING IMAGES */}

          <section>

            <h2 className="
              text-2xl
              font-serif
              mb-6
            ">

              Existing Images

            </h2>


            {existingImages.length === 0 ? (

              <p className="
                opacity-60
              ">

                No images uploaded.

              </p>

            ) : (

              <div className="
                grid
                grid-cols-2
                md:grid-cols-3
                gap-6
              ">


                {existingImages.map(
                  image => (

                    <div

                      key={image}

                      className="
                        relative
                        group
                      "

                    >

                      <img

                        src={
                          `http://localhost:8080${image}`
                        }

                        alt="Knife"

                        className="
                          w-full
                          h-56
                          object-cover
                          border
                        "

                      />


                      <button

                        type="button"

                        onClick={() =>
                          removeExistingImage(
                            image
                          )
                        }

                        className="
                          absolute
                          top-3
                          right-3
                          bg-black
                          text-white
                          w-9
                          h-9
                          flex
                          items-center
                          justify-center
                          text-xl
                        "

                      >

                        ×

                      </button>

                    </div>

                  )
                )}

              </div>

            )}

          </section>


          {/* NEW IMAGES */}

          <section className="
            border
            border-agane-text
            p-6
          ">

            <h2 className="
              text-2xl
              font-serif
              mb-4
            ">

              Add New Images

            </h2>


            <p className="
              text-sm
              opacity-60
              mb-4
            ">

              JPEG, PNG or WebP recommended.

            </p>


            <input

              type="file"

              multiple

              accept="
                image/jpeg,
                image/jpg,
                image/png,
                image/webp
              "

              onChange={(e) =>
                setNewImages(
                  e.target.files
                )
              }

            />

          </section>


          {/* ERROR */}

          {error && (

            <div className="
              border
              border-red-600
              text-red-600
              p-4
            ">

              {error}

            </div>

          )}


          {/* SAVE */}

          <div className="
            flex
            gap-4
            items-center
          ">

            <button

              type="submit"

              disabled={
                saving ||
                !form.makerId
              }

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
                disabled:opacity-40
              "

            >

              {saving
                ? "Saving Knife..."
                : "Update Knife"
              }

            </button>


            <button

              type="button"

              onClick={() =>
                navigate("/admin")
              }

              className="
                border
                px-8
                py-4
              "

            >

              Cancel

            </button>

          </div>


        </form>

      </div>

    </main>

  );

}