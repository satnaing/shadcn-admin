import i18n from '@/i18n'

// Tests assert against the original English copy, so force en-US here.
// The app itself defaults to zh-CN (see src/i18n/index.ts).
void i18n.changeLanguage('en-US')
