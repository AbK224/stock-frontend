import "./App.css";
import { RecoilRoot } from "recoil";
import { Toaster } from "sonner";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import Register from "./pages/register";
import Connexion from "./pages/connexion";
import InventoryPage from "./pages/InventoryPage";
import Dashboard from "./pages/dashboard"; // 🆕 à créer
import Sidebar from "./components/SideBar";
import SuppliersPage from "./pages/SuppliersPage";
import OrdersPage from "./pages/OrdersPage";
import './App.css';


// 🔹 Composant qui affiche la Sidebar seulement si l’utilisateur est connecté
const Layout = ({ children }) => {
  const location = useLocation();
  const hideSidebarRoutes = ["/", "/connexion", "/register"]; // routes sans sidebar
  const hideSidebar = hideSidebarRoutes.includes(location.pathname);

  return (
    <div style={{ display: "flex" }}>
      {!hideSidebar && <Sidebar />}
      <div style={{ marginLeft: hideSidebar ? 0 : "230px", padding: "20px", flex: 1 }}>
        {children}
      </div>
    </div>
  );
};

// 🔒 Protection des routes internes
const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/connexion" replace />;
};

function App() {
  return (
    <RecoilRoot>
      <Router>
        <Layout>
          <Toaster position="top-right" richColors />

          <Routes>
            {/* 🔹 Page par défaut → Connexion */}
            <Route path="/" element={<Connexion />} />

            {/* 🔹 Authentification */}
            <Route path="/register" element={<Register />} />
            <Route path="/connexion" element={<Connexion />} />

            {/* 🔹 Routes protégées (requièrent un token) */}
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="/inventorypage" element={<ProtectedRoute element={<InventoryPage />} />} />
            <Route path="/suppliers" element={<ProtectedRoute element={<SuppliersPage />} />} />
            <Route path="/orders" element={<ProtectedRoute element={<OrdersPage />} />} />
            

            {/* 🔹 Redirection pour routes inconnues */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Layout>
      </Router>
    </RecoilRoot>
  );
}

export default App;
