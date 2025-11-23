/**
 * Device Fingerprinting Utility
 * Generates a unique, persistent device fingerprint for MAC randomization immunity
 * 
 * Uses multiple browser attributes to create a stable identifier:
 * - User-Agent
 * - Screen resolution
 * - Timezone
 * - Language
 * - Canvas fingerprint
 * - WebGL fingerprint
 * - LocalStorage UUID (persistent)
 */

const FINGERPRINT_STORAGE_KEY = 'ggwifi_device_fingerprint';
const UUID_STORAGE_KEY = 'ggwifi_device_uuid';

/**
 * Generate a unique UUID and store it in localStorage
 */
const getOrCreateUUID = () => {
  let uuid = localStorage.getItem(UUID_STORAGE_KEY);
  
  if (!uuid) {
    // Generate a simple UUID v4-like string
    uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    localStorage.setItem(UUID_STORAGE_KEY, uuid);
  }
  
  return uuid;
};

/**
 * Generate canvas fingerprint
 */
const getCanvasFingerprint = () => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 200;
    canvas.height = 50;
    
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('GG-WiFi Device Fingerprint', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('GG-WiFi Device Fingerprint', 4, 17);
    
    return canvas.toDataURL();
  } catch (e) {
    return 'canvas-not-supported';
  }
};

/**
 * Generate WebGL fingerprint
 */
const getWebGLFingerprint = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return 'webgl-not-supported';
    }
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      return {
        vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
        renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
        version: gl.getParameter(gl.VERSION),
        shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
      };
    }
    
    return {
      version: gl.getParameter(gl.VERSION),
      shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
    };
  } catch (e) {
    return 'webgl-error';
  }
};

/**
 * Generate device fingerprint data
 */
export const generateDeviceFingerprint = async () => {
  const fingerprintData = {
    // Persistent UUID
    uuid: getOrCreateUUID(),
    
    // Browser attributes
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    languages: navigator.languages?.join(',') || navigator.language,
    cookieEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack || 'unknown',
    
    // Screen attributes
    screenWidth: screen.width,
    screenHeight: screen.height,
    screenColorDepth: screen.colorDepth,
    screenPixelDepth: screen.pixelDepth,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    
    // Timezone
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffset: new Date().getTimezoneOffset(),
    
    // Hardware
    hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
    deviceMemory: navigator.deviceMemory || 'unknown',
    maxTouchPoints: navigator.maxTouchPoints || 0,
    
    // Canvas fingerprint
    canvas: getCanvasFingerprint(),
    
    // WebGL fingerprint
    webgl: getWebGLFingerprint(),
    
    // Timestamp
    timestamp: Date.now(),
  };
  
  // Generate hash using Web Crypto API
  const fingerprintString = JSON.stringify(fingerprintData);
  const encoder = new TextEncoder();
  const data = encoder.encode(fingerprintString);
  
  let hash;
  try {
    // Use SubtleCrypto for hashing
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    // Fallback: simple hash
    hash = btoa(fingerprintString).replace(/[^a-zA-Z0-9]/g, '').substring(0, 64);
  }
  
  // Store fingerprint hash in localStorage
  localStorage.setItem(FINGERPRINT_STORAGE_KEY, hash);
  
  return {
    hash,
    data: fingerprintData,
  };
};

/**
 * Get stored fingerprint hash
 */
export const getStoredFingerprintHash = () => {
  return localStorage.getItem(FINGERPRINT_STORAGE_KEY);
};

/**
 * Verify fingerprint matches stored value
 */
export const verifyFingerprint = async () => {
  const stored = getStoredFingerprintHash();
  if (!stored) {
    return { valid: false, reason: 'No stored fingerprint' };
  }
  
  const current = await generateDeviceFingerprint();
  
  return {
    valid: current.hash === stored,
    stored,
    current: current.hash,
  };
};

/**
 * Clear stored fingerprint (for testing/debugging)
 */
export const clearFingerprint = () => {
  localStorage.removeItem(FINGERPRINT_STORAGE_KEY);
  localStorage.removeItem(UUID_STORAGE_KEY);
};
