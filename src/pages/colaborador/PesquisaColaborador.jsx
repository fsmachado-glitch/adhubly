import { useState } from 'react';
import DB from '../../lib/db';
import { useToast } from '../../components/Toast';

export default function PesquisaColaborador() {
  const toast = useToast();
  const [answers, setAnswers] = useState({});
  const questions = [
    { k: 'enps', text: 'Em uma escala de 0 a 10, qual a probabilidade de recomendar esta empresa?', max: 10 },
    { k: 'seg1', text: 'Sinto-me seguro(a) para expressar opiniões diferentes das do meu gestor.', max: 5 },
    { k: 'seg2', text: 'Posso admitir erros sem medo de consequências negativas.', max: 5 },
    { k: 'resp1', text: 'As metas que tenho são claras e alcançáveis.', max: 5 },
    { k: 'resp2', text: 'Quando cometo erros, recebo feedback construtivo.', max: 5 },
    { k: 'lid1', text: 'Meu gestor me apoia no desenvolvimento profissional.', max: 5 },
    { k: 'lid2', text: 'Existe abertura para dar feedback à liderança.', max: 5 },
  ];

  function submit() {
    const keys = questions.map(q => q.k);
    if (keys.some(k => !answers[k])) { toast('Responda todas as perguntas'); return; }
    const surveys = DB.getArr('surveys');
    const period = new Date().toISOString().slice(0, 7);
    const existing = surveys.find(s => s.periodo === period);
    if (existing) { existing.respostas.push(answers); DB.set('surveys', surveys); }
    else DB.push('surveys', { periodo: period, respostas: [answers] });
    toast('✓ Pesquisa enviada! Sua resposta é anônima.');
    setAnswers({});
  }

  return (
    <div className="page-enter">
      <div className="ph"><div><div className="ph-title">Pesquisa de Clima</div><div className="ph-sub">Sua resposta é anônima e contribui para melhorar o ambiente</div></div></div>
      <div className="card">
        <div className="sh">Pesquisa do mês</div>
        {questions.map(q => (
          <div className="survey-q" key={q.k}>
            <div className="survey-q-text">{q.text}</div>
            <div className="survey-scale">
              {Array.from({ length: q.max }, (_, i) => i + 1).map(n => (
                <div key={n} className={`survey-num ${answers[q.k] === n ? 'sel' : ''}`} onClick={() => setAnswers({ ...answers, [q.k]: n })}>{n}</div>
              ))}
            </div>
          </div>
        ))}
        <button className="btn btn-primary" onClick={submit} style={{ marginTop: '.75rem' }}>Enviar respostas</button>
      </div>
    </div>
  );
}
