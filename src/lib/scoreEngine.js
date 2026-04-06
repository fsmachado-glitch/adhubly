import DB from './db';

export function calcScore(colab) {
  const w = DB.get('weights') || { resp: 30, seg: 30, lid: 20, risco: 20 };
  const ocorrs = DB.getArr('ocorrencias').filter(o => o.colabId == colab.id);
  const evals = DB.getArr('evals360').filter(e => e.avaliado == colab.id);
  const surveys = DB.getArr('surveys');
  const vids = DB.getArr('videos');
  const totalVids = vids.filter(v => v.obrig == 'todos').length || 1;
  const vidsDone = Math.min(colab.videosDone || Math.floor(Math.random() * totalVids + 1), totalVids);

  // Responsabilização
  const negOc = ocorrs.filter(o =>
    ['Advertência verbal', 'Advertência escrita', 'Suspensão', 'Meta não cumprida', 'Absenteísmo'].includes(o.tipo)
  ).length;
  const resp = Math.max(0, Math.min(100, 100 - (negOc * 15) + (vidsDone / totalVids * 20)));

  // Segurança psicológica
  const latestSurvey = surveys[surveys.length - 1];
  let segScore = 70;
  if (latestSurvey && latestSurvey.respostas?.length > 0) {
    const r = latestSurvey.respostas[0];
    segScore = ((r.seg1 + r.seg2) / 2 / 5) * 100;
    segScore = Math.max(0, Math.min(100, segScore + (r.enps - 5) * 3));
  }

  // Liderança (média das avaliações 360)
  let lidScore = 70;
  if (evals.length > 0) {
    const avg = evals.reduce((s, e) => {
      const c = e.criterios;
      return s + (c.lideranca + c.feedback + c.comunicacao) / 3;
    }, 0) / evals.length;
    lidScore = (avg / 5) * 100;
  }

  // Risco comportamental (inverso)
  const confOc = ocorrs.filter(o =>
    ['Conflito reportado', 'Assédio reportado'].includes(o.tipo)
  ).length;
  const risco = Math.max(0, Math.min(100, 100 - (confOc * 20) - (negOc * 8)));

  const final = Math.round(
    (resp * w.resp / 100) + (segScore * w.seg / 100) +
    (lidScore * w.lid / 100) + (risco * w.risco / 100)
  );

  return {
    final,
    resp: Math.round(resp),
    seg: Math.round(segScore),
    lid: Math.round(lidScore),
    risco: Math.round(risco)
  };
}

export function scoreClass(s) {
  if (s >= 75) return 'score-high';
  if (s >= 50) return 'score-mid';
  return 'score-low';
}

export function scoreLabel(s) {
  if (s >= 75) return 'Saudável';
  if (s >= 50) return 'Atenção';
  return 'Risco alto';
}

export function scoreColor(s) {
  if (s >= 75) return 'var(--success)';
  if (s >= 50) return 'var(--warn)';
  return 'var(--danger)';
}
