import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemas'
import {media} from 'sanity-plugin-media'
import {structure} from './desk/structure'
import Logo from './components/Logo'
import {noteField} from 'sanity-plugin-note-field'
import {userGuidePlugin} from '@q42/sanity-plugin-user-guide'
import {vercelDeployTool} from 'sanity-plugin-vercel-deploy'
import {userGuideStructure} from './guides/userGuideStructure'

export default defineConfig({
  name: 'internetthings-starter',
  title: 'Starter',
  icon: Logo,
  projectId: '6mav93fo',
  dataset: 'production',

  plugins: [
    structureTool({structure}),
    visionTool(),
    noteField(),
    vercelDeployTool(),
    userGuidePlugin({userGuideStructure}),
    media({
      creditLine: {
        enabled: true,
      },
    }),
  ],
  schema: {
    types: schemaTypes,
  },
})
