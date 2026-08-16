import {
  useEffect,
  useState
} from "react";

import {
  useAuth0
} from "@auth0/auth0-react";

import {
  useNavigate
} from "react-router-dom";


// ==========================
// TYPES
// ==========================

type Maker = {
  id: string;
  name: string;
  slug: string;
  country?: string;
  bio?: string;
  image?: string | null;
};


type Knife = {
  id: string;
  title: string;
  slug?: string;
  price: number;
  status: string;
  images: string[];
  maker?: Maker;
};


type Collaboration = {
  id: string;
  title: string;
  quantity: number;
  status: string;
  description?: string;
  image?: string | null;
  releaseDate?: string | null;
  maker?: Maker;
};


type SharpeningSupply = {
  id: string;
  title: string;
  slug: string;
  category: string;
  description?: string | null;
  price: number;
  stock: number;
  images: string[];
  status: string;
  createdAt: string;
};


type Order = {
  id: string;

  knifeId?: string | null;

  sharpeningSupplyId?: string | null;

  stripeSessionId: string;

  customerEmail?: string | null;

  customerName?: string | null;

  amount: number;

  currency: string;

  status: string;

  createdAt: string;

  knife?: Knife;

  sharpeningSupply?: SharpeningSupply;
};


// ==========================
// ADMIN
// ==========================

export default function Admin() {

  const navigate = useNavigate();

  const {
    user,
    logout
  } = useAuth0();


  // ==========================
  // STATE
  // ==========================

  const [loading, setLoading] =
    useState(true);


  const [makers, setMakers] =
    useState<Maker[]>([]);


  const [knives, setKnives] =
    useState<Knife[]>([]);


  const [collaborations, setCollaborations] =
    useState<Collaboration[]>([]);


  const [sharpeningSupplies, setSharpeningSupplies] =
    useState<SharpeningSupply[]>([]);


  const [orders, setOrders] =
    useState<Order[]>([]);


  // ==========================
  // LOAD DATA
  // ==========================

  async function loadData() {

    try {

      // ==========================
      // MAKERS
      // ==========================

      const makersResponse =
        await fetch(
          "http://localhost:8080/api/makers"
        );


      const makersData =
        await makersResponse.json();


      if (Array.isArray(makersData)) {

        setMakers(
          makersData
        );

      }


      // ==========================
      // KNIVES
      // ==========================

      const knivesResponse =
        await fetch(
          "http://localhost:8080/api/knives"
        );


      const knivesData =
        await knivesResponse.json();


      if (Array.isArray(knivesData)) {

        setKnives(
          knivesData
        );

      }


      // ==========================
      // COLLABORATIONS
      // ==========================

      const collabResponse =
        await fetch(
          "http://localhost:8080/api/collaborations"
        );


      const collabData =
        await collabResponse.json();


      if (Array.isArray(collabData)) {

        setCollaborations(
          collabData
        );

      }


      // ==========================
      // SHARPENING SUPPLIES
      // ==========================

      const suppliesResponse =
        await fetch(
          "http://localhost:8080/api/sharpening-supplies"
        );


      const suppliesData =
        await suppliesResponse.json();


      if (Array.isArray(suppliesData)) {

        setSharpeningSupplies(
          suppliesData
        );

      }


      // ==========================
      // ORDERS
      // ==========================

      const ordersResponse =
        await fetch(
          "http://localhost:8080/api/stripe/orders"
        );


      const ordersData =
        await ordersResponse.json();


      if (Array.isArray(ordersData)) {

        setOrders(
          ordersData
        );

      }


    } catch (error) {

      console.error(
        "ADMIN LOAD ERROR",
        error
      );

    } finally {

      setLoading(false);

    }

  }


  useEffect(() => {

    loadData();

  }, []);


  // ==========================
  // DELETE MAKER
  // ==========================

  async function deleteMaker(
    id: string
  ) {

    if (
      !confirm(
        "Delete this maker?"
      )
    ) {

      return;

    }


    try {

      const response =
        await fetch(

          `http://localhost:8080/api/makers/${id}`,

          {
            method: "DELETE"
          }

        );


      if (!response.ok) {

        let message =
          "Failed deleting maker";


        try {

          const data =
            await response.json();


          if (data.error) {

            message =
              data.error;

          }

        } catch {

          // Ignore JSON parsing error

        }


        throw new Error(
          message
        );

      }


      setMakers(
        prev =>
          prev.filter(
            maker =>
              maker.id !== id
          )
      );


    } catch (error) {

      console.error(
        "DELETE MAKER ERROR",
        error
      );


      alert(
        "Failed deleting maker. The maker may still have knives or collaborations attached."
      );

    }

  }


  // ==========================
  // DELETE KNIFE
  // ==========================

  async function deleteKnife(
    id: string
  ) {

    if (
      !confirm(
        "Delete this knife?"
      )
    ) {

      return;

    }


    try {

      const response =
        await fetch(

          `http://localhost:8080/api/knives/${id}`,

          {
            method: "DELETE"
          }

        );


      if (!response.ok) {

        throw new Error(
          "Failed deleting knife"
        );

      }


      setKnives(
        prev =>
          prev.filter(
            knife =>
              knife.id !== id
          )
      );


    } catch (error) {

      console.error(
        "DELETE KNIFE ERROR",
        error
      );


      alert(
        "Failed deleting knife"
      );

    }

  }


  // ==========================
  // DELETE COLLABORATION
  // ==========================

  async function deleteCollaboration(
    id: string
  ) {

    if (
      !confirm(
        "Delete this collaboration?"
      )
    ) {

      return;

    }


    try {

      const response =
        await fetch(

          `http://localhost:8080/api/collaborations/${id}`,

          {
            method: "DELETE"
          }

        );


      if (!response.ok) {

        throw new Error(
          "Failed deleting collaboration"
        );

      }


      setCollaborations(
        prev =>
          prev.filter(
            item =>
              item.id !== id
          )
      );


    } catch (error) {

      console.error(
        "DELETE COLLABORATION ERROR",
        error
      );


      alert(
        "Failed deleting collaboration"
      );

    }

  }


  // ==========================
  // DELETE SHARPENING SUPPLY
  // ==========================

  async function deleteSharpeningSupply(
    id: string
  ) {

    if (
      !confirm(
        "Delete this sharpening supply?"
      )
    ) {

      return;

    }


    try {

      const response =
        await fetch(

          `http://localhost:8080/api/sharpening-supplies/${id}`,

          {
            method: "DELETE"
          }

        );


      if (!response.ok) {

        let message =
          "Failed deleting sharpening supply";


        try {

          const data =
            await response.json();


          if (data.error) {

            message =
              data.error;

          }

        } catch {

          // Ignore JSON parsing error

        }


        throw new Error(
          message
        );

      }


      setSharpeningSupplies(
        prev =>
          prev.filter(
            supply =>
              supply.id !== id
          )
      );


    } catch (error) {

      console.error(
        "DELETE SHARPENING SUPPLY ERROR",
        error
      );


      alert(
        "Failed deleting sharpening supply"
      );

    }

  }


  // ==========================
  // DELETE ORDER
  // ==========================

  async function deleteOrder(
    id: string
  ) {

    if (
      !confirm(
        "Delete this order?\n\nThis only removes the order from Ågane. It does NOT refund the Stripe payment."
      )
    ) {

      return;

    }


    try {

      const response =
        await fetch(

          `http://localhost:8080/api/stripe/orders/${id}`,

          {
            method: "DELETE"
          }

        );


      if (!response.ok) {

        let message =
          "Failed deleting order";


        try {

          const data =
            await response.json();


          if (data.error) {

            message =
              data.error;

          }

        } catch {

          // Ignore JSON parsing error

        }


        throw new Error(
          message
        );

      }


      setOrders(
        prev =>
          prev.filter(
            order =>
              order.id !== id
          )
      );


    } catch (error) {

      console.error(
        "DELETE ORDER ERROR",
        error
      );


      alert(

        error instanceof Error
          ? error.message
          : "Failed deleting order"

      );

    }

  }


  // ==========================
  // FORMAT ORDER DATE
  // ==========================

  function formatDate(
    date: string
  ) {

    return new Date(
      date
    ).toLocaleString(
      "en-SE",
      {
        dateStyle: "medium",
        timeStyle: "short"
      }
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
        max-w-7xl
        mx-auto
      ">


        {/* ==========================
            HEADER
        ========================== */}

        <header className="
          flex
          justify-between
          items-center
          mb-16
        ">

          <div>

            <h1 className="
              text-5xl
              font-serif
            ">

              Ågane Workshop

            </h1>


            <p className="
              mt-3
              opacity-70
            ">

              Welcome{" "}
              {user?.name}

            </p>

          </div>


          <button
            onClick={() =>
              logout()
            }
            className="
              border
              px-6
              py-3
              hover:bg-black
              hover:text-white
              transition
            "
          >

            Logout

          </button>

        </header>


        {/* ==========================
            LOADING
        ========================== */}

        {loading && (

          <p className="
            mb-12
          ">

            Loading...

          </p>

        )}


        {/* ==================================================
            ORDERS
        ================================================== */}

        <section className="
          mb-32
        ">

          <div className="
            flex
            justify-between
            items-center
            mb-10
          ">

            <div>

              <h2 className="
                text-4xl
                font-serif
              ">

                Orders

              </h2>


              <p className="
                mt-2
                opacity-60
              ">

                {orders.length}{" "}
                {orders.length === 1
                  ? "order"
                  : "orders"}

              </p>

            </div>

          </div>


          {orders.length === 0 ? (

            <div className="
              border
              p-10
              bg-white
            ">

              <p className="
                opacity-60
              ">

                No orders yet.

              </p>

            </div>

          ) : (

            <div className="
              space-y-6
            ">

              {orders.map(
                order => {

                  const isKnife =
                    !!order.knife;


                  const isSupply =
                    !!order.sharpeningSupply;


                  const title =
                    order.knife?.title ||
                    order.sharpeningSupply?.title ||
                    "Unknown product";


                  const image =
                    order.knife?.images?.[0] ||
                    order.sharpeningSupply?.images?.[0];


                  const productType =
                    isKnife
                      ? "Knife"
                      : isSupply
                        ? "Sharpening Supply"
                        : "Unknown";


                  return (

                    <article
                      key={order.id}
                      className="
                        bg-white
                        border
                        p-8
                      "
                    >

                      <div className="
                        grid
                        md:grid-cols-[180px_1fr_auto]
                        gap-8
                        items-center
                      ">


                        {/* IMAGE */}

                        <div>

                          {image ? (

                            <img
                              src={
                                `http://localhost:8080${image}`
                              }
                              alt={title}
                              className="
                                w-full
                                h-36
                                object-cover
                              "
                            />

                          ) : (

                            <div className="
                              w-full
                              h-36
                              bg-agane-bg
                              flex
                              items-center
                              justify-center
                              opacity-50
                            ">

                              No image

                            </div>

                          )}

                        </div>


                        {/* ORDER INFORMATION */}

                        <div>

                          <p className="
                            text-xs
                            uppercase
                            tracking-widest
                            opacity-50
                          ">

                            {productType}

                          </p>


                          <h3 className="
                            text-2xl
                            font-serif
                            mt-1
                          ">

                            {title}

                          </h3>


                          {isKnife && (

                            <p className="
                              mt-2
                              opacity-70
                            ">

                              Maker:{" "}

                              {order.knife?.maker?.name ||
                                "Unknown"}

                            </p>

                          )}


                          {isSupply && (

                            <p className="
                              mt-2
                              opacity-70
                            ">

                              Category:{" "}

                              {order.sharpeningSupply?.category ||
                                "Unknown"}

                            </p>

                          )}


                          <div className="
                            mt-4
                            space-y-1
                            text-sm
                          ">

                            <p>

                              Customer:{" "}

                              <strong>

                                {order.customerName ||
                                  "No name"}

                              </strong>

                            </p>


                            <p>

                              Email:{" "}

                              {order.customerEmail ||
                                "No email"}

                            </p>


                            <p>

                              Date:{" "}

                              {formatDate(
                                order.createdAt
                              )}

                            </p>

                          </div>

                        </div>


                        {/* PRICE / STATUS */}

                        <div className="
                          md:text-right
                        ">

                          <p className="
                            text-3xl
                            font-serif
                          ">

                            {(order.amount / 100)
                              .toLocaleString(
                                "sv-SE"
                              )}{" "}

                            {order.currency.toUpperCase()}

                          </p>


                          <p className="
                            mt-3
                            inline-block
                            border
                            px-4
                            py-2
                            text-xs
                            uppercase
                            tracking-widest
                          ">

                            {order.status}

                          </p>


                          <p className="
                            mt-3
                            text-xs
                            opacity-40
                            break-all
                          ">

                            {order.id}

                          </p>


                          {/* DELETE ORDER */}

                          <button
                            type="button"
                            onClick={() =>
                              deleteOrder(
                                order.id
                              )
                            }
                            className="
                              mt-5
                              border
                              border-red-600
                              text-red-600
                              px-4
                              py-2
                              text-xs
                              uppercase
                              tracking-widest
                              hover:bg-red-600
                              hover:text-white
                              transition
                            "
                          >

                            Delete Order

                          </button>

                        </div>

                      </div>


                      {/* STRIPE SESSION */}

                      <div className="
                        mt-6
                        pt-6
                        border-t
                        text-xs
                        opacity-40
                        break-all
                      ">

                        Stripe Session:{" "}
                        {order.stripeSessionId}

                      </div>

                    </article>

                  );

                }
              )}

            </div>

          )}

        </section>


        {/* ==================================================
            MAKERS
        ================================================== */}

        <section>

          <div className="
            flex
            justify-between
            items-center
            mb-10
          ">

            <h2 className="
              text-4xl
              font-serif
            ">

              Makers

            </h2>


            <button
              onClick={() =>
                navigate(
                  "/admin/maker/new"
                )
              }
              className="
                border
                px-6
                py-3
                hover:bg-black
                hover:text-white
                transition
              "
            >

              + Add Maker

            </button>

          </div>


          {makers.length === 0 ? (

            <p className="
              opacity-60
            ">

              No makers yet.

            </p>

          ) : (

            <div className="
              grid
              md:grid-cols-3
              gap-10
            ">

              {makers.map(
                maker => (

                  <article
                    key={maker.id}
                    className="
                      bg-white
                      border
                      p-8
                    "
                  >

                    {maker.image ? (

                      <img
                        src={
                          `http://localhost:8080${maker.image}`
                        }
                        alt={
                          maker.name
                        }
                        className="
                          h-56
                          w-full
                          object-cover
                          mb-6
                        "
                      />

                    ) : (

                      <div className="
                        h-56
                        w-full
                        bg-agane-bg
                        flex
                        items-center
                        justify-center
                        mb-6
                        opacity-50
                      ">

                        No image

                      </div>

                    )}


                    <h3 className="
                      text-3xl
                      font-serif
                    ">

                      {maker.name}

                    </h3>


                    {maker.country && (

                      <p className="
                        mt-3
                        opacity-60
                      ">

                        {maker.country}

                      </p>

                    )}


                    {maker.bio && (

                      <p className="
                        mt-4
                        opacity-70
                      ">

                        {maker.bio}

                      </p>

                    )}


                    <div className="
                      mt-6
                      flex
                      gap-3
                    ">

                      <button
                        onClick={() =>
                          navigate(
                            `/admin/maker/${maker.id}/edit`
                          )
                        }
                        className="
                          border
                          px-4
                          py-2
                          hover:bg-black
                          hover:text-white
                          transition
                        "
                      >

                        Edit

                      </button>


                      <button
                        onClick={() =>
                          deleteMaker(
                            maker.id
                          )
                        }
                        className="
                          border
                          border-red-600
                          text-red-600
                          px-4
                          py-2
                          hover:bg-red-600
                          hover:text-white
                          transition
                        "
                      >

                        Delete

                      </button>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </section>


        {/* ==================================================
            KNIVES
        ================================================== */}

        <section className="
          mt-32
        ">

          <div className="
            flex
            justify-between
            items-center
            mb-10
          ">

            <h2 className="
              text-4xl
              font-serif
            ">

              Knives

            </h2>


            <button
              onClick={() =>
                navigate(
                  "/admin/new"
                )
              }
              className="
                border
                px-6
                py-3
                hover:bg-black
                hover:text-white
                transition
              "
            >

              + Add Knife

            </button>

          </div>


          {knives.length === 0 ? (

            <p className="
              opacity-60
            ">

              No knives yet.

            </p>

          ) : (

            <div className="
              grid
              md:grid-cols-3
              gap-10
            ">

              {knives.map(
                knife => (

                  <article
                    key={knife.id}
                    className="
                      bg-white
                      border
                      p-6
                    "
                  >

                    {knife.images?.[0] && (

                      <img
                        src={
                          `http://localhost:8080${knife.images[0]}`
                        }
                        alt={
                          knife.title
                        }
                        className="
                          h-64
                          w-full
                          object-cover
                        "
                      />

                    )}


                    <h3 className="
                      text-2xl
                      font-serif
                      mt-5
                    ">

                      {knife.title}

                    </h3>


                    <p className="
                      mt-2
                    ">

                      Maker:{" "}

                      {knife.maker?.name ||
                        "Unknown"}

                    </p>


                    <p className="
                      mt-1
                    ">

                      {knife.price} SEK

                    </p>


                    <p className="
                      mt-1
                      opacity-60
                      capitalize
                    ">

                      {knife.status}

                    </p>


                    <div className="
                      mt-5
                      flex
                      gap-3
                    ">

                      <button
                        onClick={() =>
                          navigate(
                            `/admin/knife/${knife.id}/edit`
                          )
                        }
                        className="
                          border
                          px-4
                          py-2
                          hover:bg-black
                          hover:text-white
                          transition
                        "
                      >

                        Edit

                      </button>


                      <button
                        onClick={() =>
                          deleteKnife(
                            knife.id
                          )
                        }
                        className="
                          border
                          border-red-600
                          text-red-600
                          px-4
                          py-2
                          hover:bg-red-600
                          hover:text-white
                          transition
                        "
                      >

                        Delete

                      </button>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </section>


        {/* ==================================================
            COLLABORATIONS
        ================================================== */}

        <section className="
          mt-32
        ">

          <div className="
            flex
            justify-between
            items-center
            mb-10
          ">

            <h2 className="
              text-4xl
              font-serif
            ">

              Collaborations

            </h2>


            <button
              onClick={() =>
                navigate(
                  "/admin/collaboration/new"
                )
              }
              className="
                border
                px-6
                py-3
                hover:bg-black
                hover:text-white
                transition
              "
            >

              + Add Collaboration

            </button>

          </div>


          {collaborations.length === 0 ? (

            <p className="
              opacity-60
            ">

              No collaborations yet.

            </p>

          ) : (

            <div className="
              grid
              md:grid-cols-2
              gap-10
            ">

              {collaborations.map(
                collab => (

                  <article
                    key={collab.id}
                    className="
                      bg-white
                      border
                      p-8
                    "
                  >

                    {collab.image && (

                      <img
                        src={
                          `http://localhost:8080${collab.image}`
                        }
                        alt={
                          collab.title
                        }
                        className="
                          h-72
                          w-full
                          object-cover
                          mb-6
                        "
                      />

                    )}


                    <h3 className="
                      text-3xl
                      font-serif
                    ">

                      {collab.title}

                    </h3>


                    <p className="
                      mt-3
                    ">

                      Maker:{" "}

                      {collab.maker?.name ||
                        "Unknown"}

                    </p>


                    <p className="
                      mt-2
                    ">

                      {collab.quantity}{" "}
                      pieces

                    </p>


                    <p className="
                      mt-2
                      opacity-60
                      capitalize
                    ">

                      {collab.status}

                    </p>


                    {collab.releaseDate && (

                      <p className="
                        mt-2
                        opacity-60
                      ">

                        Release:{" "}

                        {new Date(
                          collab.releaseDate
                        ).toLocaleDateString()}

                      </p>

                    )}


                    <div className="
                      mt-6
                      flex
                      gap-3
                    ">

                      <button
                        onClick={() =>
                          navigate(
                            `/admin/collaboration/${collab.id}/edit`
                          )
                        }
                        className="
                          border
                          px-4
                          py-2
                          hover:bg-black
                          hover:text-white
                          transition
                        "
                      >

                        Edit

                      </button>


                      <button
                        onClick={() =>
                          deleteCollaboration(
                            collab.id
                          )
                        }
                        className="
                          border
                          border-red-600
                          text-red-600
                          px-4
                          py-2
                          hover:bg-red-600
                          hover:text-white
                          transition
                        "
                      >

                        Delete

                      </button>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </section>


        {/* ==================================================
            SHARPENING SUPPLIES
        ================================================== */}

        <section className="
          mt-32
        ">

          <div className="
            flex
            justify-between
            items-center
            mb-10
          ">

            <div>

              <p className="
                text-xs
                uppercase
                tracking-[0.3em]
                opacity-50
                mb-3
              ">

                Shop

              </p>


              <h2 className="
                text-4xl
                font-serif
              ">

                Sharpening Supplies

              </h2>

            </div>


            <button
              onClick={() =>
                navigate(
                  "/admin/sharpening-supply/new"
                )
              }
              className="
                border
                px-6
                py-3
                hover:bg-black
                hover:text-white
                transition
              "
            >

              + Add Sharpening Supply

            </button>

          </div>


          {sharpeningSupplies.length === 0 ? (

            <div className="
              border
              p-10
              bg-white
            ">

              <p className="
                opacity-60
              ">

                No sharpening supplies yet.

              </p>

            </div>

          ) : (

            <div className="
              grid
              md:grid-cols-3
              gap-10
            ">

              {sharpeningSupplies.map(
                supply => (

                  <article
                    key={supply.id}
                    className="
                      bg-white
                      border
                      p-6
                    "
                  >

                    {/* IMAGE */}

                    {supply.images?.[0] ? (

                      <img
                        src={
                          `http://localhost:8080${supply.images[0]}`
                        }
                        alt={
                          supply.title
                        }
                        className="
                          h-64
                          w-full
                          object-cover
                        "
                      />

                    ) : (

                      <div className="
                        h-64
                        w-full
                        bg-agane-bg
                        flex
                        items-center
                        justify-center
                        opacity-50
                      ">

                        No image

                      </div>

                    )}


                    {/* CATEGORY */}

                    <p className="
                      mt-5
                      text-xs
                      uppercase
                      tracking-[0.25em]
                      opacity-50
                    ">

                      {supply.category}

                    </p>


                    {/* TITLE */}

                    <h3 className="
                      text-2xl
                      font-serif
                      mt-2
                    ">

                      {supply.title}

                    </h3>


                    {/* PRICE */}

                    <p className="
                      mt-3
                    ">

                      {supply.price.toLocaleString(
                        "sv-SE"
                      )}{" "}
                      SEK

                    </p>


                    {/* STOCK */}

                    <p className="
                      mt-2
                    ">

                      Stock:{" "}

                      <strong>

                        {supply.stock}

                      </strong>

                    </p>


                    {/* STATUS */}

                    <p className="
                      mt-1
                      opacity-60
                      capitalize
                    ">

                      {supply.status}

                    </p>


                    {/* DESCRIPTION */}

                    {supply.description && (

                      <p className="
                        mt-4
                        text-sm
                        opacity-60
                        line-clamp-3
                      ">

                        {supply.description}

                      </p>

                    )}


                    {/* ACTIONS */}

                    <div className="
                      mt-6
                      flex
                      gap-3
                    ">

                      <button
                        onClick={() =>
                          navigate(
                            `/admin/sharpening-supply/${supply.id}/edit`
                          )
                        }
                        className="
                          border
                          px-4
                          py-2
                          hover:bg-black
                          hover:text-white
                          transition
                        "
                      >

                        Edit

                      </button>


                      <button
                        onClick={() =>
                          deleteSharpeningSupply(
                            supply.id
                          )
                        }
                        className="
                          border
                          border-red-600
                          text-red-600
                          px-4
                          py-2
                          hover:bg-red-600
                          hover:text-white
                          transition
                        "
                      >

                        Delete

                      </button>

                    </div>

                  </article>

                )
              )}

            </div>

          )}

        </section>


      </div>

    </main>

  );

}