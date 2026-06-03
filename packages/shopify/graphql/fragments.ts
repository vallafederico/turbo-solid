export const MONEY = `
  fragment Money on MoneyV2 {
    amount
    currencyCode
  }
`;

export const IMAGE = `
  fragment Image on Image {
    url
    altText
    width
    height
  }
`;

export const PRODUCT_CARD = `
  fragment ProductCard on Product {
    id
    handle
    title
    featuredImage {
      ...Image
    }
    priceRange {
      minVariantPrice {
        ...Money
      }
      maxVariantPrice {
        ...Money
      }
    }
  }
  ${IMAGE}
  ${MONEY}
`;

export const PRODUCT_VARIANT = `
  fragment ProductVariant on ProductVariant {
    id
    title
    availableForSale
    sku
    price {
      ...Money
    }
    compareAtPrice {
      ...Money
    }
    selectedOptions {
      name
      value
    }
    image {
      ...Image
    }
    product {
      handle
      title
    }
  }
  ${MONEY}
  ${IMAGE}
`;

export const PRODUCT_DETAIL = `
  fragment ProductDetail on Product {
    ...ProductCard
    description
    descriptionHtml
    vendor
    productType
    tags
    encodedVariantExistence
    encodedVariantAvailability
    seo {
      title
      description
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(
      selectedOptions: $selectedOptions
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      ...ProductVariant
    }
    adjacentVariants(selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    images(first: 10) {
      edges {
        node {
          ...Image
        }
      }
    }
  }
  ${PRODUCT_CARD}
  ${PRODUCT_VARIANT}
`;

export const COLLECTION = `
  fragment Collection on Collection {
    id
    handle
    title
    description
    image {
      ...Image
    }
  }
  ${IMAGE}
`;

export const CART = `
  fragment Cart on Cart {
    id
    checkoutUrl
    totalQuantity
    note
    discountCodes {
      code
      applicable
    }
    cost {
      subtotalAmount {
        ...Money
      }
      totalAmount {
        ...Money
      }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        cost {
          totalAmount {
            ...Money
          }
          amountPerQuantity {
            ...Money
          }
          compareAtAmountPerQuantity {
            ...Money
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            availableForSale
            requiresShipping
            price {
              ...Money
            }
            compareAtPrice {
              ...Money
            }
            selectedOptions {
              name
              value
            }
            image {
              ...Image
            }
            product {
              title
              handle
            }
          }
        }
      }
    }
  }
  ${MONEY}
  ${IMAGE}
`;
