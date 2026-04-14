import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import { TasksMultiDeleteDialog } from './tasks-multi-delete-dialog'

vi.mock('@/lib/utils', async (orig) => ({
  ...(await orig()),
  sleep: vi.fn(() => Promise.resolve()),
}))

function createTableMock(rowCount = 2) {
  const rows = Array.from({ length: rowCount }, () => ({}))
  const resetRowSelection = vi.fn()
  const table = {
    getFilteredSelectedRowModel: () => ({ rows }),
    resetRowSelection,
  } as unknown as Table<Record<string, unknown>>
  return { table, resetRowSelection }
}

describe('TasksMultiDeleteDialog', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the dialog with the correct title, description, input and buttons', async () => {
    const { table } = createTableMock()

    const { getByRole, getByText } = await render(
      <TasksMultiDeleteDialog open onOpenChange={vi.fn()} table={table} />
    )

    const title = getByRole('heading', {
      level: 2,
      name: /Delete 2 tasks/i,
    })
    const desc = getByText(
      'Are you sure you want to delete the selected tasks?'
    )
    const confirmDeleteInput = getByRole('textbox', {
      name: /Confirm by typing "DELETE"/i,
    })
    const cancelButton = getByRole('button', { name: /Cancel/i })
    const deleteButton = getByRole('button', { name: /Delete/i })

    expect(title).toBeInTheDocument()
    expect(desc).toBeInTheDocument()
    expect(confirmDeleteInput).toBeInTheDocument()
    expect(cancelButton).toBeInTheDocument()
    expect(deleteButton).toBeInTheDocument()
    expect(deleteButton).toBeDisabled()
  })

  it('keeps the delete button disabled until the confirm delete input is filled correctly', async () => {
    const { table } = createTableMock()
    const { getByRole } = await render(
      <TasksMultiDeleteDialog open onOpenChange={vi.fn()} table={table} />
    )

    const confirmDeleteInput = getByRole('textbox', {
      name: /Confirm by typing "DELETE"/i,
    })
    const deleteButton = getByRole('button', { name: /Delete/i })

    expect(deleteButton).toBeDisabled()

    await userEvent.fill(confirmDeleteInput, 'wrong-input')
    expect(deleteButton).toBeDisabled()

    await userEvent.fill(confirmDeleteInput, 'DELETE')
    expect(deleteButton).toBeEnabled()
  })

  it('closes the dialog when the cancel button is clicked', async () => {
    const onOpenChange = vi.fn()
    const { table } = createTableMock()
    const { getByRole } = await render(
      <TasksMultiDeleteDialog open onOpenChange={onOpenChange} table={table} />
    )

    const cancelButton = getByRole('button', { name: /Cancel/i })
    await userEvent.click(cancelButton)

    expect(onOpenChange).toHaveBeenCalledOnce()
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('resets the confirm delete input when the dialog is closed and reopened', async () => {
    const { table } = createTableMock()

    function Harness() {
      const [open, setOpen] = useState(true)
      return (
        <>
          <button type='button' onClick={() => setOpen(true)}>
            Reopen
          </button>
          {open ? (
            <TasksMultiDeleteDialog
              open={open}
              onOpenChange={setOpen}
              table={table}
            />
          ) : null}
        </>
      )
    }

    const { getByRole } = await render(<Harness />)

    const confirmDeleteInput = getByRole('textbox', {
      name: /Confirm by typing "DELETE"/i,
    })
    await userEvent.fill(confirmDeleteInput, 'DELETE')
    expect(confirmDeleteInput).toHaveValue('DELETE')

    const cancelButton = getByRole('button', { name: /Cancel/i })
    await userEvent.click(cancelButton)

    const reopenButton = getByRole('button', { name: /Reopen/i })
    await userEvent.click(reopenButton)
    expect(confirmDeleteInput).toHaveValue('')
  })

  it('shows the submitted data when deleted successfully', async () => {
    const { table, resetRowSelection } = createTableMock()
    const onOpenChange = vi.fn()
    const { getByRole } = await render(
      <TasksMultiDeleteDialog open onOpenChange={onOpenChange} table={table} />
    )

    const confirmDeleteInput = getByRole('textbox', {
      name: /Confirm by typing "DELETE"/i,
    })
    const deleteButton = getByRole('button', { name: /Delete/i })

    expect(deleteButton).toBeDisabled()

    await userEvent.fill(confirmDeleteInput, 'DELETE')
    expect(deleteButton).toBeEnabled()

    await userEvent.click(deleteButton)

    expect(onOpenChange).toHaveBeenCalledOnce()
    expect(onOpenChange).toHaveBeenCalledWith(false)

    await vi.waitFor(() => expect(resetRowSelection).toHaveBeenCalledOnce())
  })

  it('deletes successfully when press Enter key on the confirm delete input', async () => {
    const { table, resetRowSelection } = createTableMock()
    const onOpenChange = vi.fn()
    const { getByRole } = await render(
      <TasksMultiDeleteDialog open onOpenChange={onOpenChange} table={table} />
    )

    const confirmDeleteInput = getByRole('textbox', {
      name: /Confirm by typing "DELETE"/i,
    })
    const deleteButton = getByRole('button', { name: /Delete/i })

    expect(deleteButton).toBeDisabled()

    await userEvent.fill(confirmDeleteInput, 'DELETE')
    expect(deleteButton).toBeEnabled()

    await userEvent.keyboard('{Enter}')
    expect(onOpenChange).toHaveBeenCalledOnce()
    expect(onOpenChange).toHaveBeenCalledWith(false)

    await vi.waitFor(() => expect(resetRowSelection).toHaveBeenCalledOnce())
  })
})
