import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import {Toaster} from "react-hot-toast";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import userRoutes from "./components/routes/userRoutes";
import adminRoutes from "./components/routes/adminRoutes"
import NotFound from "./components/layout/NotFound";

function App() {
  const UserRoutes = userRoutes()
  const AdminRoutes = adminRoutes()
  return (
    <Router>
      <div className="App">
        <Toaster position="top-center"/>
        <Header />
        <div className="container">
          <Routes>
            {UserRoutes}
            {AdminRoutes}
            <Route path="*" element = {<NotFound/>} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;