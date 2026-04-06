import React, { useState, useEffect } from 'react';
import { Plus, Search, X, RefreshCw } from 'lucide-react';
import DB from '../../lib/db';
import { useData } from '../../hooks/useData';
import { calcScore, scoreColor, scoreLabel, scoreClass } from '../../lib/scoreEngine';
import Modal, { useModal } from '../../components/Modal';
import { useToast } from '../../components/Toast';

export default function Colaboradores() {
  const toast = useToast();
  const [filter, setFilter] = useState('');
  const modal = useModal();
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({ nome: '', email: '', cargo: '', dept: '', admissao: '', gestor: '', status: 'onboarding' });

  const [allColabs, loading, error, refresh] = useData('colabs');
  
  const colabs = allColabs.filter(c =>
    !filter || c.nome?.toLowerCase().includes(filter.toLowerCase()) ||
    c.dept?.toLowerCase().includes(filter.toLowerCase()) ||
    c.cargo?.toLowerCase().includes(filter.toLowerCase())
  );
  
  const depts = [...new Set(allColabs.map(c => c.dept).filter(Boolean))].sort();
  const stMap = { ativo: 'b-green', alerta: 'b-red', onboarding: 'b-teal', afastado: 'b-yellow' };
  const deptList = ['RH', 'Administração', 'Jurídico', 'Almoxarifado', 'Manutenção', 'TI', 'Comercial', 'Financeiro', 'Operacional', 'Atendimento'];

  const colors = [
    ['rgba(0,212,180,.15)', 'var(--teal2)'], ['rgba(245,158,11,.15)', '#92400E'],
    ['rgba(59,130,246,.15)', 'var(--blue)'], ['rgba(99,102,241,.15)', '#4338CA'],
    ['rgba(236,72,153,.1)', '#9D174D'], ['rgba(16,185,129,.1)', '#065F46'],
    ['rgba(139,92,246,.1)', '#5B21B6']
  ];

  function openNew() {
    setEditId(null);
    setForm({ nome: '', email: '', cargo: '', dept: '', admissao: new Date().toISOString().split('T')[0], gestor: '', status: 'onboarding' });
    modal.open();
  }

  function openEdit(c) {
    setEditId(c.id);
    setForm({ nome: c.nome, email: c.email, cargo: c.cargo, dept: c.dept, admissao: c.admissao, gestor: c.gestor || '', status: c.status });
    modal.open();
  }

  async function save() {
    if (!form.nome || !form.email || !form.cargo || !form.dept) { toast('Preencha os campos obrigatórios'); return; }
    setSubmitting(true);
    try {
      const initials = form.nome.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
      const colorPair = colors[allColabs.length % colors.length];
      const data = { ...form, avatar: initials, cor: colorPair[0], cor_txt: colorPair[1] };

      if (editId) { await DB.update('colabs', editId, data); toast('Colaborador atualizado!'); }
      else { await DB.push('colabs', data); toast('Colaborador adicionado!'); }
      modal.close();
      refresh();
    } catch (err) {
      toast('Erro ao salvar: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function del(id, nome) {
    if (confirm(`Remover ${nome}?`)) {
      try {
        await DB.delete('colabs', id);
        toast('Colaborador removido.');
        refresh();
      } catch (err) {
        toast('Erro ao remover: ' + err.message);
      }
    }
  }

  const activeDepts = filter && depts.includes(filter) ? [filter] : depts;
  const colabsByDept = activeDepts.reduce((acc, d) => {
    const list = colabs.filter(c => c.dept === d);
    if (list.length > 0) acc[d] = list;
    return acc;
  }, {});

  if (!filter || !depts.includes(filter)) {
    const others = colabs.filter(c => !c.dept || !depts.includes(c.dept));
    if (others.length > 0) colabsByDept['Outros'] = others;
  }

  if (loading) return <div className="page-enter" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}><RefreshCw className="spin" /></div>;

  return (
    <div className="page-enter">
      <div className="ph">
        <div><div className="ph-title">Colaboradores</div><div className="ph-sub">{allColabs.length} perfis cadastrados no Supabase</div></div>
        <div className="ph-actions">
           <button className="btn btn-primary" onClick={openNew}><Plus size={13} /> Adicionar</button>
        </div>
      </div>

      <div className="search-box">
        <Search size={13} style={{ color: 'var(--gray2)', flexShrink: 0 }} />
        <input type="text" placeholder="Buscar..." value={filter} onChange={e => setFilter(e.target.value)} />
      </div>

      <div className="filters">
        <button className={`chip ${!filter ? 'active' : ''}`} onClick={() => setFilter('')}>Todos ({allColabs.length})</button>
        {depts.map(d => <button className={`chip ${filter === d ? 'active' : ''}`} key={d} onClick={() => setFilter(d)}>{d}</button>)}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="tbl-overflow">
          <table className="tbl">
            <thead><tr><th>Colaborador</th><th>Cargo</th><th>Admissão</th><th>Score</th><th>Conformidade</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {Object.entries(colabsByDept).map(([dept, list]) => (
                <React.Fragment key={dept}>
                  <tr style={{ background: 'var(--off)', fontWeight: 700 }}><td colSpan="7" style={{ padding: '10px 16px', fontSize: 11, textTransform: 'uppercase', color: 'var(--navy)' }}>📂 {dept}</td></tr>
                  {list.map(c => {
                    const s = calcScore(c);
                    return (
                      <tr key={c.id}>
                        <td><div className="uc"><div className="av" style={{ background: c.cor, color: c.cor_txt }}>{c.avatar}</div><div><div className="un">{c.nome}</div><div className="ur">{c.email}</div></div></div></td>
                        <td>{c.cargo}</td>
                        <td>{c.admissao ? new Date(c.admissao + 'T12:00').toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }) : '—'}</td>
                        <td><span className={`score-badge ${scoreClass(s.final)}`}>{s.final}</span></td>
                        <td><div className="prog" style={{ width: 60 }}><div className="prog-fill" style={{ width: `${s.final}%`, background: scoreColor(s.final) }} /></div></td>
                        <td><span className={`badge ${stMap[c.status] || 'b-gray'}`}>{c.status}</span></td>
                        <td><button className="btn btn-ghost" onClick={() => openEdit(c)}>Editar</button></td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modal.isOpen} onClose={modal.close} title={editId ? 'Editar colaborador' : 'Novo colaborador'}>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Nome completo *</label><input className="form-input" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">E-mail *</label><input className="form-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Cargo *</label><input className="form-input" value={form.cargo} onChange={e => setForm({ ...form, cargo: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">Departamento *</label>
            <select className="form-select" value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })}>
              <option value="">Selecione</option>
              {deptList.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group"><label className="form-label">Data de admissão *</label><input className="form-input" type="date" value={form.admissao} onChange={e => setForm({ ...form, admissao: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">Gestor direto</label><input className="form-input" value={form.gestor} onChange={e => setForm({ ...form, gestor: e.target.value })} /></div>
        </div>
        <div className="modal-footer">
          {editId && <button className="btn btn-danger" style={{ marginRight: 'auto' }} onClick={() => { del(editId, form.nome); modal.close(); }}>Remover</button>}
          <button className="btn btn-ghost" onClick={modal.close}>Cancelar</button>
          <button className="btn btn-primary" onClick={save} disabled={submitting}>{submitting ? 'Salvando...' : 'Salvar'}</button>
        </div>
      </Modal>
    </div>
  );
}
