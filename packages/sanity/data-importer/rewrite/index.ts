// make this extendable so client can be passed into children

class DocumentImporter {
  totalItems: number
  currentItem: number
  documentType: string
  data: any[]
  client: any
  mode?: 'create' | 'patch' | 'createOrReplace' | 'createIfNotExists'
  onComplete?: () => void
  dryRun?: boolean
  clearOldUpload?: boolean

  constructor({
    documentType,
    data,
    client,
    mode,
    onComplete,
    clearOldUpload,
    dryRun = false,
  }) {
    this.totalItems = data.length
    this.currentItem = 0
    this.documentType = documentType
    this.data = data
    this.client = client
    this.mode = mode
    this.onComplete = onComplete
    this.dryRun = dryRun
    this.clearOldUpload = clearOldUpload
  }

  checkParams() {
    if (this.mode !== 'create') {
      this.clearOldUpload = false
    }

    !this.client && new Error('property "client" is required')
    !this.documentType && new Error('property "documentType" is required')

    typeof this.onComplete !== 'function' && new Error('funtion property "callback" is required')
  }

  start() {
    console.log('Starting import...')
    this.checkParams()
    if (this.clearOldUpload) {
      this.prompt(
        'confirm',
        'Clear Old Data is enabled, this will delete all existing documents of this type, are you absolutely 100% positively sure you want to continue?',
      )
      this.clearOldData()
    }
    // start timer here
    this.initialProcessing()
    this.prepare()
    this.cleanup()
    this.submit()
  }

  clearOldData() {}

  initialProcessing() {}

  prepare() {}

  get total() {
    return this.data.length
  }

  cleanup() {}

  prompt(type: 'confirm', message: string) {
    if (this.clearOldUpload) {
    }
  }

  submit() {
    // split requsts
  }
}
