import { Arguments } from "../argumentHandler"

export default async function exit(args:Arguments, raw){
	process.stdin.pause()
	process.exitCode = Number(args.arguments[0] || "0")
}