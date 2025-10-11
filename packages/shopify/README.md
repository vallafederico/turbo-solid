

### Environment Variable Details

- `SHOPIFY_STOREFRONT_PUBLIC_TOKEN`: Your Shopify Storefront API public access token
- `SHOPIFY_STOREFRONT_PRIVATE_TOKEN`: Your Shopify Storefront API private access token (for server-side operations)
- `SHOPIFY_STORE_DOMAIN`: Your Shopify store domain (e.g., `your-store.myshopify.com`)



## Updating schema.graphql
https://danielbeck.io/posts/how-to-downl
oad-shopify-graphql-schema/
```bash
		npx get-graphql-schema https://shopify.dev/admin-graphql-direct-proxy/2025-07 \
    > shopify-2025-07.schema

```