export const getDataFromLocalStorage = (key: string): string | null => {
    if (typeof window === 'undefined') {
      return null; // Return null if window is undefined (e.g., during server-side rendering)
    }
  
    const data = window.localStorage.getItem(key);
    return data;
};