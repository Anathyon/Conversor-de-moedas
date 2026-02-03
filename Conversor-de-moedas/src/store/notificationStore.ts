import { create } from 'zustand';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface NotificationState {
  showPWANotification: boolean;
  deferredPrompt: any;
  toasts: Toast[];

  showNotification: () => void;
  hideNotification: () => void;
  setDeferredPrompt: (prompt: any) => void;
  installPWA: () => Promise<void>;

  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  showPWANotification: false,
  deferredPrompt: null,
  toasts: [],

  showNotification: () => set({ showPWANotification: true }),

  hideNotification: () => set({ showPWANotification: false }),

  setDeferredPrompt: (prompt) => set({ deferredPrompt: prompt }),

  installPWA: async () => {
    const { deferredPrompt } = get();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      set({ deferredPrompt: null, showPWANotification: false });
    }
  },

  addToast: (message, type = 'info') => {
    const id = Date.now().toString();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }]
    }));

    // Auto remove after 3 seconds
    setTimeout(() => {
      get().removeToast(id);
    }, 3000);
  },

  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),
}));