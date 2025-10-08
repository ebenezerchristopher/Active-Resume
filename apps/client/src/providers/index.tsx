import { ThemeProvider } from "./theme";
import { Outlet } from "react-router";
import { HelmetProvider } from "react-helmet-async";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../libs/query-client";
import { helmetContext } from "@client/constants/helmet";
import { LocaleProvider } from "./locale";
import { TooltipProvider } from "@active-resume/ui";
import { Toaster } from "./toaster";
import { AuthRefreshProvider } from "./auth-refresh";

export const Providers = () => (
  <LocaleProvider>
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <AuthRefreshProvider>
          <ThemeProvider>
            <TooltipProvider>
              <Outlet />
              <Toaster />
            </TooltipProvider>
          </ThemeProvider>
        </AuthRefreshProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </LocaleProvider>
);
