import DB from './db';
import { supabase } from './supabase';

export async function seedIfEmpty() {
  const { data: existing } = await supabase.from('colabs').select('id').limit(1);
  if (existing && existing.length > 0) return;

  console.log('🌱 Semeando dados iniciais no Supabase...');

  const colabs = [
    { nome: 'Carlos Mendes', email: 'carlos.mendes@adhubly.com', cargo: 'CEO / Diretor', dept: 'Administração', admissao: '2020-01-01', gestor: '-', status: 'ativo', avatar: 'CM', cor: 'var(--navy2)', cor_txt: 'white' },
    { nome: 'Juliana Rosa', email: 'juliana.rosa@adhubly.com', cargo: 'Secretária Executiva', dept: 'Administração', admissao: '2022-05-10', gestor: 'Carlos Mendes', status: 'ativo', avatar: 'JR', cor: 'var(--off2)', cor_txt: 'var(--gray)' },
    { nome: 'Ana Lima', email: 'ana.lima@adhubly.com', cargo: 'Gerente Comercial', dept: 'Comercial', admissao: '2022-03-15', gestor: 'Carlos Mendes', status: 'ativo', avatar: 'AL', cor: 'rgba(0,212,180,.15)', cor_txt: 'var(--teal2)' },
    { nome: 'Lucas Oliveira', email: 'lucas.oliveira@adhubly.com', cargo: 'Consultor de Vendas', dept: 'Comercial', admissao: '2024-01-15', gestor: 'Ana Lima', status: 'ativo', avatar: 'LO', cor: 'rgba(16,185,129,.1)', cor_txt: '#065F46' },
    { nome: 'Tatiane Dias', email: 'tatiane.dias@adhubly.com', cargo: 'Inside Sales', dept: 'Comercial', admissao: '2025-02-01', gestor: 'Ana Lima', status: 'onboarding', avatar: 'TD', cor: 'rgba(236,72,153,.1)', cor_txt: '#9D174D' },
    { nome: 'Mariana Souza', email: 'mariana.souza@adhubly.com', cargo: 'Coordenadora RH', dept: 'RH', admissao: '2023-10-10', gestor: 'Carlos Mendes', status: 'ativo', avatar: 'MS', cor: 'rgba(59,130,246,.15)', cor_txt: 'var(--blue)' },
    { nome: 'Ricardo Silva', email: 'ricardo.silva@adhubly.com', cargo: 'Analista de DP', dept: 'RH', admissao: '2024-05-20', gestor: 'Mariana Souza', status: 'ativo', avatar: 'RS', cor: 'var(--off2)', cor_txt: 'var(--gray)' },
    { nome: 'Carla Ferreira', email: 'carla.ferreira@adhubly.com', cargo: 'Tech Lead', dept: 'TI', admissao: '2022-08-05', gestor: 'Carlos Mendes', status: 'ativo', avatar: 'CF', cor: 'rgba(99,102,241,.15)', cor_txt: '#4338CA' },
    { nome: 'Danilo Vaz', email: 'danilo.vaz@adhubly.com', cargo: 'Dev Fullstack', dept: 'TI', admissao: '2024-11-12', gestor: 'Carla Ferreira', status: 'ativo', avatar: 'DV', cor: 'var(--off2)', cor_txt: 'var(--gray)' },
    { nome: 'Bruno Costa', email: 'bruno.costa@adhubly.com', cargo: 'Diretor Financeiro', dept: 'Financeiro', admissao: '2021-01-20', gestor: 'Carlos Mendes', status: 'ativo', avatar: 'BC', cor: 'rgba(245,158,11,.15)', cor_txt: '#92400E' },
    { nome: 'Beatriz Sol', email: 'beatriz.sol@adhubly.com', cargo: 'Analista de Contas', dept: 'Financeiro', admissao: '2023-09-01', gestor: 'Bruno Costa', status: 'ativo', avatar: 'BS', cor: 'var(--off2)', cor_txt: 'var(--gray)' },
    { nome: 'André Santos', email: 'andre.santos@adhubly.com', cargo: 'Advogado Sênior', dept: 'Jurídico', admissao: '2023-04-10', gestor: 'Carlos Mendes', status: 'ativo', avatar: 'AS', cor: 'rgba(139,92,246,.1)', cor_txt: '#5B21B6' },
    { nome: 'Sofia Melo', email: 'sofia.melo@adhubly.com', cargo: 'Analista de Compliance', dept: 'Jurídico', admissao: '2024-07-15', gestor: 'André Santos', status: 'ativo', avatar: 'SM', cor: 'var(--off2)', cor_txt: 'var(--gray)' },
    { nome: 'João Guedes', email: 'joao.guedes@adhubly.com', cargo: 'Encarregado de Estoque', dept: 'Almoxarifado', admissao: '2021-03-01', gestor: 'Bruno Costa', status: 'ativo', avatar: 'JG', cor: '#FEE2E2', cor_txt: '#991B1B' },
    { nome: 'Pedro Lucas', email: 'pedro.lucas@adhubly.com', cargo: 'Auxiliar de Logística', dept: 'Almoxarifado', admissao: '2024-10-05', gestor: 'João Guedes', status: 'ativo', avatar: 'PL', cor: 'var(--off2)', cor_txt: 'var(--gray)' },
    { nome: 'Marcos Lima', email: 'marcos.lima@adhubly.com', cargo: 'Técnico Manutenção', dept: 'Manutenção', admissao: '2022-11-20', gestor: 'Juliana Rosa', status: 'ativo', avatar: 'ML', cor: '#FEF3C7', cor_txt: '#92400E' },
    { nome: 'Pedro Alves', email: 'pedro.alves@adhubly.com', cargo: 'Líder de Produção', dept: 'Operacional', admissao: '2021-06-10', gestor: 'Carlos Mendes', status: 'alerta', avatar: 'PA', cor: '#FEE2E2', cor_txt: '#991B1B' },
    { nome: 'Fernanda Rocha', email: 'fernanda.rocha@adhubly.com', cargo: 'Operadora de Máquina', dept: 'Operacional', admissao: '2024-06-01', gestor: 'Pedro Alves', status: 'ativo', avatar: 'FR', cor: 'var(--off2)', cor_txt: 'var(--gray)' },
    { nome: 'Vanessa Costa', email: 'vanessa.costa@adhubly.com', cargo: 'Coordenadora de CS', dept: 'Atendimento', admissao: '2023-08-15', gestor: 'Ana Lima', status: 'ativo', avatar: 'VC', cor: '#DBEAFE', cor_txt: '#1E40AF' },
    { nome: 'Paulo Junior', email: 'paulo.junior@adhubly.com', cargo: 'Analista de Suporte', dept: 'Atendimento', admissao: '2025-01-05', gestor: 'Vanessa Costa', status: 'ativo', avatar: 'PJ', cor: 'var(--off2)', cor_txt: 'var(--gray)' },
  ];

  // Insert colabs and get their real IDs
  const { data: insertedColabs, error: colabError } = await supabase.from('colabs').insert(colabs).select();
  if (colabError) { console.error('Erro ao semear colabs:', colabError); return; }

  const findId = (nome) => insertedColabs.find(x => x.nome === nome)?.id;

  const ocorr = [
    { colab_id: findId('Pedro Alves'), tipo: 'Advertência verbal', data: '2025-03-12', resp: 'Carlos Mendes', descricao: '5 ausências não justificadas nos últimos 30 dias na linha de produção.', status: 'aberta' },
    { colab_id: findId('João Guedes'), tipo: 'Atraso recorrente', data: '2025-03-20', resp: 'Bruno Costa', descricao: 'Atraso sistemático na abertura do almoxarifado afetando a recepção de materiais.', status: 'aberta' },
    { colab_id: findId('Danilo Vaz'), tipo: 'Meta não cumprida', data: '2025-03-05', resp: 'Carla Ferreira', descricao: 'Atraso na entrega da API de documentos.', status: 'resolvida' },
    { colab_id: findId('Ana Lima'), tipo: 'Elogio formal', data: '2025-03-25', resp: 'Carlos Mendes', descricao: 'Excelência na gestão das equipes Comercial e Atendimento.', status: 'resolvida' },
  ];
  await supabase.from('ocorrencias').insert(ocorr);

  const evals = [
    { avaliado: findId('Ana Lima'), tipo: 'gestor', criterios: { comunicacao: 5, responsabilizacao: 5, colaboracao: 5, lideranca: 5, feedback: 5, etica: 5 }, comment: 'Liderança excepcional.' },
    { avaliado: findId('Pedro Alves'), tipo: 'gestor', criterios: { comunicacao: 3, responsabilizacao: 2, colaboracao: 3, lideranca: 2, feedback: 2, etica: 4 }, comment: 'Precisa melhorar pontualidade.' },
    { avaliado: findId('Carla Ferreira'), tipo: 'gestor', criterios: { comunicacao: 4, responsabilizacao: 4, colaboracao: 5, lideranca: 4, feedback: 4, etica: 5 }, comment: 'Excelente técnica.' },
  ];
  await supabase.from('evals360').insert(evals);

  const videos = [
    { titulo: 'Onboarding Adhubly 2025', cat: 'Institucional', dur: '10:00', obrig: 'todos' },
    { titulo: 'Segurança no Trabalho (EPI/EPC)', cat: 'Segurança', dur: '20:00', obrig: 'todos' },
    { titulo: 'Compliance e Ética', cat: 'Conformidade', dur: '15:00', obrig: 'todos' },
  ];
  await supabase.from('videos').insert(videos);

  const docs = [
    { nome: 'Código de Conduta v3.2', tipo: 'Política', validade: '2025-12-31', dest: 'todos', assinados: 12, status: 'parcial' },
    { nome: 'Manual de Segurança Almoxarifado', tipo: 'Segurança', validade: '2026-01-01', dest: 'Almoxarifado', assinados: 1, status: 'parcial' },
  ];
  await supabase.from('docs').insert(docs);

  console.log('✅ Dados semeados com sucesso!');
}
