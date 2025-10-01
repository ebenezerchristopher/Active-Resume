import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from "react-router";
import { Providers } from "../providers";
import { ErrorPage } from "@client/pages/public/error";
import { HomePage } from "@client/pages/home/page";
import { HomeLayout } from "@client/pages/home/layout";
import { AuthLayout } from "@client/pages/auth/layout";
import { GuestGuard } from "./gaurds/guest";
import { RegisterPage } from "@client/pages/auth/register/page";
import { LoginPage } from "@client/pages/auth/login/page";
import { ForgotPasswordPage } from "../pages/auth/forgot-password/page";
import { ResetPasswordPage } from "../pages/auth/reset-password/page";

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
      </Route>
    </Route>
  </Route>,
);

export const router = createBrowserRouter(routes);
