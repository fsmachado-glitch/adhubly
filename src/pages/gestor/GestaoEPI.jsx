import React, { useState } from 'react';
import { Plus, Shield, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { useData } from '../../hooks/useData';

export default function GestaoEPI() {
  const [colabs, colLoading] = useData('colabs');
  const [epis, epiLoading] = useData('epis');

  if (colLoading || epiLoading) return <div className="page-enter"><RefreshCw className="spin" /> Carregando...</div>;

  return (
    <div className="page-enter">
      <div className="ph">
        <div><div className="ph-title">Gestão de EPIs</div><div className="ph-sub">Controle de equipamentos de proteção individual</div></div>
        <button className="btn btn-primary"><Plus size={13} /> Nova Entrega</button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="tbl">
          <thead><tr><th>Colaborador</th><th>Item</th><th>Entrega</th><th>Validade</th><th>Aceite</th></tr></thead>
          <tbody>
            {epis.map(e => {
              const colab = colabs.find(c => c.id === e.colab_id) || { nome: 'Desconhecido' };
              return (
                <tr key={e.id}>
                  <td>{colab.nome}</td>
                  <td>{e.item}</td>
                  <td>{e.entrega ? new Date(e.entrega).toLocaleDateString('pt-BR') : '—'}</td>
                  <td>{e.validade ? new Date(e.validade).toLocaleDateString('pt-BR') : '—'}</td>
                  <td>{e.aceite ? <span className="badge b-green">Assinado</span> : <span className="badge b-yellow">Pendente</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
