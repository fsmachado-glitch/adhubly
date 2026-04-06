import React, { useState } from 'react';
import { Plus, Users, Star, MessageSquare } from 'lucide-react';
import { useData } from '../../hooks/useData';

export default function Avaliacao360() {
  const [colabs, colLoading] = useData('colabs');
  const [evals, evalLoading] = useData('evals360');

  if (colLoading || evalLoading) return <div className="page-enter">Carregando...</div>;

  return (
    <div className="page-enter">
      <div className="ph">
        <div><div className="ph-title">Avaliação 360°</div><div className="ph-sub">Gestão de competências e feedback constante</div></div>
        <button className="btn btn-primary"><Plus size={13} /> Nova Avaliação</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
        {evals.map(e => {
          const colab = colabs.find(c => c.id === e.avaliado) || { nome: 'Desconhecido' };
          return (
            <div className="card" key={e.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', marginBottom: '1rem' }}>
                <div className="av" style={{ background: 'var(--off2)', color: 'var(--gray)' }}>{colab.avatar || colab.nome[0]}</div>
                <div><div style={{ fontWeight: 800, fontSize: 13 }}>{colab.nome}</div><div style={{ fontSize: 11, color: 'var(--gray)' }}>{e.tipo}</div></div>
              </div>
              <p style={{ fontSize: 12, color: 'var(--gray)', fontStyle: 'italic', marginBottom: '1rem' }}>"{e.comment}"</p>
              <div style={{ borderTop: '1px solid var(--off2)', paddingTop: '.75rem', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 11, color: 'var(--gray2)' }}>{e.created_at ? new Date(e.created_at).toLocaleDateString('pt-BR') : '—'}</div>
                <button className="btn btn-ghost" style={{ fontSize: 11 }}>Ver Detalhes</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
