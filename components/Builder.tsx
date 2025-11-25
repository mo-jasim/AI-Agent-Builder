import React, { useRef, useState } from 'react';
import { AgentConfig, AgentDocument } from '../types';
import { Upload, FileText, Trash2, Globe, Building2, MessageSquareText, Palette, Save } from 'lucide-react';

interface BuilderProps {
  config: AgentConfig;
  setConfig: React.Dispatch<React.SetStateAction<AgentConfig>>;
  onSave: () => void;
}

export const Builder: React.FC<BuilderProps> = ({ config, setConfig, onSave }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (field: keyof AgentConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsProcessing(true);
      const newDocs: AgentDocument[] = [...config.documents];
      
      // Process files sequentially
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        
        // Simple simulation of reading text content
        // In a real app, you'd use a server to parse PDFs/DOCX
        const text = await readFileAsText(file);
        
        newDocs.push({
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          content: text,
          type: file.type,
          size: file.size
        });
      }
      
      setConfig(prev => ({ ...prev, documents: newDocs }));
      setIsProcessing(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target?.result as string || '');
      reader.onerror = (error) => reject(error);
      // For demo purposes, we treat everything as text. 
      // Real implementation would need specific parsers.
      reader.readAsText(file); 
    });
  };

  const removeDocument = (id: string) => {
    setConfig(prev => ({
      ...prev,
      documents: prev.documents.filter(d => d.id !== id)
    }));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Configure Your Assistant</h1>
          <p className="text-slate-500 mt-1">Provide the details and knowledge your AI needs to succeed.</p>
        </div>
        <button 
          onClick={onSave}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm active:scale-95"
        >
          <Save size={18} />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Basic Info & Style */}
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Building2 size={20} className="text-brand-500" /> Identity
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
                <input
                  type="text"
                  value={config.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Website URL</label>
                <div className="relative">
                  <Globe size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="url"
                    value={config.websiteUrl}
                    onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Palette size={20} className="text-purple-500" /> Appearance
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Brand Color (Hex)</label>
                <div className="flex gap-2">
                    <input
                        type="color"
                        value={config.primaryColor}
                        onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                        className="h-10 w-12 rounded border border-slate-300 p-1 cursor-pointer"
                    />
                    <input
                        type="text"
                        value={config.primaryColor}
                        onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 uppercase"
                    />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Welcome Message</label>
                <textarea
                  value={config.welcomeMessage}
                  onChange={(e) => handleInputChange('welcomeMessage', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-all h-24 resize-none"
                  placeholder="Hi! How can I help you today?"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Intelligence */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full flex flex-col">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <MessageSquareText size={20} className="text-green-500" /> Behavior & Instructions
            </h2>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                System Prompt
                <span className="ml-2 text-xs font-normal text-slate-500">Define the personality and core rules.</span>
              </label>
              <textarea
                value={config.systemPrompt}
                onChange={(e) => handleInputChange('systemPrompt', e.target.value)}
                className="w-full h-48 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-all font-mono text-sm leading-relaxed resize-none"
                placeholder="You are a friendly support agent. You answer concisely. Always prioritize selling the Premium plan..."
              />
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <FileText size={20} className="text-orange-500" /> Knowledge Base
                </h2>
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Text/CSV/MD files supported</span>
            </div>
            
            <div 
                className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                multiple 
                accept=".txt,.md,.csv,.json"
                onChange={handleFileUpload}
              />
              <div className="w-12 h-12 bg-blue-50 text-brand-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Upload size={24} />
              </div>
              <p className="text-slate-900 font-medium">Click to upload training documents</p>
              <p className="text-sm text-slate-500 mt-1">Upload business policies, FAQs, or product data.</p>
            </div>

            {config.documents.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="text-sm font-medium text-slate-700 uppercase tracking-wider text-xs">Uploaded Documents ({config.documents.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {config.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg group">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="min-w-8 w-8 h-8 bg-white border border-slate-200 rounded flex items-center justify-center text-slate-500">
                          <FileText size={16} />
                        </div>
                        <div className="truncate">
                          <p className="text-sm font-medium text-slate-700 truncate">{doc.name}</p>
                          <p className="text-xs text-slate-400">{(doc.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeDocument(doc.id)}
                        className="text-slate-400 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {isProcessing && (
                 <div className="mt-4 text-center text-sm text-brand-600 animate-pulse">Processing documents...</div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};