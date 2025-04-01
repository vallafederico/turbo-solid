# GDPR Cookie Compliance
`https://gdpr.eu/cookies/`

## Rules

1. ALWAYS Ask consent for Marketing or Statistics cookies. GTAG, GTM, all of it. Get consent before you let those scripts run and have cookies 
2. Explain everything. Even Strictly necessary cookies. It needs a quick blurb to say "We use these to make the experience smoother and save things so you can use them next time" or something.
3. Create a page or popout where a user can change these at free will. Not just the first time they visit.


## Using the package

```tsx
import {useGdpr} from '@local/gdpr'
import { For } from "solid-js"

export function ConsentBanner() {
  const [consent, setConsent] = useGdpr()

  const options = ['statistics', 'marketing', 'preferences']

  return (
    <div>
      <form>
        <For each={options}>
          {
            (option, i)=>(
            <label>
              Allow {option} cookies?
              <input type="checkbox" name={option} onInput={(e)=> setConsent(option,e.currentTarget.checked)}/>
            </label>
            )
          }
          </For>
      </form>
      <button onClick={()=>setConsent('all', true)}>Allow all</button>
      <button onClick={()=>setConsent('all', false)}>Deny all</button>
    </div>

  )
}
```

## Notes
- `consent` is NOT reactive.

## Extra: Cookie Types

### Preferences cookies
Also known as "functionality cookies," these cookies allow a website to remember choices you have made in the past, like what language you prefer, what region you would like weather reports for, or what your user name and password are so you can automatically log in.

`TLDR: DO NOT ask for consent for these, just explain them somewhere`

### Statistics cookies
Also known as "performance cookies," these cookies collect information about how you use a website, like which pages you visited and which links you clicked on. None of this information can be used to identify you. It is all aggregated and, therefore, anonymized. Their sole purpose is to improve website functions. This includes cookies from third-party analytics services as long as the cookies are for the exclusive use of the owner of the website visited.

`TLDR: These and Marketing Cookies are the real important one. GTAG, GTM, Clarity, etc. all use these. You NEED to ask for consent before letting these scripts run and store cookies.`

### Marketing cookies
These cookies track your online activity to help advertisers deliver more relevant advertising or to limit how many times you see an ad. These cookies can share that information with other organizations or advertisers. These are persistent cookies and almost always of third-party provenance.

`These and Marketing Cookies are the real bitch. GTAG, GTM, Clarity, etc. all use these. You NEED to ask for consent before letting these scripts run and store cookies.`