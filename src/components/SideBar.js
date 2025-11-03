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
      style={{
        width: "230px",
        height: "100vh",
        backgroundColor: "#1E293B",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "fixed",
        left: 0,
        top: 0,
        padding: "20px 10px",
      }}
    >
      <div>
        <h2 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "30px", textAlign: "center" }}>
          🏪 MyStore
        </h2>

        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 15px",
              marginBottom: "8px",
              borderRadius: "8px",
              backgroundColor: isActive ? "#334155" : "transparent",
              color: isActive ? "#38bdf8" : "#f1f5f9",
              textDecoration: "none",
              fontWeight: isActive ? "bold" : "normal",
              transition: "all 0.2s ease",
            })}
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </div>
         <div style={{ borderTop: "1px solid #334155", paddingTop: "15px" }}>
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            width: "100%",
            padding: "10px 15px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#dc2626",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#b91c1c")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
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
