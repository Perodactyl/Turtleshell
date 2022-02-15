import { Arguments } from "../argumentHandler"
import { colorize } from "../lib"
import { getConfig } from "../settings"

export default async function exit(args:Arguments, raw){
	const cfg = await getConfig()
	console.log(colorize(`[red]Exit[$reset]ing ${cfg.terminal_name}.`))
	process.stdin.pause()
	process.exitCode = Number(args.arguments[0] || "0")
}