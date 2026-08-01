import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AvailableKnives from "./pages/AvailableKnives";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import NewKnife from "./pages/NewKnife";
import NewCollaboration from "./pages/NewCollaboration";
import Collection from "./pages/Collection";
import Navbar from "./components/Navbar";
import KnifeDetail from "./pages/KnifeDetail";
import EditKnife from "./pages/EditKnife";
import Collaborations from "./pages/Collaborations";





console.log("ADMIN COMPONENT:", Admin);



function App() {


  return (

    <>


      <Navbar />



      <Routes>


        {/* PUBLIC */}


        <Route
          path="/"
          element={<Home />}
        />
        <Route
  path="/collection/:slug"
  element={<KnifeDetail />}
/>
<Route

path="/collaborations"

element={<Collaborations />}

/>



        <Route
          path="/collection"
          element={<Collection />}
        />
        



        <Route
          path="/knives"
          element={<AvailableKnives />}
        /> 
        <Route

path="/admin/knife/:id/edit"

element={

<ProtectedRoute>

<EditKnife />

</ProtectedRoute>

}

/>



        <Route
          path="/login"
          element={<Login />}
        />
        <Route
  path="/collection/:slug"
  element={<KnifeDetail />}
/>
        






        {/* ADMIN */}



        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />



        <Route
          path="/admin/new"
          element={
            <ProtectedRoute>
              <NewKnife />
            </ProtectedRoute>
          }
        />



        <Route
          path="/admin/collaboration/new"
          element={
            <ProtectedRoute>
              <NewCollaboration />
            </ProtectedRoute>
          }
        />



      </Routes>


    </>

  );

}


export default App;