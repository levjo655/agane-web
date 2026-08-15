import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AvailableKnives from "./pages/AvailableKnives";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

import NewKnife from "./pages/NewKnife";
import EditKnife from "./pages/EditKnife";

import NewCollaboration from "./pages/NewCollaboration";
import EditCollaboration from "./pages/EditCollaboration";

import Collection from "./pages/Collection";
import KnifeDetail from "./pages/KnifeDetail";

import Collaborations from "./pages/Collaborations";

import MakerProfile from "./pages/MakerProfile";
import Makers from "./pages/Makers";
import NewMaker from "./pages/NewMaker";

import Navbar from "./components/Navbar";


function App() {

  return (

    <>

      <Navbar />

      <Routes>


        {/* ==================================================
            PUBLIC
        ================================================== */}


        <Route
          path="/"
          element={<Home />}
        />


        <Route
          path="/collection"
          element={<Collection />}
        />


        <Route
          path="/collection/:slug"
          element={<KnifeDetail />}
        />


        <Route
          path="/knives"
          element={<AvailableKnives />}
        />


        <Route
          path="/collaborations"
          element={<Collaborations />}
        />


        <Route
          path="/makers"
          element={<Makers />}
        />


        <Route
          path="/makers/:maker"
          element={<MakerProfile />}
        />


        <Route
          path="/login"
          element={<Login />}
        />



        {/* ==================================================
            ADMIN DASHBOARD
        ================================================== */}


        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />



        {/* ==================================================
            ADMIN — KNIVES
        ================================================== */}


        <Route
          path="/admin/new"
          element={
            <ProtectedRoute>
              <NewKnife />
            </ProtectedRoute>
          }
        />


        <Route
          path="/admin/knife/:id/edit"
          element={
            <ProtectedRoute>
              <EditKnife />
            </ProtectedRoute>
          }
        />



        {/* ==================================================
            ADMIN — MAKERS
        ================================================== */}


        <Route
          path="/admin/makers"
          element={
            <ProtectedRoute>
              <Makers />
            </ProtectedRoute>
          }
        />


        <Route
          path="/admin/maker/new"
          element={
            <ProtectedRoute>
              <NewMaker />
            </ProtectedRoute>
          }
        />


        {/* Keep this route too in case something currently
            links to /admin/makers/new */}

        <Route
          path="/admin/makers/new"
          element={
            <ProtectedRoute>
              <NewMaker />
            </ProtectedRoute>
          }
        />



        {/* ==================================================
            ADMIN — COLLABORATIONS
        ================================================== */}


        <Route
          path="/admin/collaboration/new"
          element={
            <ProtectedRoute>
              <NewCollaboration />
            </ProtectedRoute>
          }
        />


        <Route
          path="/admin/collaboration/:id/edit"
          element={
            <ProtectedRoute>
              <EditCollaboration />
            </ProtectedRoute>
          }
        />


      </Routes>

    </>

  );

}


export default App;