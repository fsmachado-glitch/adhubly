import DB from '../../lib/db';

export default function Onboarding() {
  const colabs = DB.getArr('colabs').filter(c => c.status === 'onboarding' || c.status === 'ativo');

  return (
    <div className="page-enter">
      <div className="ph"><div><div className="ph-title">Onboarding Digital</div><div className="ph-sub">Acompanhe a integração de cada colaborador</div></div></div>
      {colabs.map(c => {
        const prog = c.status === 'ativo' ? 85 : 30;
        return (
          <div className="card" key={c.id} style={{ marginBottom: '.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '.85rem' }}>
              <div className="av" style={{ width: 40, height: 40, fontSize: 14, background: c.cor || 'var(--off2)', color: c.corTxt || 'var(--gray)' }}>{c.avatar || c.nome?.[0]}</div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600 }}>{c.nome}</div><div style={{ fontSize: 11, color: 'var(--gray)' }}>{c.cargo} · {c.dept}</div></div>
              <span className={`badge ${c.status === 'ativo' ? 'b-green' : 'b-teal'}`}>{prog}% concluído</span>
            </div>
            <div className="ob-steps">
              {['Cadastro', 'Contrato', 'Treinamentos', 'Políticas', 'Concluído'].map((step, i) => {
                const cls = prog >= (i + 1) * 17 ? 'done' : prog >= i * 17 ? 'cur' : 'todo';
                return <div className={`ob-step ${cls}`} key={step}><div className="ob-num">{cls === 'done' ? '✓' : i + 1}</div><div className="ob-step-lbl">{step}</div></div>;
              })}
            </div>
            <div className="prog" style={{ marginTop: '.5rem' }}><div className="prog-fill" style={{ width: `${prog}%`, background: 'var(--teal)' }} /></div>
          </div>
        );
      })}
      {colabs.length === 0 && <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray)' }}>Nenhum colaborador em onboarding</div>}
    </div>
  );
}
