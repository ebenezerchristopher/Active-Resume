import { ScrollArea } from "@active-resume/ui";
import { Outlet } from "react-router";

import { Footer } from "./components/footer";
import { Header } from "./components/header";

export const HomeLayout = () => (
  <ScrollArea orientation="vertical" className="h-screen">
    <Header />
    <Outlet />
    <Footer />
  </ScrollArea>
);
