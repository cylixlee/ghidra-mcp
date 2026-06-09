const TIMEOUT = 5000

export class GhidraClient {
	constructor(private baseUrl: string) { }

	async safeGet(endpoint: string, params: Record<string, string | number | undefined> = {}): Promise<string[]> {
		const url = new URL(endpoint, this.baseUrl)
		for (const [key, value] of Object.entries(params)) {
			if (value !== undefined) {
				url.searchParams.set(key, String(value))
			}
		}
		try {
			const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT) })
			if (response.ok) {
				const text = await response.text()
				return text.split("\n")
			}
			return [`Error ${response.status}: ${(await response.text()).trim()}`]
		} catch (e) {
			return [`Request failed: ${String(e)}`]
		}
	}

	async safePost(endpoint: string, data: Record<string, string> | string): Promise<string> {
		const url = new URL(endpoint, this.baseUrl)
		try {
			const body =
				typeof data === "string" ? data : new URLSearchParams(data).toString()
			const response = await fetch(url, {
				method: "POST",
				headers: typeof data === "string" ? {
					"Content-Type": "text/plain; charset=utf-8",
				} : {
					"Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
				},
				body,
				signal: AbortSignal.timeout(TIMEOUT),
			})
			if (response.ok) {
				return (await response.text()).trim()
			}
			return `Error ${response.status}: ${(await response.text()).trim()}`
		} catch (e) {
			return `Request failed: ${String(e)}`
		}
	}
}
