import React, { useState, useEffect } from 'react';
import { Bell, Menu, LogOut, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import DB from '../lib/db';
import { useToast } from './Toast';

export default function Topbar({ role, setRole, onMenuToggle }) {
  const toast = useToast();
  const [cfg, setCfg] = useState({});
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  function handleRoleSwitch(newRole) {
    setRole(newRole);
    if (newRole === 'colab') {
      navigate('/meu-painel');
    } else {
      navigate('/');
    }
  }

  useEffect(() => {
    DB.getConfig().then(setCfg);
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data?.user?.email || '');
    });
  }, []);

  async function handleLogout() {
    if (confirm('Deseja realmente sair?')) {
      await supabase.auth.signOut();
      window.location.reload();
    }
  }

  return (
    <header className="topbar">
      <button className="tb-btn mobile-menu-btn" onClick={onMenuToggle}>
        <Menu size={16} />
      </button>

      <div className="tb-logo" onClick={() => window.location.href = '/'}>
        <div className="tb-mark" style={{ background: 'transparent', color: 'var(--teal)' }}>
          <Zap size={24} fill="currentColor" strokeWidth={0} />
        </div>
        <span className="tb-name" style={{ fontWeight: 800, fontSize: 20 }}>Adhubly</span>
      </div>

      <span className="tb-client">{cfg.nome || 'Carregando...'}</span>

      <div className="tb-right">
        <div className="role-toggle">
          <button className={`role-btn ${role === 'gestor' ? 'active' : ''}`} onClick={() => handleRoleSwitch('gestor')}>Gestor</button>
          <button className={`role-btn ${role === 'colab' ? 'active' : ''}`} onClick={() => handleRoleSwitch('colab')}>Colaborador</button>
        </div>

        <button className="tb-btn" onClick={() => toast('Nenhuma notificação nova')}>
          <Bell size={14} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginLeft: '.5rem', paddingLeft: '.5rem', borderLeft: '1px solid var(--off2)' }}>
          <div className="tb-avatar" style={{ fontSize: 10, fontWeight: 700 }}>{userEmail?.[0]?.toUpperCase() || 'U'}</div>
          <button className="tb-btn" onClick={handleLogout} title="Sair do sistema">
            <LogOut size={14} style={{ color: 'var(--gray)' }} />
          </button>
        </div>
      </div>
    </header>
  );
}
