import { create } from "zustand";

interface UiState {
  isTrainingModalOpen: boolean;
  setTrainingModalOpen: (isOpen: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isTrainingModalOpen: false,
  setTrainingModalOpen: (isOpen) => set({ isTrainingModalOpen: isOpen }),
}));
