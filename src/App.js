import './App.css';
import { RecoilRoot } from 'recoil';
import { Toaster } from 'sonner';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './pages/register';
import Connexion from './pages/connexion';
import Dashboard from './pages/dashboard';
import InventoryPage from './pages/InventoryPage';



function App() {
  return (
    <RecoilRoot>
      <Router>
      <Toaster position="top-right" richColors />


        <Routes>
            {/* page de connexion par defaut */}
          <Route path="/" element={<Connexion />} />
            {/* page d'inscription */}
          <Route path="/register" element={<Register />} />
          <Route path="/connexion" element={<Connexion />} />
            {/* page du tableau de bord */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/InventoryPage" element={<InventoryPage />} />

            {/* redirection vers la page de connexion pour toute autre route */}
          <Route path="*" element={<Navigate to = "/" />} />
        </Routes>
      </Router>
    </RecoilRoot>
  );
}

export default App;
