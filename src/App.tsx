import React, { useState, useEffect, KeyboardEvent } from 'react';
import { Send, Play, Loader2, Terminal, MessageSquare, AlertCircle, Menu, History, X, 
  CheckCircle2, Code, Cog, Paperclip, Mic, ArrowRight, Shield, Zap, Settings, 
  MonitorCheck, FileSearch, FolderSearch } from 'lucide-react';
import { getGeminiResponse } from './lib/gemini';
import { parseAutomationTasks, executeAutomationTask, getDefaultSteps } from './lib/automation';

interface AutomationStatus {
  isRunning: boolean;
  message: string;
  success?: boolean;
  error?: string;
  steps?: string[];
  currentStep?: number;
}

interface HistoryItem {
  query: string;
  response: string;
  timestamp: Date;
  status?: AutomationStatus;
}

const automationTasks = [
  "Open Notepad and type Hello World",
  "Check disk space usage",
  "List all running processes",
  "Clean Windows temp files",
  "Check Windows updates",
  "Manage startup programs",
  "Scan system for malware",
  "Backup important files"
];

const generalTasks = [
  "How to create a new folder?",
  "Show Windows shortcuts",
  "Explain Task Manager",
  "Windows security tips",
  "Customize desktop",
  "Fix slow startup",
  "Optimize performance",
  "Network troubleshooting"
];

function App() {
  const [showChat, setShowChat] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [automationStatus, setAutomationStatus] = useState<AutomationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showUploadTooltip, setShowUploadTooltip] = useState(false);
  const [showVoiceTooltip, setShowVoiceTooltip] = useState(false);
  const [showAutomationConfirm, setShowAutomationConfirm] = useState(false);
  const [pendingAutomation, setPendingAutomation] = useState<string[]>([]);

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setAutomationStatus(null);
    
    try {
      const enhancedQuery = `For Windows OS: ${query}`;
      const aiResponse = await getGeminiResponse(enhancedQuery);
      setResponse(aiResponse);
      setHistory(prev => [{
        query,
        response: aiResponse,
        timestamp: new Date()
      }, ...prev]);
      
    } catch (error) {
      setResponse('Sorry, I encountered an error while processing your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutomate = async () => {
    const tasks = parseAutomationTasks(query);
    const steps = tasks.map(task => getDefaultSteps(task.type)).flat();
    setPendingAutomation(steps);
    setShowAutomationConfirm(true);
  };

  const confirmAutomation = async () => {
    setShowAutomationConfirm(false);
    setAutomationStatus({ 
      isRunning: true, 
      message: 'Starting automation...',
      steps: pendingAutomation,
      currentStep: 0 
    });
    
    try {
      const tasks = parseAutomationTasks(query);
      
      for (let i = 0; i < tasks.length; i++) {
        setAutomationStatus(prev => ({ 
          ...prev!, 
          currentStep: i,
          message: `Executing: ${tasks[i].type}` 
        }));
        
        const result = await executeAutomationTask(tasks[i]);
        console.log('Automation result:', result);
      }

      setAutomationStatus({
        isRunning: false,
        message: 'Automation completed successfully',
        success: true,
        steps: pendingAutomation.map(step => `✓ ${step}`),
        currentStep: pendingAutomation.length
      });

    } catch (error) {
      setAutomationStatus({
        isRunning: false,
        message: 'Automation failed',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        steps: pendingAutomation,
        currentStep: 0
      });
    }
  };

  if (!showChat) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="relative inline-block mb-12">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full blur-xl opacity-75 animate-gradient" />
              <Terminal className="relative h-24 w-24 text-blue-400 mx-auto" />
            </div>
            
            <h1 className="text-7xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 text-transparent bg-clip-text animate-gradient">
              Windows Assistive Workmate
            </h1>
            <p className="text-2xl text-gray-400 mb-16 max-w-3xl mx-auto leading-relaxed">
              Your intelligent Windows companion that streamlines tasks, automates workflows, and provides expert guidance for all your Windows needs.
            </p>
            
            <button
              onClick={() => setShowChat(true)}
              className="group relative inline-flex items-center justify-center px-12 py-5 text-xl font-medium text-white bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl animate-gradient"
            >
              <span className="relative z-10">Get Started</span>
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-20 blur transition-opacity duration-300" />
            </button>

            <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-8 bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:scale-105 hover:shadow-xl group">
                <Shield className="h-10 w-10 text-blue-400 mb-6 group-hover:text-blue-300 transition-colors" />
                <h3 className="text-xl font-semibold mb-4">Windows Security</h3>
                <p className="text-gray-400">Automated security checks and system protection features</p>
              </div>
              
              <div className="p-8 bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-xl group">
                <Zap className="h-10 w-10 text-purple-400 mb-6 group-hover:text-purple-300 transition-colors" />
                <h3 className="text-xl font-semibold mb-4">Quick Automation</h3>
                <p className="text-gray-400">One-click automation for common Windows tasks</p>
              </div>
              
              <div className="p-8 bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700 hover:border-green-500 transition-all duration-300 transform hover:scale-105 hover:shadow-xl group">
                <MonitorCheck className="h-10 w-10 text-green-400 mb-6 group-hover:text-green-300 transition-colors" />
                <h3 className="text-xl font-semibold mb-4">System Monitoring</h3>
                <p className="text-gray-400">Real-time monitoring of system performance</p>
              </div>
              
              <div className="p-8 bg-gray-800/50 backdrop-blur rounded-xl border border-gray-700 hover:border-teal-500 transition-all duration-300 transform hover:scale-105 hover:shadow-xl group">
                <FileSearch className="h-10 w-10 text-teal-400 mb-6 group-hover:text-teal-300 transition-colors" />
                <h3 className="text-xl font-semibold mb-4">File Management</h3>
                <p className="text-gray-400">Smart file organization and cleanup tools</p>
              </div>
            </div>

            <div className="mt-24 p-8 bg-gray-800/30 backdrop-blur rounded-xl border border-gray-700">
              <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">Why Choose Windows Assistive Workmate?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-left">
                  <h4 className="text-xl font-semibold mb-4 text-blue-400">Windows Expertise</h4>
                  <p className="text-gray-400">Built specifically for Windows, understanding your system's unique needs and capabilities.</p>
                </div>
                <div className="text-left">
                  <h4 className="text-xl font-semibold mb-4 text-purple-400">Smart Automation</h4>
                  <p className="text-gray-400">Intelligent task automation that learns from your preferences and usage patterns.</p>
                </div>
                <div className="text-left">
                  <h4 className="text-xl font-semibold mb-4 text-green-400">24/7 Assistance</h4>
                  <p className="text-gray-400">Always ready to help with any Windows-related task or question.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800/80 backdrop-blur-sm shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className="text-gray-400 hover:text-gray-200"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-2">
              <Terminal className="h-6 w-6 text-blue-400" />
              <h1 className="text-xl font-bold text-gray-100">Windows Assistive Workmate</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)] relative">
        <div className={`fixed inset-y-0 left-0 transform ${isHistoryOpen ? 'translate-x-0' : '-translate-x-full'} w-72 bg-gray-800/90 backdrop-blur-sm shadow-lg transition-transform duration-300 ease-in-out z-20 border-r border-gray-700`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <History className="h-5 w-5 text-blue-400" />
                <h2 className="text-lg font-semibold text-gray-100">History</h2>
              </div>
              <button onClick={() => setIsHistoryOpen(false)} className="text-gray-400 hover:text-gray-200">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              {history.map((item, index) => (
                <div key={index} className="group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 transform -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors border border-gray-600 hover:border-gray-500">
                    <p className="text-sm font-medium text-gray-100">{item.query}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                    {item.status && (
                      <div className={`mt-2 text-xs flex items-center space-x-1 ${
                        item.status.success ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {item.status.success ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <AlertCircle className="h-3 w-3" />
                        )}
                        <span>{item.status.message}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`flex-1 flex flex-col max-w-6xl mx-auto w-full px-4 ${
          (automationStatus || showAutomationConfirm) ? 'ml-80' : ''
        }`}>
          <main className="flex-1 overflow-y-auto p-6 chat-scroll">
            <div className="mb-8 overflow-hidden task-scroll-container">
              <div className="flex space-x-4 animate-scroll whitespace-nowrap py-3">
                {[...automationTasks, ...automationTasks].map((task, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(task)}
                    className="inline-flex items-center px-6 py-2.5 bg-blue-600/20 text-sm text-blue-300 rounded-full hover:bg-blue-600/30 transition-colors border border-blue-500/30 hover:border-blue-500/50 whitespace-nowrap transform hover:scale-105 duration-200"
                  >
                    {task}
                  </button>
                ))}
              </div>
              <div className="flex space-x-4 animate-scroll whitespace-nowrap py-3" style={{ animationDirection: 'reverse' }}>
                {[...generalTasks, ...generalTasks].map((task, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(task)}
                    className="inline-flex items-center px-6 py-2.5 bg-purple-600/20 text-sm text-purple-300 rounded-full hover:bg-purple-600/30 transition-colors border border-purple-500/30 hover:border-purple-500/50 whitespace-nowrap transform hover:scale-105 duration-200"
                  >
                    {task}
                  </button>
                ))}
              </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {response && (
                <div className="bg-gray-800/50 backdrop-blur rounded-xl shadow-lg p-6 border border-gray-700 transform transition-all duration-300 hover:shadow-2xl">
                  <div className="flex items-start space-x-4">
                    <MessageSquare className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-200 mb-3">Response</h3>
                      <p className="text-gray-300 whitespace-pre-wrap break-words">{response}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleAutomate}
                      className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg animate-gradient"
                    >
                      <Play className="h-5 w-5" />
                      <span>Automate This</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </main>

          <div className="border-t border-gray-700 bg-gray-800/90 backdrop-blur-sm p-6">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
              <div className="flex items-end space-x-3">
                <div className="flex space-x-2">
                  <div className="relative">
                    <button
                      type="button"
                      onMouseEnter={() => setShowUploadTooltip(true)}
                      onMouseLeave={() => setShowUploadTooltip(false)}
                      className="p-2 text-gray-400 hover:text-gray-200 transition-colors"
                      disabled
                    >
                      <Paperclip className="h-5 w-5" />
                    </button>
                    {showUploadTooltip && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-700 text-xs text-gray-200 rounded whitespace-nowrap">
                        File upload (Coming soon)
                      </div>
                    )}
                  </div>
                  
                  <div className="relative">
                    <button
                      type="button"
                      onMouseEnter={() => setShowVoiceTooltip(true)}
                      onMouseLeave={() => setShowVoiceTooltip(false)}
                      className="p-2 text-gray-400 hover:text-gray-200 transition-colors"
                      disabled
                    >
                      <Mic className="h-5 w-5" />
                    </button>
                    {showVoiceTooltip && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-700 text-xs text-gray-200 rounded whitespace-nowrap">
                        Voice input (Coming soon)
                      </div>
                    )}
                  </div>
                </div>
                
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about Windows tasks or type a command..."
                  className="flex-1 p-3 bg-gray-700/50 text-gray-100 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-12 placeholder-gray-500"
                  disabled={isLoading}
                />
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {(automationStatus || showAutomationConfirm) && (
          <div className="fixed left-0 top-16 bottom-0 w-80 border-r border-gray-700 bg-gray-800/90 backdrop-blur-sm p-6 overflow-y-auto">
            <div className="sticky top-0 bg-gray-800/90 backdrop-blur-sm pb-4 mb-4 border-b border-gray-700">
              <h3 className="text-lg font-medium text-gray-200 mb-2">
                {showAutomationConfirm ? 'Confirm Automation' : 'Automation Progress'}
              </h3>
              <p className="text-sm text-gray-400">
                {showAutomationConfirm 
                  ? 'Please review and confirm the following automation steps:'
                  : automationStatus?.message}
              </p>
            </div>
            
            <div className="space-y-4">
              {(showAutomationConfirm ? pendingAutomation : automationStatus?.steps)?.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-3 rounded-lg bg-gray-700/30 ${
                    !showAutomationConfirm && index <= (automationStatus?.currentStep ?? 0)
                      ? 'text-gray-200'
                      : 'text-gray-500'
                  }`}
                >
                  {!showAutomationConfirm && index < (automationStatus?.currentStep ?? 0) ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-none" />
                  ) : !showAutomationConfirm && index === (automationStatus?.currentStep ?? 0) ? (
                    <div className="h-5 w-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin flex-none" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-600 flex-none" />
                  )}
                  <span className="text-sm">{step}</span>
                </div>
              ))}
            </div>

            {showAutomationConfirm && (
              <div className="sticky bottom-0 pt-4 mt-6 bg-gray-800/90 backdrop-blur-sm border-t border-gray-700">
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowAutomationConfirm(false)}
                    className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmAutomation}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}

            {automationStatus?.error && (
              <div className="mt-6 p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-400 flex-none mt-0.5" />
                  <p className="text-sm text-red-400">{automationStatus.error}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;