import React, { useState, useEffect } from 'react';
import { AgentConfig, NavigationTab } from './types';
import { Layout } from './components/Layout';
import { Builder } from './components/Builder';
import { ChatPreview } from './components/ChatPreview';
import { Deploy } from './components/Deploy';

const DEFAULT_CONFIG: AgentConfig = {
  id: 'agent-' + Math.random().toString(36).substr(2, 9),
  businessName: '',
  websiteUrl: '',
  systemPrompt: 'You are a helpful and polite AI assistant for our business. Answer customer questions based on our knowledge base. Be concise and professional.',
  documents: [],
  primaryColor: '#3b82f6', // Tailwind blue-500
  welcomeMessage: 'Hi there! Welcome to our site. How can I assist you today?'
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>(NavigationTab.BUILDER);
  const [config, setConfig] = useState<AgentConfig>(DEFAULT_CONFIG);

  // Persist to local storage to simulate a "Save" in a real app
  useEffect(() => {
    const saved = localStorage.getItem('nexus_agent_config');
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved config", e);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('nexus_agent_config', JSON.stringify(config));
    // Optional: Show a toast notification here
    alert('Agent configuration saved successfully!');
    setActiveTab(NavigationTab.PREVIEW);
  };

  const renderContent = () => {
    switch (activeTab) {
      case NavigationTab.BUILDER:
        return <Builder config={config} setConfig={setConfig} onSave={handleSave} />;
      case NavigationTab.PREVIEW:
        return <ChatPreview config={config} />;
      case NavigationTab.DEPLOY:
        return <Deploy config={config} />;
      default:
        return <Builder config={config} setConfig={setConfig} onSave={handleSave} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;