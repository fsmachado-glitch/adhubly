import { useNavigate } from 'react-router-dom';
import DB from '../../lib/db';
import { calcScore, scoreColor, scoreLabel } from '../../lib/scoreEngine';

export default function MeuPainel() {
  const navigate = useNavigate();
  const colabs = DB.getArr('colabs');
  const c = colabs[0] || { nome: 'Colaborador', cargo: '—', dept: '—', avatar: '?', cor: 'var(--off2)', corTxt: 'var(--gray)' };
  const s = calcScore(c);
  const pendDocs = DB.getArr('docs').filter(d => d.status === 'parcial').length;
  const pendVids = DB.getArr('videos').filter(v => v.obrig === 'todos').length;

  return (
    <div className="page-enter">
      <div className="collab-hero">
        <div className="ch-av">{c.avatar || c.nome?.[0]}</div>
        <div><div className="ch-name">Olá, {c.nome?.split(' ')[0]}!</div><div className="ch-role">{c.cargo} · {c.dept}</div></div>
        <div className="ch-stats">
          <div><div className="ch-stat-val">{s.final}</div><div className="ch-stat-lbl">Score</div></div>
          <div><div className="ch-stat-val">{pendDocs}</div><div className="ch-stat-lbl">Docs pend.</div></div>
          <div><div className="ch-stat-val">{pendVids}</div><div className="ch-stat-lbl">Treinamentos</div></div>
        </div>
      </div>
      <div className="card-grid">
        <div className="card">
          <div className="sh">Tarefas pendentes</div>
          <div className="doc-row" onClick={() => navigate('/meus-documentos')}>
            <div className="doc-ico" style={{ background: '#FEF3C7' }}><span style={{ fontSize: 14 }}>📄</span></div>
            <div><div className="doc-name">Documentos aguardando assinatura</div><div className="doc-sub">{pendDocs} pendente(s)</div></div>
            <span className="badge b-yellow">Urgente</span>
          </div>
          <div className="doc-row" onClick={() => navigate('/meus-treinamentos')}>
            <div className="doc-ico" style={{ background: 'var(--off2)' }}><span style={{ fontSize: 14 }}>🎬</span></div>
            <div><div className="doc-name">Treinamentos obrigatórios</div><div className="doc-sub">{pendVids} vídeo(s)</div></div>
            <span className="badge b-gray">Pendente</span>
          </div>
          <div className="doc-row" onClick={() => navigate('/pesquisa-colaborador')}>
            <div className="doc-ico" style={{ background: 'rgba(0,212,180,.1)' }}><span style={{ fontSize: 14 }}>💬</span></div>
            <div><div className="doc-name">Pesquisa de clima do mês</div><div className="doc-sub">Sua resposta é anônima</div></div>
            <span className="badge b-blue">Disponível</span>
          </div>
        </div>
        <div className="card">
          <div className="sh">Meu score comportamental</div>
          <div style={{ textAlign: 'center', marginBottom: '.85rem' }}>
            <div style={{ fontFamily: 'var(--font-h)', fontSize: 44, fontWeight: 800, color: scoreColor(s.final) }}>{s.final}</div>
            <div style={{ fontSize: 12, color: 'var(--gray)' }}>{scoreLabel(s.final)}</div>
          </div>
          {[
            { l: 'Responsabilização', v: s.resp, c: 'var(--teal)' },
            { l: 'Seg. Psicológica', v: s.seg, c: 'var(--blue)' },
            { l: 'Liderança', v: s.lid, c: 'var(--gold)' },
          ].map(d => (
            <div className="dim-row" key={d.l}><span className="dim-label">{d.l}</span><div className="dim-track"><div className="dim-fill" style={{ width: `${d.v}%`, background: d.c }} /></div><span className="dim-val">{d.v}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}
