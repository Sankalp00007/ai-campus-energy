export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  STUDENT = 'STUDENT'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export enum SensorType {
  POWER = 'POWER',
  WIFI = 'WIFI',
  TEMP = 'TEMP',
  PIR = 'PIR'
}

export enum SensorStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  WARNING = 'WARNING'
}

export interface Sensor {
  id: string;
  name: string;
  type: SensorType;
  location: string;
  value: string | number;
  unit: string;
  status: SensorStatus;
  lastUpdated: Date;
  buildingId?: string;
}

export interface Building {
  id: string;
  name: string;
  totalConsumption: number; // kWh
  occupancy: number; // percentage
  status: 'Good' | 'Warning' | 'Critical';
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  resolved: boolean;
}

export interface WifiPoint {
  id: string;
  location: string;
  signalStrength: number; // -dBm (lower is worse, higher is better, usually -30 to -90)
  clients: number;
  status: 'active' | 'down' | 'congested';
}