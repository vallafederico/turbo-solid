export class RefResolver {
  errors: string[]
  data: any

  constructor(data: any) {
    this.errors = []
    this.data = data
  }

  start() {}

  maintainOrder() {}

  get resolverMode() {
    return this.data.mode
  }

  resolve() {}

  cleanup() {}
}
