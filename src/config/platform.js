export function isMobileUi() {
  if (typeof navigator === 'undefined') {
    return false;
  }

  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const forced = params?.get('ui');
  if (forced === 'mobile') {
    return true;
  }
  if (forced === 'desktop') {
    return false;
  }

  const ua = navigator.userAgent || '';
  if (/Android|iPhone|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    return true;
  }

  if (navigator.platform === 'MacIntel' && (navigator.maxTouchPoints || 0) > 1) {
    return true;
  }
  if (typeof window !== 'undefined' && window.matchMedia) {
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (coarse && window.innerWidth < 900) {
      return true;
    }
  }
  return false;
}
