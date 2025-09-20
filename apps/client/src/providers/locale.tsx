import "@client/libs/dayjs";

import { i18n } from "@lingui/core";
import { detect, fromStorage, fromUrl } from "@lingui/detect-locale";
import { I18nProvider } from "@lingui/react";
import { languages } from "@active-resume/utils";
import { useEffect, useState } from "react";

import { defaultLocale, dynamicActivate } from "../libs/lingui";
import { updateUser } from "../services/user";
import { useAuthStore } from "../stores/auth";

type Props = {
  children: React.ReactNode;
};

export const LocaleProvider = ({ children }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const userLocale = useAuthStore((state) => state.user?.locale ?? defaultLocale);

  useEffect(() => {
    const activateAndSetLoading = async () => {
      const detectedLocale =
        detect(fromUrl("locale"), fromStorage("locale"), userLocale, defaultLocale) ??
        defaultLocale;

      // Activate the locale only if it's supported
      if (languages.some((lang) => lang.locale === detectedLocale)) {
        await dynamicActivate(detectedLocale);
      } else {
        await dynamicActivate(defaultLocale);
      }
      setIsLoading(false);
    };

    void activateAndSetLoading();
  }, [userLocale]);

  if (isLoading) return null; // Or a loading spinner/component

  return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
};

export const changeLanguage = async (locale: string) => {
  // Update locale in local storage
  window.localStorage.setItem("locale", locale);

  // Update locale in user profile, if authenticated
  const state = useAuthStore.getState();
  if (state.user) await updateUser({ locale }).catch(() => null);

  // Reload the page for language switch to take effect
  window.location.reload();
};
