import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";


export default function Login() {

  const {
    loginWithRedirect,
    isAuthenticated,
    isLoading,
    user
  } = useAuth0();



  console.log("LOGIN PAGE:", {
    isLoading,
    isAuthenticated,
    user
  });



  if (isLoading) {
    return (
      <div className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-agane-bg
        text-agane-text
      ">
        Loading...
      </div>
    );
  }



  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }



  return (
    <div className="
      min-h-screen
      flex
      flex-col
      items-center
      justify-center
      bg-agane-bg
      text-agane-text
    ">

      <h1 className="
        text-5xl
        font-serif
        mb-8
      ">
        Ågane Workshop
      </h1>


      <p className="mb-8">
        Login to manage your knives
      </p>


      <button
        onClick={() =>
          loginWithRedirect({
            appState: {
              returnTo: "/admin"
            }
          })
        }
        className="
          border
          border-agane-text
          px-8
          py-3
          hover:bg-agane-text
          hover:text-white
          transition
        "
      >
        Login
      </button>


    </div>
  );
}