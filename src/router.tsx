import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import Loader from '@/components/loader'

const Dashboard = lazy(() => import('@/pages/dashboard'))
const SignIn = lazy(() => import('@/pages/auth/sign-in'))
const SignIn2 = lazy(() => import('@/pages/auth/sign-in-2'))

export default function Router() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-in-2' element={<SignIn2 />} />
      </Routes>
    </Suspense>
  )
}
