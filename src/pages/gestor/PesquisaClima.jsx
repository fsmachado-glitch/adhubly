import { useState } from 'react';
import DB from '../../lib/db';
import { useToast } from '../../components/Toast';
import Modal, { useModal } from '../../components/Modal';

export default function PesquisaClima() {
  const toast = useToast();
  const modal = useModal();
  const [, forceUpdate] = useState(0);
  const surveys = DB.getArr('surveys');
  const last = surveys[surveys.length - 1];
  const resps = last?.respostas || [];

  let enpsNum = 0, clr = 'var(--gray)', label = 'Aguardando';
  if (resps.length > 0) {
    const r = resps[0];
    enpsNum = (r.enps - 5) * 10;
    clr = enpsNum >= 30 ? 'var(--success)' : enpsNum >= -10 ? 'var(--warn)' : 'var(--danger)';
    label = enpsNum >= 30 ? 'Excelente' : enpsNum >= -10 ? 'Neutro' : 'Crítico';
  }

  const qs = [
    { k: 'seg1', l: 'Segurança para falar' }, { k: 'seg2', l: 'Liberdade de discordar' },
    { k: 'resp1', l: 'Clareza de metas' }, { k: 'resp2', l: 'Responsabilização justa' },
    { k: 'lid1', l: 'Qualidade da liderança' }, { k: 'lid2', l: 'Feedback recebido' },
  ];

  return (
    <div className="page-enter">
      <div className="ph">
        <div><div className="ph-title">Pesquisa de Clima & eNPS</div><div className="ph-sub">Termômetro do engajamento e segurança psicológica</div></div>
        <button className="btn btn-primary" onClick={() => { toast('Pesquisa enviada para todos!'); }}>Enviar pesquisa</button>
      </div>
      <div className="card-grid">
        <div className="card" style={{ textAlign: 'center' }}>
          <div className="sh" style={{ justifyContent: 'center' }}>eNPS atual</div>
          <div className="enps-val" style={{ color: clr }}>{resps.length > 0 ? enpsNum : '—'}</div>
          <div className="enps-lbl">{label}</div>
          <div className="enps-bar">
            <div className="enps-seg" style={{ background: 'var(--danger)', width: '33%' }} />
            <div className="enps-seg" style={{ background: 'var(--gray3)', width: '34%' }} />
            <div className="enps-seg" style={{ background: 'var(--success)', width: '33%' }} />
          </div>
          <div className="enps-scale"><span>Detratores</span><span>Neutros</span><span>Promotores</span></div>
        </div>
        <div className="card">
          <div className="sh">Respostas por pergunta (média)</div>
          {resps.length > 0 ? qs.map(q => {
            const avg = resps.reduce((s, x) => s + (x[q.k] || 0), 0) / resps.length;
            const pct = (avg / 5) * 100;
            const c2 = pct >= 75 ? 'var(--teal)' : pct >= 50 ? 'var(--warn)' : 'var(--danger)';
            return (
              <div className="dim-row" key={q.k}>
                <span className="dim-label">{q.l}</span>
                <div className="dim-track"><div className="dim-fill" style={{ width: `${pct}%`, background: c2 }} /></div>
                <span className="dim-val" style={{ color: c2 }}>{avg.toFixed(1)}</span>
              </div>
            );
          }) : <div style={{ fontSize: 12, color: 'var(--gray)', padding: '.5rem' }}>Envie uma pesquisa para ver resultados.</div>}
        </div>
      </div>
      <div className="card">
        <div className="sh">Histórico de pesquisas</div>
        {[...surveys].reverse().map(s => {
          const r = s.respostas?.[0] || {};
          const n = ((r.enps || 5) - 5) * 10;
          return (
            <div className="doc-row" key={s.id}>
              <div className="doc-ico" style={{ background: n >= 0 ? '#D1FAE5' : '#FEE2E2' }}>
                <span style={{ fontFamily: 'var(--font-h)', fontSize: 13, fontWeight: 800, color: n >= 0 ? 'var(--success)' : 'var(--danger)' }}>{n}</span>
              </div>
              <div style={{ flex: 1 }}><div className="doc-name">Pesquisa {s.periodo}</div><div className="doc-sub">{s.respostas?.length || 0} resposta(s)</div></div>
              <span className={`badge ${n >= 30 ? 'b-green' : n >= -10 ? 'b-yellow' : 'b-red'}`}>{n >= 30 ? 'Excelente' : n >= -10 ? 'Neutro' : 'Crítico'}</span>
            </div>
          );
        })}
        {surveys.length === 0 && <div style={{ fontSize: 12, color: 'var(--gray)' }}>Nenhuma pesquisa.</div>}
      </div>
    </div>
  );
}
