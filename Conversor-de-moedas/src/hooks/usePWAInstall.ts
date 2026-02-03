import { useEffect, useState } from 'react';
import { useNotificationStore } from '../store/notificationStore';

export const usePWAInstall = () => {
  const { setDeferredPrompt, showNotification, installPWA } = useNotificationStore();
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent automatic prompt
      e.preventDefault();
      // Save the event
      setDeferredPrompt(e);
      setIsInstallable(true);
      // Show notification if desired
      showNotification();
    };

    const handleAppInstalled = () => {
      console.log('PWA installed successfully');
      setDeferredPrompt(null);
      setIsInstallable(false);
      setIsInstalled(true);
    };

    // Check if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [setDeferredPrompt, showNotification]);

  return { isInstallable, isInstalled, installPWA };
};