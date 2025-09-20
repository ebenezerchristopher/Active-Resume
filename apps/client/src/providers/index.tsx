import { ThemeProvider } from "./theme";
import { Outlet } from "react-router";
import { HelmetProvider } from "react-helmet-async";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../libs/query-client";
import { helmetContext } from "@client/constants/helmet";
import { LocaleProvider } from "./locale";

export const Providers = () => (
  <LocaleProvider>
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Outlet />
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </LocaleProvider>
);
