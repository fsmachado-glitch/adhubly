import React, { useState, useEffect } from 'react';
import { Save, Shield, Database, Trash2, RefreshCw } from 'lucide-react';
import DB from '../../lib/db';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../components/Toast';

export default function Configuracoes() {
  const toast = useToast();
  const [cfg, setCfg] = useState({ nome: '', seg: '', cnpj: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DB.getConfig().then(data => {
      setCfg(data);
      setLoading(false);
    });
  }, []);

  async function save() {
    setLoading(true);
    try {
      await DB.setConfig(cfg);
      toast('✅ Configurações salvas!');
    } catch (err) {
      toast('Erro ao salvar: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function clearDB() {
    if (confirm('⚠️ ATENÇÃO: Isso apagará TODOS os dados do Supabase. Deseja continuar?')) {
      toast('Limpando base...');
      // In a real app, we might just truncate tables.
      // For now, let's just toast.
      toast('Operação restrita para segurança.');
    }
  }

  if (loading) return <div className="page-enter">Carregando...</div>;

  return (
    <div className="page-enter">
      <div className="ph">
        <div><div className="ph-title">Configurações</div><div className="ph-sub">Gestão da conta e parâmetros do sistema</div></div>
      </div>

      <div className="grid">
        <div className="card">
          <div className="sh" style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}><Shield size={16} /> Dados da Empresa</div>
          <div className="form-group"><label className="form-label">Nome da Organização</label><input className="form-input" value={cfg.nome} onChange={e => setCfg({ ...cfg, nome: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">Segmento</label><input className="form-input" value={cfg.seg} onChange={e => setCfg({ ...cfg, seg: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">CNPJ</label><input className="form-input" value={cfg.cnpj} onChange={e => setCfg({ ...cfg, cnpj: e.target.value })} /></div>
          <button className="btn btn-primary" onClick={save} disabled={loading} style={{ marginTop: '1rem' }}>{loading ? <RefreshCw className="spin" size={14} /> : <Save size={13} />} Salvar Alterações</button>
        </div>

        <div className="card">
          <div className="sh" style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}><Database size={16} /> Manutenção</div>
          <p style={{ fontSize: 12, color: 'var(--gray)', marginBottom: '1.5rem' }}>Gerencie a persistência de dados no Supabase.</p>
          <button className="btn btn-danger" onClick={clearDB} style={{ width: '100%' }}><Trash2 size={13} /> Limpar Base de Dados</button>
        </div>
      </div>
    </div>
  );
}
