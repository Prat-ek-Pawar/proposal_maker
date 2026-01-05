import { PDFViewer } from '@react-pdf/renderer';
import { ProposalDocument } from './ProposalPDF';
import { useProposalStore } from '../../store/useProposalStore';
import { useDeferredValue } from 'react';
import { ErrorBoundary } from '../layout/ErrorBoundary';

export const PDFPreview = () => {
  const { content, clientName, themeColor, contentVersion, date, validity, visualData, isReplicaActive, documentType } = useProposalStore();
  
  const deferredContent = useDeferredValue(content);
  const deferredClientName = useDeferredValue(clientName);
  const deferredThemeColor = useDeferredValue(themeColor);
  const deferredVersion = useDeferredValue(contentVersion);
  const deferredDate = useDeferredValue(date);
  const deferredValidity = useDeferredValue(validity);
  
  const isUpdating = 
    contentVersion !== deferredVersion || 
    clientName !== deferredClientName || 
    themeColor !== deferredThemeColor ||
    date !== deferredDate ||
    validity !== deferredValidity;

  return (
    <div className="h-full w-full bg-neutral-800 flex flex-col">
      <div className="bg-neutral-900 border-b border-white/5 text-neutral-400 text-xs uppercase tracking-widest text-center py-2 font-bold relative">
        Live PDF Preview
        {isUpdating && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" />
            <span className="text-[10px] lowercase opacity-50 font-medium tracking-normal">Syncing...</span>
          </div>
        )}
      </div>
      <div className="flex-1 bg-neutral-800 p-4 md:p-8 flex items-center justify-center overflow-hidden">
        <ErrorBoundary>
            <PDFViewer 
                key={`pdf-${deferredVersion}-${deferredClientName}-${deferredThemeColor}-${deferredDate}-${deferredValidity}-${documentType}`}
                className="w-full h-full shadow-2xl rounded-sm border-none bg-white font-sans" 
                style={{ width: '100%', height: '100%' }}
                showToolbar={false}
            >
               <ProposalDocument 
                  content={deferredContent} 
                  clientName={deferredClientName} 
                  themeColor={deferredThemeColor} 
                  date={deferredDate}
                  validity={deferredValidity}
                  visualData={visualData}
                  isReplicaActive={isReplicaActive}
                  documentType={documentType}
               />
            </PDFViewer>
        </ErrorBoundary>
      </div>
    </div>
  );
};
