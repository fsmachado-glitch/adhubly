import { supabase } from './supabase';

const DB = {
  // Config data (single record)
  async getConfig() {
    const { data, error } = await supabase.from('config').select('data').eq('id', 1).single();
    if (error) console.error('Error fetching config:', error);
    return data?.data || {};
  },

  async setConfig(configData) {
    const { error } = await supabase.from('config').update({ data: configData }).eq('id', 1);
    if (error) console.error('Error updating config:', error);
  },

  // Generic array methods
  async getArr(table) {
    const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false });
    if (error) {
      console.error(`Error fetching from ${table}:`, error);
      return [];
    }
    return data;
  },

  async push(table, item) {
    // Supabase handles IDs automatically if we use UUID, but we can also pass one
    const { data, error } = await supabase.from(table).insert([item]).select().single();
    if (error) {
      console.error(`Error pushing to ${table}:`, error);
      throw error;
    }
    return data;
  },

  async update(table, id, patch) {
    const { data, error } = await supabase.from(table).update(patch).eq('id', id).select().single();
    if (error) {
      console.error(`Error updating ${table}:`, error);
      throw error;
    }
    return data;
  },

  async delete(table, id) {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) {
      console.error(`Error deleting from ${table}:`, error);
      throw error;
    }
  },

  // Specialized queries
  async getColabs() {
    return this.getArr('colabs');
  },

  async getOcorrencias(colabId) {
    let query = supabase.from('ocorrencias').select('*').order('data', { ascending: false });
    if (colabId) query = query.eq('colab_id', colabId);
    const { data } = await query;
    return data || [];
  }
};

export default DB;
