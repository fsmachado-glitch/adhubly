import { useState } from 'react';
import { Brain, Zap, RefreshCw } from 'lucide-react';
import DB from '../../lib/db';
import { calcScore, scoreColor, scoreLabel } from '../../lib/scoreEngine';
import { analyzeColaborador, getLatestAnalysis } from '../../lib/aiEngine';
import { useToast } from '../../components/Toast';

export default function MeuTermometro() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [, forceUpdate] = useState(0);
  const colabs = DB.getArr('colabs');
  const c = colabs[0] || { nome: 'Colaborador', id: null };
  const s = calcScore(c);
  const analysis = c.id ? getLatestAnalysis(c.id) : null;

  async function run() {
    if (!c.id) return;
    setLoading(true);
    try { await analyzeColaborador(c.id); toast('✨ Análise atualizada!'); } catch (err) { toast('Erro: ' + err.message); }
    setLoading(false); forceUpdate(n => n + 1);
  }

  return (
    <div className="page-enter">
      <div className="ph">
        <div><div className="ph-title">Meu Termômetro AI ✨</div><div className="ph-sub">Análise inteligente do seu perfil comportamental</div></div>
        <button className="btn btn-ai" onClick={run} disabled={loading}>
          {loading ? <><RefreshCw size={13} /> Analisando...</> : <><Zap size={13} /> Atualizar análise</>}
        </button>
      </div>
      <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
        <div style={{ fontFamily: 'var(--font-h)', fontSize: 64, fontWeight: 800, color: scoreColor(analysis?.termometro || s.final) }}>{analysis?.termometro || s.final}</div>
        <div style={{ fontSize: 14, color: 'var(--gray)' }}>{analysis?.termometroLabel || scoreLabel(s.final)}</div>
        <div className="termometro" style={{ maxWidth: 400, margin: '.75rem auto' }}>
          <div className="termometro-indicator" style={{ left: `${analysis?.termometro || s.final}%` }} />
        </div>
      </div>
      {analysis ? (
        <>
          <div className="card" style={{ background: 'var(--off)', border: 'none' }}>
            <div className="sh"><Brain size={14} style={{ marginRight: 6 }} /> Diagnóstico</div>
            <div style={{ fontSize: 13, color: 'var(--gray)', lineHeight: 1.7 }}>{analysis.diagnostico}</div>
          </div>
          {analysis.pontosFortres && (
            <div className="card-grid">
              <div className="card"><div className="sh">Pontos Fortes 💪</div>
                {analysis.pontosFortres.map((p, i) => <div key={i} style={{ fontSize: 12, color: '#065F46', background: '#D1FAE5', padding: '6px 10px', borderRadius: 6, marginBottom: 4 }}>✓ {p}</div>)}
              </div>
              <div className="card"><div className="sh">Pontos de Atenção ⚠️</div>
                {analysis.pontosAtencao?.map((p, i) => <div key={i} style={{ fontSize: 12, color: '#92400E', background: '#FEF3C7', padding: '6px 10px', borderRadius: 6, marginBottom: 4 }}>⚠ {p}</div>)}
              </div>
            </div>
          )}
          {analysis.recomendacoes && (
            <div className="card"><div className="sh">Recomendações para você</div>
              {analysis.recomendacoes.map((r, i) => (
                <div className="doc-row" key={i} style={{ cursor: 'default' }}>
                  <div className="doc-ico" style={{ background: 'rgba(0,212,180,.1)' }}><span style={{ fontSize: 12 }}>💡</span></div>
                  <div style={{ flex: 1 }}><div className="doc-name">{r.acao}</div><div className="doc-sub">{r.descricao}</div></div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="ai-card" style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="ai-pulse" style={{ justifyContent: 'center', marginBottom: '.5rem' }}>Motor de IA disponível</div>
          <p style={{ fontSize: 13, color: 'var(--gray)', maxWidth: 400, margin: '0 auto' }}>Clique em "Atualizar análise" para gerar seu diagnóstico personalizado com inteligência artificial.</p>
        </div>
      )}
    </div>
  );
}
