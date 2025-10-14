import { TwoFactorDialog } from "../pages/dashboard/settings/_dialogs/two-factor";

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
      </div>
    </>
  );
};
