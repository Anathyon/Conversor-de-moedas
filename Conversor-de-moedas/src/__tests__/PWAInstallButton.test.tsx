
import React from 'react';
import { render, screen } from '@testing-library/react';
import { PWAInstallButton } from '../components/PWAInstallButton';
import { usePWAInstall } from '../hooks/usePWAInstall';

// Mock the hook
jest.mock('../hooks/usePWAInstall');

describe('PWAInstallButton', () => {
  const mockInstallPWA = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when not installable', () => {
    (usePWAInstall as jest.Mock).mockReturnValue({
      isInstallable: false,
      isInstalled: false,
      installPWA: mockInstallPWA,
    });

    const { container } = render(<PWAInstallButton />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders "App Instalado" when installed', () => {
    (usePWAInstall as jest.Mock).mockReturnValue({
      isInstallable: false,
      isInstalled: true,
      installPWA: mockInstallPWA,
    });

    render(<PWAInstallButton />);
    expect(screen.getByText('App Instalado')).toBeInTheDocument();
  });

  it('renders install button when installable', () => {
    (usePWAInstall as jest.Mock).mockReturnValue({
      isInstallable: true,
      isInstalled: false,
      installPWA: mockInstallPWA,
    });

    render(<PWAInstallButton />);
    
    const button = screen.getByRole('button', { name: /instalar aplicativo/i });
    expect(button).toBeInTheDocument();
    
    // Simulate click
    button.click();
    expect(mockInstallPWA).toHaveBeenCalled();
  });
});
