import { CART, COLLECTION, PRODUCT_CARD, PRODUCT_DETAIL } from "./fragments";

export const GET_PRODUCTS = `
  query GetProducts(
    $first: Int!
    $after: String
    $sortKey: ProductSortKeys
    $reverse: Boolean
  ) {
    products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse) {
      edges {
        cursor
        node {
          ...ProductCard
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${PRODUCT_CARD}
`;

export const GET_PRODUCT_BY_HANDLE = `
  query GetProductByHandle(
    $handle: String!
    $selectedOptions: [SelectedOptionInput!]!
  ) {
    product(handle: $handle) {
      ...ProductDetail
    }
  }
  ${PRODUCT_DETAIL}
`;

export const GET_COLLECTIONS = `
  query GetCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          ...Collection
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${COLLECTION}
`;

export const GET_COLLECTION_BY_HANDLE = `
  query GetCollectionByHandle($handle: String!) {
    collection(handle: $handle) {
      ...Collection
    }
  }
  ${COLLECTION}
`;

export const GET_COLLECTION_PRODUCTS = `
  query GetCollectionProducts(
    $handle: String!
    $first: Int!
    $after: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) {
    collection(handle: $handle) {
      ...Collection
      products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse) {
        edges {
          cursor
          node {
            ...ProductCard
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
  ${COLLECTION}
  ${PRODUCT_CARD}
`;

export const GET_CART = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      ...Cart
    }
  }
  ${CART}
`;

export const GET_SEARCH = `
  query SearchProducts($query: String!, $first: Int!) {
    search(query: $query, first: $first, types: PRODUCT) {
      edges {
        node {
          ... on Product {
            ...ProductCard
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${PRODUCT_CARD}
`;
