
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Code, Settings, Trash2, Send, Wand2, Terminal, AlertTriangle, RefreshCw, X } from 'lucide-react';
import { generateGameCode, selectSkeletonId } from './services/geminiService.ts';

interface Log {
  type: 'info' | 'error' | 'success';
  message: string;
  timestamp: string;
}

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentSkeleton, setCurrentSkeleton] = useState<string | null>(null);
  const [gameCode, setGameCode] = useState<string | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const addLog = useCallback((message: string, type: 'info' | 'error' | 'success' = 'info') => {
    setLogs(prev => [
      { message, type, timestamp: new Date().toLocaleTimeString() },
      ...prev
    ].slice(0, 50));
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGameCode(null);
    setCurrentSkeleton(null);
    setLogs([]);
    addLog(`Analyzing request: "${prompt}"...`, 'info');

    try {
      // Phase 1: Select Skeleton
      const skeletonId = await selectSkeletonId(prompt);
      setCurrentSkeleton(skeletonId);
      addLog(`Skeleton selected: ${skeletonId}`, 'success');

      // Phase 2: Generate Game Code
      addLog(`Generating game code based on ${skeletonId} skeleton...`, 'info');
      const rawCode = await generateGameCode(skeletonId, prompt);
      
      // Smart Cleaning Logic: Extract only the valid HTML part
      let cleanedCode = rawCode.trim();

      // 1. If wrapped in markdown blocks, extract the content
      const markdownMatch = cleanedCode.match(/```(?:html)?\s*([\s\S]*?)```/);
      if (markdownMatch) {
        cleanedCode = markdownMatch[1];
      }

      // 2. Locate the start of the HTML document to ignore preceding conversational text
      const docTypeIndex = cleanedCode.indexOf('<!DOCTYPE html>');
      const htmlTagIndex = cleanedCode.indexOf('<html');
      
      if (docTypeIndex !== -1) {
        cleanedCode = cleanedCode.substring(docTypeIndex);
      } else if (htmlTagIndex !== -1) {
        cleanedCode = cleanedCode.substring(htmlTagIndex);
      }

      if (!cleanedCode.trim().startsWith('<')) {
         addLog('Warning: Generated code might contain conversational text.', 'error');
      }

      setGameCode(cleanedCode);
      addLog('Game generation complete!', 'success');
      setActiveTab('preview');
    } catch (error) {
      console.error('Generation Error:', error);
      addLog(`Error during generation: ${error instanceof Error ? error.message : String(error)}`, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleIframeMessage = useCallback((event: MessageEvent) => {
    if (event.data && event.data.type === 'error') {
      addLog(`Runtime Error: ${event.data.message} (Line: ${event.data.line})`, 'error');
    }
  }, [addLog]);

  useEffect(() => {
    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, [handleIframeMessage]);

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      {/* Sidebar / Controls */}
      <div className="w-80 border-r border-slate-800 flex flex-col bg-slate-900 shadow-xl z-20">
        <div className="p-4 border-b border-slate-800 flex items-center gap-2">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Wand2 size={20} className="text-white" />
          </div>
          <h1 className="font-bold text-lg tracking-tight">Skeleton AI</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your Game Idea</label>
            <textarea
              className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none placeholder-slate-600"
              placeholder="E.g. A neon-themed infinite runner where you play as a cat dodging laser dogs..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 transition-all active:scale-95"
          >
            {isGenerating ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Play size={18} fill="currentColor" />
                Generate Game
              </>
            )}
          </button>

          {currentSkeleton && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase">Current Skeleton</span>
                <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2 py-0.5 rounded-full border border-blue-500/20">Active</span>
              </div>
              <p className="text-sm font-mono text-blue-300">{currentSkeleton}</p>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Logs</label>
              <button 
                onClick={() => setLogs([])}
                className="text-slate-500 hover:text-slate-300 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="bg-black/40 border border-slate-800 rounded-xl p-3 h-64 overflow-y-auto font-mono text-[11px] space-y-2 scrollbar-thin">
              {logs.length === 0 ? (
                <div className="text-slate-700 italic flex items-center gap-2">
                  <Terminal size={12} />
                  Waiting for input...
                </div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className={`flex gap-2 ${
                    log.type === 'error' ? 'text-red-400' : 
                    log.type === 'success' ? 'text-emerald-400' : 'text-slate-400'
                  }`}>
                    <span className="opacity-30 shrink-0">[{log.timestamp}]</span>
                    <span>{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <p className="text-[10px] text-slate-600 text-center">
            Powered by Gemini 3.0 & Skeleton Engine
          </p>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col relative">
        <div className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 z-10 shadow-sm">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all relative ${
                activeTab === 'preview' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Play size={16} />
              Preview
              {activeTab === 'preview' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400 rounded-full" />}
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all relative ${
                activeTab === 'code' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Code size={16} />
              Source
              {activeTab === 'code' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400 rounded-full" />}
            </button>
          </div>

          <div className="flex items-center gap-3">
            {gameCode && (
              <button 
                title="Download HTML"
                className="text-slate-500 hover:text-slate-300 p-2 rounded-lg hover:bg-slate-800 transition-all"
                onClick={() => {
                  const blob = new Blob([gameCode], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'game.html';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <Code size={18} />
              </button>
            )}
            <Settings size={18} className="text-slate-600 hover:text-slate-400 cursor-pointer" />
          </div>
        </div>

        <div className="flex-1 bg-slate-950 relative overflow-hidden">
          {activeTab === 'preview' ? (
            <div className="w-full h-full flex items-center justify-center relative">
              {gameCode ? (
                <iframe
                  ref={iframeRef}
                  title="Game Preview"
                  className="w-full h-full border-none bg-black"
                  srcDoc={gameCode}
                  sandbox="allow-scripts allow-modals"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-700 gap-4">
                  <div className="p-8 border-2 border-dashed border-slate-900 rounded-3xl">
                    <Play size={48} className="opacity-20" />
                  </div>
                  <p className="text-lg font-medium">Generate a game to see the preview</p>
                </div>
              )}
              
              {isGenerating && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-30 transition-all animate-in fade-in duration-500">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-900 border-t-blue-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Wand2 size={24} className="text-blue-400" />
                    </div>
                  </div>
                  <p className="mt-6 text-blue-400 font-bold animate-pulse">SKELETON ENGINE BOOTING...</p>
                  <p className="mt-2 text-slate-500 text-sm">Consulting AI Agents for strategy...</p>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full bg-[#0d1117] font-mono p-6 overflow-auto text-xs sm:text-sm">
              {gameCode ? (
                <pre className="text-emerald-400/90 whitespace-pre-wrap selection:bg-blue-500/30">
                  {gameCode}
                </pre>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-700">
                  <Code size={48} className="opacity-20 mb-4" />
                  <p>No code generated yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
