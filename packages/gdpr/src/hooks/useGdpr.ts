import { createEffect, onMount } from "solid-js"
import { Consent, ConsentType } from "../types"
import useCookie from "./useCookie"
// import { gdprStore, setGdprStore } from "../stores/gdpr-store"

interface GdprHookProps {
  statistics: boolean
  marketing: boolean
  preferences: boolean
  onConsentChange: (consent: Consent) => void
}

export default function useGdpr({
  onConsentChange = () => {},
}: GdprHookProps) {
  const [cookie, setCookie] = useCookie()

  // Consent is always false unless set by the user
  let statistics = false
  let marketing = false
  let preferences = false

  // const consent_marketing = cookie('content_marketing')
  // const consent_preferences = cookie('content_preferences')

  // Load consent from cookies, if any
  onMount(() => {
    statistics = cookie('content_statistics')
    marketing = cookie('content_marketing')
    preferences = cookie('content_preferences')
  })

  const setConsent = (consent: ConsentType | 'all', value: boolean) => {
    switch(consent) {
      case 'statistics':
        setCookie('content_statistics', Boolean(value))
        statistics = value
      case 'marketing':
        setCookie('content_marketing', Boolean(value))
        marketing = value
      case 'preferences':
        setCookie('content_preferences', Boolean(value))
        preferences = value
      case 'all':
        setCookie('content_statistics', Boolean(value))
        setCookie('content_marketing', Boolean(value))
        setCookie('content_preferences', Boolean(value))
        statistics = value
        marketing = value
        preferences = value
    }
  }

  return [{statistics, marketing, preferences}, setConsent]

  // createEffect(() => {
  //   onConsentChange({...gdprStore})

  //   setCookie('content_statistics', Boolean(gdprStore.statistics))
  //   setCookie('content_marketing', Boolean(gdprStore.marketing))
  //   setCookie('content_preferences', Boolean(gdprStore.preferences))
  // })
  
  // const setConsent = (consent: ConsentType | 'all', value: boolean) => {
  //   switch(consent) {
  //     case 'statistics':
  //       setGdprStore('statistics', value)
  //       break
  //     case 'marketing':
  //       setGdprStore('marketing', value)
  //       break 
  //     case 'preferences':
  //       setGdprStore('preferences', value)
  //       break
  //     case 'all':
  //       setGdprStore({
  //         statistics: value,
  //         marketing: value,
  //         preferences: value
  //       })
  //       break
  //   }
  // }

  // return [
  //   gdprStore,
  //   setConsent
  // ] as const
}