import { TwoFactorDialog } from "../pages/dashboard/settings/_dialogs/two-factor";
import { ResumeDialog } from "../pages/dashboard/resumes/_dialogs/resume";
import { LockDialog } from "../pages/dashboard/resumes/_dialogs/lock";
import { ImportDialog } from "../pages/dashboard/resumes/_dialogs/import";
import { ProfilesDialog } from "../pages/builder/sidebars/left/dialogs/profiles";
import { useResumeStore } from "../stores/resume";
import { ExperienceDialog } from "../pages/builder/sidebars/left/dialogs/experience";
import { EducationDialog } from "../pages/builder/sidebars/left/dialogs/education";
import { AwardsDialog } from "../pages/builder/sidebars/left/dialogs/awards";
import { CertificationsDialog } from "../pages/builder/sidebars/left/dialogs/certifications";
import { InterestsDialog } from "../pages/builder/sidebars/left/dialogs/interests";
import { LanguagesDialog } from "../pages/builder/sidebars/left/dialogs/languages";
import { ProjectsDialog } from "../pages/builder/sidebars/left/dialogs/projects";
import { VolunteerDialog } from "../pages/builder/sidebars/left/dialogs/volunteer";
import { SkillsDialog } from "../pages/builder/sidebars/left/dialogs/skills";
import { ReferencesDialog } from "../pages/builder/sidebars/left/dialogs/references";
import { CustomSectionDialog } from "../pages/builder/sidebars/left/dialogs/custom-section";
import { PublicationsDialog } from "../pages/builder/sidebars/left/dialogs/publications";

type Props = {
  children: React.ReactNode;
};

export const DialogProvider = ({ children }: Props) => {
  const isResumeLoaded = useResumeStore((state) => Object.keys(state.resume).length > 0);

  return (
    <>
      {children}
      <div id="dialog-root">
        <TwoFactorDialog />
        <ResumeDialog />
        <LockDialog />
        <ImportDialog />

        {isResumeLoaded && (
          <>
            <ProfilesDialog />
            <ExperienceDialog />
            <EducationDialog />
            <AwardsDialog />
            <CertificationsDialog />
            <InterestsDialog />
            <LanguagesDialog />
            <ProjectsDialog />
            <PublicationsDialog />
            <VolunteerDialog />
            <SkillsDialog />
            <ReferencesDialog />
            <CustomSectionDialog />
          </>
        )}
      </div>
    </>
  );
};
