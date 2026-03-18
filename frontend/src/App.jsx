import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import { userService } from './api/apiService';
import { Layout, User as UserIcon, Bell } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setupUser = async () => {
      try {
        const res = await userService.getAll();
        if (res.data.length > 0) {
          setUser(res.data[0]);
        } else {
          const newUser = await userService.create({
            name: 'John Doe',
            email: 'johndoe@gmail.com'
          });
          setUser(newUser.data);
        }
      } catch (err) {
        console.error('Failed to setup demo user', err);
      } finally {
        setLoading(false);
      }
    };
    setupUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="h-20 w-20 bg-primary-600 rounded-[2rem] animate-pulse"></div>
        <p className="mt-6 text-xl font-bold text-slate-500">Initializing Workspace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-primary-500/30 font-sans">
      {/* Centered Top Nav */}
      <nav className="h-24 px-10 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50 flex items-center justify-center">
        <div className="w-full max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-primary-600 p-2.5 rounded-2xl">
              <Layout className="text-white" size={28} />
            </div>
            <span className="text-3xl font-black tracking-tighter text-white">
              Track<span className="text-primary-500">Job</span>
            </span>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
              <span className="text-lg font-bold text-white leading-none">{user?.name}</span>
              <span className="text-xs text-slate-500 mt-1">{user?.email}</span>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-primary-500 flex items-center justify-center text-black font-black text-xl shadow-lg shadow-primary-500/10">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </div>
      </nav>

      <main className="w-full max-w-7xl mx-auto px-10 py-16">
        {user ? <Dashboard userId={user.id} /> : (
          <div className="py-20 text-center glass rounded-[3rem] px-10 border-rose-500/20">
            <h2 className="text-4xl font-black text-rose-500">Database Connection Failed</h2>
            <p className="text-xl text-slate-500 mt-4 leading-relaxed">
              We couldn't reach the backend API. Please ensure the Spring Boot server is running in its Docker container.
            </p>
          </div>
        )}
      </main>

      <footer className="py-20 border-t border-white/5 text-center text-slate-600 font-bold uppercase tracking-widest text-sm">
        <p>&copy; 2026 TrackJob Intelligence System. Focused on Career Growth.</p>
      </footer>
    </div>
  );
}

export default App;
