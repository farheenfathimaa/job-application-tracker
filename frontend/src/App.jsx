import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import { userService } from './api/apiService';
import { Layout } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setupUser = async () => {
      try {
        // For demonstration, we'll try to find or create a default user
        const res = await userService.getAll();
        if (res.data.length > 0) {
          setUser(res.data[0]);
        } else {
          const newUser = await userService.create({
            name: 'Demo User',
            email: 'demo@example.com'
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-primary-500 rounded-xl mb-4"></div>
          <div className="h-4 w-32 bg-slate-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-primary-500/30">
      <nav className="border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary-600 p-2 rounded-lg shadow-lg shadow-primary-900/20">
              <Layout className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Track<span className="text-primary-500">Job</span></span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium text-white">{user?.name}</span>
              <span className="text-xs text-slate-500">{user?.email}</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-primary-400 font-bold">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </div>
      </nav>

      <main>
        {user ? <Dashboard userId={user.id} /> : (
          <div className="py-20 text-center">
            <h2 className="text-2xl text-rose-400 font-bold">Error connecting to Backend</h2>
            <p className="text-slate-500 mt-2">Ensure the Spring Boot API is running.</p>
          </div>
        )}
      </main>

      <footer className="border-t border-white/5 py-8 text-center text-slate-600 text-sm">
        <p>&copy; 2026 Job Application Tracker. Built with Spring Boot & React.</p>
      </footer>
    </div>
  );
}

export default App;
