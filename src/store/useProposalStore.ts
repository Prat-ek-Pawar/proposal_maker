import { create } from "zustand";
import { type JSONContent } from "@tiptap/react";
import type { VisualData } from "../components/types";

interface ProposalState {
  clientName: string;
  content: JSONContent;
  isExporting: boolean;
  themeColor: string;
  contentVersion: number;
  date: string;
  validity: string;
  visualData: VisualData | null;
  isReplicaActive: boolean;
  documentType: "proposal" | "quotation";

  setClientName: (name: string) => void;
  setContent: (content: JSONContent) => void;
  setIsExporting: (isExporting: boolean) => void;
  setThemeColor: (color: string) => void;
  incrementVersion: () => void;
  setDate: (date: string) => void;
  setValidity: (validity: string) => void;
  setVisualData: (data: VisualData | null) => void;
  setIsReplicaActive: (active: boolean) => void;
  setDocumentType: (type: "proposal" | "quotation") => void;
}

const DEFAULT_CONTENT: JSONContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
    },
  ],
};

const today = new Date().toISOString().split("T")[0];

export const useProposalStore = create<ProposalState>((set) => ({
  clientName: "",
  content: DEFAULT_CONTENT,
  isExporting: false,
  themeColor: "#2563eb",
  contentVersion: 0,
  date: today,
  validity: "15 Days",
  visualData: null,
  isReplicaActive: false,
  documentType: "proposal",

  setClientName: (name) => set({ clientName: name }),
  setContent: (content) =>
    set((state) => ({
      content,
      contentVersion: state.contentVersion + 1,
    })),
  setIsExporting: (isExporting) => set({ isExporting }),
  setThemeColor: (color) => set({ themeColor: color }),
  incrementVersion: () =>
    set((state) => ({ contentVersion: state.contentVersion + 1 })),
  setDate: (date) => set({ date }),
  setValidity: (validity) => set({ validity }),
  setVisualData: (data) => set({ visualData: data }),
  setIsReplicaActive: (active) => set({ isReplicaActive: active }),
  setDocumentType: (type) => set({ documentType: type }),
}));
