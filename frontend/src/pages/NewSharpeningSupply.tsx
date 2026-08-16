
import {
  type FormEvent,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";


export default function NewSharpeningSupply() {

  const navigate =
    useNavigate();


  // ==================================================
  // STATE
  // ==================================================

  const [title, setTitle] =
    useState("");

  const [category, setCategory] =
    useState("stone");

  const [price, setPrice] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [status, setStatus] =
    useState("available");

  const [images, setImages] =
    useState<File[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // ==================================================
  // IMAGE HANDLING
  // ==================================================

  function handleImages(
    event: React.ChangeEvent<HTMLInputElement>
  ) {

    if (!event.target.files) {

      return;

    }


    setImages(
      Array.from(
        event.target.files
      )
    );

  }


  // ==================================================
  // SUBMIT
  // ==================================================

  async function handleSubmit(
    event: FormEvent
  ) {

    event.preventDefault();

    setError("");


    if (!title.trim()) {

      setError(
        "Product name is required."
      );

      return;

    }


    if (!category) {

      setError(
        "Category is required."
      );

      return;

    }


    try {

      setLoading(true);


      const formData =
        new FormData();


      formData.append(
        "title",
        title.trim()
      );


      formData.append(
        "category",
        category
      );


      formData.append(
        "price",
        price || "0"
      );


      formData.append(
        "description",
        description.trim()
      );


      formData.append(
        "status",
        status
      );


      images.forEach(
        image => {

          formData.append(
            "images",
            image
          );

        }
      );


      const response =
        await fetch(
          "http://localhost:8080/api/sharpening-supplies",
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
          "Failed creating sharpening supply"
        );

      }


      navigate(
        "/admin"
      );


    } catch (error) {

      console.error(
        "CREATE SHARPENING SUPPLY ERROR:",
        error
      );


      setError(

        error instanceof Error
          ? error.message
          : "Failed creating sharpening supply"

      );

    } finally {

      setLoading(false);

    }

  }


  // ==================================================
  // PAGE
  // ==================================================

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


        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="
          mb-12
        ">

          <button
            type="button"
            onClick={() =>
              navigate("/admin")
            }
            className="
              text-sm
              opacity-60
              hover:opacity-100
              transition
              mb-8
            "
          >

            ← Back to Admin

          </button>


          <p className="
            text-xs
            uppercase
            tracking-[0.35em]
            opacity-50
          ">

            Ågane Workshop

          </p>


          <h1 className="
            text-5xl
            font-serif
            mt-4
          ">

            Add Sharpening Supply

          </h1>


          <p className="
            mt-4
            opacity-60
          ">

            Add stones, rods, strops and other
            sharpening equipment to the shop.

          </p>

        </header>


        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (

          <div className="
            border
            border-red-600
            text-red-600
            p-5
            mb-8
          ">

            {error}

          </div>

        )}


        {/* ==================================================
            FORM
        ================================================== */}

        <form
          onSubmit={handleSubmit}
          className="
            bg-white
            border
            p-8
            md:p-12
          "
        >


          {/* ==================================================
              TITLE
          ================================================== */}

          <div className="
            mb-8
          ">

            <label className="
              block
              text-xs
              uppercase
              tracking-[0.25em]
              opacity-60
              mb-3
            ">

              Product Name

            </label>


            <input
              type="text"
              value={title}
              onChange={event =>
                setTitle(
                  event.target.value
                )
              }
              placeholder="Diamond Stone"
              className="
                w-full
                border
                px-4
                py-4
                outline-none
                focus:border-black
              "
            />

          </div>


          {/* ==================================================
              CATEGORY
          ================================================== */}

          <div className="
            mb-8
          ">

            <label className="
              block
              text-xs
              uppercase
              tracking-[0.25em]
              opacity-60
              mb-3
            ">

              Category

            </label>


            <select
              value={category}
              onChange={event =>
                setCategory(
                  event.target.value
                )
              }
              className="
                w-full
                border
                px-4
                py-4
                bg-white
                outline-none
                focus:border-black
              "
            >

              <option value="stone">
                Sharpening Stone
              </option>

              <option value="sharpening-rod">
                Sharpening Rod
              </option>

              <option value="strop">
                Strop
              </option>

              <option value="compound">
                Polishing Compound
              </option>

              <option value="flattening">
                Flattening / Maintenance
              </option>

              <option value="accessory">
                Sharpening Accessory
              </option>

              <option value="other">
                Other
              </option>

            </select>

          </div>


          {/* ==================================================
              PRICE
          ================================================== */}

          <div className="
            mb-8
          ">

            <label className="
              block
              text-xs
              uppercase
              tracking-[0.25em]
              opacity-60
              mb-3
            ">

              Price — SEK

            </label>


            <input
              type="number"
              min="0"
              value={price}
              onChange={event =>
                setPrice(
                  event.target.value
                )
              }
              placeholder="1995"
              className="
                w-full
                border
                px-4
                py-4
                outline-none
                focus:border-black
              "
            />

          </div>


          {/* ==================================================
              STATUS
          ================================================== */}

          <div className="
            mb-8
          ">

            <label className="
              block
              text-xs
              uppercase
              tracking-[0.25em]
              opacity-60
              mb-3
            ">

              Status

            </label>


            <select
              value={status}
              onChange={event =>
                setStatus(
                  event.target.value
                )
              }
              className="
                w-full
                border
                px-4
                py-4
                bg-white
                outline-none
                focus:border-black
              "
            >

              <option value="available">
                Available
              </option>

              <option value="coming-soon">
                Coming Soon
              </option>

              <option value="sold-out">
                Sold Out
              </option>

              <option value="hidden">
                Hidden
              </option>

            </select>

          </div>


          {/* ==================================================
              DESCRIPTION
          ================================================== */}

          <div className="
            mb-8
          ">

            <label className="
              block
              text-xs
              uppercase
              tracking-[0.25em]
              opacity-60
              mb-3
            ">

              Description

            </label>


            <textarea
              value={description}
              onChange={event =>
                setDescription(
                  event.target.value
                )
              }
              rows={7}
              placeholder="
Describe the product, intended use,
dimensions, grit, manufacturer, etc.
              "
              className="
                w-full
                border
                px-4
                py-4
                outline-none
                resize-y
                focus:border-black
              "
            />

          </div>


          {/* ==================================================
              IMAGES
          ================================================== */}

          <div className="
            mb-10
          ">

            <label className="
              block
              text-xs
              uppercase
              tracking-[0.25em]
              opacity-60
              mb-3
            ">

              Product Images

            </label>


            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImages}
              className="
                w-full
                border
                p-4
                bg-white
              "
            />


            {images.length > 0 && (

              <p className="
                mt-3
                text-sm
                opacity-60
              ">

                {images.length}{" "}
                {images.length === 1
                  ? "image"
                  : "images"}{" "}
                selected

              </p>

            )}

          </div>


          {/* ==================================================
              ACTIONS
          ================================================== */}

          <div className="
            flex
            flex-col
            sm:flex-row
            gap-4
          ">

            <button
              type="submit"
              disabled={loading}
              className="
                flex-1
                bg-black
                text-white
                py-4
                uppercase
                tracking-[0.2em]
                text-sm
                hover:opacity-80
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >

              {loading
                ? "Creating..."
                : "Create Supply"
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
                uppercase
                tracking-[0.2em]
                text-sm
                hover:bg-black
                hover:text-white
                transition
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

