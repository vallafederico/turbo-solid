import { createContext, createEffect, useContext } from 'solid-js'
import type { Product, ProductOption, ProductVariant } from '../types'
import { createStore, produce } from 'solid-js/store'
import { variantFromOptions, variantOptionsToObject } from '../utils'

interface ProductStore {
	selectedOptions: Record<string, string>
	selectedVariant: ProductVariant | null
	productAttributes: Record<string, string>
	canAddToCart: boolean
	productData: Product | null
	canSelectOverlays: boolean
}

const [product, setProduct] = createStore<ProductStore>({
	selectedOptions: {},
	selectedVariant: null,
	productAttributes: {},
	canAddToCart: true,
	productData: null,
	canSelectOverlays: true,
})

const setSelectedOptions = (options: Record<string, string>) => {
	setProduct(
		produce((state) => {
			state.selectedOptions = options
		}),
	)
}

const setCanSelectOverlays = (canSelectOverlays: boolean) => {
	setProduct('canSelectOverlays', canSelectOverlays)
}

const setSelectedVariant = (variant: ProductVariant) => {
	setProduct(
		produce((state) => {
			state.selectedVariant = variant
		}),
	)
}

const setCanAddToCart = (canAddToCart: boolean) => {
	setProduct('canAddToCart', canAddToCart)
}

const setProductAttributes = (attributes: Record<string, string>) => {
	setProduct(
		produce((state) => {
			const filteredAttributes = Object.fromEntries(
				Object.entries(attributes).filter(([_, value]) => value !== undefined),
			)
			state.productAttributes = {
				...state.productAttributes,
				...filteredAttributes,
			}
		}),
	)
}

const removeProductAttribute = (attribute: string) => {
	setProduct('productAttributes', (prev: Record<string, string>) => {
		const { [attribute]: _, ...rest } = prev
		return rest
	})
}

const ProductContext = createContext({
	selectedOptions: () => product.selectedOptions,
	setSelectedOptions,
	selectedVariant: () => product.selectedVariant,
	setSelectedVariant,
	productAttributes: () => product.productAttributes,
	setProductAttributes,
	removeProductAttribute,
	canAddToCart: () => product.canAddToCart,
	setCanAddToCart,
	product: () => product.productData,
	canSelectOverlays: () => product.canSelectOverlays,
	setCanSelectOverlays,
})

export const useProduct = () => {
	const ctx = useContext(ProductContext)

	if (!ctx) {
		throw new Error('useProduct must be used within a ProductProvider')
	}

	return ctx
}

export const ProductProvider = ({
	children,
	defaultVariant,
	defaultOptions,
	productData,
}: {
	children: any
	defaultVariant: ProductVariant
	defaultOptions: ProductOption[]
	productData: Product
}) => {
	setProduct('productData', productData)

	setSelectedVariant(defaultVariant)
	setSelectedOptions(variantOptionsToObject(defaultOptions))

	createEffect(() => {
		const v = variantFromOptions(
			product?.productData?.variants?.nodes || [],
			product.selectedOptions,
		)

		setSelectedVariant(v)
	})

	return (
		<ProductContext.Provider
			value={{
				product: () => productData,
				selectedOptions: () => product.selectedOptions,
				setSelectedOptions,
				selectedVariant: () => product.selectedVariant,
				setSelectedVariant,
				productAttributes: () => product.productAttributes,
				setProductAttributes,
				canAddToCart: () => product.canAddToCart,
				setCanAddToCart,
				removeProductAttribute,
			}}
		>
			{children}
		</ProductContext.Provider>
	)
}
