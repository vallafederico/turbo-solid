declare module "solid-js" {
  namespace JSX {
    interface Directives {
      webgl: [() => any, (v: any) => any];
      scroll: [() => any, (v: any) => any];
    }
  }
}
