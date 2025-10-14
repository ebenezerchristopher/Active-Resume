import { i18n } from "@lingui/core";
import dayjs from "dayjs";

import { dayjsLocales } from "./dayjs";

export const defaultLocale = "en-US";

export async function dynamicActivate(locale: string) {
  try {
    const { messages } = await import(`../locales/${locale}/messages.po`);

    if (messages) {
      i18n.loadAndActivate({ locale, messages });
      //i18n.load(locale, messages);
      //i18n.activate(locale);
    }

    if (dayjsLocales[locale]) {
      dayjs.locale(await dayjsLocales[locale]());
    }
  } catch {
    throw new Error(`Failed to load messages for locale: ${locale}`);
  }
}
