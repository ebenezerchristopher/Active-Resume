export const processUsername = (string?: string | null) => {
  if (!string) return "";

  return string.replace(/[^\d.A-Za-z-]/g, "").toLowerCase();
};
