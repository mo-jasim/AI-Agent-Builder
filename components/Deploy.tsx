import React, { useState } from 'react';
import { AgentConfig } from '../types';
import { Copy, Check, ExternalLink, Code2, Globe } from 'lucide-react';

interface DeployProps {
  config: AgentConfig;
}

export const Deploy: React.FC<DeployProps> = ({ config }) => {
  const [copied, setCopied] = useState(false);

  // Simulating a generated script tag
  const scriptCode = `<!-- Nexus AI Widget Code -->
<script>
  window.nexusConfig = {
    agentId: "${config.id}",
    businessName: "${config.businessName}",
    primaryColor: "${config.primaryColor}",
    greeting: "${config.welcomeMessage}"
  };
</script>
<script 
  src="https://cdn.nexus-ai-platform.com/widget/v2/loader.js" 
  defer
></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4 mb-12">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Globe size={32} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Your AI Agent is Ready!</h1>
        <p className="text-slate-500 max-w-lg mx-auto text-lg">
          Your custom assistant has been configured with <span className="font-semibold text-slate-800">{config.documents.length} knowledge base documents</span> and is ready to be embedded on your site.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="text-brand-400" size={20} />
            <span className="text-white font-mono text-sm">Installation Script</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 text-xs font-medium bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
        <div className="p-6 bg-slate-950 overflow-x-auto">
          <pre className="font-mono text-sm text-slate-300 leading-relaxed">
            {scriptCode}
          </pre>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-2">Instructions</h3>
          <ol className="list-decimal list-inside space-y-3 text-sm text-slate-600">
            <li>Copy the code snippet above.</li>
            <li>Open your website's HTML file (usually <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">index.html</code>).</li>
            <li>Paste the code just before the closing <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">&lt;/body&gt;</code> tag.</li>
            <li>Save and publish your changes.</li>
          </ol>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-2">Framework Guides</h3>
            <div className="space-y-3">
                <a href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group">
                    <span className="text-sm font-medium text-slate-700">Next.js / React</span>
                    <ExternalLink size={14} className="text-slate-400 group-hover:text-brand-600" />
                </a>
                 <a href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group">
                    <span className="text-sm font-medium text-slate-700">WordPress</span>
                    <ExternalLink size={14} className="text-slate-400 group-hover:text-brand-600" />
                </a>
                 <a href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group">
                    <span className="text-sm font-medium text-slate-700">Shopify</span>
                    <ExternalLink size={14} className="text-slate-400 group-hover:text-brand-600" />
                </a>
            </div>
        </div>
      </div>
    </div>
  );
};