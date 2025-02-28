import blockContent from './blockContent'
import body from './body'
import formFields from './form-fields'
import imageAlt from './imageAlt'
import link from './link'
import location from './location'
import strippedText from './strippedText'

export default [...formFields, blockContent, link, imageAlt, location, strippedText, body] as any[]
