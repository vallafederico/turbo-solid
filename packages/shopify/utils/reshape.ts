import type { Connection, PageInfo, RawConnection } from "../types";

const defaultPageInfo: PageInfo = {
	hasNextPage: false,
	endCursor: null,
};

export function normalizePageInfo(pageInfo?: PageInfo): PageInfo {
	return {
		hasNextPage: pageInfo?.hasNextPage ?? false,
		endCursor: pageInfo?.endCursor ?? null,
	};
}

export function flattenConnection<T>(connection?: RawConnection<T> | null): T[] {
	if (!connection) return [];

	if (connection.nodes?.length) {
		return connection.nodes;
	}

	if (connection.edges?.length) {
		return connection.edges.map((edge) => edge.node);
	}

	return [];
}

export function reshapeConnection<T>(
	connection?: RawConnection<T> | null,
): Connection<T> {
	return {
		nodes: flattenConnection(connection),
		pageInfo: normalizePageInfo(connection?.pageInfo),
	};
}

export function reshapeProductImages(
	images?: RawConnection<{
		url: string;
		altText?: string | null;
		width?: number | null;
		height?: number | null;
	}> | null,
) {
	return flattenConnection(images);
}

export function reshapeProduct<T extends { images?: RawConnection<{
	url: string;
	altText?: string | null;
	width?: number | null;
	height?: number | null;
}> | null }>(
	product: T,
) {
	const { images, ...rest } = product;
	return {
		...rest,
		...(images ? { images: reshapeProductImages(images) } : {}),
	};
}

export function reshapeCart<T extends { lines?: RawConnection<unknown> }, L = ReturnType<typeof flattenConnection>[number]>(
	cart: T,
): Omit<T, "lines"> & { lines: L[] } {
	const { lines, ...rest } = cart;
	return {
		...rest,
		lines: flattenConnection(lines) as L[],
	};
}
