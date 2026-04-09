export const trackTacticalEvent = async (event: string, data: any = {}) => {
  try {
    // Local storage check for user PII if previously captured
    const userJson = localStorage.getItem('kz_user_dossier');
    const user = userJson ? JSON.parse(userJson) : null;

    console.log(`[Tactical Track] ${event}`, data);

    const res = await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        data,
        user: {
          email: user?.email,
          phone: user?.phone
        }
      })
    });

    return await res.json();
  } catch (err) {
    // Silent fail in production to avoid breaking UX
    console.error('Analytics Silenced:', err);
  }
};

// Common Tactical Events
export const ANALYTICS_EVENTS = {
  COMPARE_INITIATED: 'Compare_Initiated',
  SOUND_SIGNATURE_SELECTED: 'Sound_Signature_Selected',
  HIGH_VALUE_SCROLL: 'High_Value_Scroll',
  ACOUSTIC_DNA_FORMED: 'Acoustic_DNA_Formed',
  PHANTOM_SCAN_COMPLETE: 'Phantom_Scan_Complete',
  CATALOG_INFILTRATED: 'Catalog_Infiltrated'
};
