import { useAuth0 } from "@auth0/auth0-react";

export default function Header() {

  const {
    isAuthenticated,
    logout
  } = useAuth0();


  return (
    <header>

      {isAuthenticated && (
        <button
          onClick={() =>
            logout({
              logoutParams: {
                returnTo: window.location.origin
              }
            })
          }
        >
          Logout
        </button>
      )}

    </header>
  );
}