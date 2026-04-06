import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useData } from '../../hooks/useData';

export default function CanalDenuncias() {
  const [denuncias, loading] = useData('denuncias');

  const stMap = { investigando: 'b-blue', resolvida: 'b-green', improcedente: 'b-gray' };

  if (loading) return <div className="page-enter">Carregando canal...</div>;

  return (
    <div className="page-enter">
      <div className="ph">
        <div><div className="ph-title">Canal de Denúncias Internas</div><div className="ph-sub">Gestão anônima de incidentes e compliance</div></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {denuncias.map(d => (
          <div className="card" key={d.id} style={{ borderLeft: `4px solid ${d.status === 'resolvida' ? 'var(--success)' : 'var(--danger)'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.5rem' }}>
              <div style={{ fontWeight: 800, fontSize: 13, textTransform: 'uppercase', color: 'var(--navy)' }}>Protocolo #{d.id?.slice(0, 6)}</div>
              <span className={`badge ${stMap[d.status]}`}>{d.status}</span>
            </div>
            <div style={{ fontSize: 12, marginBottom: '.75rem', fontWeight: 600 }}>{d.tipo} - Setor: {d.setor}</div>
            <p style={{ fontSize: 13, color: 'var(--gray)', lineHeight: 1.5 }}>{d.descricao}</p>
            <div style={{ marginTop: '1rem', paddingTop: '.75rem', borderTop: '1px solid var(--off2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 11, color: 'var(--gray2)' }}>Recebido em: {d.data ? new Date(d.data).toLocaleDateString('pt-BR') : 'Hoje'}</div>
              <button className="btn btn-ghost" style={{ fontSize: 11 }}>Tratar</button>
            </div>
          </div>
        ))}
        {denuncias.length === 0 && <div className="card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--gray)' }}>Nenhuma denúncia registrada.</div>}
      </div>
    </div>
  );
}
