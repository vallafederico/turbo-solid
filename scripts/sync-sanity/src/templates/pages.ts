export const PAGE_TEMPLATES = {
  page: (
    filename: string,
    capitalizedName: string
  ) => `import createPage from '../../utils/createPage'

export default createPage({
  title: '${capitalizedName}',
  slug: false,
  seo: true,
  slices: true,
  name: '${filename}',
})`,
};
