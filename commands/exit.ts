import { Arguments } from "../argumentHandler"
import { colorize } from "../lib"

export default async function exit(args:Arguments, raw){
	console.log(colorize("[red]Exit[$reset]ing pprompt."))
	process.stdin.pause()
	process.exitCode = Number(args.arguments[0] || "0")
}