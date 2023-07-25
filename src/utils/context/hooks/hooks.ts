import { useSessionStorage } from "@/utils/hooks/useSessionStorage";

export const useAccessToken = () =>
  useSessionStorage<string | undefined>("AT", undefined);

export const useRefreshToken = () =>
  useSessionStorage<string | undefined>("RT", undefined);

export const useUserType = () =>
  useSessionStorage<string | undefined>("UT", undefined);

export const useReferences = () => useSessionStorage<any>("REF", undefined);

export const useUserId = () =>
  useSessionStorage<string | undefined>("UID", undefined);

export const useGoogleAccountInfo = () => 
  useSessionStorage<string | undefined>("GGL", undefined)