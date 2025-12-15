import { Alert, Building, Sensor, SensorStatus, SensorType, WifiPoint } from '../types';

// Mock Data Generators

export const generateMockSensors = (): Sensor[] => [
  { id: 'S-101', name: 'Main Lab AC Unit', type: SensorType.POWER, location: 'Science Block A', value: 2450, unit: 'W', status: SensorStatus.ONLINE, lastUpdated: new Date() },
  { id: 'S-102', name: 'Library Lighting', type: SensorType.POWER, location: 'Library Main Hall', value: 850, unit: 'W', status: SensorStatus.ONLINE, lastUpdated: new Date() },
  { id: 'S-103', name: 'Server Room Temp', type: SensorType.TEMP, location: 'IT Center', value: 21.5, unit: '°C', status: SensorStatus.ONLINE, lastUpdated: new Date() },
  { id: 'S-104', name: 'Corridor Motion', type: SensorType.PIR, location: 'Dorm Block B', value: 'Active', unit: '', status: SensorStatus.ONLINE, lastUpdated: new Date() },
  { id: 'S-105', name: 'Cafeteria WiFi', type: SensorType.WIFI, location: 'Student Center', value: -45, unit: 'dBm', status: SensorStatus.WARNING, lastUpdated: new Date() },
  { id: 'S-106', name: 'Lab Equipment 4', type: SensorType.POWER, location: 'Science Block A', value: 0, unit: 'W', status: SensorStatus.OFFLINE, lastUpdated: new Date() },
  { id: 'S-107', name: 'Lecture Hall 1 AC', type: SensorType.POWER, location: 'Academic Block', value: 3200, unit: 'W', status: SensorStatus.WARNING, lastUpdated: new Date() },
];

export const generateMockBuildings = (): Building[] => [
  { id: 'B1', name: 'Science Block', totalConsumption: 450.2, occupancy: 85, status: 'Good' },
  { id: 'B2', name: 'Library', totalConsumption: 120.5, occupancy: 40, status: 'Good' },
  { id: 'B3', name: 'IT Center', totalConsumption: 890.0, occupancy: 20, status: 'Warning' },
  { id: 'B4', name: 'Dormitories', totalConsumption: 340.8, occupancy: 65, status: 'Good' },
  { id: 'B5', name: 'Admin Block', totalConsumption: 210.1, occupancy: 90, status: 'Critical' },
];

export const generateMockAlerts = (): Alert[] => [
  { id: 'A1', title: 'High Power Usage', message: 'IT Center server room exceeding threshold by 15%.', severity: 'high', timestamp: new Date(Date.now() - 1000 * 60 * 15), resolved: false },
  { id: 'A2', title: 'AC Left On', message: 'Lecture Hall 3 AC running with 0 occupancy.', severity: 'medium', timestamp: new Date(Date.now() - 1000 * 60 * 60), resolved: false },
  { id: 'A3', title: 'WiFi Weak Signal', message: 'Student Center AP-4 reporting low signal strength.', severity: 'low', timestamp: new Date(Date.now() - 1000 * 60 * 120), resolved: true },
];

export const generateWifiPoints = (): WifiPoint[] => [
  { id: 'AP-01', location: 'Library 1F', signalStrength: -35, clients: 45, status: 'active' },
  { id: 'AP-02', location: 'Library 2F', signalStrength: -55, clients: 23, status: 'active' },
  { id: 'AP-03', location: 'Science Lab', signalStrength: -78, clients: 12, status: 'congested' },
  { id: 'AP-04', location: 'Cafeteria', signalStrength: -42, clients: 89, status: 'active' },
  { id: 'AP-05', location: 'Dorm Lobby', signalStrength: -90, clients: 5, status: 'down' },
  { id: 'AP-06', location: 'Gym', signalStrength: -60, clients: 15, status: 'active' },
];

export const getChartData = () => {
  const data = [];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  for (const day of days) {
    data.push({
      name: day,
      usage: Math.floor(Math.random() * 500) + 200,
      predicted: Math.floor(Math.random() * 500) + 200,
      solar: Math.floor(Math.random() * 200) + 50,
    });
  }
  return data;
};

// Helper to simulate live updates
export const randomizeSensorValue = (sensor: Sensor): Sensor => {
  let newValue = sensor.value;
  if (sensor.type === SensorType.POWER && typeof sensor.value === 'number') {
    // Fluctuate by +/- 5%
    const change = sensor.value * 0.05 * (Math.random() - 0.5);
    newValue = Math.max(0, Math.floor(sensor.value + change));
  } else if (sensor.type === SensorType.TEMP && typeof sensor.value === 'number') {
    const change = (Math.random() - 0.5) * 0.5;
    newValue = parseFloat((sensor.value + change).toFixed(1));
  }
  return { ...sensor, value: newValue, lastUpdated: new Date() };
};