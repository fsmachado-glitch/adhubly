import { useState, useEffect } from 'react';
import DB from '../lib/db';

/**
 * Hook customizado para buscar dados do Supabase com estado de loading e erro.
 * @param {string} table - Nome da tabela (ex: 'colabs', 'ocorrencias').
 * @param {any} initialData - Valor inicial.
 * @returns {Array} [data, loading, error, refresh]
 */
export function useData(table, initialData = []) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchData() {
    setLoading(true);
    try {
      const result = await DB.fetchArr(table);
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [table]);

  return [data, loading, error, fetchData];
}
