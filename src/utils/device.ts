const ua = (window.navigator.userAgent || '').toLowerCase()

export const isMobile = ua.includes('mobile')
export const isAndroid = ua.includes('android')
