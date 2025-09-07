import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter, Routes,Route} from 'react-router-dom'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'
import { Toaster } from 'sonner'
import HomeRedirect from './Redirect/HomeRedirect.jsx'
import PrivateRoute from './Redirect/PrivateRoute.jsx'
import PageNotFound from './pages/PageNotFound.jsx'
import ErrorBoundary from './pages/ErrorBoundary.jsx'

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Toaster />
    <Routes>
      <Route path="/" element={<HomeRedirect />} />

      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </PrivateRoute>
        }
      />

      <Route path="/create-new-account" element={<Signup />} />
      <Route path="/login-to-account" element={<Login />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  </BrowserRouter>
);
