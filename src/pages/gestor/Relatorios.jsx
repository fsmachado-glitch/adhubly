import DB from '../../lib/db';
import { calcScore, scoreColor, scoreLabel, scoreClass } from '../../lib/scoreEngine';
import { useToast } from '../../components/Toast';

export default function Relatorios() {
  const toast = useToast();
  const colabs = DB.getArr('colabs');
  const ocorrs = DB.getArr('ocorrencias');
  const surveys = DB.getArr('surveys');
  const scored = colabs.map(c => ({ c, s: calcScore(c) })).sort((a, b) => b.s.final - a.s.final);
  const avg = scored.length ? Math.round(scored.reduce((a, x) => a + x.s.final, 0) / scored.length) : 0;
  const depts = [...new Set(colabs.map(c => c.dept).filter(Boolean))];
  const months = ['Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar'];
  const vals = [72, 76, 80, 84, 88, avg || 70];
  const maxV = Math.max(...vals);

  function exportCSV() {
    const rows = [['Nome', 'Departamento', 'Cargo', 'Admissão', 'Score', 'Status']];
    colabs.forEach(c => { const s = calcScore(c); rows.push([c.nome, c.dept, c.cargo, c.admissao, s.final, c.status]); });
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `adhubly_relatorio_${new Date().toISOString().split('T')[0]}.csv`; a.click();
    toast('✓ CSV exportado!');
  }

  return (
    <div className="page-enter">
      <div className="ph">
        <div><div className="ph-title">Relatórios</div><div className="ph-sub">{new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })} · {colabs.length} colaboradores</div></div>
        <button className="btn btn-primary" onClick={exportCSV}>Exportar CSV</button>
      </div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-lbl">Score médio</div><div className="stat-val" style={{ color: scoreColor(avg) }}>{avg}</div><div className={`trend ${avg >= 75 ? 'trend-up' : 'trend-nt'}`}>{scoreLabel(avg)}</div></div>
        <div className="stat-card"><div className="stat-lbl">Total colaboradores</div><div className="stat-val">{colabs.length}</div></div>
        <div className="stat-card"><div className="stat-lbl">Ocorrências (total)</div><div className="stat-val">{ocorrs.length}</div></div>
        <div className="stat-card"><div className="stat-lbl">Pesquisas realizadas</div><div className="stat-val">{surveys.length}</div></div>
      </div>
      <div className="card-grid">
        <div className="card">
          <div className="sh">Evolução do score comportamental</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 90 }}>
            {vals.map((v, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: i === vals.length - 1 ? 'var(--teal2)' : 'var(--gray)' }}>{v}</div>
                <div style={{ width: '100%', background: i === vals.length - 1 ? 'var(--teal)' : 'rgba(0,212,180,.25)', borderRadius: '3px 3px 0 0', height: (v / maxV) * 70 }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            {months.map((m, i) => <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 9, color: i === months.length - 1 ? 'var(--teal2)' : 'var(--gray)', fontWeight: i === months.length - 1 ? 700 : 400 }}>{m}</div>)}
          </div>
        </div>
        <div className="card">
          <div className="sh">Conformidade por departamento</div>
          {depts.map(dept => {
            const dc = scored.filter(x => x.c.dept === dept);
            const a = dc.length ? Math.round(dc.reduce((s, x) => s + x.s.final, 0) / dc.length) : 0;
            return <div className="dim-row" key={dept}><span className="dim-label">{dept}</span><div className="dim-track"><div className="dim-fill" style={{ width: `${a}%`, background: scoreColor(a) }} /></div><span className="dim-val" style={{ color: scoreColor(a) }}>{a}</span></div>;
          })}
          {depts.length === 0 && <div style={{ fontSize: 12, color: 'var(--gray)' }}>Adicione colaboradores.</div>}
        </div>
      </div>
      <div className="card">
        <div className="sh">Ranking comportamental completo</div>
        <div className="tbl-overflow">
          <table className="tbl">
            <thead><tr><th>#</th><th>Colaborador</th><th>Score</th><th>Conformidade</th><th>Ocorrências</th><th>Risco</th></tr></thead>
            <tbody>
              {scored.map(({ c, s }, i) => {
                const myOc = ocorrs.filter(o => o.colabId == c.id);
                return (
                  <tr key={c.id}>
                    <td style={{ fontFamily: 'var(--font-h)', fontWeight: 700, color: i < 3 ? 'var(--gold)' : 'var(--gray)' }}>{i + 1}</td>
                    <td><div className="uc"><div className="av" style={{ background: c.cor || 'var(--off2)', color: c.corTxt || 'var(--gray)', width: 24, height: 24, fontSize: 9 }}>{c.avatar || c.nome?.[0]}</div><div className="un">{c.nome}</div></div></td>
                    <td><span className={`score-badge ${scoreClass(s.final)}`}>{s.final}</span></td>
                    <td>{s.final}%</td>
                    <td>{myOc.length}</td>
                    <td><span className={`badge ${s.final < 50 ? 'b-red' : s.final < 70 ? 'b-yellow' : 'b-green'}`}>{s.final < 50 ? 'Alto' : s.final < 70 ? 'Médio' : 'Baixo'}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
