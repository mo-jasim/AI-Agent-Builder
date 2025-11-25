import React from 'react';
import { NavigationTab } from '../types';
import { LayoutDashboard, MessageSquare, Code, Bot } from 'lucide-react';

interface LayoutProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ activeTab, setActiveTab, children }) => {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex shadow-sm z-10">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white">
            <Bot size={20} />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-800">Nexus AI</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab(NavigationTab.BUILDER)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === NavigationTab.BUILDER
                ? 'bg-brand-50 text-brand-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard size={18} />
            Agent Builder
          </button>
          <button
            onClick={() => setActiveTab(NavigationTab.PREVIEW)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === NavigationTab.PREVIEW
                ? 'bg-brand-50 text-brand-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <MessageSquare size={18} />
            Live Preview
          </button>
          <button
            onClick={() => setActiveTab(NavigationTab.DEPLOY)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === NavigationTab.DEPLOY
                ? 'bg-brand-50 text-brand-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Code size={18} />
            Deploy & Embed
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs text-slate-500 font-medium mb-1">Current Plan</p>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-800">Pro Business</span>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded-full">Active</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="bg-white h-16 border-b border-slate-200 flex items-center px-6 justify-between md:hidden">
            <div className="flex items-center gap-2">
                 <Bot size={20} className="text-brand-600" />
                 <span className="font-bold text-slate-800">Nexus AI</span>
            </div>
            {/* Mobile Nav Toggle could go here */}
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};