export type CustomLog = "say" | "nfo" | "ok" | "hey" | "no"

export type CustomLogFunction = (message: string, ...params: any[]) => void

type CustomConsole = {
	[key in NormalizedCustomLog]: (message: string, ...params: any[]) => void
}

type NormalizedCustomLog = "log" | "info" | "ok" | "warn" | "error"

const nodeColors = {
	no: "\x1b[31m", // red
	ok: "\x1b[32m", // green
	hey: "\x1b[33m", // yellow
	nfo: "\x1b[34m", // blue
	say: "\x1b[36m", // cyan
	_bright: "\x1b[1m",
	_reset: "\x1b[0m",
}

const webColors = {
	say: ["#53868B", "#7AC5CD", "#98F5FF"],
	nfo: ["#1565C0", "#42A5F5", "#18FFFF"],
	ok: ["#008B45", "#00CD66", "#00FF7F"],
	hey: ["#8B8B00", "#CDCD00", "#FFFF00"],
	no: ["#8B1A1A", "#CD2626", "#FF3030"],	
}

export const customLog = (
	key: CustomLog,
) => {
	return (
		message: string,
		...params: any[]
	) => {
		var parts = message.split("*")
		var styles = [...Array(parts.length)].map((_, i) => {
			return i % 2 == 0
				? `background: ${webColors[key][0]}; color: ${webColors[key][1]}; font-weight: normal; font-size: 10px; line-height: 10px; padding: 5px 0px`
				: `background: ${webColors[key][0]}; color: ${webColors[key][2]}; font-weight: bold; font-size: 10px; line-height: 10px; padding: 5px 0px`
		})
		
		typeof window == "undefined"
			? console.log(parts.map((p, i) => {
				var color = nodeColors[key]
				var { _bright, _reset } = nodeColors
				return `${i % 2 == 1 ? _bright : ""}${color}${p}${_reset}`
			}).join(""), ...params.map(p => {
				return Array.isArray(p)
					? `Array[${p.length}]`
					: ["string", "number", "boolean"].includes(typeof p)
						? p
						: p.constructor
							? p.constructor.name
							: `${p}`
			}))
			: console.log(...[`%c${parts.join("%c")}`, ...styles], ...params)
	}
}

export const customConsole: CustomConsole = {
	log: customLog("say"),
	info: customLog("nfo"),
	ok: customLog("ok"),
	warn: customLog("hey"),
	error: customLog("no"),
}