import { computed, ref } from 'vue'

/**
 * localstorage
 */
export function useLocalStorage(key: string) {
  const value = getItem(key)

  function setItem(key: string, value: any) {
    localStorage.setItem(key, value)
  }

  function getItem(key: string) {
    localStorage.getItem(key)
  }

  return {
    setItem,
    value
  }
}
