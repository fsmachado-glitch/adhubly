import React, { useState } from 'react';
import { Gavel, AlertCircle, FileText, CheckCircle } from 'lucide-react';
import { useData } from '../../hooks/useData';

export default function ModuloJuridico() {
  const [ocorrs, loading] = useData('ocorrencias');

  if (loading) return <div className="page-enter">Carregando jurídico...</div>;

  const riscs = ocorrs.filter(o => o.tipo.toLowerCase().includes('justa causa') || o.status === 'aberta');

  return (
    <div className="page-enter">
      <div className="ph">
        <div><div className="ph-title">Módulo Jurídico e Compliance</div><div className="ph-sub">Prevenção de riscos trabalhistas e auditoria</div></div>
        <button className="btn btn-danger"><AlertCircle size={13} /> Novo Risco Crítico</button>
      </div>

      <div className="card">
        <div className="sh" style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}><Gavel size={16} /> Alertas de Processo e Risco</div>
        {riscs.map(r => (
           <div className="doc-row" key={r.id}>
             <div style={{ flex: 1 }}>
               <div style={{ fontWeight: 700, fontSize: 13 }}>{r.tipo}</div>
               <div style={{ fontSize: 11, color: 'var(--gray)' }}>{r.descricao?.slice(0, 80)}...</div>
             </div>
             <span className="badge b-red">Risco Alto</span>
           </div>
        ))}
        {riscs.length === 0 && <div style={{ fontSize: 13, color: 'var(--gray2)', padding: '1rem', textAlign: 'center' }}>Nenhum risco jurídico iminente detectado.</div>}
      </div>
    </div>
  );
}
