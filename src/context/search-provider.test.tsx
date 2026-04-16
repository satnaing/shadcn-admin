import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, type RenderResult } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { SearchProvider } from '@/context/search-provider'

const COMMAND_MENU_PLACEHOLDER = 'Type a command or search...'

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  setTheme: vi.fn(),
}))

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    useNavigate: () => mocks.navigate,
  }
})

vi.mock('@/context/theme-provider', () => ({
  useTheme: () => ({ setTheme: mocks.setTheme }),
}))

/**
 * Matches SearchProvider (`metaKey || ctrlKey` + `key === 'k'`).
 * Use real key delivery via `userEvent.keyboard` so the document listener sees a trusted-like sequence (see Vitest browser interactivity).
 */
async function toggleCommandPaletteShortcut() {
  await userEvent.keyboard('{Control>}k{/Control}')
}

async function flushEffects() {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve())
    })
  })
}

async function renderWithSearchProvider() {
  const screen = await render(<SearchProvider>{null}</SearchProvider>)
  await flushEffects()
  return screen
}

async function openCommandPalette(screen: RenderResult) {
  await toggleCommandPaletteShortcut()
  await vi.waitFor(() =>
    expect(
      screen.getByPlaceholder(COMMAND_MENU_PLACEHOLDER)
    ).toBeInTheDocument()
  )
}

describe('SearchProvider and CommandMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the command palette when the palette is open', async () => {
    const screen = await renderWithSearchProvider()
    const { getByPlaceholder, getByText } = screen

    await openCommandPalette(screen)

    expect(getByPlaceholder(COMMAND_MENU_PLACEHOLDER)).toBeInTheDocument()
    expect(getByText('Theme')).toBeInTheDocument()
    expect(getByText('Light')).toBeInTheDocument()
    expect(getByText('Dark')).toBeInTheDocument()
    expect(getByText('System')).toBeInTheDocument()
    expect(getByText('Dashboard')).toBeInTheDocument()
  })

  it('does not show the dialog content when search is closed', async () => {
    const { getByPlaceholder } = await renderWithSearchProvider()

    expect(getByPlaceholder(COMMAND_MENU_PLACEHOLDER)).not.toBeInTheDocument()
  })

  it('opens the command menu when the Cmd/Ctrl + K shortcut is pressed', async () => {
    const screen = await renderWithSearchProvider()

    expect(
      screen.getByPlaceholder(COMMAND_MENU_PLACEHOLDER)
    ).not.toBeInTheDocument()

    await openCommandPalette(screen)

    expect(
      screen.getByPlaceholder(COMMAND_MENU_PLACEHOLDER)
    ).toBeInTheDocument()
  })

  it('navigates to a top-level route and closes the palette when a nav item is selected', async () => {
    const screen = await renderWithSearchProvider()

    await openCommandPalette(screen)

    await userEvent.click(screen.getByText('Tasks'))

    expect(mocks.navigate).toHaveBeenCalledWith({ to: '/tasks' })
    expect(
      screen.getByPlaceholder(COMMAND_MENU_PLACEHOLDER)
    ).not.toBeInTheDocument()
  })

  it('navigates for nested sidebar items (group with sub-items)', async () => {
    const screen = await renderWithSearchProvider()
    const { getByPlaceholder, getByRole } = screen

    await openCommandPalette(screen)

    await userEvent.click(getByRole('option', { name: 'Settings Account' }))

    expect(mocks.navigate).toHaveBeenCalledWith({ to: '/settings/account' })
    expect(getByPlaceholder(COMMAND_MENU_PLACEHOLDER)).not.toBeInTheDocument()
  })

  it('applies theme and closes the palette when a theme command is chosen', async () => {
    const screen = await renderWithSearchProvider()

    await openCommandPalette(screen)

    await userEvent.click(screen.getByText('Dark'))

    expect(mocks.setTheme).toHaveBeenCalledWith('dark')
    expect(
      screen.getByPlaceholder(COMMAND_MENU_PLACEHOLDER)
    ).not.toBeInTheDocument()
  })

  it('shows empty state when the filter matches nothing', async () => {
    const screen = await renderWithSearchProvider()

    await openCommandPalette(screen)

    await userEvent.fill(
      screen.getByPlaceholder(COMMAND_MENU_PLACEHOLDER),
      'zzzz-no-match-xxxx'
    )

    expect(screen.getByText('No results found.')).toBeInTheDocument()
  })
})
