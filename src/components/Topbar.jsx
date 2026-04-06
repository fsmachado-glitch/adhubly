import React, { useState, useEffect } from 'react';
import { Bell, Menu, LogOut, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import DB from '../lib/db';
import { useToast } from './Toast';

export default function Topbar({ role, setRole, onMenuToggle }) {
  const toast = useToast();
  const [cfg, setCfg] = useState({});
  const [userEmail, setUserEmail] = useState('');

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
      <button className="tb-btn" onClick={onMenuToggle} style={{ display: 'none' }} id="menu-btn">
        <Menu size={16} />
      </button>

      <div className="tb-logo" onClick={() => window.location.href = '/'}>
        <div className="tb-mark">
          <svg viewBox="0 0 18 18" fill="none" style={{ width: 17, height: 17 }}>
            <rect x="1" y="10" width="4" height="7" rx="1" fill="#0A0F1E" />
            <rect x="7" y="6" width="4" height="11" rx="1" fill="#0A0F1E" />
            <rect x="13" y="2" width="4" height="15" rx="1" fill="#0A0F1E" />
          </svg>
        </div>
        <span className="tb-name">Ad<span>Hub</span>ly</span>
      </div>

      <span className="tb-client">{cfg.nome || 'Carregando...'}</span>

      <div className="tb-right">
        <div className="role-toggle">
          <button className={`role-btn ${role === 'gestor' ? 'active' : ''}`} onClick={() => setRole('gestor')}>Gestor</button>
          <button className={`role-btn ${role === 'colab' ? 'active' : ''}`} onClick={() => setRole('colab')}>Colaborador</button>
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
