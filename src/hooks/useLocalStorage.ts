import { computed, ref } from 'vue'

/**
 * localstorage
 */
export function useLocalStorage(key: string) {
  const value = getItem(key)

  function setItem(key: string, value: any): void {
    localStorage.setItem(key, value)
  }

  function getItem(key: string): string {
    return localStorage.getItem(key) || ''
  }

  return {
    setItem,
    value
  }
}
