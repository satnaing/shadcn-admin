import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { ThemeProvider } from '@/context/theme-provider'
import { getCookie } from '@/lib/cookies'
import { clearCookies } from '@/test-utils/cookies'
import { ThemeSwitch } from './theme-switch'

const THEME_STORAGE_KEY = 'theme-switch-test-theme'

async function renderThemeSwitch(defaultTheme: 'light' | 'dark' | 'system') {
    return await render(
        <ThemeProvider defaultTheme={defaultTheme} storageKey={THEME_STORAGE_KEY}>
            <ThemeSwitch />
        </ThemeProvider>
    )
}

function ensureThemeColorMeta(initialContent = 'initial') {
    let metaThemeColor = document.querySelector(
        "meta[name='theme-color']"
    ) as HTMLMetaElement | null

    if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta')
        metaThemeColor.setAttribute('name', 'theme-color')
        document.head.appendChild(metaThemeColor)
    }

    metaThemeColor.setAttribute('content', initialContent)
    return metaThemeColor
}

function mockSystemTheme(resolvedTheme: 'light' | 'dark') {
    const isDark = resolvedTheme === 'dark'

    return vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => {
        const matches = query === '(prefers-color-scheme: dark)' ? isDark : false

        return {
            matches,
            media: query,
            onchange: null,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            addListener: vi.fn(),
            removeListener: vi.fn(),
            dispatchEvent: vi.fn(),
        } as unknown as MediaQueryList
    })
}

describe('ThemeSwitch', () => {
    beforeEach(() => {
        clearCookies(THEME_STORAGE_KEY)
        document.querySelector("meta[name='theme-color']")?.remove()
        document.documentElement.classList.remove('light', 'dark')
    })

    it('does not re-trigger theme-color update when switching from system to light while system theme is light', async () => {
        mockSystemTheme('light')
        const metaThemeColor = ensureThemeColorMeta()
        const setAttributeSpy = vi.spyOn(metaThemeColor, 'setAttribute')

        const screen = await renderThemeSwitch('system')

        await vi.waitFor(() =>
            expect(metaThemeColor.getAttribute('content')).toBe('#fff')
        )
        const contentCallsAfterMount = setAttributeSpy.mock.calls.filter(
            ([key]) => key === 'content'
        ).length

        await userEvent.click(screen.getByRole('button', { name: /toggle theme/i }))
        await userEvent.click(screen.getByRole('menuitem', { name: /^light$/i }))

        await vi.waitFor(() => expect(getCookie(THEME_STORAGE_KEY)).toBe('light'))

        const contentCallsAfterSwitch = setAttributeSpy.mock.calls.filter(
            ([key]) => key === 'content'
        ).length

        expect(contentCallsAfterSwitch).toBe(contentCallsAfterMount)
    })

    it('does not re-trigger theme-color update when switching from light to system while system theme is light', async () => {
        mockSystemTheme('light')
        const metaThemeColor = ensureThemeColorMeta()
        const setAttributeSpy = vi.spyOn(metaThemeColor, 'setAttribute')

        const screen = await renderThemeSwitch('light')

        await vi.waitFor(() =>
            expect(metaThemeColor.getAttribute('content')).toBe('#fff')
        )
        const contentCallsAfterMount = setAttributeSpy.mock.calls.filter(
            ([key]) => key === 'content'
        ).length

        await userEvent.click(screen.getByRole('button', { name: /toggle theme/i }))
        await userEvent.click(screen.getByRole('menuitem', { name: /^system$/i }))

        await vi.waitFor(() => expect(getCookie(THEME_STORAGE_KEY)).toBe('system'))

        const contentCallsAfterSwitch = setAttributeSpy.mock.calls.filter(
            ([key]) => key === 'content'
        ).length

        expect(contentCallsAfterSwitch).toBe(contentCallsAfterMount)
    })
})