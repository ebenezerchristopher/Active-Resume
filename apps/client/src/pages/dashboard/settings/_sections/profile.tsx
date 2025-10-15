import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/core/macro";
import { Theme, useTheme } from "@active-resume/hooks";
import {
  Button,
  Combobox,
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@active-resume/ui";
import { cn } from "@active-resume/utils";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v3";
import { LocaleComboboxPopover } from "@client/components/locale-combobox";
import { useUpdateUser, useUser } from "@client/services/user";
import { Trans } from "@lingui/react/macro";

const formSchema = z.object({
  theme: z.enum(["system", "light", "dark"]).default("system"),
  locale: z.string().default("en-US"),
});

type FormValues = z.infer<typeof formSchema>;

export const ProfileSettings = () => {
  const { user } = useUser();
  const { theme, setTheme } = useTheme();
  const { updateUser, loading } = useUpdateUser();

  const form = useForm<Partial<FormValues>>({
    resolver: zodResolver(formSchema),
    defaultValues: { theme, locale: "en-US" },
  });

  const onReset = useCallback(() => {
    if (!user) return;

    form.reset({ theme, locale: user.locale });
  }, [form, user, theme]);

  useEffect(() => {
    user && onReset();
  }, [user, onReset]);

  const onSubmit = async (data: Partial<FormValues>) => {
    if (!user) return;

    setTheme(data.theme as Theme);

    if (user.locale !== data.locale) {
      window.localStorage.setItem("locale", data.locale as string);
      await updateUser({ locale: data.locale });

      window.location.reload();
    }

    form.reset(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold leading-relaxed tracking-tight">{t`Profile`}</h3>
        <p className="leading-relaxed opacity-75">
          {t`Here, you can update your profile to customize and personalize your experience.`}
        </p>
      </div>

      <Form {...form}>
        <form className="grid gap-6 sm:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="theme"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t`Theme`}</FormLabel>
                <div className="w-full">
                  <Combobox
                    {...field}
                    value={field.value}
                    options={[
                      { label: t`System`, value: "system" },
                      { label: t`Light`, value: "light" },
                      { label: t`Dark`, value: "dark" },
                    ]}
                    onValueChange={field.onChange}
                  />
                </div>
              </FormItem>
            )}
          />

          <FormField
            name="locale"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t`Language`}</FormLabel>
                <div className="w-full">
                  <LocaleComboboxPopover
                    value={field.value as string}
                    onValueChange={field.onChange}
                  />
                </div>
                <FormDescription>
                  <span>
                    <Trans>
                      Don't see your language?{" "}
                      <a
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        href="https://translate.rxresu.me/"
                        className="font-medium underline underline-offset-2"
                      >
                        Help translate the app.
                      </a>
                    </Trans>
                  </span>
                </FormDescription>
              </FormItem>
            )}
          />

          <div
            className={cn(
              "hidden items-center space-x-2 self-center sm:col-start-2",
              form.formState.isDirty && "flex animate-in fade-in",
            )}
          >
            <Button type="submit" disabled={loading}>
              {t`Save Changes`}
            </Button>
            <Button type="reset" variant="ghost" onClick={onReset}>
              {t`Discard`}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
