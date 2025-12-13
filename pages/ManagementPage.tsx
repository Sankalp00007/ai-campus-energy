import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Building, Sensor, WifiPoint, SensorType, SensorStatus } from '../types';
import { 
  Building2, Activity, Wifi, Plus, Trash2, Edit2, Save, X, 
  Loader2, CheckCircle, AlertCircle
} from 'lucide-react';

type Tab = 'buildings' | 'sensors' | 'wifi';

const ManagementPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('buildings');
  
  // Data State
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [wifiPoints, setWifiPoints] = useState<WifiPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Modal/Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'buildings') {
        const data = await api.getBuildings();
        setBuildings(data);
      } else if (activeTab === 'sensors') {
        const [sData, bData] = await Promise.all([api.getSensors(), api.getBuildings()]);
        setSensors(sData);
        setBuildings(bData); 
      } else if (activeTab === 'wifi') {
        const data = await api.getWifiPoints();
        setWifiPoints(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      if (activeTab === 'buildings') await api.deleteBuilding(id);
      if (activeTab === 'sensors') await api.deleteSensor(id);
      if (activeTab === 'wifi') await api.deleteWifiPoint(id);
      setMessage({ type: 'success', text: 'Item deleted successfully' });
      fetchData();
    } catch (e: any) {
      console.error(e);
      setMessage({ type: 'error', text: `Failed to delete: ${e.message}` });
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setMessage(null);
    if (activeTab === 'buildings') {
      setFormData({ name: '', totalConsumption: 0, occupancy: 0, status: 'Good' });
    } else if (activeTab === 'sensors') {
      setFormData({ id: '', name: '', type: SensorType.POWER, location: '', value: 0, unit: 'W', status: SensorStatus.ONLINE, buildingId: '' });
    } else if (activeTab === 'wifi') {
      setFormData({ id: '', location: '', signalStrength: -50, clients: 0, status: 'active' });
    }
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setMessage(null);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (activeTab === 'buildings') {
        const payload = {
            ...formData,
            totalConsumption: Number(formData.totalConsumption),
            occupancy: Number(formData.occupancy)
        };
        if (editingId) await api.updateBuilding(editingId, payload);
        else await api.addBuilding(payload);

      } else if (activeTab === 'sensors') {
        const payload = {
            ...formData,
            value: Number(formData.value),
            // Ensure buildingId is null if empty string
            buildingId: formData.buildingId === "" ? null : formData.buildingId
        };
        if (editingId) await api.updateSensor(editingId, payload);
        else await api.addSensor(payload);

      } else if (activeTab === 'wifi') {
        const payload = {
            ...formData,
            signalStrength: Number(formData.signalStrength),
            clients: Number(formData.clients)
        };
        if (editingId) await api.updateWifiPoint(editingId, payload);
        else await api.addWifiPoint(payload);
      }

      setIsModalOpen(false);
      setMessage({ type: 'success', text: 'Saved successfully!' });
      fetchData();
    } catch (e: any) {
      console.error(e);
      setMessage({ type: 'error', text: `Error: ${e.message || 'Check console for details'}` });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {message && (
        <div className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-lg shadow-lg flex items-center animate-in slide-in-from-top-2 duration-300 ${
            message.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white'
        }`}>
            {message.type === 'success' ? <CheckCircle size={18} className="mr-2" /> : <AlertCircle size={18} className="mr-2" />}
            <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                <Edit2 className="mr-3 text-slate-500" /> Infrastructure Management
           </h1>
           <p className="text-slate-500 mt-1">Add devices, update statuses, or simulate live data changes.</p>
        </div>
        <button 
            onClick={openAddModal}
            className="mt-4 md:mt-0 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center transition-colors shadow-sm"
        >
            <Plus size={18} className="mr-2" /> Add {activeTab === 'wifi' ? 'Access Point' : activeTab.slice(0, -1)}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm w-fit">
        <TabButton active={activeTab === 'buildings'} onClick={() => setActiveTab('buildings')} icon={Building2} label="Buildings" />
        <TabButton active={activeTab === 'sensors'} onClick={() => setActiveTab('sensors')} icon={Activity} label="Sensors" />
        <TabButton active={activeTab === 'wifi'} onClick={() => setActiveTab('wifi')} icon={Wifi} label="WiFi Points" />
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
        {loading ? (
            <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-emerald-600 w-8 h-8" /></div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs">
                        <tr>
                            {activeTab === 'buildings' && (
                                <>
                                    <th className="px-6 py-3">ID</th>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Power (kWh)</th>
                                    <th className="px-6 py-3">Occupancy (%)</th>
                                    <th className="px-6 py-3">Status</th>
                                </>
                            )}
                            {activeTab === 'sensors' && (
                                <>
                                    <th className="px-6 py-3">ID</th>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Type</th>
                                    <th className="px-6 py-3">Current Value</th>
                                    <th className="px-6 py-3">Status</th>
                                </>
                            )}
                            {activeTab === 'wifi' && (
                                <>
                                    <th className="px-6 py-3">ID</th>
                                    <th className="px-6 py-3">Location</th>
                                    <th className="px-6 py-3">Signal (dBm)</th>
                                    <th className="px-6 py-3">Clients</th>
                                    <th className="px-6 py-3">Status</th>
                                </>
                            )}
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {activeTab === 'buildings' && buildings.map(b => (
                            <tr key={b.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-mono text-xs text-slate-400">{b.id}</td>
                                <td className="px-6 py-4 font-medium text-slate-900">{b.name}</td>
                                <td className="px-6 py-4">{b.totalConsumption}</td>
                                <td className="px-6 py-4">{b.occupancy}</td>
                                <td className="px-6 py-4"><StatusBadge status={b.status} /></td>
                                <td className="px-6 py-4 text-right">
                                    <ActionButtons onEdit={() => openEditModal(b)} onDelete={() => handleDelete(b.id)} />
                                </td>
                            </tr>
                        ))}
                        {activeTab === 'sensors' && sensors.map(s => (
                            <tr key={s.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-mono text-xs">{s.id}</td>
                                <td className="px-6 py-4 font-medium text-slate-900">{s.name}</td>
                                <td className="px-6 py-4"><span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">{s.type}</span></td>
                                <td className="px-6 py-4 font-bold">{s.value} <span className="font-normal text-slate-500">{s.unit}</span></td>
                                <td className="px-6 py-4"><StatusBadge status={s.status} /></td>
                                <td className="px-6 py-4 text-right">
                                    <ActionButtons onEdit={() => openEditModal(s)} onDelete={() => handleDelete(s.id)} />
                                </td>
                            </tr>
                        ))}
                        {activeTab === 'wifi' && wifiPoints.map(w => (
                            <tr key={w.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-mono text-xs">{w.id}</td>
                                <td className="px-6 py-4 font-medium text-slate-900">{w.location}</td>
                                <td className="px-6 py-4">{w.signalStrength}</td>
                                <td className="px-6 py-4">{w.clients}</td>
                                <td className="px-6 py-4"><StatusBadge status={w.status} /></td>
                                <td className="px-6 py-4 text-right">
                                    <ActionButtons onEdit={() => openEditModal(w)} onDelete={() => handleDelete(w.id)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && (
                    (activeTab === 'buildings' && buildings.length === 0) ||
                    (activeTab === 'sensors' && sensors.length === 0) ||
                    (activeTab === 'wifi' && wifiPoints.length === 0)
                ) && (
                    <div className="text-center py-12">
                        <p className="text-slate-500">No data found. Click "Add" to get started.</p>
                    </div>
                )}
            </div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-900">
                        {editingId ? 'Edit Item' : 'Add New Item'}
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSave} className="p-6 space-y-4">
                    
                    {activeTab === 'buildings' && (
                        <>
                            {!editingId && <Input label="Building ID (e.g. B1)" value={formData.id || ''} onChange={v => setFormData({...formData, id: v})} required />}
                            <Input label="Building Name" value={formData.name || ''} onChange={v => setFormData({...formData, name: v})} required />
                            <Input label="Current Consumption (kWh)" type="number" value={formData.totalConsumption} onChange={v => setFormData({...formData, totalConsumption: v})} required />
                            <Input label="Occupancy (%)" type="number" value={formData.occupancy} onChange={v => setFormData({...formData, occupancy: v})} required />
                            <Select label="Status" value={formData.status} onChange={v => setFormData({...formData, status: v})} options={['Good', 'Warning', 'Critical']} />
                        </>
                    )}

                    {activeTab === 'sensors' && (
                        <>
                             {!editingId && <Input label="Sensor ID (e.g., S-101)" value={formData.id || ''} onChange={v => setFormData({...formData, id: v})} required />}
                             <Input label="Sensor Name" value={formData.name || ''} onChange={v => setFormData({...formData, name: v})} required />
                             <Select label="Type" value={formData.type} onChange={v => setFormData({...formData, type: v})} options={Object.values(SensorType)} />
                             <div className="grid grid-cols-2 gap-4">
                                <Input label="Current Value" type="number" value={formData.value} onChange={v => setFormData({...formData, value: v})} required />
                                <Input label="Unit" value={formData.unit || ''} onChange={v => setFormData({...formData, unit: v})} required />
                             </div>
                             <Input label="Location" value={formData.location || ''} onChange={v => setFormData({...formData, location: v})} required />
                             <Select label="Status" value={formData.status} onChange={v => setFormData({...formData, status: v})} options={Object.values(SensorStatus)} />
                             <div className="space-y-1">
                                <label className="block text-sm font-medium text-slate-700">Assigned Building</label>
                                <select 
                                    className="block w-full rounded-md border-slate-300 border px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                                    value={formData.buildingId || ''}
                                    onChange={e => setFormData({...formData, buildingId: e.target.value})}
                                >
                                    <option value="">-- No Building --</option>
                                    {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                             </div>
                        </>
                    )}

                    {activeTab === 'wifi' && (
                        <>
                            {!editingId && <Input label="Access Point ID (e.g., AP-01)" value={formData.id || ''} onChange={v => setFormData({...formData, id: v})} required />}
                            <Input label="Location" value={formData.location || ''} onChange={v => setFormData({...formData, location: v})} required />
                            <Input label="Signal Strength (dBm)" type="number" value={formData.signalStrength} onChange={v => setFormData({...formData, signalStrength: v})} required />
                            <Input label="Active Clients" type="number" value={formData.clients} onChange={v => setFormData({...formData, clients: v})} required />
                            <Select label="Status" value={formData.status} onChange={v => setFormData({...formData, status: v})} options={['active', 'down', 'congested']} />
                        </>
                    )}

                    <div className="pt-4 flex justify-end space-x-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 text-sm font-medium hover:bg-slate-50">Cancel</button>
                        <button 
                            type="submit" 
                            disabled={saving}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center disabled:opacity-50"
                        >
                            {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

// --- Subcomponents ---

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
    <button 
        onClick={onClick}
        className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            active 
            ? 'bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-200' 
            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
        }`}
    >
        <Icon size={16} className={`mr-2 ${active ? 'text-emerald-500' : 'text-slate-400'}`} />
        {label}
    </button>
);

const ActionButtons = ({ onEdit, onDelete }: any) => (
    <div className="flex justify-end space-x-2">
        <button onClick={onEdit} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
            <Edit2 size={16} />
        </button>
        <button onClick={onDelete} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete">
            <Trash2 size={16} />
        </button>
    </div>
);

const StatusBadge = ({ status }: { status: string }) => {
    let color = 'bg-slate-100 text-slate-800';
    const s = status ? status.toUpperCase() : 'UNKNOWN';
    if (['GOOD', 'ONLINE', 'ACTIVE'].includes(s)) color = 'bg-emerald-100 text-emerald-800';
    if (['WARNING', 'CONGESTED'].includes(s)) color = 'bg-amber-100 text-amber-800';
    if (['CRITICAL', 'OFFLINE', 'DOWN'].includes(s)) color = 'bg-red-100 text-red-800';

    return <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${color}`}>{status}</span>;
};

// Form Helpers
const Input = ({ label, value, onChange, type = "text", required = false }: any) => (
    <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">{label}</label>
        <input 
            type={type} 
            value={value} 
            onChange={e => onChange(e.target.value)} 
            required={required}
            className="block w-full rounded-md border-slate-300 border px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500 shadow-sm"
        />
    </div>
);

const Select = ({ label, value, onChange, options }: any) => (
    <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">{label}</label>
        <select 
            value={value} 
            onChange={e => onChange(e.target.value)}
            className="block w-full rounded-md border-slate-300 border px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500 shadow-sm"
        >
            {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
        </select>
    </div>
);

export default ManagementPage;