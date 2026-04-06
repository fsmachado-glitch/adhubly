import React from 'react';
import { useData } from '../../hooks/useData';

export default function MapaDores() {
  const [colabs, loading] = useData('colabs');
  if (loading) return <div className="page-enter">Carregando mapa...</div>;
  return (
    <div className="page-enter">
      <div className="ph"><div><div className="ph-title">Mapa de Dores</div><div className="ph-sub">Visualização de riscos por setor</div></div></div>
      <div className="card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--gray)' }}>📊 Mapa em processamento no Supabase...</div>
    </div>
  );
}
