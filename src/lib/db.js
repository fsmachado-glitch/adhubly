import { supabase } from './supabase';

const DB = {
  _cache: {},

  // Preloads all tables into memory at login to prevent sync errors in older components
  async preloadAll() {
    const tables = ['colabs', 'ocorrencias', 'evals360', 'surveys', 'videos', 'epis', 'docs', 'denuncias', 'ai_analyses'];
    await Promise.all(tables.map(async (t) => {
      const { data } = await supabase.from(t).select('*').order('created_at', { ascending: false });
      this._cache[t] = data || [];
    }));
    await this.getConfig();
    this._cache['weights'] = { resp: 30, seg: 30, lid: 20, risco: 20 };
  },

  // Sync getter for cached config
  get(key) {
    return this._cache[key] || null;
  },

  // Sync getter for cached arrays (Prevents React crashes in scoreEngine, Sidebar, etc)
  getArr(table) {
    return this._cache[table] || [];
  },

  // Async fetcher for components that use useData hook
  async fetchArr(table) {
    const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false });
    if (error) {
      console.error(`Error fetching from ${table}:`, error);
      return [];
    }
    this._cache[table] = data; // Update cache
    return data;
  },

  async getConfig() {
    const { data, error } = await supabase.from('config').select('data').eq('id', 1).single();
    if (error) console.error('Error fetching config:', error);
    this._cache['config'] = data?.data || {};
    return this._cache['config'];
  },

  async setConfig(configData) {
    const { error } = await supabase.from('config').update({ data: configData }).eq('id', 1);
    if (!error) this._cache['config'] = configData;
  },

  async push(table, item) {
    const { data, error } = await supabase.from(table).insert([item]).select().single();
    if (error) throw error;
    if (this._cache[table]) this._cache[table].unshift(data); // Optimistic cache UI update
    return data;
  },

  async update(table, id, patch) {
    const { data, error } = await supabase.from(table).update(patch).eq('id', id).select().single();
    if (error) throw error;
    if (this._cache[table]) {
      const idx = this._cache[table].findIndex(x => x.id === id);
      if (idx !== -1) this._cache[table][idx] = { ...this._cache[table][idx], ...data };
    }
    return data;
  },

  async delete(table, id) {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
    if (this._cache[table]) {
      this._cache[table] = this._cache[table].filter(x => x.id !== id);
    }
  },

  async getColabs() {
    return this.fetchArr('colabs');
  },

  async getOcorrencias(colabId) {
    let query = supabase.from('ocorrencias').select('*').order('data', { ascending: false });
    if (colabId) query = query.eq('colab_id', colabId);
    const { data } = await query;
    return data || [];
  }
};

export default DB;
