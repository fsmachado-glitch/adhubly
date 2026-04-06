import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import DB from '../../lib/db';
import { useData } from '../../hooks/useData';
import { calcScore, scoreColor, scoreLabel, scoreClass } from '../../lib/scoreEngine';

export default function ScoreComportamental() {
  const [activeFilter, setActiveFilter] = useState('');
  const [colabs, loading, error] = useData('colabs');

  const depts = [...new Set(colabs.map(c => c.dept).filter(Boolean))].sort();

  const filteredColabs = colabs.filter(c => !activeFilter || c.dept === activeFilter);
  const scored = filteredColabs.map(c => ({ c, s: calcScore(c) })).sort((a, b) => b.s.final - a.s.final);
  const avg = scored.length ? Math.round(scored.reduce((a, x) => a + x.s.final, 0) / scored.length) : 0;
  
  const dims = ['resp', 'seg', 'lid', 'risco'];
  const dimNames = ['Responsabilização', 'Seg. Psicológica', 'Liderança', 'Risco Comp.'];
  const dimColors = ['var(--teal)', 'var(--blue)', '#F59E0B', 'var(--danger)'];

  const colabsByDept = (activeFilter ? [activeFilter] : depts).reduce((acc, d) => {
    const list = scored.filter(x => x.c.dept === d);
    if (list.length > 0) acc[d] = list;
    return acc;
  }, {});

  if (!activeFilter) {
    const others = scored.filter(x => !x.c.dept || !depts.includes(x.c.dept));
    if (others.length > 0) colabsByDept['Outros'] = others;
  }

  if (loading) return <div className="page-enter" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}><RefreshCw className="spin" /></div>;

  return (
    <div className="page-enter">
      <div className="ph">
        <div>
          <div className="ph-title">Score Comportamental</div>
          <div className="ph-sub">Métricas em tempo real via Supabase</div>
        </div>
      </div>

      <div className="card" style={{ background: 'var(--navy)', border: 'none', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 160 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase' }}>Score Médio</div>
            <div style={{ fontFamily: 'var(--font-h)', fontSize: 56, fontWeight: 800, color: scoreColor(avg) }}>{avg}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.45)' }}>{scoreLabel(avg)}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '.6rem', flex: 3 }}>
            {dims.map((d, i) => {
              const avgDim = scored.length ? Math.round(scored.reduce((a, x) => a + x.s[d], 0) / scored.length) : 0;
              return (
                <div key={d} style={{ background: 'rgba(255,255,255,.06)', borderRadius: 'var(--r)', padding: '.75rem 1rem' }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase' }}>{dimNames[i]}</div>
                  <div style={{ fontFamily: 'var(--font-h)', fontSize: 24, fontWeight: 800, color: dimColors[i] }}>{avgDim}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="filters" style={{ marginBottom: '1rem' }}>
        <button className={`chip ${!activeFilter ? 'active' : ''}`} onClick={() => setActiveFilter('')}>Todos os setores</button>
        {depts.map(d => <button className={`chip ${activeFilter === d ? 'active' : ''}`} key={d} onClick={() => setActiveFilter(d)}>{d}</button>)}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="tbl-overflow">
          <table className="tbl">
            <thead>
              <tr><th>Colaborador</th><th>Resp.</th><th>Seg. Psic.</th><th>Liderança</th><th>Risco</th><th>Score</th><th>Status</th></tr>
            </thead>
            <tbody>
              {Object.entries(colabsByDept).map(([dept, list]) => (
                <React.Fragment key={dept}>
                  <tr style={{ background: 'var(--off)', fontWeight: 700 }}><td colSpan="7" style={{ padding: '10px 16px', fontSize: 11, color: 'var(--navy)' }}>📂 {dept}</td></tr>
                  {list.map(({ c, s }) => (
                    <tr key={c.id}>
                      <td><div className="uc"><div className="av" style={{ background: c.cor, color: c.cor_txt }}>{c.avatar}</div><div><div className="un">{c.nome}</div><div className="ur">{c.cargo}</div></div></div></td>
                      {dims.map((dim, i) => (
                        <td key={dim}><div className="prog" style={{ width: 40, display: 'inline-block', marginRight: 5 }}><div className="prog-fill" style={{ width: `${s[dim]}%`, background: dimColors[i] }} /></div>{s[dim]}</td>
                      ))}
                      <td><span style={{ fontSize: 20, fontWeight: 800, color: scoreColor(s.final) }}>{s.final}</span></td>
                      <td><span className={`score-badge ${scoreClass(s.final)}`}>{scoreLabel(s.final)}</span></td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
