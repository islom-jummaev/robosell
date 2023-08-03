import { toast } from "react-toastify";
import React, { ReactNode } from "react";


export const notificationSuccess = (title: string, text?: string, duration?: number) => {
  toast.success(title, {
    autoClose: duration || 3000,
    theme: "colored",
    hideProgressBar: true,
  });
};

export const notificationWarning = (title: string, text?: string, duration?: number) => {
  toast.warning(title, {
    autoClose: duration || 3000,
    theme: "colored",
    hideProgressBar: true,
  });
};

export const notificationError = (title: string, text?: string, duration?: number) => {
  toast.error(title, {
    autoClose: duration || 3000,
    theme: "colored",
    hideProgressBar: true,
  });
};

export const pushNotification = (component: ReactNode) => {
  toast.info(component, {
    autoClose: 2000,
    theme: "colored",
    hideProgressBar: true,
    position: "bottom-right",
    className: "push-notification-toast",
    icon: false
  });
};

