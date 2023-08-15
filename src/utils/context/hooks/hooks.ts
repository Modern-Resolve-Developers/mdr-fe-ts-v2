import { useSessionStorage } from "@/utils/hooks/useSessionStorage";
import { AccessSavedAuth, AccessUserId } from "../base/SessionContext";

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
export const useRouting = () => 
  useSessionStorage<string | undefined>("DR", undefined)
  export const useTokens = () => useSessionStorage<AccessSavedAuth | null>('token', null)
  export const useuid = () => useSessionStorage<AccessUserId | null>('uid', null)
  export const useDeviceId = () => useSessionStorage<string | undefined>('DI', undefined)
  export const useDevice = () => useSessionStorage<string | undefined>('D', undefined)
