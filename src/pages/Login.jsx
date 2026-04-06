import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/Toast';
import { Brain, Lock, Mail, RefreshCw } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast('👋 Bem-vindo de volta!');
    } catch (err) {
      toast('Erro: ' + (err.message === 'Invalid login credentials' ? 'E-mail ou senha inválidos' : err.message));
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp(e) {
    e.preventDefault();
    if (!email || !password) {
      toast('Por favor, preencha o e-mail e a senha antes de clicar em Criar agora.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      toast('📧 Verifique seu e-mail para confirmar o cadastro!');
    } catch (err) {
      toast('Erro: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--navy)', padding: '1rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: 400, padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 60, height: 60, borderRadius: '50%', background: 'rgba(0,212,180,.1)', color: 'var(--teal)', marginBottom: '1rem' }}>
            <Brain size={32} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-h)', fontSize: 24, fontWeight: 800, color: 'var(--navy)', marginBottom: '.25rem' }}>Adhubly</h1>
          <p style={{ fontSize: 13, color: 'var(--gray)' }}>Gestão Empresarial Inteligente</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}><Mail size={14} /> E-mail</label>
            <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="exemplo@dhubly.com" />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}><Lock size={14} /> Senha</label>
            <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>

          <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', height: 42 }} disabled={loading}>
            {loading ? <RefreshCw className="spin" size={16} /> : 'Entrar'}
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: 12, color: 'var(--gray)' }}>
            Não tem uma conta? <button type="button" className="link" onClick={handleSignUp} style={{ color: 'var(--teal2)' }}>Criar agora</button>
          </div>
        </form>

        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--off2)', textAlign: 'center' }}>
           <p style={{ fontSize: 11, color: 'var(--gray2)', lineHeight: 1.5 }}>
             Acesso restrito a gestores e colaboradores autorizados.
           </p>
        </div>
      </div>
    </div>
  );
}
