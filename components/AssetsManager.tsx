
import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Home, 
  Truck, 
  Briefcase, 
  Box, 
  Trash2, 
  Search,
  Calendar,
  Layers,
  Calculator,
  Edit2,
  X,
  Save
} from 'lucide-react';
import { Asset, AssetCategory } from '../types';

interface AssetsManagerProps {
  assets: Asset[];
  onAdd: (asset: any) => void;
  onUpdate: (asset: Asset) => void;
  onDelete: (id: string) => void;
  isAdmin?: boolean;
}

const AssetsManager: React.FC<AssetsManagerProps> = ({ assets, onAdd, onUpdate, onDelete, isAdmin }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    value: '',
    category: AssetCategory.EQUIPMENT,
    acquisitionDate: new Date().toISOString().split('T')[0],
    note: ''
  });

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

  const filteredAssets = assets.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingAsset(null);
    setFormData({
      name: '',
      value: '',
      category: AssetCategory.EQUIPMENT,
      acquisitionDate: new Date().toISOString().split('T')[0],
      note: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setFormData({
      name: asset.name,
      value: asset.value.toString(),
      category: asset.category,
      acquisitionDate: asset.acquisitionDate,
      note: asset.note || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      value: parseFloat(formData.value),
      category: formData.category,
      acquisitionDate: formData.acquisitionDate,
      note: formData.note
    };

    if (editingAsset) {
      onUpdate({ ...payload, id: editingAsset.id });
    } else {
      onAdd({ ...payload, id: Math.random().toString(36).substr(2, 9) });
    }
    setIsModalOpen(false);
  };

  const getCategoryIcon = (category: AssetCategory) => {
    switch (category) {
      case AssetCategory.REAL_ESTATE: return <Home size={18} />;
      case AssetCategory.VEHICLE: return <Truck size={18} />;
      case AssetCategory.EQUIPMENT: return <Briefcase size={18} />;
      case AssetCategory.INVENTORY: return <Box size={18} />;
      default: return <Package size={18} />;
    }
  };

  const getCategoryColor = (category: AssetCategory) => {
    switch (category) {
      case AssetCategory.REAL_ESTATE: return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400';
      case AssetCategory.VEHICLE: return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
      case AssetCategory.EQUIPMENT: return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400';
      case AssetCategory.INVENTORY: return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-400';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-left">
      <div className="text-left">
        <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Asset Portfolio</h3>
        <p className="text-slate-500 dark:text-slate-400 font-bold tracking-tight mt-1">Strategic management of your physical and digital capital</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-900 text-white shadow-2xl relative overflow-hidden group col-span-1 md:col-span-2 text-left">
          <div className="absolute top-0 right-0 p-8 opacity-10 -translate-y-4 translate-x-4 group-hover:scale-110 transition-transform duration-700">
             <Calculator size={180} />
          </div>
          <div className="relative z-10 text-left">
            <p className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.3em] mb-3">Consolidated Valuation</p>
            <div className="flex items-baseline gap-3 text-left">
              <span className="text-7xl font-black tabular-nums">{totalValue.toLocaleString()}</span>
              <span className="text-xl font-bold opacity-60">ETB</span>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-slate-900 dark:bg-slate-950 border border-slate-800 dark:border-white/5 text-white shadow-2xl relative overflow-hidden flex flex-col justify-center text-left">
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <Layers size={140} />
          </div>
          <div className="relative z-10 text-left">
            <h4 className="text-xl font-black mb-1">Asset Diversity</h4>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Track and optimize your business assets across different categories.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden p-8 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search assets..." 
              className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {isAdmin && (
            <button 
              onClick={handleOpenAdd}
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95 uppercase tracking-widest"
            >
              <Plus size={18} />
              Add Asset
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {filteredAssets.map((asset) => (
            <div key={asset.id} className="p-8 bg-slate-50/50 dark:bg-slate-800/40 rounded-[2.5rem] border border-slate-100 dark:border-white/5 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all group text-left">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl shadow-lg ${getCategoryColor(asset.category)}`}>
                  {getCategoryIcon(asset.category)}
                </div>
                {isAdmin && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleOpenEdit(asset)}
                      className="p-2 bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 border border-slate-100 dark:border-white/10 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-500/20 transition-all"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => onDelete(asset.id)}
                      className="p-2 bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 border border-slate-100 dark:border-white/10 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/20 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{asset.name}</h4>
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">{asset.category.replace('_', ' ')}</p>
                </div>

                <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 tabular-nums">
                  {asset.value.toLocaleString()} 
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-600 ml-2">ETB</span>
                </p>

                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                  <Calendar size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Acquired: {new Date(asset.acquisitionDate).toLocaleDateString()}</span>
                </div>

                {asset.note && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic border-l-2 border-slate-200 dark:border-slate-700 pl-3">
                    {asset.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/90 backdrop-blur-md z-[300] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-200 border dark:border-white/5">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                {editingAsset ? 'Modify Asset' : 'Add New Asset'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full text-slate-400 dark:text-slate-600 transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Asset Name</label>
                <input 
                  type="text" required
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl outline-none font-black text-sm text-slate-900 dark:text-white"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Merkato Shop"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Valuation (ETB)</label>
                <input 
                  type="number" required
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl outline-none font-black text-sm text-slate-900 dark:text-white"
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Category</label>
                  <select 
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl outline-none font-black text-sm dark:text-white"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as AssetCategory})}
                  >
                    {Object.values(AssetCategory).map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Acquisition Date</label>
                  <input 
                    type="date" required
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl outline-none font-black text-sm dark:text-white"
                    value={formData.acquisitionDate}
                    onChange={(e) => setFormData({...formData, acquisitionDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Notes (Optional)</label>
                <textarea 
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl outline-none font-medium text-sm text-slate-900 dark:text-white h-24 resize-none"
                  value={formData.note}
                  onChange={(e) => setFormData({...formData, note: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className="w-full mt-6 bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-2xl dark:shadow-none uppercase tracking-widest flex items-center justify-center gap-3"
              >
                <Save size={20} />
                {editingAsset ? 'Update Asset' : 'Save Asset'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetsManager;
