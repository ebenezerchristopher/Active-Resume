import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from "react-router";
import { Providers } from "../providers";
import { ErrorPage } from "@client/pages/public/error";
import { HomePage } from "@client/pages/home/page";
import { HomeLayout } from "@client/pages/home/layout";

export const routes = createRoutesFromElements(
  <Route element={<Providers />} errorElement={<ErrorPage />}>
    <Route element={<HomeLayout />}>
      <Route path="/" element={<HomePage />} />
    </Route>
  </Route>,
);

export const router = createBrowserRouter(routes);
