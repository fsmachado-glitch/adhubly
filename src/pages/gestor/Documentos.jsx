import React, { useState } from 'react';
import { Plus, Search, FileText, CheckCircle, Clock } from 'lucide-react';
import { useData } from '../../hooks/useData';

export default function Documentos() {
  const [docs, loading] = useData('docs');
  const [colabs] = useData('colabs');

  if (loading) return <div className="page-enter">Carregando...</div>;

  return (
    <div className="page-enter">
      <div className="ph">
        <div><div className="ph-title">Documentos</div><div className="ph-sub">Gestão de arquivos e assinaturas</div></div>
        <button className="btn btn-primary"><Plus size={13} /> Novo Documento</button>
      </div>
      <div className="grid">
        <div className="card">
          <div className="sh">Status de Assinaturas</div>
          {docs.map(d => (
            <div key={d.id} className="doc-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--off2)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{d.nome}</div>
                <div style={{ fontSize: 11, color: 'var(--gray)' }}>{d.tipo} - Expira em {d.validade}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, fontWeight: 700 }}>{d.assinados}/{colabs.length} assinados</div>
                <div className="prog" style={{ width: 80, height: 6, marginTop: 4 }}><div className="prog-fill" style={{ width: `${(d.assinados/colabs.length)*100}%` }} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
