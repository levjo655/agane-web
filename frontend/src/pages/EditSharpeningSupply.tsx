import {
  type FormEvent,
  useEffect,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";


type SharpeningSupply = {

  id: string;

  slug: string;

  title: string;

  category: string;

  price: number;

  stock: number;

  status: string;

  description?: string;

  images: string[];

};


export default function EditSharpeningSupply() {

  const {
    id
  } = useParams();

  const navigate =
    useNavigate();


  // ==================================================
  // STATE
  // ==================================================

  const [
    title,
    setTitle
  ] = useState("");

  const [
    category,
    setCategory
  ] = useState("stone");

  const [
    price,
    setPrice
  ] = useState("");

  const [
    stock,
    setStock
  ] = useState("1");

  const [
    description,
    setDescription
  ] = useState("");

  const [
    status,
    setStatus
  ] = useState("available");

  const [
    existingImages,
    setExistingImages
  ] = useState<string[]>([]);

  const [
    newImages,
    setNewImages
  ] = useState<File[]>([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    saving,
    setSaving
  ] = useState(false);

  const [
    error,
    setError
  ] = useState("");


  // ==================================================
  // LOAD PRODUCT
  // ==================================================

  useEffect(() => {

    async function loadSupply() {

      if (!id) {

        setError(
          "Product ID is missing."
        );

        setLoading(false);

        return;

      }


      try {

        setLoading(true);

        const response =
          await fetch(
            `http://localhost:8080/api/sharpening-supplies/${id}`
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.error ||
            "Failed loading product"
          );

        }


        const supply:
          SharpeningSupply =
          data;


        setTitle(
          supply.title
        );

        setCategory(
          supply.category
        );

        setPrice(
          String(
            supply.price ?? ""
          )
        );

        setStock(
          String(
            supply.stock ?? 0
          )
        );

        setDescription(
          supply.description || ""
        );

        setStatus(
          supply.status
        );

        setExistingImages(
          supply.images || []
        );


      } catch (error) {

        console.error(
          "LOAD SHARPENING SUPPLY ERROR:",
          error
        );


        setError(

          error instanceof Error
            ? error.message
            : "Failed loading product"

        );

      } finally {

        setLoading(false);

      }

    }


    loadSupply();

  }, [id]);


  // ==================================================
  // IMAGE HANDLING
  // ==================================================

  function handleImages(
    event: React.ChangeEvent<HTMLInputElement>
  ) {

    if (!event.target.files) {

      return;

    }


    setNewImages(
      Array.from(
        event.target.files
      )
    );

  }


  function removeExistingImage(
    image: string
  ) {

    setExistingImages(
      current =>
        current.filter(
          item =>
            item !== image
        )
    );

  }


  // ==================================================
  // SAVE
  // ==================================================

  async function handleSubmit(
    event: FormEvent
  ) {

    event.preventDefault();

    setError("");


    if (!id) {

      setError(
        "Product ID is missing."
      );

      return;

    }


    if (!title.trim()) {

      setError(
        "Product name is required."
      );

      return;

    }


    const numericPrice =
      Number(price);

    if (
      isNaN(numericPrice) ||
      numericPrice < 0
    ) {

      setError(
        "Please enter a valid price."
      );

      return;

    }


    const numericStock =
      Number(stock);

    if (
      isNaN(numericStock) ||
      numericStock < 0 ||
      !Number.isInteger(numericStock)
    ) {

      setError(
        "Stock must be a whole number of 0 or greater."
      );

      return;

    }


    try {

      setSaving(true);


      const formData =
        new FormData();


      // ------------------------------------------
      // BASIC INFORMATION
      // ------------------------------------------

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
        String(numericPrice)
      );


      formData.append(
        "stock",
        String(numericStock)
      );


      formData.append(
        "description",
        description.trim()
      );


      formData.append(
        "status",
        numericStock > 0
          ? status
          : "sold-out"
      );


      formData.append(
        "existingImages",
        JSON.stringify(
          existingImages
        )
      );


      // ------------------------------------------
      // NEW IMAGES
      // ------------------------------------------

      newImages.forEach(
        image => {

          formData.append(
            "images",
            image
          );

        }
      );


      // ------------------------------------------
      // SEND
      // ------------------------------------------

      const response =
        await fetch(
          `http://localhost:8080/api/sharpening-supplies/${id}`,
          {
            method: "PUT",
            body: formData
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.error ||
          "Failed updating product"
        );

      }


      console.log(
        "SHARPENING SUPPLY UPDATED:",
        data
      );


      navigate(
        "/admin"
      );


    } catch (error) {

      console.error(
        "UPDATE SHARPENING SUPPLY ERROR:",
        error
      );


      setError(

        error instanceof Error
          ? error.message
          : "Failed updating product"

      );

    } finally {

      setSaving(false);

    }

  }


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {

    return (

      <main className="
        min-h-screen
        bg-agane-bg
        text-agane-text
        flex
        items-center
        justify-center
      ">

        <div className="text-center">

          <p className="
            text-xs
            uppercase
            tracking-[0.35em]
            opacity-50
          ">

            Ågane Workshop

          </p>

          <p className="mt-4">

            Loading product...

          </p>

        </div>

      </main>

    );

  }


  // ==================================================
  // ERROR
  // ==================================================

  if (error && !title) {

    return (

      <main className="
        min-h-screen
        bg-agane-bg
        text-agane-text
        flex
        items-center
        justify-center
        px-6
      ">

        <div className="text-center">

          <p className="
            text-red-600
            mb-6
          ">

            {error}

          </p>


          <button
            type="button"
            onClick={() =>
              navigate("/admin")
            }
            className="
              border
              px-8
              py-3
              uppercase
              tracking-[0.2em]
              text-sm
            "
          >

            ← Back to Admin

          </button>

        </div>

      </main>

    );

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


        {/* HEADER */}

        <header className="mb-12">

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

            Edit Sharpening Supply

          </h1>


          <p className="
            mt-4
            opacity-60
          ">

            Update product information,
            pricing, stock, availability and images.

          </p>

        </header>


        {/* ERROR */}

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


        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="
            bg-white
            border
            p-8
            md:p-12
          "
        >


          {/* TITLE */}

          <div className="mb-8">

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


          {/* CATEGORY */}

          <div className="mb-8">

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


          {/* PRICE */}

          <div className="mb-8">

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
              STOCK
          ================================================== */}

          <div className="mb-8">

            <label className="
              block
              text-xs
              uppercase
              tracking-[0.25em]
              opacity-60
              mb-3
            ">

              Stock / Quantity

            </label>


            <input
              type="number"
              min="0"
              step="1"
              value={stock}
              onChange={event =>
                setStock(
                  event.target.value
                )
              }
              className="
                w-full
                border
                px-4
                py-4
                outline-none
                focus:border-black
              "
            />


            <p className="
              mt-2
              text-sm
              opacity-50
            ">

              Number of units currently available.

            </p>

          </div>


          {/* STATUS */}

          <div className="mb-8">

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


          {/* DESCRIPTION */}

          <div className="mb-8">

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
              rows={8}
              className="
                w-full
                border
                px-4
                py-4
                outline-none
                resize-y
              "
            />

          </div>


          {/* EXISTING IMAGES */}

          {existingImages.length > 0 && (

            <div className="mb-10">

              <label className="
                block
                text-xs
                uppercase
                tracking-[0.25em]
                opacity-60
                mb-3
              ">

                Current Images

              </label>


              <div className="
                grid
                grid-cols-2
                md:grid-cols-4
                gap-4
              ">

                {existingImages.map(
                  (
                    image,
                    index
                  ) => (

                    <div
                      key={`${image}-${index}`}
                      className="
                        relative
                        border
                        overflow-hidden
                      "
                    >

                      <img
                        src={
                          `http://localhost:8080${image}`
                        }
                        alt={`${title} ${index + 1}`}
                        className="
                          w-full
                          h-40
                          object-cover
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
                          top-2
                          right-2
                          bg-black
                          text-white
                          px-3
                          py-1
                          text-xs
                        "
                      >

                        Remove

                      </button>

                    </div>

                  )
                )}

              </div>

            </div>

          )}


          {/* NEW IMAGES */}

          <div className="mb-10">

            <label className="
              block
              text-xs
              uppercase
              tracking-[0.25em]
              opacity-60
              mb-3
            ">

              Add New Images

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


            {newImages.length > 0 && (

              <p className="
                mt-3
                text-sm
                opacity-60
              ">

                {newImages.length}{" "}
                {newImages.length === 1
                  ? "image"
                  : "images"}{" "}
                selected

              </p>

            )}

          </div>


          {/* ACTIONS */}

          <div className="
            flex
            flex-col
            sm:flex-row
            gap-4
          ">

            <button
              type="submit"
              disabled={saving}
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

              {saving
                ? "Saving..."
                : "Save Changes"
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