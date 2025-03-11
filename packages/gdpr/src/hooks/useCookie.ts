import { createSignal } from "solid-js"

export default function useCookie() {

  /**
   * Hook for retrieving a cookie value
   * @returns The value of the cookie or null if the cookie does not exist
   */
  const cookie = (name: string) => {
    const cookie = document.cookie.split('; ').find(row => row.startsWith(`${name}=`))
    return cookie ? cookie.split('=')[1] : null
  }

  /**
   * Hook for managing browser cookies
   * @param name The name of the cookie to get/set
   * @param value Optional initial value for the cookie
   * @returns [getCookie, setCookie] tuple where:
   * - getCookie() retrieves the current cookie value
   * - setCookie(value, expiration?) sets the cookie value and optional expiration
   */
  const setCookie = (name: string, value: string | number | boolean, expiration?: number) => {
    if(value){
      // Max expiration of 12 months enforced in Luxembourg as of 2024, no other countries have this law as of Q1 2025
      const maxExpiration = 365 * 24 * 60 * 60 * 1000 // 12 months in milliseconds
      const safeExpiration = expiration ? Math.min(expiration, maxExpiration) : maxExpiration
      
      document.cookie = `${name}=${value}; path=/${safeExpiration ? `; expires=${new Date(Date.now() + safeExpiration).toUTCString()}` : ''}`
    } else if (value === undefined) {
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    }
  }

  return [cookie, setCookie]
}