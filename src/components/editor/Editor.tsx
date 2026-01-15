import { useEditor, EditorContent, type Editor as EditorType } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { useProposalStore } from '../../store/useProposalStore';
import { FaBold, FaItalic, FaUnderline, FaListUl, FaListOl, FaLink, FaMagic, FaBrain } from 'react-icons/fa';
import { clsx } from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';
import { useUiStore } from '../../store/useUiStore';
import { API_BASE_URL } from '../../config';

const ToolbarButton = ({ 
  onClick, 
  isActive = false, 
  children,
  title
}: { 
  onClick: () => void, 
  isActive?: boolean, 
  children: React.ReactNode,
  title?: string 
}) => (
  <button
    type="button"
    onClick={(e) => {
        e.preventDefault();
        onClick();
    }}
    title={title}
    className={clsx(
      "p-2 rounded hover:bg-neutral-100 transition-colors text-neutral-600",
      isActive && "bg-neutral-100 text-neutral-900 font-bold"
    )}
  >
    {children}
  </button>
);

const EditorToolbar = ({ editor, onAiClick }: { editor: EditorType, onAiClick: () => void }) => {
  const { setTrainingModalOpen } = useUiStore();
  const { isReplicaActive, setIsReplicaActive, documentType, setDocumentType } = useProposalStore();

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-neutral-200 p-2 bg-white sticky top-0 z-10 shadow-sm backdrop-blur-sm bg-white/90">
      <ToolbarButton 
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
        isActive={editor.isActive('heading', { level: 1 })}
        title="Heading 1"
      >
        <span className="font-bold px-1">H1</span>
      </ToolbarButton>
      <ToolbarButton 
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
        isActive={editor.isActive('heading', { level: 2 })}
        title="Heading 2"
      >
        <span className="font-bold text-sm px-1">H2</span>
      </ToolbarButton>
      
      <div className="w-px h-5 bg-neutral-200 mx-2" />
      
      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}>
        <FaBold size={14} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}>
        <FaItalic size={14} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')}>
        <FaUnderline size={14} />
      </ToolbarButton>
      
      <div className="w-px h-5 bg-neutral-200 mx-2" />
      
      <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')}>
        <FaListUl size={14} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')}>
        <FaListOl size={14} />
      </ToolbarButton>
      
      <div className="w-px h-5 bg-neutral-200 mx-2" />
      
      <ToolbarButton onClick={setLink} isActive={editor.isActive('link')}>
        <FaLink size={14} />
      </ToolbarButton>
      
      <div className="w-px h-5 bg-neutral-200 mx-2" />
      
      <ToolbarButton onClick={onAiClick} title="Generate with AI">
        <FaMagic size={14} className="text-purple-600" />
        <span className="ml-1 text-xs font-bold text-purple-600">AI Gen</span>
      </ToolbarButton>

      <div className="w-px h-5 bg-neutral-200 mx-2" />

      <ToolbarButton onClick={() => setTrainingModalOpen(true)} title="Train AI">
        <FaBrain size={14} className="text-green-600" />
        <span className="ml-1 text-xs font-bold text-green-600">Train</span>
      </ToolbarButton>

      <div className="w-px h-5 bg-neutral-200 mx-2" />

      <label className="flex items-center gap-2 cursor-pointer select-none">
          <input 
            type="checkbox" 
            checked={isReplicaActive} 
            onChange={(e) => setIsReplicaActive(e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
          />
          <span className="text-xs font-bold text-neutral-600">Replica Mode</span>
      </label>

      <div className="w-px h-5 bg-neutral-200 mx-2" />

      <div className="flex items-center gap-3 border border-neutral-200 rounded-md px-2 py-1 bg-neutral-50">
          <label className="flex items-center gap-1.5 cursor-pointer">
              <input 
                  type="radio" 
                  name="docType"
                  checked={documentType === 'proposal'} 
                  onChange={() => setDocumentType('proposal')}
                  className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500"
              />
              <span className={`text-xs font-bold ${documentType === 'proposal' ? 'text-blue-700' : 'text-neutral-500'}`}>Proposal</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
              <input 
                  type="radio" 
                  name="docType"
                  checked={documentType === 'quotation'} 
                  onChange={() => setDocumentType('quotation')}
                  className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500"
              />
              <span className={`text-xs font-bold ${documentType === 'quotation' ? 'text-blue-700' : 'text-neutral-500'}`}>Quotation</span>
          </label>
      </div>
    </div>
  );
};

const AIPromptModal = ({ isOpen, onClose, onSubmit, isGenerating }: { isOpen: boolean, onClose: () => void, onSubmit: (text: string) => void, isGenerating: boolean }) => {
  const [input, setInput] = useState("");

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-neutral-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <div className="bg-purple-100 p-1.5 rounded-md">
                <FaMagic className="text-purple-600" size={14} />
              </div>
              <span className="font-bold text-neutral-800">AI Proposal Generator</span>
           </div>
           <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 transition-colors">
             <span className="text-xl">×</span>
           </button>
        </div>
        
        <div className="p-6">
           <p className="text-sm text-neutral-500 mb-3 font-medium">Describe your proposal requirements:</p>
           <textarea 
             autoFocus
             className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-neutral-700 placeholder:text-neutral-400 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none resize-none transition-all text-sm leading-relaxed"
             rows={4}
             placeholder="E.g., Create a premium proposal for a luxury real estate client offering social media marketing services..."
             value={input}
             onChange={(e) => setInput(e.target.value)}
             onKeyDown={(e) => {
               if (e.key === 'Enter' && !e.shiftKey) {
                 e.preventDefault();
                 if (input.trim()) onSubmit(input);
               }
             }}
           />
           
           <div className="flex justify-end gap-3 mt-4">
              <button 
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => input.trim() && onSubmit(input)}
                disabled={!input.trim() || isGenerating}
                className="bg-neutral-900 hover:bg-neutral-800 text-white px-5 py-2 rounded-lg font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <FaMagic size={12} />
                    <span>Generate</span>
                  </>
                )}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export const Editor = () => {
  const { content, setContent, isReplicaActive, setVisualData, documentType, clientName } = useProposalStore();
  const [isAiModalOpen, setAiModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Use a ref for the debounced function to keep it stable across renders
  const debouncedUpdateRef = useRef(
    debounce((json: any) => {
      console.log("Updating store content...");
      setContent(json);
    }, 800)
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
      Placeholder.configure({ placeholder: "Start writing your proposal..." }),
      Link.configure({ openOnClick: false }),
      Underline,
      Table.configure({ resizable: true }),
      TableRow, TableHeader, TableCell,
    ],
    content: content as any,
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none min-h-[calc(100vh-200px)] p-12 lg:p-20 font-sans',
      },
    },
    onUpdate: ({ editor }) => debouncedUpdateRef.current(editor.getJSON()),
  });

  // Cleanup debounce
  useEffect(() => () => debouncedUpdateRef.current.cancel(), []);

  const handleAiSubmit = async (description: string) => {
    setIsGenerating(true);
    try {
        const response = await fetch(`${API_BASE_URL}/api/generate-proposal`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                description,
                useReplica: isReplicaActive,
                documentType,
                clientName
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to generate proposal');
        }
        
        const data = await response.json();
        
        if (data.visualData) {
            setVisualData(data.visualData);
        }

        if (data.content && editor) {
            let contentToSet = data.content;
            
            // If string, perform basic cleanup to ensure Tiptap parses it well
            if (typeof contentToSet === 'string') {
                // Remove Markdown code blocks if any
                contentToSet = contentToSet.replace(/```html/g, '').replace(/```/g, '');
                // Remove outer html/body tags if present, keeping inner content
                const bodyMatch = contentToSet.match(/<body[^>]*>([\s\S]*)<\/body>/i);
                if (bodyMatch) {
                    contentToSet = bodyMatch[1];
                }
            }
            
            console.log("Setting editor content:", contentToSet);
            editor.commands.setContent(contentToSet);
            setAiModalOpen(false); // Close modal on success
        } else {
            alert("No content was generated.");
        }
    } catch (e: any) {
        console.error(e);
        alert(`Error: ${e.message || 'Ensure backend is running on port 3000'}`);
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden relative">
      <EditorToolbar editor={editor!} onAiClick={() => setAiModalOpen(true)} />
      
      <div 
        className="flex-1 overflow-y-auto bg-white cursor-text relative" 
        onClick={() => editor?.chain().focus().run()}
      >
         <div className="max-w-4xl mx-auto min-h-full bg-white shadow-sm border-x border-dashed border-neutral-100">
            <EditorContent editor={editor} />
         </div>
      </div>
      
      <AIPromptModal 
        isOpen={isAiModalOpen} 
        onClose={() => setAiModalOpen(false)} 
        onSubmit={handleAiSubmit} 
        isGenerating={isGenerating}
      />
    </div>
  );
};
