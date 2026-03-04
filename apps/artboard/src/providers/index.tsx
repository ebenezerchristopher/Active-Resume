import { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Outlet } from "react-router";

import { helmetContext } from "../constants/helmet";
import { useArtboardStore } from "../store/artboard";

//import { sampleResume } from "@active-resume/schema";

export const Providers = () => {
  const resume = useArtboardStore((state) => state.resume);
  const setResume = useArtboardStore((state) => state.setResume);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data.type === "SET_RESUME") setResume(event.data.payload);
    };

    window.addEventListener("message", handleMessage, false);

    return () => {
      window.removeEventListener("message", handleMessage, false);
    };
  }, [setResume]);

  useEffect(() => {
    const resumeData = window.localStorage.getItem("resume");

    if (resumeData) setResume(JSON.parse(resumeData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.localStorage.getItem("resume"), setResume]);

  if (!resume) return null;

  return (
    <HelmetProvider context={helmetContext}>
      <Outlet />
    </HelmetProvider>
  );
};
