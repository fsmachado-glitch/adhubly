import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import DB from '../../lib/db';
import { useData } from '../../hooks/useData';
import { calcScore, scoreColor, scoreLabel, scoreClass } from '../../lib/scoreEngine';

export default function Dashboard() {
  const navigate = useNavigate();
  const [cfg, setCfg] = useState({});
  const [colabs, colLoading] = useData('colabs');
  const [ocorrs, ocLoading] = useData('ocorrencias');
  const [docs, docLoading] = useData('docs');
  const d = new Date();

  useEffect(() => {
    DB.getConfig().then(setCfg);
  }, []);

  if (colLoading || ocLoading || docLoading) {
    return <div className="page-enter" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', color: 'var(--gray)' }}><RefreshCw className="spin" size={24} /> Carregando painel...</div>;
  }

  const scores = colabs.map(c => calcScore(c).final);
  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const pendDocs = docs.filter(d => d.status === 'parcial' || d.status === 'expirado').length;
  const alertas = ocorrs.filter(o => o.status === 'aberta').length;
  const depts = [...new Set(colabs.map(c => c.dept).filter(Boolean))];

  const ocAlerts = ocorrs.filter(o => o.status === 'aberta').slice(0, 3);

  return (
    <div className="page-enter">
      <div className="ph">
        <div>
          <div className="ph-title">Visão Geral</div>
          <div className="ph-sub">{cfg.nome || 'Empresa'} · {d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</div>
        </div>
        <div className="ph-actions">
          <button className="btn btn-ghost" onClick={() => navigate('/colaboradores')}>
            <Plus size={13} /> Novo colaborador
          </button>
          <button className="btn btn-ai" onClick={() => navigate('/adhubly-ai')}>
            ✨ Adhubly AI
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/relatorios')}>Ver relatório</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-lbl">Colaboradores ativos</div>
          <div className="stat-val">{colabs.length}</div>
          <div className="trend trend-up">↑ {colabs.filter(c => c.status === 'onboarding').length} em onboarding</div>
        </div>
        <div className="stat-card">
          <div className="stat-lbl">Score comportamental</div>
          <div className="stat-val" style={{ color: scoreColor(avgScore) }}>{avgScore}</div>
          <div className={`trend ${avgScore >= 75 ? 'trend-up' : avgScore >= 50 ? 'trend-nt' : 'trend-dn'}`}>{scoreLabel(avgScore)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-lbl">Docs pendentes</div>
          <div className="stat-val" style={{ color: pendDocs > 0 ? 'var(--warn)' : 'var(--success)' }}>{pendDocs}</div>
          <div className={`trend ${pendDocs > 0 ? 'trend-nt' : 'trend-up'}`}>{pendDocs > 0 ? 'Requer atenção' : 'Em dia'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-lbl">Ocorrências abertas</div>
          <div className="stat-val" style={{ color: alertas > 0 ? 'var(--danger)' : 'var(--success)' }}>{alertas}</div>
          <div className={`trend ${alertas > 0 ? 'trend-dn' : 'trend-up'}`}>{alertas > 0 ? 'Atenção necessária' : 'Nenhuma pendente'}</div>
        </div>
      </div>

      {/* Two columns */}
      <div className="card-grid">
        <div className="card">
          <div className="sh">
            Conformidade por área
            <button className="link" onClick={() => navigate('/relatorios')}>Ver tudo →</button>
          </div>
          {depts.map(dept => {
            const dc = colabs.filter(c => c.dept === dept);
            const avg = dc.length ? Math.round(dc.map(c => calcScore(c).final).reduce((a, b) => a + b, 0) / dc.length) : 0;
            return (
              <div className="dim-row" key={dept}>
                <span className="dim-label">{dept}</span>
                <div className="dim-track">
                  <div className="dim-fill" style={{ width: `${avg}%`, background: scoreColor(avg) }} />
                </div>
                <span className="dim-val" style={{ color: scoreColor(avg) }}>{avg}</span>
              </div>
            );
          })}
          {depts.length === 0 && <div style={{ fontSize: 12, color: 'var(--gray)', textAlign: 'center', padding: '1rem' }}>Nenhum departamento cadastrado</div>}
        </div>

        <div className="card">
          <div className="sh">
            Alertas comportamentais
            <button className="link" onClick={() => navigate('/riscos')}>Ver painel →</button>
          </div>
          {ocAlerts.map(o => {
            const c = colabs.find(x => x.id == o.colabId) || { nome: '?' };
            const isBad = ['Advertência escrita', 'Suspensão', 'Assédio reportado', 'Conflito reportado'].includes(o.tipo);
            return (
              <div className={`alert ${isBad ? 'danger' : 'warn'}`} key={o.id}>
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1, stroke: isBad ? 'var(--danger)' : 'var(--warn)' }} />
                <div>
                  <div className="alert-t">{o.tipo} — {c.nome}</div>
                  <div className="alert-d">{o.desc?.slice(0, 80)}...</div>
                </div>
              </div>
            );
          })}
          {ocAlerts.length === 0 && (
            <div className="alert info">
              <AlertCircle size={16} style={{ flexShrink: 0, stroke: 'var(--teal2)' }} />
              <div>
                <div className="alert-t">Nenhuma ocorrência aberta</div>
                <div className="alert-d">Equipe dentro dos parâmetros esperados.</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Colaboradores table */}
      <div className="sh">
        Colaboradores
        <button className="link" onClick={() => navigate('/colaboradores')}>Ver todos →</button>
      </div>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="tbl-overflow">
          <table className="tbl">
            <thead>
              <tr><th>Colaborador</th><th>Dept.</th><th>Score Comp.</th><th>Conformidade</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {colabs.slice(0, 6).map(c => {
                const s = calcScore(c);
                const stMap = { ativo: 'b-green', alerta: 'b-red', onboarding: 'b-teal', afastado: 'b-yellow' };
                return (
                  <tr key={c.id}>
                    <td>
                      <div className="uc">
                        <div className="av" style={{ background: c.cor || 'var(--off2)', color: c.corTxt || 'var(--gray)' }}>{c.avatar || c.nome?.[0]}</div>
                        <div><div className="un">{c.nome}</div><div className="ur">{c.cargo}</div></div>
                      </div>
                    </td>
                    <td>{c.dept || '—'}</td>
                    <td><span className={`score-badge ${scoreClass(s.final)}`}>{s.final}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                        <div className="prog" style={{ width: 70 }}><div className="prog-fill" style={{ width: `${s.final}%`, background: scoreColor(s.final) }} /></div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: scoreColor(s.final) }}>{s.final}%</span>
                      </div>
                    </td>
                    <td><span className={`badge ${stMap[c.status] || 'b-gray'}`}><span className="sdot" />{c.status}</span></td>
                    <td><button className="btn btn-ghost" style={{ fontSize: 11, padding: '3px 8px' }} onClick={() => navigate('/colaboradores')}>Ver</button></td>
                  </tr>
                );
              })}
              {colabs.length === 0 && (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray)', fontSize: 12 }}>Nenhum colaborador cadastrado</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
