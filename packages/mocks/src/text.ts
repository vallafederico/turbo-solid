import { randomItem } from './utils'

// Names
export const mockName = () => 'Amelia van den Heuvel'
export const mockFirstName = () => 'Amelia'
export const mockLastName = () => 'van den Heuvel'

// Contact information
export const mockEmail = () => 'Amelia.van.den.heuvel@example.com'
export const mockPhone = () => '(555) 123-4567'
export const mockAddress = () => '123 Main Street'
export const mockCity = () => 'San Francisco'

// Lorem ipsum text - designed to be useful for real layouts
const wordsVariations = [
  'Lorem ipsum dolor sit amet',
  'Consectetur adipiscing elit sed',
  'Tempor incididunt ut labore',
  'Magna aliqua enim minim',
  'Nisi ut aliquip ex ea',
  'Commodo consequat duis aute',
]

const sentenceVariations = [
  'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
  'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam quis nostrud exercitation ullamco laboris.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.',
  'Excepteur sint occaecat cupidatat non proident sunt in culpa.',
  'Qui officia deserunt mollit anim id est laborum sed ut.',
]

export const mockWords = () => randomItem(wordsVariations)

export const mockSentence = () => randomItem(sentenceVariations)

export const mockParagraph = () =>
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

// Additional text utilities
export const mockShortText = () => 'Lorem ipsum dolor sit amet'

export const mockButtonLabel = () =>
  randomItem([
    'Learn more',
    'Get started',
    'Contact us',
    'Read more',
    'View details',
  ])

export const mockMediumText = () =>
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'

export const mockLongText = () =>
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'

export const mockCallToAction = () => 'Get started today'

export const mockQuote = () =>
  'This program has completely changed how I manage my health. The personalized approach made all the difference.'

// Date utilities
export const mockDate = () => new Date('2024-01-15T10:30:00Z')
export const mockDateString = () => '2024-01-15'
export const mockTimestamp = () => 1705316400000
