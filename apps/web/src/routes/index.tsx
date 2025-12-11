import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import RootLayout from '../components/layouts/RootLayout'

// Lazy load pages for better performance
const HomePage = lazy(() => import('../pages/HomePage'))
const SoundsPage = lazy(() => import('../pages/SoundsPage'))
const SignInPage = lazy(() => import('../pages/auth/SignInPage'))
const SignUpPage = lazy(() => import('../pages/auth/SignUpPage'))
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'))
const VerifyEmailPage = lazy(() => import('../pages/auth/security/VerifyEmailPage'))
const ConfirmEmailPage = lazy(() => import('../pages/auth/security/ConfirmEmailPage'))
const NewPasswordPage = lazy(() => import('../pages/auth/security/NewPasswordPage'))
const ResetConfirmedPage = lazy(() => import('../pages/auth/security/ResetConfirmedPage'))
const WelcomePage = lazy(() => import('../pages/WelcomePage'))
const TermsPage = lazy(() => import('../pages/TermsPage'))
const PrivacyPolicyPage = lazy(() => import('../pages/PrivacyPolicyPage'))

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-xl">Loading...</div>
  </div>
)

// Create router
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'sounds',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SoundsPage />
          </Suspense>
        ),
      },
      {
        path: 'auth',
        children: [
          {
            path: 'signin',
            element: (
              <Suspense fallback={<PageLoader />}>
                <SignInPage />
              </Suspense>
            ),
          },
          {
            path: 'signup',
            element: (
              <Suspense fallback={<PageLoader />}>
                <SignUpPage />
              </Suspense>
            ),
          },
          {
            path: 'reset-password',
            element: (
              <Suspense fallback={<PageLoader />}>
                <ResetPasswordPage />
              </Suspense>
            ),
          },
          {
            path: 'security',
            children: [
              {
                path: 'verify-email',
                element: (
                  <Suspense fallback={<PageLoader />}>
                    <VerifyEmailPage />
                  </Suspense>
                ),
              },
              {
                path: 'confirm-email',
                element: (
                  <Suspense fallback={<PageLoader />}>
                    <ConfirmEmailPage />
                  </Suspense>
                ),
              },
              {
                path: 'new-password',
                element: (
                  <Suspense fallback={<PageLoader />}>
                    <NewPasswordPage />
                  </Suspense>
                ),
              },
              {
                path: 'reset-confirmed',
                element: (
                  <Suspense fallback={<PageLoader />}>
                    <ResetConfirmedPage />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
      {
        path: 'welcome',
        element: (
          <Suspense fallback={<PageLoader />}>
            <WelcomePage />
          </Suspense>
        ),
      },
      {
        path: 'terms',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TermsPage />
          </Suspense>
        ),
      },
      {
        path: 'privacy-policy',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PrivacyPolicyPage />
          </Suspense>
        ),
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
