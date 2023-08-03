import { create } from "zustand";

export const $documentationStep = {
  useStore: create<{ step: number, update: (p: number) => void; }>()((set) => ({
    step: 1,
    update: (step) => {
      set({ step });
    }
  }))
};