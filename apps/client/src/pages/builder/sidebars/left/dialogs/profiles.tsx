import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/core/macro";
import { defaultProfile, profileSchema } from "@active-resume/schema";
import {
  Avatar,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@active-resume/ui";
import { Resolver, useForm } from "react-hook-form";
import type { z } from "zod/v3";

import { BrandIcon } from "@/client/components/brand-icon";

import { SectionDialog } from "../sections/shared/section-dialog";
import { URLInput } from "../sections/shared/url-input";
import { Trans } from "@lingui/react/macro";

const formSchema = profileSchema;

type FormValues = z.infer<typeof formSchema>;

export const ProfilesDialog = () => {
  const form = useForm<FormValues>({
    defaultValues: defaultProfile,
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
  });

  return (
    <SectionDialog<FormValues> id="profiles" form={form} defaultValues={defaultProfile}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          name="network"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t`Network`}</FormLabel>
              <FormControl>
                <Input {...field} placeholder="GitHub" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t`Username`}</FormLabel>
              <FormControl>
                <Input {...field} placeholder="john.doe" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="url"
          control={form.control}
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>{t`Website`}</FormLabel>
              <FormControl>
                <URLInput {...field} placeholder="https://github.com/johndoe" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="icon"
          control={form.control}
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel htmlFor="iconSlug">{t`Icon`}</FormLabel>
              <FormControl>
                <div className="flex items-center gap-x-2">
                  <Avatar className="size-8 bg-white p-1.5">
                    <BrandIcon slug={field.value} />
                  </Avatar>
                  <Input {...field} placeholder="github" onChange={field.onChange} />
                </div>
              </FormControl>
              <FormMessage />
              <FormDescription className="ml-10">
                <Trans>
                  Powered by{" "}
                  <a
                    href="https://simpleicons.org/"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="font-medium"
                  >
                    Simple Icons
                  </a>
                </Trans>
              </FormDescription>
            </FormItem>
          )}
        />
      </div>
    </SectionDialog>
  );
};
