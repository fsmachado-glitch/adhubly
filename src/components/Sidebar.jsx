import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Map, Users, UserPlus, Activity, Eye, MessageSquare, AlertTriangle, Shield, Video, FileText, BarChart3, Settings, Brain, ShieldAlert, HardHat, Bell } from 'lucide-react';
import DB from '../lib/db';
import { calcScore } from '../lib/scoreEngine';

export default function Sidebar({ role, isOpen, onClose }) {
  const navigate = useNavigate();
  const colabs = DB.getArr('colabs');
  const alertCount = colabs.filter(c => c.status === 'alerta').length;
  const riskCount = colabs.filter(c => calcScore(c).final < 50).length;
  const denunciaCount = DB.getArr('denuncias').filter(d => d.status === 'recebida').length;

  const gestorLinks = [
    { section: 'Início', items: [
      { to: '/', icon: Home, label: 'Visão Geral' },
      { to: '/mapa-dores', icon: Map, label: 'Mapa de Dores' },
    ]},
    { section: 'Pessoas', items: [
      { to: '/colaboradores', icon: Users, label: 'Colaboradores', badge: alertCount > 0 ? alertCount : null, badgeClass: 'warn' },
      { to: '/onboarding', icon: UserPlus, label: 'Onboarding' },
    ]},
    { section: 'Comportamento', items: [
      { to: '/score', icon: Activity, label: 'Score Comportamental' },
      { to: '/avaliacao-360', icon: Eye, label: 'Avaliação 360°' },
      { to: '/pesquisa-clima', icon: MessageSquare, label: 'Pesquisa eNPS/Clima' },
      { to: '/riscos', icon: AlertTriangle, label: 'Painel de Riscos', badge: riskCount > 0 ? riskCount : null },
    ]},
    { section: 'Compliance', items: [
      { to: '/juridico', icon: Shield, label: 'Módulo Jurídico' },
      { to: '/videos', icon: Video, label: 'Vídeos & Treinamentos' },
      { to: '/documentos', icon: FileText, label: 'Documentos' },
      { to: '/denuncias', icon: ShieldAlert, label: 'Canal de Denúncias', badge: denunciaCount > 0 ? denunciaCount : null },
      { to: '/epis', icon: HardHat, label: 'Gestão de EPIs' },
    ]},
    { section: 'Inteligência', items: [
      { to: '/adhubly-ai', icon: Brain, label: 'Adhubly AI ✨' },
      { to: '/relatorios', icon: BarChart3, label: 'Relatórios' },
    ]},
    { section: 'Config', items: [
      { to: '/configuracoes', icon: Settings, label: 'Configurações' },
    ]},
  ];

  const colabLinks = [
    { section: 'Minha Área', items: [
      { to: '/meu-painel', icon: Home, label: 'Meu Painel' },
      { to: '/meus-treinamentos', icon: Video, label: 'Meus Treinamentos' },
      { to: '/meus-documentos', icon: FileText, label: 'Meus Documentos' },
      { to: '/meu-historico', icon: Activity, label: 'Meu Histórico' },
      { to: '/pesquisa-colaborador', icon: MessageSquare, label: 'Pesquisa de Clima' },
      { to: '/meu-termometro', icon: Brain, label: 'Meu Termômetro AI' },
    ]},
  ];

  const links = role === 'gestor' ? gestorLinks : colabLinks;

  return (
    <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
      {links.map(section => (
        <div className="sb-section" key={section.section}>
          <div className="sb-label">{section.section}</div>
          {section.items.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => onClose && onClose()}
              end={item.to === '/'}
            >
              <item.icon size={15} strokeWidth={2} style={{ opacity: .65, flexShrink: 0 }} />
              {item.label}
              {item.badge && (
                <span className={`nav-badge ${item.badgeClass || ''}`}>{item.badge}</span>
              )}
            </NavLink>
          ))}
        </div>
      ))}
      <div className="sb-bottom">
        <div className="sb-upgrade">
          <p>Plataforma <strong style={{ color: 'var(--teal)', fontFamily: 'var(--font-h)', fontWeight: 800 }}>Adhubly</strong> · Gestão inteligente de pessoas</p>
        </div>
      </div>
    </nav>
  );
}
