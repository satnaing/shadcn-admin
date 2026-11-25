import { useTranslation } from 'react-i18next'
import {
  IconTelegram,
  IconNotion,
  IconFigma,
  IconTrello,
  IconSlack,
  IconZoom,
  IconStripe,
  IconGmail,
  IconMedium,
  IconSkype,
  IconDocker,
  IconGithub,
  IconGitlab,
  IconDiscord,
  IconWhatsapp,
} from '@/assets/brand-icons'

export function useAppsData() {
  const { t } = useTranslation()

  const apps = [
    {
      name: 'Telegram',
      logo: <IconTelegram />,
      connected: false,
      desc: t('apps.desc_telegram'),
    },
    {
      name: 'Notion',
      logo: <IconNotion />,
      connected: true,
      desc: t('apps.desc_notion'),
    },
    {
      name: 'Figma',
      logo: <IconFigma />,
      connected: true,
      desc: t('apps.desc_figma'),
    },
    {
      name: 'Trello',
      logo: <IconTrello />,
      connected: false,
      desc: t('apps.desc_trello'),
    },
    {
      name: 'Slack',
      logo: <IconSlack />,
      connected: false,
      desc: t('apps.desc_slack'),
    },
    {
      name: 'Zoom',
      logo: <IconZoom />,
      connected: true,
      desc: t('apps.desc_zoom'),
    },
    {
      name: 'Stripe',
      logo: <IconStripe />,
      connected: false,
      desc: t('apps.desc_stripe'),
    },
    {
      name: 'Gmail',
      logo: <IconGmail />,
      connected: true,
      desc: t('apps.desc_gmail'),
    },
    {
      name: 'Medium',
      logo: <IconMedium />,
      connected: false,
      desc: t('apps.desc_medium'),
    },
    {
      name: 'Skype',
      logo: <IconSkype />,
      connected: false,
      desc: t('apps.desc_skype'),
    },
    {
      name: 'Docker',
      logo: <IconDocker />,
      connected: false,
      desc: t('apps.desc_docker'),
    },
    {
      name: 'GitHub',
      logo: <IconGithub />,
      connected: false,
      desc: t('apps.desc_github'),
    },
    {
      name: 'GitLab',
      logo: <IconGitlab />,
      connected: false,
      desc: t('apps.desc_gitlab'),
    },
    {
      name: 'Discord',
      logo: <IconDiscord />,
      connected: false,
      desc: t('apps.desc_discord'),
    },
    {
      name: 'WhatsApp',
      logo: <IconWhatsapp />,
      connected: false,
      desc: t('apps.desc_whatsapp'),
    },
  ]

  return apps
}
