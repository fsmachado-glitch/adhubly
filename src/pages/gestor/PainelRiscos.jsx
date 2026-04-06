import React, { useState } from 'react';
import { AlertCircle, TrendingUp, ShieldAlert, ChevronRight, RefreshCw } from 'lucide-react';
import { useData } from '../../hooks/useData';
import { calcScore, scoreColor } from '../../lib/scoreEngine';

export default function PainelRiscos() {
  const [colabs, colLoading] = useData('colabs');
  const [ocorrs, ocLoading] = useData('ocorrencias');

  if (colLoading || ocLoading) return <div className="page-enter"><RefreshCw className="spin" /> Carregando...</div>;

  const alerts = ocorrs.filter(o => o.status === 'aberta');
  const lowScores = colabs.map(c => ({ c, s: calcScore(c) })).filter(x => x.s.final < 60);

  return (
    <div className="page-enter">
      <div className="ph">
        <div><div className="ph-title">Painel de Riscos</div><div className="ph-sub">Detecção proativa de riscos operacionais e comportamentais</div></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
          <div className="sh" style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}><AlertCircle size={16} color="var(--danger)" /> Alertas Comportamentais ({alerts.length})</div>
          {alerts.map(o => {
            const colab = colabs.find(c => c.id === o.colab_id) || { nome: 'Desconhecido' };
            return (
              <div className="doc-row" key={o.id}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{colab.nome}</div>
                  <div style={{ fontSize: 11, color: 'var(--gray)' }}>{o.tipo} - {o.data}</div>
                </div>
                <button className="btn btn-ghost" style={{ fontSize: 10 }}>Ver Detalhes</button>
              </div>
            );
          })}
        </div>

        <div className="card" style={{ borderLeft: '4px solid #F59E0B' }}>
          <div className="sh" style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}><TrendingUp size={16} color="#F59E0B" /> Queda de Desempenho ({lowScores.length})</div>
          {lowScores.map(({ c, s }) => (
            <div className="doc-row" key={c.id}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{c.nome}</div>
                <div style={{ fontSize: 11, color: 'var(--gray)' }}>Score Crítico: {s.final}%</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: scoreColor(s.final) }}>{s.final}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
