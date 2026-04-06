import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import { supabase } from './lib/supabase';
import { seedIfEmpty } from './lib/seedData';
import './index.css';

// Gestor pages
import Dashboard from './pages/gestor/Dashboard';
import MapaDores from './pages/gestor/MapaDores';
import Colaboradores from './pages/gestor/Colaboradores';
import Onboarding from './pages/gestor/Onboarding';
import ScoreComportamental from './pages/gestor/ScoreComportamental';
import Avaliacao360 from './pages/gestor/Avaliacao360';
import PesquisaClima from './pages/gestor/PesquisaClima';
import PainelRiscos from './pages/gestor/PainelRiscos';
import ModuloJuridico from './pages/gestor/ModuloJuridico';
import Videos from './pages/gestor/Videos';
import Documentos from './pages/gestor/Documentos';
import Relatorios from './pages/gestor/Relatorios';
import AdhublyAI from './pages/gestor/AdhublyAI';
import CanalDenuncias from './pages/gestor/CanalDenuncias';
import GestaoEPI from './pages/gestor/GestaoEPI';
import Configuracoes from './pages/gestor/Configuracoes';

// Colaborador pages
import MeuPainel from './pages/colaborador/MeuPainel';
import PesquisaColaborador from './pages/colaborador/PesquisaColaborador';
import MeuTermometro from './pages/colaborador/MeuTermometro';

function AppContent() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('gestor');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) seedIfEmpty(); // Seed after login if empty
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) seedIfEmpty();
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null; // Or a splash screen

  if (!session) return <Login />;

  return (
    <>
      <Topbar role={role} setRole={setRole} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="app-layout">
        <Sidebar role={role} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/colaboradores" element={<Colaboradores />} />
            <Route path="/score" element={<ScoreComportamental />} />
            <Route path="/adhubly-ai" element={<AdhublyAI />} />
            <Route path="/mapa-dores" element={<MapaDores />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/avaliacao-360" element={<Avaliacao360 />} />
            <Route path="/pesquisa-clima" element={<PesquisaClima />} />
            <Route path="/riscos" element={<PainelRiscos />} />
            <Route path="/juridico" element={<ModuloJuridico />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/documentos" element={<Documentos />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/denuncias" element={<CanalDenuncias />} />
            <Route path="/epis" element={<GestaoEPI />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
            
            <Route path="/meu-painel" element={<MeuPainel />} />
            <Route path="/pesquisa-colaborador" element={<PesquisaColaborador />} />
            <Route path="/meu-termometro" element={<MeuTermometro />} />
            
            {/* Fallback to Dashboard if route not found */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </BrowserRouter>
  );
}
