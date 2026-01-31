import { useEffect } from 'react';
import { useNotificationStore } from '../store/notificationStore';

export const usePWAInstall = () => {
  const { setDeferredPrompt, showNotification } = useNotificationStore();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Previne o prompt automático do browser
      e.preventDefault();
      // Salva o evento para usar depois
      setDeferredPrompt(e);
      // Mostra nossa notificação customizada
      showNotification();
    };

    const handleAppInstalled = () => {
      console.log('PWA foi instalada');
      setDeferredPrompt(null);
    };

    // Adiciona os event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [setDeferredPrompt, showNotification]);
};