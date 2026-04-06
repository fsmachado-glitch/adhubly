import React, { useState } from 'react';
import { Plus, Play, CheckCircle, Clock } from 'lucide-react';
import { useData } from '../../hooks/useData';

export default function Videos() {
  const [vids, loading] = useData('videos');

  if (loading) return <div className="page-enter">Carregando treinamentos...</div>;

  const bgMap = { Institucional: 'var(--navy2)', Treinamento: '#1a1a2c', Conformidade: '#1a2c1a', Liderança: '#2c1a0e', Segurança: '#1a2a2c' };

  return (
    <div className="page-enter">
      <div className="ph">
        <div><div className="ph-title">Treinamentos e Vídeos</div><div className="ph-sub">Mantenha sua equipe em conformidade e capacitada</div></div>
        <button className="btn btn-primary"><Plus size={13} /> Novo Vídeo</button>
      </div>

      <div className="vid-grid">
        {vids.map((v, i) => (
          <div className="vid-card" key={v.id || i}>
            <div className="vid-thumb" style={{ background: bgMap[v.cat] || 'var(--navy)' }}>
              <div className="vid-play"><Play size={20} fill="#fff" color="#fff" /></div>
              <div className="vid-dur">{v.dur}</div>
            </div>
            <div className="vid-body">
              <div className="vid-tag" style={{ borderBottom: '1px solid var(--off2)', paddingBottom: '.5rem', marginBottom: '.5rem', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--gray)' }}>{v.cat}</div>
              <div className="vid-title">{v.titulo}</div>
              <div className="vid-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge b-blue">{v.obrig === 'todos' ? 'Obrigatório' : 'Opcional'}</span>
                <span style={{ fontSize: 11, color: 'var(--gray2)' }}>{v.assistidos || 0} visualizações</span>
              </div>
            </div>
          </div>
        ))}
        {vids.length === 0 && <div className="card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--gray)' }}>Nenhum treinamento cadastrado.</div>}
      </div>
    </div>
  );
}
