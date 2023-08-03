import { useState } from "react";

export type ModalControlType<T = unknown> = {
  modalProps: { open: boolean } & T;
  open: (props?: T) => void;
  close: () => void
};

export const useModalControl = <T>(initialModalProps?: T): ModalControlType<T> => {
  const [modalProps, setModalProps] = useState<ModalControlType["modalProps"] & T>({
    open: false,
    ...initialModalProps,
  } as ModalControlType["modalProps"] & T);

  const open = (props?: T) => {
    setModalProps({ open: true, ...props } as ModalControlType["modalProps"] & T);
  };

  const close = () => {
    setModalProps({ open: false, ...initialModalProps } as ModalControlType["modalProps"] & T);
  };

  return {
    modalProps,
    open,
    close
  };
};
