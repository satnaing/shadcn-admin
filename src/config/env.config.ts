export const envConfig = {
  environment: (import.meta.env.VITE_ENV as string) || 'local',
  apiUrl: (import.meta.env.VITE_API_URL as string) || 'http://localhost:8000',
  appUrl: (import.meta.env.VITE_URL as string) || 'http://localhost:3000',
  openReplayProjectId:
    (import.meta.env.VITE_OPEN_REPLAY_ID as string) || '71jGSol3gtbBFlTgM5qL',
  extensionUrl:
    (import.meta.env.VITE_EXTENSION_URL as string) ||
    'https://chromewebstore.google.com/detail/commentify-automate-linke/efmnkiklpnaekhleodlncoembopfmjca',
  crispApiKey:
    (import.meta.env.VITE_CRISP_API_KEY as string) ||
    '517b7dc4-a006-4383-afcc-4c3e3416cd05',
  chromeExtensionId:
    (import.meta.env.VITE_CHROME_EXTENSION_ID as string) ||
    'efmnkiklpnaekhleodlncoembopfmjca',
  chromeExtensionIconUrl:
    (import.meta.env.VITE_CHROME_EXTENSION_ICON_URL as string) || 'icon-34.png',
  postHogKey:
    (import.meta.env.VITE_POSTHOG_KEY as string) ||
    'phc_NYYVXRjptZtafTvffop2imyZgIQrUpjdTKM9oicQrJG',
  postHogHost:
    (import.meta.env.VITE_POSTHOG_HOST as string) || 'https://us.i.posthog.com',
}
