import { afterEach, describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarTrigger,
} from './sidebar'

afterEach(async () => {
  document.documentElement.dir = 'ltr'
  await page.viewport(1440, 900)
})

describe.each(['ltr', 'rtl'] as const)('SidebarTrigger (%s)', (direction) => {
  it('exposes desktop state after keyboard activation', async () => {
    await page.viewport(1440, 900)
    document.documentElement.dir = direction
    const screen = await render(
      <SidebarProvider defaultOpen>
        <Sidebar>
          <SidebarContent>
            <a href='#navigation'>Navigation</a>
          </SidebarContent>
        </Sidebar>
        <SidebarTrigger />
      </SidebarProvider>
    )
    const trigger = screen.getByRole('button', {
      name: 'Toggle Sidebar',
      includeHidden: true,
    })
    await expect.element(trigger).toHaveAttribute('aria-expanded', 'true')
    // Focus is explicit here; end-to-end checks separately verify Tab reachability.
    trigger.element().focus()
    await userEvent.keyboard('{Enter}')
    await expect.element(trigger).toHaveAttribute('aria-expanded', 'false')
    await userEvent.keyboard(' ')
    await expect.element(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('exposes mobile state independently from the desktop default', async () => {
    await page.viewport(390, 844)
    document.documentElement.dir = direction
    const screen = await render(
      <SidebarProvider defaultOpen>
        <Sidebar>
          <SidebarContent>
            <a href='#navigation'>Navigation</a>
          </SidebarContent>
        </Sidebar>
        <SidebarTrigger />
      </SidebarProvider>
    )
    const trigger = screen.getByRole('button', {
      name: 'Toggle Sidebar',
      includeHidden: true,
    })
    await expect.element(trigger).toHaveAttribute('aria-expanded', 'false')
    trigger.element().focus()
    await userEvent.keyboard('{Enter}')
    await expect.element(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect.element(page.getByRole('dialog')).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await expect.element(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect.element(trigger).toHaveFocus()
  })
})
