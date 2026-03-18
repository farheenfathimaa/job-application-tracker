import React, { useState, useEffect } from 'react';
import { applicationService } from '../api/apiService';
import { Plus, Search, Filter, Briefcase, Calendar, CheckCircle2, Clock, XCircle, MoreVertical, Edit2, Trash2 } from 'lucide-react';

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

  const filteredApps = statusFilter === 'ALL' 
    ? applications 
    : applications.filter(app => app.status === statusFilter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPLIED': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'INTERVIEW': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'OFFER': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'REJECTED': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPLIED': return <Briefcase size={14} />;
      case 'INTERVIEW': return <Clock size={14} />;
      case 'OFFER': return <CheckCircle2 size={14} />;
      case 'REJECTED': return <XCircle size={14} />;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Job Applications</h1>
          <p className="text-slate-400 mt-1">Track and manage your career journey.</p>
        </div>
        <button 
          onClick={() => { setCurrentApp(null); setIsModalOpen(true); }}
          className="btn-primary flex items-center gap-2 w-fit"
        >
          <Plus size={20} />
          New Application
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {['ALL', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-3 rounded-xl border transition-all duration-200 text-sm font-medium flex items-center justify-between ${
              statusFilter === status 
                ? 'bg-primary-600/10 border-primary-500/50 text-primary-400 ring-1 ring-primary-500/50' 
                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            {status}
            <span className="bg-slate-800 px-2 py-0.5 rounded text-xs">
              {status === 'ALL' ? applications.length : applications.filter(a => a.status === status).length}
            </span>
          </button>
        ))}
      </div>

      <div className="glass rounded-2xl p-4 mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by company..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : filteredApps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map(app => (
            <div key={app.id} className="glass rounded-2xl p-6 hover:border-primary-500/30 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(app.status)}`}>
                  {getStatusIcon(app.status)}
                  {app.status}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setCurrentApp(app); setIsModalOpen(true); }} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(app.id)} className="p-2 hover:bg-rose-500/10 rounded-lg text-slate-400 hover:text-rose-400">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{app.role}</h3>
              <p className="text-primary-400 font-medium mb-4">{app.company}</p>
              
              <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {new Date(app.dateApplied).toLocaleDateString()}
                </div>
              </div>

              {app.notes && (
                <p className="text-sm text-slate-500 line-clamp-2 italic">"{app.notes}"</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="glass rounded-2xl py-20 text-center">
          <Briefcase className="mx-auto text-slate-700 mb-4" size={48} />
          <h3 className="text-xl font-medium text-slate-300">No applications found</h3>
          <p className="text-slate-500 mt-2">Start your journey by adding your first job application.</p>
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

// Placeholder for ApplicationForm component
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
      alert('Error saving application. Check console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="glass w-full max-w-lg rounded-2xl p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">{currentApp ? 'Edit' : 'New'} Application</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white">
            <XCircle size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Company Name</label>
            <input 
              required
              className="input-field"
              value={formData.company}
              onChange={e => setFormData({...formData, company: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Job Role</label>
            <input 
              required
              className="input-field"
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Status</label>
              <select 
                className="input-field appearance-none cursor-pointer"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="APPLIED">Applied</option>
                <option value="INTERVIEW">Interview</option>
                <option value="OFFER">Offer</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Date Applied</label>
              <input 
                type="date"
                required
                className="input-field"
                value={formData.dateApplied}
                onChange={e => setFormData({...formData, dateApplied: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1.5">Notes</label>
            <textarea 
              rows={3}
              className="input-field resize-none text-sm"
              value={formData.notes || ''}
              onChange={e => setFormData({...formData, notes: e.target.value})}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full mt-4 flex justify-center items-center py-3"
          >
            {loading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white animate-spin rounded-full"></div> : (currentApp ? 'Update Application' : 'Create Application')}
          </button>
        </form>
      </div>
    </div>
  );
};
