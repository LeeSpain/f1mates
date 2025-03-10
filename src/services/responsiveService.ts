
import { useEffect, useState } from 'react';

// Device type definition
type DeviceType = 'mobile' | 'tablet' | 'desktop';

// Breakpoints in pixels
const breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024
};

/**
 * Hook to determine the current device type based on window width
 * @returns Current device type
 */
export const useDeviceType = (): DeviceType => {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  
  useEffect(() => {
    // Function to update device type
    const updateDeviceType = () => {
      const width = window.innerWidth;
      
      if (width >= breakpoints.desktop) {
        setDeviceType('desktop');
      } else if (width >= breakpoints.tablet) {
        setDeviceType('tablet');
      } else {
        setDeviceType('mobile');
      }
    };
    
    // Set initial device type
    updateDeviceType();
    
    // Add event listener for window resize
    window.addEventListener('resize', updateDeviceType);
    
    // Clean up event listener
    return () => window.removeEventListener('resize', updateDeviceType);
  }, []);
  
  return deviceType;
};

/**
 * Function to get device-specific class names
 * @param baseClass Base CSS class
 * @param mobileClass Optional mobile-specific class
 * @param tabletClass Optional tablet-specific class
 * @param desktopClass Optional desktop-specific class
 * @returns Combined class names
 */
export const getResponsiveClass = (
  baseClass: string,
  deviceType: DeviceType,
  mobileClass: string = '',
  tabletClass: string = '',
  desktopClass: string = ''
): string => {
  let responsiveClass = baseClass;
  
  switch (deviceType) {
    case 'mobile':
      if (mobileClass) responsiveClass += ` ${mobileClass}`;
      break;
    case 'tablet':
      if (tabletClass) responsiveClass += ` ${tabletClass}`;
      break;
    case 'desktop':
      if (desktopClass) responsiveClass += ` ${desktopClass}`;
      break;
    default:
      break;
  }
  
  return responsiveClass;
};

/**
 * Test responsive behavior for a specific element
 * Logs to console if there are any issues on the target element
 * @param elementId The ID of the element to test
 */
export const testResponsiveness = (elementId: string): void => {
  const element = document.getElementById(elementId);
  
  if (!element) {
    console.error(`Responsive test: Element with ID "${elementId}" not found`);
    return;
  }
  
  // Save original window dimensions
  const originalWidth = window.innerWidth;
  const originalHeight = window.innerHeight;
  
  // Test device widths
  const testWidths = [375, 768, 1024, 1440];
  
  console.group(`Responsive test for element: ${elementId}`);
  
  // Log element visibility at different widths
  testWidths.forEach(width => {
    // Simulate window resize
    window.innerWidth = width;
    window.dispatchEvent(new Event('resize'));
    
    // Get computed style
    const style = window.getComputedStyle(element);
    
    console.log(
      `Width: ${width}px | ` +
      `Visible: ${style.display !== 'none'} | ` +
      `Width: ${style.width} | ` +
      `Height: ${style.height}`
    );
  });
  
  console.groupEnd();
  
  // Reset window dimensions
  window.innerWidth = originalWidth;
  window.innerHeight = originalHeight;
  window.dispatchEvent(new Event('resize'));
};
