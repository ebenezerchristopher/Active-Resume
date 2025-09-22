import { t } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Helmet } from "react-helmet-async";
import { HeroSection } from "./sections/hero";
import { LogoCloudSection } from "./sections/logo-cloud";
import { StatisticsSection } from "./sections/statistics";
import { FeaturesSection } from "./sections/features";
import { TemplatesSection } from "./sections/templates";
import { TestimonialsSection } from "./sections/testimonials";
import { SupportSection } from "./sections/support";
import { FAQSection } from "./sections/faq";
import { ContributorsSection } from "./sections/contributors";

export const HomePage = () => {
  const { i18n } = useLingui();

  return (
    <main className="relative isolate bg-background">
      <Helmet prioritizeSeoTags>
        <html lang={i18n.locale} />

        <title>
          {t`Reactive Resume`} - {t`A free and open-source resume builder`}
        </title>

        <meta
          name="description"
          content="A free and open-source resume builder that simplifies the process of creating, updating, and sharing your resume."
        />
      </Helmet>

      <HeroSection />
      <LogoCloudSection />
      <StatisticsSection />
      <FeaturesSection />
      <TemplatesSection />
      <TestimonialsSection />
      <SupportSection />
      <FAQSection />
      <ContributorsSection />
    </main>
  );
};
