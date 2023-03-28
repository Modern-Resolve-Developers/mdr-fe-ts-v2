import { useSessionStorage } from "@/utils/hooks/useSessionStorage";

export const useAccessToken = () => useSessionStorage<string | undefined>('AT', undefined)

export const useRefreshToken = () => useSessionStorage<string | undefined>('RT', undefined)
