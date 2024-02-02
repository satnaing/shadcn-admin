import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import Loader from '@/components/loader'

const Dashboard = lazy(() => import('@/pages/dashboard'))
const SignIn = lazy(() => import('@/pages/auth/sign-in'))
const SignIn2 = lazy(() => import('@/pages/auth/sign-in-2'))
const SignUp = lazy(() => import('@/pages/auth/sign-up'))
const ForgotPassword = lazy(() => import('@/pages/auth/forgot-password'))

// Errors
const GeneralError = lazy(() => import('@/pages/errors/general-error'))
const NotFoundError = lazy(() => import('@/pages/errors/not-found-error'))
const MaintenanceError = lazy(() => import('@/pages/errors/maintenance-error'))

export default function Router() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Auth routes */}
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-in-2' element={<SignIn2 />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />

        <Route path='/' element={<Dashboard />} />

        {/* Error routes */}
        <Route path='/500' element={<GeneralError />} />
        <Route path='/404' element={<NotFoundError />} />
        <Route path='/503' element={<MaintenanceError />} />
      </Routes>
    </Suspense>
  )
}
