import { isServer } from 'solid-js/web'

export const getLocalStorage = (key: string) => {
	if (!isServer) {
		return localStorage.getItem(key)
	}

	return null
}

export const setLocalStorage = (key: string, value: string) => {
	if (!isServer) {
		localStorage.setItem(key, value)
	}
}

export const removeLocalStorage = (key: string) => {
	if (!isServer) {
		localStorage.removeItem(key)
	}
}
