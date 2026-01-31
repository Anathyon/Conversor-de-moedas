import { create } from 'zustand';

interface NotificationState {
  showPWANotification: boolean;
  deferredPrompt: any;
  showNotification: () => void;
  hideNotification: () => void;
  setDeferredPrompt: (prompt: any) => void;
  installPWA: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  showPWANotification: false,
  deferredPrompt: null,

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
}));