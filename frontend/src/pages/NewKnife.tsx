import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";


type Maker = {
  id: string;
  name: string;
};


export default function NewKnife() {

  const navigate = useNavigate();


  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  const [makers, setMakers] =
    useState<Maker[]>([]);


  const [form, setForm] =
    useState({

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


  const [images, setImages] =
    useState<FileList | null>(null);


  // ==========================
  // GENERATE SLUG
  // ==========================

  function generateSlug(value: string) {

    return value
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  }


  // ==========================
  // LOAD MAKERS
  // ==========================

  useEffect(() => {

    async function loadMakers() {

      try {

        const response =
          await fetch(
            "http://localhost:8080/api/makers"
          );


        if (!response.ok) {

          throw new Error(
            "Failed loading makers"
          );

        }


        const data =
          await response.json();


        if (Array.isArray(data)) {

          setMakers(data);

        }

      } catch (error) {

        console.error(
          "LOAD MAKERS ERROR:",
          error
        );

      }

    }


    loadMakers();

  }, []);


  // ==========================
  // HANDLE FORM CHANGE
  // ==========================

  function handleChange(
    e:
      React.ChangeEvent<
        HTMLInputElement |
        HTMLTextAreaElement |
        HTMLSelectElement
      >
  ) {

    const {
      name,
      value
    } = e.target;


    // Automatically generate slug
    // when title changes

    if (name === "title") {

      setForm(prev => ({

        ...prev,

        title: value,

        slug: generateSlug(value)

      }));

      return;

    }


    setForm(prev => ({

      ...prev,

      [name]: value

    }));

  }


  // ==========================
  // HANDLE IMAGE CHANGE
  // ==========================

  function handleImagesChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {

    setImages(
      e.target.files
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

      // ==========================
      // BASIC VALIDATION
      // ==========================

      if (!form.title.trim()) {

        throw new Error(
          "Knife name is required"
        );

      }


      if (!form.makerId) {

        throw new Error(
          "Please select a maker"
        );

      }


      if (!form.price) {

        throw new Error(
          "Price is required"
        );

      }


      // ==========================
      // ENSURE SLUG EXISTS
      // ==========================

      const finalSlug =
        form.slug.trim()
          ? generateSlug(form.slug)
          : generateSlug(form.title);


      if (!finalSlug) {

        throw new Error(
          "Unable to generate knife slug"
        );

      }


      // ==========================
      // CREATE FORM DATA
      // ==========================

      const formData =
        new FormData();


      formData.append(
        "title",
        form.title.trim()
      );


      formData.append(
        "slug",
        finalSlug
      );


      formData.append(
        "makerId",
        form.makerId
      );


      formData.append(
        "origin",
        form.origin.trim()
      );


      formData.append(
        "steel",
        form.steel.trim()
      );


      formData.append(
        "bladeType",
        form.bladeType.trim()
      );


      formData.append(
        "length",
        form.length.trim()
      );


      formData.append(
        "handle",
        form.handle.trim()
      );


      formData.append(
        "weight",
        form.weight
      );


      formData.append(
        "description",
        form.description.trim()
      );


      formData.append(
        "price",
        form.price
      );


      formData.append(
        "status",
        form.status
      );


      // ==========================
      // ADD IMAGES
      // ==========================

      if (images) {

        Array.from(images).forEach(
          image => {

            formData.append(
              "images",
              image
            );

          }
        );

      }


      // ==========================
      // SEND TO BACKEND
      // ==========================

      const response =
        await fetch(
          "http://localhost:8080/api/knives",
          {
            method: "POST",
            body: formData
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.error ||
          "Failed creating knife"
        );

      }


      console.log(
        "KNIFE CREATED:",
        data
      );


      // ==========================
      // GO BACK TO ADMIN
      // ==========================

      navigate("/admin");

    } catch (error) {

      console.error(
        "CREATE KNIFE ERROR:",
        error
      );


      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong creating knife"
      );

    } finally {

      setLoading(false);

    }

  }


  return (

    <main
      className="
        min-h-screen
        bg-agane-bg
        text-agane-text
        px-6
        py-16
      "
    >

      <div
        className="
          max-w-4xl
          mx-auto
        "
      >

        {/* ==========================
            HEADER
        ========================== */}

        <div className="mb-12">

          <p
            className="
              text-xs
              uppercase
              tracking-[0.35em]
              opacity-50
              mb-4
            "
          >
            Ågane Admin
          </p>


          <h1
            className="
              text-5xl
              md:text-6xl
              font-serif
            "
          >
            Add New Knife
          </h1>


          <p
            className="
              mt-5
              opacity-60
              max-w-2xl
            "
          >
            Add a new knife to the Ågane shop.
          </p>

        </div>


        {/* ==========================
            FORM
        ========================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-10"
        >


          {/* ==========================
              BASIC INFORMATION
          ========================== */}

          <section
            className="
              border
              border-agane-text
              p-6
              md:p-8
            "
          >

            <p
              className="
                text-xs
                uppercase
                tracking-[0.3em]
                opacity-50
                mb-6
              "
            >
              Basic Information
            </p>


            <div
              className="
                grid
                md:grid-cols-2
                gap-6
              "
            >

              {/* TITLE */}

              <div className="md:col-span-2">

                <label
                  className="
                    block
                    text-xs
                    uppercase
                    tracking-widest
                    mb-3
                  "
                >
                  Knife Name
                </label>


                <input
                  name="title"
                  placeholder="e.g. Gyuto 240mm"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="
                    border
                    border-agane-text
                    p-4
                    bg-transparent
                    w-full
                    outline-none
                  "
                />

              </div>


              {/* SLUG */}

              <div className="md:col-span-2">

                <label
                  className="
                    block
                    text-xs
                    uppercase
                    tracking-widest
                    mb-3
                  "
                >
                  URL Slug
                </label>


                <input
                  name="slug"
                  placeholder="gyuto-240mm"
                  value={form.slug}
                  onChange={handleChange}
                  required
                  className="
                    border
                    border-agane-text
                    p-4
                    bg-transparent
                    w-full
                    outline-none
                  "
                />


                <p
                  className="
                    text-xs
                    opacity-50
                    mt-2
                  "
                >
                  Automatically generated from the
                  knife name. You can edit it manually.
                </p>

              </div>


              {/* ORIGIN */}

              <input
                name="origin"
                placeholder="Origin"
                value={form.origin}
                onChange={handleChange}
                className="
                  border
                  border-agane-text
                  p-4
                  bg-transparent
                  w-full
                  outline-none
                "
              />


              {/* STEEL */}

              <input
                name="steel"
                placeholder="Steel"
                value={form.steel}
                onChange={handleChange}
                className="
                  border
                  border-agane-text
                  p-4
                  bg-transparent
                  w-full
                  outline-none
                "
              />


              {/* BLADE TYPE */}

              <input
                name="bladeType"
                placeholder="Blade Type"
                value={form.bladeType}
                onChange={handleChange}
                className="
                  border
                  border-agane-text
                  p-4
                  bg-transparent
                  w-full
                  outline-none
                "
              />


              {/* LENGTH */}

              <input
                name="length"
                placeholder="Blade Length"
                value={form.length}
                onChange={handleChange}
                className="
                  border
                  border-agane-text
                  p-4
                  bg-transparent
                  w-full
                  outline-none
                "
              />


              {/* HANDLE */}

              <input
                name="handle"
                placeholder="Handle Material"
                value={form.handle}
                onChange={handleChange}
                className="
                  border
                  border-agane-text
                  p-4
                  bg-transparent
                  w-full
                  outline-none
                "
              />


              {/* WEIGHT */}

              <input
                name="weight"
                type="number"
                placeholder="Weight (g)"
                value={form.weight}
                onChange={handleChange}
                className="
                  border
                  border-agane-text
                  p-4
                  bg-transparent
                  w-full
                  outline-none
                "
              />


              {/* PRICE */}

              <input
                name="price"
                type="number"
                min="0"
                step="1"
                placeholder="Price SEK"
                value={form.price}
                onChange={handleChange}
                required
                className="
                  border
                  border-agane-text
                  p-4
                  bg-transparent
                  w-full
                  outline-none
                "
              />

            </div>

          </section>


          {/* ==========================
              MAKER
          ========================== */}

          <section
            className="
              border
              border-agane-text
              p-6
              md:p-8
            "
          >

            <label
              className="
                block
                text-xs
                uppercase
                tracking-widest
                mb-3
              "
            >
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
                outline-none
              "
            >

              <option value="">
                Select Maker
              </option>


              {makers.map(
                maker => (

                  <option
                    key={maker.id}
                    value={maker.id}
                  >
                    {maker.name}
                  </option>

                )
              )}

            </select>

          </section>


          {/* ==========================
              STATUS
          ========================== */}

          <section
            className="
              border
              border-agane-text
              p-6
              md:p-8
            "
          >

            <label
              className="
                block
                text-xs
                uppercase
                tracking-widest
                mb-3
              "
            >
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
                outline-none
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


          {/* ==========================
              DESCRIPTION
          ========================== */}

          <section
            className="
              border
              border-agane-text
              p-6
              md:p-8
            "
          >

            <label
              className="
                block
                text-xs
                uppercase
                tracking-widest
                mb-3
              "
            >
              Description
            </label>


            <textarea
              name="description"
              placeholder="
                Knife story / description...
              "
              value={form.description}
              onChange={handleChange}
              className="
                border
                border-agane-text
                p-4
                bg-transparent
                w-full
                h-48
                outline-none
                resize-none
              "
            />

          </section>


          {/* ==========================
              IMAGES
          ========================== */}

          <section
            className="
              border
              border-agane-text
              p-6
              md:p-8
            "
          >

            <label
              className="
                block
                text-xs
                uppercase
                tracking-widest
                mb-4
              "
            >
              Knife Images
            </label>


            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImagesChange}
              className="
                block
                w-full
              "
            />


            {images &&
              images.length > 0 && (

                <p
                  className="
                    mt-4
                    text-sm
                    opacity-60
                  "
                >
                  {images.length} image
                  {images.length !== 1 ? "s" : ""}
                  {" "}selected
                </p>

              )}

          </section>


          {/* ==========================
              ERROR
          ========================== */}

          {error && (

            <div
              className="
                border
                border-red-500
                p-5
                text-red-600
              "
            >

              {error}

            </div>

          )}


          {/* ==========================
              ACTIONS
          ========================== */}

          <div
            className="
              flex
              flex-col
              sm:flex-row
              gap-4
            "
          >

            <button
              type="button"
              onClick={() => navigate("/admin")}
              disabled={loading}
              className="
                border
                border-black
                px-10
                py-4
                hover:bg-black
                hover:text-white
                transition
              "
            >
              Cancel
            </button>


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
                disabled:cursor-not-allowed
              "
            >

              {loading
                ? "Saving Knife..."
                : "Save Knife"
              }

            </button>

          </div>

        </form>

      </div>

    </main>

  );

}