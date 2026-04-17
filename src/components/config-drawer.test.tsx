import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, type RenderResult } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { DirectionProvider } from '@/context/direction-provider'
import { LayoutProvider } from '@/context/layout-provider'
import { ThemeProvider } from '@/context/theme-provider'
import { SidebarProvider } from '@/components/ui/sidebar'
import { ConfigDrawer } from './config-drawer'

function getCookieValue(name: string) {
  const match = document.cookie.match(
    new RegExp(
      `(?:^|; )${name.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}=([^;]*)`
    )
  )
  return match ? decodeURIComponent(match[1]) : null
}

async function renderConfigDrawer({
  sidebarDefaultOpen = true,
}: {
  sidebarDefaultOpen?: boolean
} = {}) {
  return await render(
    <DirectionProvider>
      <ThemeProvider>
        <LayoutProvider>
          <SidebarProvider defaultOpen={sidebarDefaultOpen}>
            <ConfigDrawer />
          </SidebarProvider>
        </LayoutProvider>
      </ThemeProvider>
    </DirectionProvider>
  )
}

async function openDrawer(screen: RenderResult) {
  await userEvent.click(
    screen.getByRole('button', { name: /^Open theme settings$/i })
  )
  await vi.waitFor(() =>
    expect(screen.getByText(/^Theme Settings$/i)).toBeInTheDocument()
  )
}

describe('ConfigDrawer (integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    for (const cookie of document.cookie.split(';')) {
      const name = cookie.split('=')[0]?.trim()
      if (!name) continue
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
    }

    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.removeAttribute('dir')
  })

  it('opens the drawer and renders the sections', async () => {
    const screen = await renderConfigDrawer()

    await openDrawer(screen)

    expect(screen.getByText(/^Theme$/i)).toBeInTheDocument()
    expect(screen.getByText(/^Layout$/i)).toBeInTheDocument()
    expect(screen.getByText(/^Direction$/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: /reset all settings to default values/i,
      })
    ).toBeInTheDocument()
  })

  describe('theme preference', () => {
    it('applies light theme to <html> and cookie', async () => {
      const screen = await renderConfigDrawer()
      await openDrawer(screen)
      await userEvent.click(
        screen.getByRole('radio', { name: /select light/i })
      )
      await vi.waitFor(() =>
        expect(document.documentElement.classList.contains('light')).toBe(true)
      )
      expect(getCookieValue('vite-ui-theme')).toBe('light')
    })

    it('applies dark theme to <html> and cookie', async () => {
      const screen = await renderConfigDrawer()
      await openDrawer(screen)
      await userEvent.click(screen.getByRole('radio', { name: /select dark/i }))
      await vi.waitFor(() =>
        expect(document.documentElement.classList.contains('dark')).toBe(true)
      )
      expect(getCookieValue('vite-ui-theme')).toBe('dark')
    })

    it('applies system theme: stores cookie and applies a resolved light or dark class', async () => {
      const screen = await renderConfigDrawer()
      await openDrawer(screen)
      // Initial state is already "system" with no cookie; switch away first so System triggers setTheme.
      await userEvent.click(
        screen.getByRole('radio', { name: /select light/i })
      )
      await vi.waitFor(() =>
        expect(getCookieValue('vite-ui-theme')).toBe('light')
      )
      await userEvent.click(
        screen.getByRole('radio', { name: /select system/i })
      )
      await vi.waitFor(() =>
        expect(getCookieValue('vite-ui-theme')).toBe('system')
      )
      await vi.waitFor(() => {
        const root = document.documentElement
        const hasLight = root.classList.contains('light')
        const hasDark = root.classList.contains('dark')
        expect(hasLight !== hasDark).toBe(true)
      })
    })
  })

  describe('sidebar variant', () => {
    it('selecting floating updates layout_variant cookie', async () => {
      const screen = await renderConfigDrawer()
      await openDrawer(screen)

      await userEvent.click(
        screen.getByRole('radio', { name: /select floating/i })
      )
      await vi.waitFor(() =>
        expect(getCookieValue('layout_variant')).toBe('floating')
      )
    })

    it('selecting sidebar updates layout_variant cookie', async () => {
      const screen = await renderConfigDrawer()
      await openDrawer(screen)

      await userEvent.click(
        screen.getByRole('radio', { name: /^select sidebar$/i })
      )
      await vi.waitFor(() =>
        expect(getCookieValue('layout_variant')).toBe('sidebar')
      )
    })

    it('selecting inset updates layout_variant cookie after another variant', async () => {
      const screen = await renderConfigDrawer()
      await openDrawer(screen)

      await userEvent.click(
        screen.getByRole('radio', { name: /select floating/i })
      )
      await vi.waitFor(() =>
        expect(getCookieValue('layout_variant')).toBe('floating')
      )

      await userEvent.click(
        screen.getByRole('radio', { name: /select inset/i })
      )
      await vi.waitFor(() =>
        expect(getCookieValue('layout_variant')).toBe('inset')
      )
    })
  })

  it('selecting full layout sets collapsible to offcanvas and closes sidebar', async () => {
    const screen = await renderConfigDrawer({ sidebarDefaultOpen: true })
    await openDrawer(screen)

    await userEvent.click(
      screen.getByRole('radio', { name: /select full layout/i })
    )
    await vi.waitFor(() =>
      expect(getCookieValue('layout_collapsible')).toBe('offcanvas')
    )
    await vi.waitFor(() =>
      expect(getCookieValue('sidebar_state')).toBe('false')
    )
  })

  describe('section reset buttons', () => {
    it('resets theme via section control after choosing dark', async () => {
      const screen = await renderConfigDrawer()
      await openDrawer(screen)

      await userEvent.click(screen.getByRole('radio', { name: /select dark/i }))
      await vi.waitFor(() =>
        expect(getCookieValue('vite-ui-theme')).toBe('dark')
      )

      await userEvent.click(
        screen.getByRole('button', {
          name: /reset theme preference to default/i,
        })
      )
      await vi.waitFor(() =>
        expect(getCookieValue('vite-ui-theme')).toBe('system')
      )
    })

    it('resets direction via section control after choosing RTL', async () => {
      const screen = await renderConfigDrawer()
      await openDrawer(screen)

      await userEvent.click(
        screen.getByRole('radio', { name: /select right to left/i })
      )
      await vi.waitFor(() =>
        expect(document.documentElement.getAttribute('dir')).toBe('rtl')
      )

      await userEvent.click(
        screen.getByRole('button', {
          name: /reset text direction to default/i,
        })
      )
      await vi.waitFor(() =>
        expect(document.documentElement.getAttribute('dir')).toBe('ltr')
      )
      expect(getCookieValue('dir')).toBe('ltr')
    })

    it('resets sidebar style via section control after choosing floating', async () => {
      const screen = await renderConfigDrawer()
      await openDrawer(screen)

      await userEvent.click(
        screen.getByRole('radio', { name: /select floating/i })
      )
      await vi.waitFor(() =>
        expect(getCookieValue('layout_variant')).toBe('floating')
      )

      await userEvent.click(
        screen.getByRole('button', {
          name: /reset sidebar style to default/i,
        })
      )
      await vi.waitFor(() =>
        expect(getCookieValue('layout_variant')).toBe('inset')
      )
    })

    it('resets layout via section control after choosing compact', async () => {
      const screen = await renderConfigDrawer({ sidebarDefaultOpen: true })
      await openDrawer(screen)

      await userEvent.click(
        screen.getByRole('radio', { name: /select compact/i })
      )
      await vi.waitFor(() =>
        expect(getCookieValue('sidebar_state')).toBe('false')
      )

      await userEvent.click(
        screen.getByRole('button', {
          name: /reset layout options to default/i,
        })
      )
      await vi.waitFor(() =>
        expect(getCookieValue('sidebar_state')).toBe('true')
      )
      await vi.waitFor(() =>
        expect(getCookieValue('layout_collapsible')).toBe('icon')
      )
    })
  })

  it('changes direction and applies it to <html dir>', async () => {
    const screen = await renderConfigDrawer()

    await openDrawer(screen)

    await userEvent.click(
      screen.getByRole('radio', { name: /select right to left/i })
    )
    await vi.waitFor(() =>
      expect(document.documentElement.getAttribute('dir')).toBe('rtl')
    )
    expect(getCookieValue('dir')).toBe('rtl')
  })

  it('updates layout: selecting non-default closes sidebar and changes layout cookie', async () => {
    const screen = await renderConfigDrawer({ sidebarDefaultOpen: true })

    await openDrawer(screen)

    expect(
      screen.getByRole('radio', { name: /select default/i })
    ).toHaveAttribute('data-state', 'checked')

    await userEvent.click(
      screen.getByRole('radio', { name: /select compact/i })
    )

    await vi.waitFor(() =>
      expect(getCookieValue('sidebar_state')).toBe('false')
    )
    await vi.waitFor(() =>
      expect(getCookieValue('layout_collapsible')).toBe('icon')
    )
  })

  it('reset restores defaults across sidebar/theme/layout/direction', async () => {
    const screen = await renderConfigDrawer({ sidebarDefaultOpen: true })

    await openDrawer(screen)

    await userEvent.click(screen.getByRole('radio', { name: /select dark/i }))
    await userEvent.click(
      screen.getByRole('radio', { name: /select right to left/i })
    )
    await userEvent.click(
      screen.getByRole('radio', { name: /select floating/i })
    )
    await userEvent.click(
      screen.getByRole('radio', { name: /select full layout/i })
    )

    await vi.waitFor(() => expect(getCookieValue('vite-ui-theme')).toBe('dark'))
    await vi.waitFor(() => expect(getCookieValue('dir')).toBe('rtl'))
    await vi.waitFor(() =>
      expect(getCookieValue('layout_variant')).toBe('floating')
    )
    await vi.waitFor(() =>
      expect(getCookieValue('layout_collapsible')).toBe('offcanvas')
    )

    await userEvent.click(
      screen.getByRole('button', {
        name: /reset all settings to default values/i,
      })
    )

    await vi.waitFor(() => expect(getCookieValue('sidebar_state')).toBe('true'))
    await vi.waitFor(() => expect(getCookieValue('dir')).toBe(null))
    await vi.waitFor(() => expect(getCookieValue('vite-ui-theme')).toBe(null))
    await vi.waitFor(() =>
      expect(getCookieValue('layout_variant')).toBe('inset')
    )
    await vi.waitFor(() =>
      expect(getCookieValue('layout_collapsible')).toBe('icon')
    )
    await vi.waitFor(() =>
      expect(document.documentElement.getAttribute('dir')).toBe('ltr')
    )
  })
})
