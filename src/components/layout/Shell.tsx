import { useProposalStore } from '../../store/useProposalStore';
import { Editor } from '../editor/Editor';
import { PDFPreview } from '../preview/PDFPreview';
import { pdf } from '@react-pdf/renderer';
import { ProposalDocument } from '../preview/ProposalPDF';
import { TrainingModal } from '../training/TrainingModal';
import { useUiStore } from '../../store/useUiStore';
import { FaDownload, FaCalendarAlt, FaShieldAlt, FaUser, FaPrint } from 'react-icons/fa';

export const Shell = () => {
  const { 
    clientName, setClientName, 
    content, isExporting, setIsExporting, 
    themeColor, setThemeColor,
    date, setDate,
    validity, setValidity,
    visualData, isReplicaActive, documentType
  } = useProposalStore();

  const { isTrainingModalOpen, setTrainingModalOpen } = useUiStore();

  const generateBlob = async () => {
    const doc = <ProposalDocument 
      content={content} 
      clientName={clientName} 
      themeColor={themeColor} 
      date={date}
      validity={validity}
      visualData={visualData}
      isReplicaActive={isReplicaActive}
      documentType={documentType}
    />;
    return await pdf(doc).toBlob();
  };

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
        const blob = await generateBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${(clientName || 'Proposal').replace(/\s+/g, '_')}_Proposal.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (e: any) {
        console.error("PDF Export Error:", e);
        alert(`Export failed: ${e.message || 'Unknown error'}.`);
    } finally {
        setIsExporting(false);
    }
  };

  const handlePrint = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
        const blob = await generateBlob();
        const url = URL.createObjectURL(blob);
        const printWindow = window.open(url, '_blank');
        if (printWindow) {
            printWindow.onload = () => {
                printWindow.print();
            };
        } else {
            alert("Pop-up blocked! Please allow pop-ups to print.");
        }
    } catch (e: any) {
        console.error("PDF Print Error:", e);
        alert(`Print failed: ${e.message || 'Unknown error'}.`);
    } finally {
        setIsExporting(false);
    }
  };
  
  const colors = ['#2563eb', '#000000', '#16a34a', '#dc2626', '#9333ea'];

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      {/* Top Bar - Glassmorphism & Premium Feel */}
      <header className="h-auto md:h-16 border-b border-slate-200 bg-white/90 backdrop-blur-md flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-3 md:py-0 shrink-0 z-30 sticky top-0 gap-3 md:gap-0">
        
        {/* Logo & Branding */}
        <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2.5">
                <div className="bg-slate-900 text-white p-1.5 rounded-lg shadow-sm">
                   <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500" />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-heading font-bold tracking-tight text-slate-900 leading-tight">PROPOSAL GEN</span>
                    <span className="text-[10px] text-slate-500 font-medium tracking-wide">ENTERPRISE EDITION</span>
                </div>
            </div>
            
            {/* Color Picker (Compact) */}
            <div className="flex items-center gap-1.5 ml-4 border-l border-slate-200 pl-4 h-8">
               {colors.map(c => (
                   <button 
                     key={c}
                     onClick={() => setThemeColor(c)}
                     title="Brand Color"
                     className={`w-4 h-4 md:w-5 md:h-5 rounded-full transition-all hover:scale-110 ${themeColor === c ? 'ring-2 ring-offset-2 ring-slate-400 scale-100' : 'opacity-60 hover:opacity-100'}`}
                     style={{ backgroundColor: c }}
                   />
               ))}
            </div>
        </div>

        {/* Dynamic Inputs - Control Bar Style */}
        <div className="flex-1 flex flex-wrap items-center justify-center md:justify-end gap-2 w-full md:w-auto">
            <div className="group relative flex items-center">
                <FaUser className="absolute left-3 text-slate-400 text-xs z-10" />
                <input 
                    type="text" 
                    placeholder="Client Name" 
                    className="pl-8 pr-3 py-1.5 text-xs md:text-sm font-medium bg-slate-100 border-none rounded-md focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all w-full md:w-40 placeholder:text-slate-400 hover:bg-slate-50"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                />
            </div>

            <div className="group relative flex items-center">
                <FaCalendarAlt className="absolute left-3 text-slate-400 text-xs z-10" />
                <input 
                    type="date" 
                    className="pl-8 pr-3 py-1.5 text-xs md:text-sm font-medium bg-slate-100 border-none rounded-md focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all w-full md:w-36 text-slate-600 hover:bg-slate-50"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>

            <div className="group relative flex items-center">
                <FaShieldAlt className="absolute left-3 text-slate-400 text-xs z-10" />
                <input 
                    type="text" 
                    placeholder="Validity (e.g. 15 Days)" 
                    className="pl-8 pr-3 py-1.5 text-xs md:text-sm font-medium bg-slate-100 border-none rounded-md focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all w-full md:w-32 placeholder:text-slate-400 hover:bg-slate-50"
                    value={validity}
                    onChange={(e) => setValidity(e.target.value)}
                />
            </div>

            <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block" />

            <div className="flex items-center gap-2 w-full md:w-auto justify-end mt-2 md:mt-0">
                <button 
                    onClick={handlePrint} 
                    disabled={isExporting}
                    className="hidden md:flex bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 px-3 py-1.5 rounded-md font-semibold text-xs items-center gap-2 transition-all active:scale-95 shadow-sm"
                >
                    <FaPrint size={10} />
                    <span>Print</span>
                </button>
                <button 
                    onClick={handleExport} 
                    disabled={isExporting}
                    className="flex-1 md:flex-none justify-center bg-slate-900 hover:bg-slate-800 text-white px-4 py-1.5 rounded-md font-semibold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-md shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/20"
                >
                    {isExporting ? (
                        <>
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Processing...</span>
                        </>
                    ) : (
                        <>
                            <FaDownload size={10} /> 
                            <span>Export PDF</span>
                        </>
                    )}
                </button>
            </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Editor Section */}
        <div className="flex-1 h-full overflow-hidden flex flex-col relative z-0 bg-white border-r border-slate-200 shadow-sm">
             <Editor />
        </div>
        
        {/* Preview Section */}
        <div className="h-[40vh] md:h-full md:w-[45%] lg:w-[48%] relative z-0 bg-slate-100/50 backdrop-blur-sm">
            <PDFPreview />
        </div>
      </main>

      {/* Global Modals */}
      <TrainingModal isOpen={isTrainingModalOpen} onClose={() => setTrainingModalOpen(false)} />
    </div>
  );
};
