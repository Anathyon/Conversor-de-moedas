import { render, screen } from '@testing-library/react';
import { PWANotification } from '../components/notifications/PWANotification';
import { useNotificationStore } from '../store/notificationStore';

// Mock do store
jest.mock('../store/notificationStore');

describe('PWANotification', () => {
  const mockHideNotification = jest.fn();
  const mockInstallPWA = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when showPWANotification is false', () => {
    (useNotificationStore as unknown as jest.Mock).mockReturnValue({
      showPWANotification: false,
      hideNotification: mockHideNotification,
      installPWA: mockInstallPWA,
    });

    const { container } = render(<PWANotification />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders notification when showPWANotification is true', () => {
    (useNotificationStore as unknown as jest.Mock).mockReturnValue({
      showPWANotification: true,
      hideNotification: mockHideNotification,
      installPWA: mockInstallPWA,
    });

    render(<PWANotification />);
    expect(screen.getByText('Instalar Conversor de Moedas')).toBeInTheDocument();
    expect(screen.getByText('Instale nosso conversor para usar offline e ter acesso rápido!')).toBeInTheDocument();
  });

  it('calls installPWA when install button is clicked', () => {
    (useNotificationStore as unknown as jest.Mock).mockReturnValue({
      showPWANotification: true,
      hideNotification: mockHideNotification,
      installPWA: mockInstallPWA,
    });

    render(<PWANotification />);
    
    const installButton = screen.getByText('Instalar');
    installButton.click();
    expect(mockInstallPWA).toHaveBeenCalled();
  });

  it('calls hideNotification when close button is clicked', () => {
    (useNotificationStore as unknown as jest.Mock).mockReturnValue({
      showPWANotification: true,
      hideNotification: mockHideNotification,
      installPWA: mockInstallPWA,
    });

    render(<PWANotification />);
    
    const closeButton = screen.getByRole('button', { name: '' }); // X button
    closeButton.click();
    expect(mockHideNotification).toHaveBeenCalled();
  });
});