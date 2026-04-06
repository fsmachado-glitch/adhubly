import { GoogleGenerativeAI } from '@google/generative-ai';
import DB from './db';
import { calcScore, scoreLabel } from './scoreEngine';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
function getAI() {
  if (!genAI && API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
  }
  return genAI;
}

export async function analyzeColaborador(colabId) {
  const ai = getAI();
  if (!ai) throw new Error('Chave da API Gemini não configurada.');

  const colabs = DB.getArr('colabs');
  const colab = colabs.find(c => c.id == colabId);
  if (!colab) throw new Error('Colaborador não encontrado.');

  const score = calcScore(colab);
  const ocorrs = DB.getArr('ocorrencias').filter(o => o.colabId == colabId);
  const evals = DB.getArr('evals360').filter(e => e.avaliado == colabId);
  const surveys = DB.getArr('surveys');
  const videos = DB.getArr('videos');
  const docs = DB.getArr('docs');
  const epis = DB.getArr('epis').filter(e => e.colabId == colabId);

  const prompt = `Você é o Adhubly AI, um sistema de inteligência artificial de gestão de pessoas para empresas brasileiras.
Analise o perfil completo do colaborador abaixo e gere uma análise detalhada em PORTUGUÊS BRASILEIRO.

═══ DADOS DO COLABORADOR ═══
Nome: ${colab.nome}
Cargo: ${colab.cargo}
Departamento: ${colab.dept}
Status: ${colab.status}
Data de admissão: ${colab.admissao}
Gestor direto: ${colab.gestor || 'Não informado'}

═══ SCORE COMPORTAMENTAL (0-100) ═══
Score final: ${score.final} (${scoreLabel(score.final)})
- Responsabilização: ${score.resp}
- Segurança psicológica: ${score.seg}
- Liderança: ${score.lid}
- Risco comportamental: ${score.risco}

═══ OCORRÊNCIAS (${ocorrs.length}) ═══
${ocorrs.length > 0
      ? ocorrs.map(o => `- [${o.tipo}] ${o.data}: ${o.desc} (Status: ${o.status})`).join('\n')
      : 'Nenhuma ocorrência registrada.'
    }

═══ AVALIAÇÕES 360° (${evals.length}) ═══
${evals.length > 0
      ? evals.map(e => {
        const c = e.criterios;
        const avg = Object.values(c).reduce((a, b) => a + b, 0) / Object.values(c).length;
        return `- Tipo: ${e.tipo} | Média: ${avg.toFixed(1)}/5 | Comunicação: ${c.comunicacao}/5 | Responsabilização: ${c.responsabilizacao}/5 | Colaboração: ${c.colaboracao}/5 | Liderança: ${c.lideranca}/5 | Feedback: ${c.feedback}/5 | Ética: ${c.etica}/5 | Comentário: "${e.comment}"`;
      }).join('\n')
      : 'Nenhuma avaliação 360° realizada.'
    }

═══ PESQUISAS DE CLIMA (última) ═══
${surveys.length > 0
      ? `Período: ${surveys[surveys.length - 1].periodo} | Respostas: ${surveys[surveys.length - 1].respostas?.length || 0}`
      : 'Nenhuma pesquisa realizada.'
    }

═══ TREINAMENTOS ═══
Total de vídeos obrigatórios: ${videos.filter(v => v.obrig === 'todos').length}
Total de vídeos na plataforma: ${videos.length}

═══ DOCUMENTOS ═══
Pendentes de assinatura: ${docs.filter(d => d.status === 'parcial').length}
Expirados: ${docs.filter(d => d.status === 'expirado').length}

═══ EPIs ═══
${epis.length > 0
      ? epis.map(e => `- ${e.item}: Entrega ${e.entrega} | Validade ${e.validade} | Aceite: ${e.aceite ? 'Sim' : 'NÃO'}`).join('\n')
      : 'Nenhum EPI registrado.'
    }

═══ INSTRUÇÕES DE RESPOSTA ═══
Responda EXCLUSIVAMENTE em JSON válido com a seguinte estrutura:
{
  "diagnostico": "Texto com 2-3 parágrafos analisando o estado atual do colaborador, incluindo pontos fortes e fracos identificados",
  "termometro": <número de 0 a 100 representando a "saúde" geral do colaborador>,
  "termometroLabel": "Excelente|Bom|Atenção|Preocupante|Crítico",
  "riscos": [
    {"tipo": "turnover|burnout|conflito|compliance|acidente", "probabilidade": <0-100>, "motivo": "explicação em 1 frase"}
  ],
  "recomendacoes": [
    {"acao": "Título da ação", "descricao": "Descrição detalhada", "urgencia": "imediata|curto_prazo|medio_prazo", "tipo": "feedback|treinamento|promocao|advertencia|acompanhamento|epi"}
  ],
  "pontosFortres": ["ponto 1", "ponto 2"],
  "pontosAtencao": ["ponto 1", "ponto 2"],
  "previsao30dias": "Previsão para os próximos 30 dias em 1-2 frases"
}`;

  try {
    const modelName = 'gemini-2.5-flash';
    console.log('[Adhubly AI Engine v1.2] Usando modelo:', modelName);
    const model = ai.getGenerativeModel({ model: modelName }, { apiVersion: 'v1beta' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Resposta da IA recebida.');

    if (!text) throw new Error('A IA retornou uma resposta vazia.');

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Resposta da IA não contém JSON válido.');

    const analysis = JSON.parse(jsonMatch[0]);
    analysis.colabId = colabId;
    analysis.colabNome = colab.nome;
    analysis.generatedAt = new Date().toISOString();

    // Save to cache
    const cache = DB.getArr('aiAnalyses');
    cache.push(analysis);
    // Keep only last 50 analyses
    if (cache.length > 50) cache.splice(0, cache.length - 50);
    DB.set('aiAnalyses', cache);

    return analysis;
  } catch (err) {
    console.error('AI Engine Error:', err);
    throw new Error('Falha ao gerar análise: ' + err.message);
  }
}

export async function analyzeAllColaboradores() {
  const colabs = DB.getArr('colabs');
  const results = [];
  for (const c of colabs) {
    try {
      const analysis = await analyzeColaborador(c.id);
      results.push(analysis);
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      results.push({ colabId: c.id, colabNome: c.nome, error: err.message });
    }
  }
  return results;
}

export async function getLatestAnalysis(colabId) {
  const { data } = await supabase.from('ai_analyses').select('analysis').eq('colab_id', colabId).single();
  return data ? data.analysis : null;
}

export async function getAllLatestAnalyses() {
  const { data: colabs } = await supabase.from('colabs').select('*');
  const { data: analyses } = await supabase.from('ai_analyses').select('*');

  return colabs.map(c => {
    const ana = analyses.find(a => a.colab_id === c.id);
    return { colab: c, analysis: ana ? ana.analysis : null };
  });
}
