import { TwoFactorDialog } from "../pages/dashboard/settings/_dialogs/two-factor";
import { ResumeDialog } from "../pages/dashboard/resumes/_dialogs/resume";
import { LockDialog } from "../pages/dashboard/resumes/_dialogs/lock";

type Props = {
  children: React.ReactNode;
};

export const DialogProvider = ({ children }: Props) => {
  //const isResumeLoaded = useResumeStore((state) => Object.keys(state.resume).length > 0);

  return (
    <>
      {children}
      <div id="dialog-root">
        <TwoFactorDialog />
        <ResumeDialog />
        <LockDialog />
      </div>
    </>
  );
};
