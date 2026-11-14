import { beforeEach, describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { PanelGuard } from './panel-guard'
import { PageGuard } from './page-guard'
import { useAuthStore } from '@/features/auth/data/auth.store'
import { usePermissionStore } from '@/features/auth/data/auth-permission.store'

describe('PanelGuard & PageGuard E2E Smoke Tests', () => {
  beforeEach(() => {
    usePermissionStore.setState({ loading: false, permissions: [] })
  })

  it('allows Admin full access to Admin, Seller, Courier, and Supervisor panels', async () => {
    useAuthStore.getState().setRole('admin')

    const { getByText: getAdmin } = await render(
      <PanelGuard panel='admin'>
        <div>Admin Content Allowed</div>
      </PanelGuard>
    )
    await expect.element(getAdmin('Admin Content Allowed')).toBeInTheDocument()

    const { getByText: getSeller } = await render(
      <PanelGuard panel='seller'>
        <div>Seller Content Allowed for Admin</div>
      </PanelGuard>
    )
    await expect.element(getSeller('Seller Content Allowed for Admin')).toBeInTheDocument()

    const { getByText: getCourier } = await render(
      <PanelGuard panel='courier'>
        <div>Courier Content Allowed for Admin</div>
      </PanelGuard>
    )
    await expect.element(getCourier('Courier Content Allowed for Admin')).toBeInTheDocument()

    const { getByText: getSupervisor } = await render(
      <PanelGuard panel='supervisor'>
        <div>Supervisor Content Allowed for Admin</div>
      </PanelGuard>
    )
    await expect.element(getSupervisor('Supervisor Content Allowed for Admin')).toBeInTheDocument()
  })

  it('allows Seller to access seller panel and blocks cross-panel access with 403', async () => {
    useAuthStore.getState().setRole('seller')

    const { getByText: getSeller } = await render(
      <PanelGuard panel='seller'>
        <div>Seller Dedicated Hub</div>
      </PanelGuard>
    )
    await expect.element(getSeller('Seller Dedicated Hub')).toBeInTheDocument()

    const { getByText: getBlocked } = await render(
      <PanelGuard panel='admin' fallback={<div>Custom 403 Blocked</div>}>
        <div>Secret Admin Content</div>
      </PanelGuard>
    )
    await expect.element(getBlocked('Custom 403 Blocked')).toBeInTheDocument()
  })

  it('allows Courier to access courier panel and blocks seller panel', async () => {
    useAuthStore.getState().setRole('courier')

    const { getByText: getCourier } = await render(
      <PanelGuard panel='courier'>
        <div>Courier Active Runs</div>
      </PanelGuard>
    )
    await expect.element(getCourier('Courier Active Runs')).toBeInTheDocument()

    const { getByText: getBlocked } = await render(
      <PanelGuard panel='seller' fallback={<div>Access Denied to Courier</div>}>
        <div>Seller Internal Data</div>
      </PanelGuard>
    )
    await expect.element(getBlocked('Access Denied to Courier')).toBeInTheDocument()
  })

  it('allows Supervisor to access supervisor panel', async () => {
    useAuthStore.getState().setRole('supervisor')

    const { getByText: getSupervisor } = await render(
      <PanelGuard panel='supervisor'>
        <div>Supervisor Commission Reports</div>
      </PanelGuard>
    )
    await expect.element(getSupervisor('Supervisor Commission Reports')).toBeInTheDocument()
  })

  it('allows PageGuard navigation for admin without 403 error', async () => {
    useAuthStore.getState().setRole('admin')

    const { getByText } = await render(
      <PageGuard permission='customers.dashboard'>
        <div>Customer Analytics Dashboard</div>
      </PageGuard>
    )
    await expect.element(getByText('Customer Analytics Dashboard')).toBeInTheDocument()
  })

  it('allows PageGuard navigation for staff and seller_staff in dev without 403 error', async () => {
    useAuthStore.getState().setRole('staff')
    const { getByText: getStaff } = await render(
      <PageGuard permission='customers.index'>
        <div>Staff Customer Page</div>
      </PageGuard>
    )
    await expect.element(getStaff('Staff Customer Page')).toBeInTheDocument()

    useAuthStore.getState().setRole('seller_staff')
    const { getByText: getSellerStaff } = await render(
      <PageGuard permission='seller.orders'>
        <div>Seller Staff Order Page</div>
      </PageGuard>
    )
    await expect.element(getSellerStaff('Seller Staff Order Page')).toBeInTheDocument()
  })
})
