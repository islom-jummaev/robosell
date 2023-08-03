import { create } from "zustand";
import { HandlerType } from "@core/zustand/types/handler";
import { StoreTypeWithData } from "@core/zustand/types/store";

export const storeCreator = <P, R, ISD>(handler: HandlerType<P, R>, initialState: StoreTypeWithData<R, ISD>) => {

  type StoreCreateType = typeof initialState & { request: (params: P) => void; reset: () => void };

  const useStore = create<StoreCreateType>()((set) => ({
    ...initialState,
    reset: () => {
      set(initialState);
    },
    request: (params) => {
      set((state) => ({
        ...state,
        loading: true
      }));

      handler(params ? params : {} as P)
        .then((response: any) => {
          set({ ...initialState, data: response.data, success: true });
        })
        .catch((error) => {
          if (error.response) {
            set({ ...initialState, error: error.response });
          }
        })
    }
  }));

  return {
    useStore
  } as { useStore: typeof useStore};
};

