import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import KnifeDetail from "./pages/KnifeDetail";

import Collaborations from "./pages/Collaborations";
import CollaborationDetail from "./pages/CollaborationDetail";

import Makers from "./pages/Makers";
import MakerDetail from "./pages/MakerDetail";

import Admin from "./pages/Admin";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

import NewKnife from "./pages/NewKnife";
import EditKnife from "./pages/EditKnife";
import EditMaker from "./pages/EditMaker";

import NewCollaboration from "./pages/NewCollaboration";
import EditCollaboration from "./pages/EditCollaboration";

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

        {/* HOME */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* SHOP / COLLECTION */}

        <Route
          path="/shop"
          element={<Shop />}
        />

        <Route
          path="/shop/:slug"
          element={<KnifeDetail />}
        />


        {/* Optional backwards-compatible collection routes */}

        <Route
          path="/collection"
          element={<Shop />}
        />

        <Route
          path="/collection/:slug"
          element={<KnifeDetail />}
        />


        {/* ==================================================
            COLLABORATIONS
        ================================================== */}

        <Route
          path="/collaborations"
          element={<Collaborations />}
        />

        <Route
          path="/collaborations/:id"
          element={<CollaborationDetail />}
        />


        {/* ==================================================
            MAKERS
        ================================================== */}

        <Route
          path="/makers"
          element={<Makers />}
        />

        <Route
          path="/makers/:slug"
          element={<MakerDetail />}
        />


        {/* ==================================================
            LOGIN
        ================================================== */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* ==================================================
            ADMIN
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
  path="/admin/maker/:id/edit"
  element={
    <ProtectedRoute>
      <EditMaker />
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

        {/* Backwards compatible */}

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