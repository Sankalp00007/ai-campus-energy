import { supabase } from './supabaseClient';
import { Building, Sensor, Alert, WifiPoint, SensorType, SensorStatus } from '../types';

export const api = {
  // --- BUILDINGS ---
  
  async getBuildings(): Promise<Building[]> {
    const { data, error } = await supabase.from('buildings').select('*').order('name');
    if (error) throw error;
    return data.map((b: any) => ({
      id: b.id,
      name: b.name,
      totalConsumption: Number(b.total_consumption),
      occupancy: b.occupancy,
      status: b.status
    }));
  },

  async addBuilding(building: Omit<Building, 'id'>): Promise<void> {
    const { error } = await supabase.from('buildings').insert({
      name: building.name,
      total_consumption: building.totalConsumption,
      occupancy: building.occupancy,
      status: building.status
    });
    if (error) {
        console.error("Supabase Error (addBuilding):", error);
        throw error;
    }
  },

  async updateBuilding(id: string, updates: Partial<Building>): Promise<void> {
    const dbUpdates: any = {};
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.totalConsumption !== undefined) dbUpdates.total_consumption = updates.totalConsumption;
    if (updates.occupancy !== undefined) dbUpdates.occupancy = updates.occupancy;
    if (updates.status) dbUpdates.status = updates.status;

    const { error } = await supabase.from('buildings').update(dbUpdates).eq('id', id);
    if (error) throw error;
  },

  async deleteBuilding(id: string): Promise<void> {
    const { error } = await supabase.from('buildings').delete().eq('id', id);
    if (error) throw error;
  },

  // --- SENSORS ---

  async getSensors(): Promise<Sensor[]> {
    const { data, error } = await supabase.from('sensors').select('*').order('name');
    if (error) throw error;
    return data.map((s: any) => ({
      id: s.id,
      name: s.name,
      type: s.type as SensorType,
      location: s.location,
      value: Number(s.value),
      unit: s.unit,
      status: s.status as SensorStatus,
      lastUpdated: new Date(s.last_updated),
      buildingId: s.building_id
    }));
  },

  async addSensor(sensor: Sensor): Promise<void> {
    const { error } = await supabase.from('sensors').insert({
      id: sensor.id,
      name: sensor.name,
      type: sensor.type,
      location: sensor.location,
      value: sensor.value,
      unit: sensor.unit,
      status: sensor.status,
      // Fix: Ensure empty string becomes null for UUID column
      building_id: sensor.buildingId || null
    });
    if (error) {
        console.error("Supabase Error (addSensor):", error);
        throw error;
    }
  },

  async updateSensor(id: string, updates: Partial<Sensor>): Promise<void> {
    const dbUpdates: any = { last_updated: new Date() };
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.type) dbUpdates.type = updates.type;
    if (updates.location) dbUpdates.location = updates.location;
    if (updates.value !== undefined) dbUpdates.value = updates.value;
    if (updates.unit) dbUpdates.unit = updates.unit;
    if (updates.status) dbUpdates.status = updates.status;
    
    // Fix: Handle empty string for UUID column on update
    if (updates.buildingId !== undefined) {
        dbUpdates.building_id = updates.buildingId || null;
    }

    const { error } = await supabase.from('sensors').update(dbUpdates).eq('id', id);
    if (error) throw error;
  },

  async deleteSensor(id: string): Promise<void> {
    const { error } = await supabase.from('sensors').delete().eq('id', id);
    if (error) throw error;
  },

  // --- ALERTS ---

  async getAlerts(): Promise<Alert[]> {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .order('timestamp', { ascending: false });
      
    if (error) throw error;
    return data.map((a: any) => ({
      id: a.id,
      title: a.title,
      message: a.message,
      severity: a.severity,
      timestamp: new Date(a.timestamp),
      resolved: a.resolved
    }));
  },

  async resolveAlert(id: string): Promise<void> {
    const { error } = await supabase
      .from('alerts')
      .update({ resolved: true })
      .eq('id', id);
    if (error) throw error;
  },

  // --- WIFI POINTS ---

  async getWifiPoints(): Promise<WifiPoint[]> {
    const { data, error } = await supabase.from('wifi_points').select('*').order('id');
    if (error) throw error;
    return data.map((w: any) => ({
      id: w.id,
      location: w.location,
      signalStrength: w.signal_strength,
      clients: w.clients,
      status: w.status
    }));
  },

  async addWifiPoint(point: WifiPoint): Promise<void> {
    const { error } = await supabase.from('wifi_points').insert({
      id: point.id,
      location: point.location,
      signal_strength: point.signalStrength,
      clients: point.clients,
      status: point.status
    });
    if (error) {
        console.error("Supabase Error (addWifiPoint):", error);
        throw error;
    }
  },

  async updateWifiPoint(id: string, updates: Partial<WifiPoint>): Promise<void> {
    const dbUpdates: any = {};
    if (updates.location) dbUpdates.location = updates.location;
    if (updates.signalStrength !== undefined) dbUpdates.signal_strength = updates.signalStrength;
    if (updates.clients !== undefined) dbUpdates.clients = updates.clients;
    if (updates.status) dbUpdates.status = updates.status;

    const { error } = await supabase.from('wifi_points').update(dbUpdates).eq('id', id);
    if (error) throw error;
  },

  async deleteWifiPoint(id: string): Promise<void> {
    const { error } = await supabase.from('wifi_points').delete().eq('id', id);
    if (error) throw error;
  }
};