import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Admin from "./Pages/Admin/Admin";
import Login from "./Pages/Admin/Login";
import ProtectedRoute from "./Components/Auth/ProtectedRoute";

const App = () => {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<Admin />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
