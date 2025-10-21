import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from "react-router";
import { Providers } from "../providers";
import { ErrorPage } from "@/client/pages/public/error";
import { HomePage } from "@/client/pages/home/page";
import { HomeLayout } from "@/client/pages/home/layout";
import { AuthLayout } from "@/client/pages/auth/layout";
import { GuestGuard } from "./gaurds/guest";
import { RegisterPage } from "@/client/pages/auth/register/page";
import { LoginPage } from "@/client/pages/auth/login/page";
import { ForgotPasswordPage } from "../pages/auth/forgot-password/page";
import { ResetPasswordPage } from "../pages/auth/reset-password/page";
import { authLoader } from "./loaders/auth";
import { AuthGuard } from "./gaurds/auth";
import { DashboardLayout } from "../pages/dashboard/layout";
import { SettingsPage } from "../pages/dashboard/settings/page";
import { VerifyEmailPage } from "../pages/auth/verify-email/page";
import { VerifyOtpPage } from "../pages/auth/verify-otp/page";
import { ResumesPage } from "../pages/dashboard/resumes/page";

export const routes = createRoutesFromElements(
  <Route element={<Providers />} errorElement={<ErrorPage />}>
    <Route element={<HomeLayout />}>
      <Route path="/" element={<HomePage />} />
    </Route>

    <Route path="auth">
      <Route element={<AuthLayout />}>
        <Route element={<GuestGuard />}>
          <Route path="login" element={<LoginPage />}></Route>
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* Password Recovery */}
        <Route element={<GuestGuard />}>
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Two-Factor Authentication */}
        <Route element={<GuestGuard />}>
          <Route path="verify-otp" element={<VerifyOtpPage />} />
        </Route>

        {/* Email Verification */}
        <Route element={<AuthGuard />}>
          <Route path="verify-email" element={<VerifyEmailPage />} />
        </Route>

        {/* OAuth Callback */}
        <Route path="callback" loader={authLoader} element={<div />} />
      </Route>
      <Route index element={<Navigate replace to="/auth/login" />} />
    </Route>
    <Route path="dashboard">
      <Route element={<AuthGuard />}>
        <Route element={<DashboardLayout />}>
          <Route path="resumes" element={<ResumesPage />} />
          <Route path="settings" element={<SettingsPage />} />

          <Route index element={<Navigate replace to="/dashboard/resumes" />} />
        </Route>
      </Route>
    </Route>
  </Route>,
);

export const router = createBrowserRouter(routes);
