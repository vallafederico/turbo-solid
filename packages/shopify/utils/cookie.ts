export const getCookie = (name: string) => {
	const cookies = document.cookie.split(';')
	const cookie = cookies.find((c) => c.trim().startsWith(`${name}=`))
	if (!cookie) return null
	return JSON.parse(decodeURIComponent(cookie.split('=')[1]))
}

export const setCookie = (name: string, value: any, days = 7) => {
	const date = new Date()
	date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
	const expires = `expires=${date.toUTCString()}`
	document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))};${expires};path=/`
}
