import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AvailableKnives from "./pages/AvailableKnives";
import Admin from "./pages/Admin";


function App() {

  return (

    <Routes>

      <Route 
        path="/" 
        element={<Home />} 
      />
<Route
  path="/admin"
  element={<Admin />}
/>

      <Route
        path="/knives"
        element={<AvailableKnives />}
      />

    </Routes>

  );

}

export default App;