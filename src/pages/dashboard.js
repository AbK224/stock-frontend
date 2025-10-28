import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InventoryPage from "./InventoryPage";

const Dashboard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    //alert(token);
    if (!token) navigate("/");
  }, [navigate]);

  return (
    <div>
      <h2>Bienvenue sur le tableau de bord</h2>
      <InventoryPage/>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
        }}
      >
        Déconnexion
      </button>
    </div>
  );
};

export default Dashboard;
