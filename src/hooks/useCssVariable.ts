export function useCssVariable(key: string) {
  if (!key) {
    return null
  }

  return getComputedStyle(document.documentElement).getPropertyValue(key) // #999999
}
