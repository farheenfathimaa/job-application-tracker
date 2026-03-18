import React, { useState, useEffect } from 'react';
import { applicationService } from '../api/apiService';
import { Plus, Search, Calendar, CheckCircle2, Clock, XCircle, Edit2, Trash2, Filter, AlertCircle, Briefcase, MapPin } from 'lucide-react';

const Dashboard = ({ userId }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentApp, setCurrentApp] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, [userId]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await applicationService.getAllByUser(userId);
      setApplications(res.data);
    } catch (err) {
      console.error('Failed to fetch applications', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 2) {
      try {
        const res = await applicationService.search(userId, term);
        setApplications(res.data);
      } catch (err) {
        console.error('Search failed', err);
      }
    } else if (term === '') {
      fetchApplications();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await applicationService.delete(id);
        setApplications(applications.filter(app => app.id !== id));
      } catch (err) {
        console.error('Delete failed', err);
      }
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'APPLIED': return { color: 'bg-blue-400 border-blue-500 text-black', icon: <Clock size={20} /> };
      case 'INTERVIEW': return { color: 'bg-purple-400 border-purple-500 text-black', icon: <Filter size={20} /> };
      case 'OFFER': return { color: 'bg-emerald-400 border-emerald-500 text-black', icon: <CheckCircle2 size={20} /> };
      case 'REJECTED': return { color: 'bg-rose-400 border-rose-500 text-black', icon: <XCircle size={20} /> };
      default: return { color: 'bg-slate-400 border-slate-500 text-black', icon: null };
    }
  };

  const filteredApps = statusFilter === 'ALL' 
    ? applications 
    : applications.filter(app => app.status === statusFilter);

  return (
    <div className="space-y-16 animate-up">
      {/* Hero Section - Centered */}
      <section className="text-center space-y-6">
        <h1 className="text-hero">Job Applications.</h1>
        <p className="text-subhero max-w-3xl mx-auto">
          Track and manage your career journey. <br className="hidden md:block" /> Stay organized, stay ahead.
        </p>
        <div className="pt-6">
          <button 
            onClick={() => { setCurrentApp(null); setIsModalOpen(true); }}
            className="btn-primary mx-auto"
          >
            <Plus size={28} strokeWidth={3} />
            Track Opportunity
          </button>
        </div>
      </section>

      {/* Stats/Filters - Centered */}
      <div className="flex flex-wrap justify-center items-center gap-4 py-8 border-y border-white/5">
        {['ALL', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'].map(status => {
          const count = status === 'ALL' ? applications.length : applications.filter(a => a.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-8 py-4 rounded-2xl border-2 transition-all duration-300 font-black text-sm uppercase tracking-widest flex items-center gap-4 ${
                statusFilter === status 
                  ? 'bg-primary-600 border-primary-500 text-black shadow-xl shadow-primary-500/20 active:scale-105' 
                  : 'bg-slate-900 border-white/5 text-black hover:border-white/10 hover:bg-slate-800'
              }`}
            >
              {status}
              <span className={`px-2.5 py-0.5 rounded-lg text-xs ${statusFilter === status ? 'bg-black/20 text-black' : 'bg-slate-950 text-slate-400'}`}> {count}</span>
            </button>
          );
        })}
      </div>

      {/* Large Search Section - Centered */}
      <div className="max-w-4xl mx-auto space-y-2">
        <div className="text-center mb-4">
          <label className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Quick Search Filter</label>
        </div>
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={32} />
          <input 
            type="text" 
            placeholder="Search company or role..."
            className="input-large pl-16 h-20 text-2xl"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Applications Grid - Card headers Left-aligned for clarity */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40">
          <div className="h-20 w-20 border-8 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
          <span className="mt-8 text-2xl font-black text-slate-700 uppercase tracking-tighter">Updating Pipeline...</span>
        </div>
      ) : filteredApps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {filteredApps.map((app, index) => {
            const config = getStatusConfig(app.status);
            return (
              <div 
                key={app.id} 
                className="glass rounded-[3rem] p-10 hover:bg-white/[0.08] hover:border-primary-500/30 transition-all duration-500 group relative flex flex-col min-h-[420px]"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Status Badge */}
                <div className="mb-8">
                  <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border-2 ${config.color}`}>
                    {config.icon}
                    {app.status}
                  </div>
                </div>

                {/* Left-Aligned Main Content for better Scanability */}
                <div className="space-y-4">
                  <h3 className="text-4xl font-black text-white leading-tight tracking-tight group-hover:text-primary-400 transition-colors">
                    {app.role}
                  </h3>
                  <div className="flex items-center gap-3 text-2xl text-slate-400 font-bold">
                    <Briefcase size={22} className="text-primary-500" />
                    {app.company}
                  </div>
                </div>

                {/* Hover Actions */}
                <div className="absolute top-8 right-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100">
                  <button onClick={() => { setCurrentApp(app); setIsModalOpen(true); }} className="h-14 w-14 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary-600 transition-all active:scale-90">
                    <Edit2 size={24} />
                  </button>
                  <button onClick={() => handleDelete(app.id)} className="h-14 w-14 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-rose-600 transition-all active:scale-90">
                    <Trash2 size={24} />
                  </button>
                </div>

                {/* Footer Data - Mixed Alignment */}
                <div className="mt-auto pt-8 border-t border-white/5 space-y-6">
                  <div className="flex items-center gap-3 text-lg text-slate-500 font-bold">
                    <Calendar size={20} />
                    APPLIED: <span className="text-white ml-1">{new Date(app.dateApplied).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>

                  {app.notes && (
                    <div className="p-6 bg-slate-950/30 rounded-[2rem] border border-white/5">
                      <p className="text-sm text-slate-400 italic leading-relaxed line-clamp-3">
                        "{app.notes}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-40 glass rounded-[4rem] border-dashed border-4 border-slate-800 max-w-4xl mx-auto w-full">
          <div className="h-24 w-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
            <Briefcase size={60} className="text-slate-800" />
          </div>
          <h3 className="text-4xl font-black text-slate-300 tracking-tighter uppercase">No Records Found</h3>
          <p className="text-xl text-slate-500 mt-6 max-w-md mx-auto leading-relaxed">
            Your application trajectory is currently blank. Start your journey by logging your first opportunity.
          </p>
        </div>
      )}

      {isModalOpen && (
        <ApplicationForm 
          userId={userId} 
          currentApp={currentApp} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => { setIsModalOpen(false); fetchApplications(); }} 
        />
      )}
    </div>
  );
};

export default Dashboard;

const ApplicationForm = ({ userId, currentApp, onClose, onSuccess }) => {
  const [formData, setFormData] = useState(currentApp || {
    company: '',
    role: '',
    status: 'APPLIED',
    dateApplied: new Date().toISOString().split('T')[0],
    notes: '',
    userId: userId
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (currentApp) {
        await applicationService.update(currentApp.id, formData);
      } else {
        await applicationService.create(formData);
      }
      onSuccess();
    } catch (err) {
      console.error('Save failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-3xl" onClick={onClose}></div>
      <div className="glass w-full max-w-4xl rounded-[4rem] p-16 shadow-[0_0_150px_rgba(0,0,0,0.4)] relative animate-in zoom-in-95 duration-500">
        <div className="flex justify-between items-center mb-14">
          <div>
            <h2 className="text-5xl font-black text-white tracking-tighter">
              {currentApp ? 'UPDATE' : 'CREATE'} RECORD
            </h2>
            <p className="text-xl text-slate-500 font-bold uppercase tracking-[0.2em] mt-2">Opportunity Logistics</p>
          </div>
          <button onClick={onClose} className="h-20 w-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center text-slate-400 hover:text-white transition-all hover:rotate-90">
            <XCircle size={40} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-sm font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Employer Name</label>
              <input 
                required
                className="input-large"
                placeholder="e.g. Meta"
                value={formData.company}
                onChange={e => setFormData({...formData, company: e.target.value})}
              />
            </div>
            <div className="space-y-4">
              <label className="text-sm font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Desired Role</label>
              <input 
                required
                className="input-large"
                placeholder="e.g. Lead Designer"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-sm font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Application Status</label>
              <div className="relative">
                <select 
                  className="input-large appearance-none cursor-pointer pr-16"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  <option value="APPLIED">APPLIED</option>
                  <option value="INTERVIEW">INTERVIEW</option>
                  <option value="OFFER">OFFER</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
                <Filter className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" size={24} />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-sm font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Logged Date</label>
              <input 
                type="date"
                required
                className="input-large"
                value={formData.dateApplied}
                onChange={e => setFormData({...formData, dateApplied: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-black uppercase tracking-[0.3em] text-slate-500 ml-2">Confidential Notes</label>
            <textarea 
              rows={4}
              className="input-large resize-none py-6 h-auto"
              placeholder="Context, contact persons, or preparation points..."
              value={formData.notes || ''}
              onChange={e => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-24 bg-primary-600 hover:bg-primary-500 text-black rounded-[2.5rem] font-black text-2xl uppercase tracking-widest shadow-2xl shadow-primary-500/20 active:scale-95 transition-all flex justify-center items-center"
          >
            {loading ? <div className="h-8 w-8 border-4 border-black/20 border-t-black animate-spin rounded-full"></div> : (currentApp ? 'Sync Changes' : 'Execute Tracking')}
          </button>
        </form>
      </div>
    </div>
  );
};
