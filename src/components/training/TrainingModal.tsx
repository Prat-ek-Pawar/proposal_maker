import { useState, useEffect } from 'react';
import { FaTimes, FaFileUpload, FaLink, FaFont, FaSpinner, FaCheckCircle, FaTrash, FaRobot, FaDatabase, FaLayerGroup } from 'react-icons/fa';

interface TrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HistoryItem {
  _id: string;
  title: string;
  source: 'file' | 'url' | 'text';
  originalContent: string;
  visualData?: any;
  createdAt: string;
  contributionSummary?: string;
}

export const TrainingModal = ({ isOpen, onClose }: TrainingModalProps) => {
  const [view, setView] = useState<'new' | 'history'>('new');
  
  // Training State
  const [activeTab, setActiveTab] = useState<'file' | 'url' | 'text'>('file');
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [isTraining, setIsTraining] = useState(false);
  const [extractVisuals, setExtractVisuals] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // History State
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && view === 'history') {
      fetchHistory();
    }
  }, [isOpen, view]);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch('http://localhost:3000/api/history');
      const data = await res.json();
      setHistory(data);
    } catch (error) {
      console.error("Failed to fetch history", error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Remove this item from the log? Note: knowledge may persist in the Master Prompt.")) return; // eslint-disable-line
    
    try {
      await fetch(`http://localhost:3000/api/history/${id}`, { method: 'DELETE' });
      setHistory(prev => prev.filter(item => item._id !== id));
    } catch (error) {
      alert("Failed to delete item");
    }
  };

  const handleTrain = async () => {
    setIsTraining(true);
    setStatus('idle');
    setMessage('');
    
    const formData = new FormData();
    if (activeTab === 'file') {
        formData.append('extractVisuals', extractVisuals ? 'true' : 'false');
    }
    
    if (activeTab === 'file' && file) {
      formData.append('type', 'file');
      formData.append('file', file);
    } else if (activeTab === 'url' && url) {
      formData.append('type', 'url');
      formData.append('url', url);
    } else if (activeTab === 'text' && text) {
      formData.append('type', 'text');
      formData.append('text', text);
    } else {
      setMessage('Please provide valid input.');
      setIsTraining(false);
      return;
    }

    try {
       const bodyPayload = activeTab === 'file' ? formData : JSON.stringify({ 
                type: activeTab, 
                url: activeTab === 'url' ? url : undefined,
                text: activeTab === 'text' ? text : undefined,
                extractVisuals: extractVisuals ? 'true' : 'false'
            });

        const response = await fetch('http://localhost:3000/api/train', {
            method: 'POST',
            body: bodyPayload,
            headers: activeTab === 'file' ? {} : {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            setStatus('success');
            setMessage('Success! The Master Prompt has been evolved with this new knowledge.');
            setFile(null); setUrl(''); setText('');
        } else {
            setStatus('error');
            setMessage(data.error || 'Training failed.');
        }
    } catch (e: any) {
        setStatus('error');
        setMessage(e.message || 'Connection error.');
    } finally {
        setIsTraining(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex overflow-hidden animate-fade-in">
        
        {/* Sidebar */}
        <div className="w-64 bg-neutral-50 border-r border-neutral-200 flex flex-col">
           <div className="p-6 border-b border-neutral-200">
                <h2 className="font-bold text-lg flex items-center gap-2 text-neutral-800">
                    <FaRobot className="text-purple-600" />
                    Model Trainer
                </h2>
            </div>
            
            <nav className="flex-1 p-4 space-y-2">
                <button 
                    onClick={() => setView('new')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${view === 'new' ? 'bg-white shadow-md text-purple-700 ring-1 ring-black/5' : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'}`}
                >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${view === 'new' ? 'bg-purple-100' : 'bg-neutral-200'}`}>
                        <FaFileUpload className="text-xs" />
                    </div>
                    Train Master Model
                </button>

                <button 
                    onClick={() => setView('history')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${view === 'history' ? 'bg-white shadow-md text-purple-700 ring-1 ring-black/5' : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'}`}
                >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${view === 'history' ? 'bg-purple-100' : 'bg-neutral-200'}`}>
                        <FaLayerGroup className="text-xs" />
                    </div>
                    Ingested Data Sources
                </button>
            </nav>
            
            <div className="p-4 border-t border-neutral-200">
                 <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <p className="text-xs text-blue-700 font-medium leading-relaxed">
                        <span className="font-bold">Tip:</span> The Master Model learns from every contribution.
                    </p>
                 </div>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-white">
            <div className="h-16 border-b border-neutral-100 flex items-center justify-between px-8">
                <h3 className="font-bold text-lg text-neutral-800">
                    {view === 'new' ? 'Upgrade Master Model' : 'Ingested Knowledge Sources'}
                </h3>
                <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-900 transition-colors">
                    <FaTimes />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
                {view === 'new' ? (
                    <div className="max-w-2xl mx-auto space-y-8">
                        <div>
                            <p className="text-neutral-600 mb-6">
                                Upload diverse proposals, style guides, or URLs. The AI will analyze them and <span className="font-bold text-purple-700">merge unique insights</span> into the single Master Prompt. Duplicates will be ignored.
                            </p>

                            <div className="bg-neutral-100/50 p-1 rounded-xl inline-flex mb-8 w-full">
                                <button onClick={() => setActiveTab('file')} className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex justify-center items-center gap-2 transition-all ${activeTab === 'file' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}>
                                    <FaFileUpload /> PDF/File
                                </button>
                                <button onClick={() => setActiveTab('url')} className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex justify-center items-center gap-2 transition-all ${activeTab === 'url' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}>
                                    <FaLink /> Website
                                </button>
                                <button onClick={() => setActiveTab('text')} className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex justify-center items-center gap-2 transition-all ${activeTab === 'text' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'}`}>
                                    <FaFont /> Text
                                </button>
                            </div>

                            <div className="min-h-[200px]">
                                {activeTab === 'file' && (
                                    <div className="border-2 border-dashed border-neutral-300 rounded-xl p-10 flex flex-col items-center justify-center bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer relative group">
                                        <input 
                                            type="file" 
                                            accept=".pdf,.txt"
                                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <FaFileUpload className="text-2xl text-purple-600" />
                                        </div>
                                        <span className="text-base font-bold text-neutral-900">{file ? file.name : "Click to Upload PDF/TXT"}</span>
                                        <span className="text-sm text-neutral-500 mt-2">Max 50MB • PDF, TXT supported</span>
                                    </div>
                                )}
                                {activeTab === 'url' && (
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold text-neutral-500 uppercase px-1">Website URL</label>
                                        <input 
                                            type="url" 
                                            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                                            placeholder="https://example.com"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                        />
                                    </div>
                                )}
                                {activeTab === 'text' && (
                                     <div className="space-y-4">
                                        <label className="text-xs font-bold text-neutral-500 uppercase px-1">Paste Content</label>
                                        <textarea 
                                            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none h-48 resize-none transition-all"
                                            placeholder="Paste content here..."
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>

                             {/* Visual Extraction Option */}
                            <div className="mt-6 flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                                <input 
                                    type="checkbox" 
                                    id="extractVisuals" 
                                    checked={extractVisuals} 
                                    onChange={(e) => setExtractVisuals(e.target.checked)}
                                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
                                />
                                <label htmlFor="extractVisuals" className="text-sm text-neutral-700 cursor-pointer select-none">
                                    <span className="font-bold">Replica Mode:</span> Also extract colors, fonts, and layout style?
                                </label>
                            </div>

                            {message && (
                                <div className={`mt-6 p-4 rounded-xl text-sm flex items-start gap-3 ${status === 'success' ? 'bg-green-50 text-green-800 border border-green-100' : status === 'error' ? 'bg-red-50 text-red-800 border border-red-100' : 'bg-neutral-100 text-neutral-600'}`}>
                                    {status === 'success' && <FaCheckCircle className="mt-0.5 shrink-0" />}
                                    <div>{message}</div>
                                </div>
                            )}

                        </div>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto">
                        {loadingHistory ? (
                            <div className="flex flex-col items-center justify-center h-64 text-neutral-400">
                                <FaSpinner className="animate-spin text-2xl mb-2" />
                                <span className="text-sm">Loading data sources...</span>
                            </div>
                        ) : history.length === 0 ? (
                            <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-dashed border-neutral-200">
                                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                                    <FaDatabase className="text-2xl" />
                                </div>
                                <h3 className="font-bold text-neutral-900 mb-1">No Data Sources</h3>
                                <p className="text-sm text-neutral-500 mb-6">The Master Prompt is using default rules.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {history.map((item) => (
                                    <div key={item._id} className="group bg-white border border-neutral-200 rounded-xl hover:shadow-sm transition-all duration-300 overflow-hidden">
                                        <div 
                                            className="p-5 flex items-center gap-4 cursor-pointer"
                                            onClick={() => setExpandedItem(expandedItem === item._id ? null : item._id)}
                                        >
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${item.source === 'file' ? 'bg-neutral-100 text-neutral-600' : 'bg-neutral-100 text-neutral-600'}`}>
                                                {item.source === 'file' ? <FaFileUpload /> : item.source === 'url' ? <FaLink /> : <FaFont />}
                                            </div>
                                            
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-neutral-900 truncate">{item.title}</h4>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-xs font-mono text-neutral-400 uppercase bg-neutral-50 px-2 py-0.5 rounded">{item.source}</span>
                                                    <span className="text-xs text-neutral-400">{new Date(item.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            <button 
                                                onClick={(e) => handleDelete(item._id, e)}
                                                className="w-8 h-8 rounded-full hover:bg-red-50 text-neutral-300 hover:text-red-500 flex items-center justify-center transition-colors"
                                                title="Remove source from log"
                                            >
                                                <FaTrash className="text-xs" />
                                            </button>
                                        </div>
                                         {/* Expanded Details - Just Basic Info */}
                                        {expandedItem === item._id && (
                                            <div className="border-t border-neutral-100 bg-neutral-50/50 p-6 animate-fade-in relative">
                                                <h5 className="text-xs font-bold text-neutral-500 uppercase mb-3">Original Source Content (Snippet)</h5>
                                                <div className="bg-white border border-neutral-200 rounded-lg p-3 max-h-40 overflow-y-auto custom-scrollbar">
                                                     <p className="text-xs text-neutral-600 font-mono leading-relaxed">
                                                        {item.originalContent || "Content not available."}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            {view === 'new' && (
                <div className="p-6 border-t border-neutral-100 bg-white flex justify-end">
                    <button 
                        onClick={handleTrain}
                        disabled={isTraining || (activeTab === 'file' && !file) || (activeTab === 'url' && !url) || (activeTab === 'text' && !text)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-200"
                    >
                        {isTraining ? (
                            <>
                                <FaSpinner className="animate-spin" /> Improving Model...
                            </>
                        ) : (
                            <>Analyze & Update Master Prompt</>
                        )}
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
