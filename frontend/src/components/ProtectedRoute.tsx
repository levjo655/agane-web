import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {

  const {
    isAuthenticated,
    isLoading,
    user
  } = useAuth0();


  console.log("PROTECTED ROUTE:", {
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
      ">
        Loading auth...
      </div>
    );
  }


  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }


  return children;
}