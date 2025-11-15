import React from "react";
import { NavLink} from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  BarChart,
  Truck,
  ShoppingCart,
  Settings,
  LogOut
} from "lucide-react"; // Icônes modernes (lucide-react)
import { logoutUser } from "../services/api";
import { toast } from "sonner";


const Sidebar = () => {
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Inventory", path: "/InventoryPage", icon: <Package size={20} /> },
    { name: "Reports", path: "/reports", icon: <BarChart size={20} /> },
    { name: "Suppliers", path: "/suppliers", icon: <Truck size={20} /> },
    { name: "Orders", path: "/orders", icon: <ShoppingCart size={20} /> },
    { name: "Manage Store", path: "/manage-store", icon: <Settings size={20} /> },



  ];
  const handleLogout = async () => {
    try {
        await logoutUser(); // Appel à l'API de déconnexion
        localStorage.removeItem("token");
        toast.success("Déconnexion réussie !");
        setTimeout(() => window.location.href = "/connexion", 500);
    } catch (error) {
        console.error("Erreur lors de la déconnexion :", error);
        toast.error("Erreur lors de la déconnexion.");
    }
};



  return (
    <div
     className="sidebar"
    >
      <div>
        <h2 className="sidebar-menu">
          🏪 MyStore
        </h2>

        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
           className={({ isActive }) =>
              isActive ? "sidebar-item sidebar-item-active" : "sidebar-item"
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </div>
         <div className="sidebar-logout">
        <button
          onClick={handleLogout}
          className="logout-btn"
        >
          <LogOut size={18} /> Déconnexion
        </button>

      <div style={{ textAlign: "center", fontSize: "12px", color: "#94a3b8" }}>
        © {new Date().getFullYear()} MyStore
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
