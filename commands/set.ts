import { Arguments } from "../argumentHandler";
import { handleHelp, multiIncludes, expectArgs, colorize } from "../lib";
import { JSONValue, modifyOptions, resetOptions, trimOptions } from "../settings";

export default async function set(args:Arguments){
//	const env = multiIncludes(args.flags, "env", "e")
	const reset = multiIncludes(args.flags, "reset", "r", "default", "d")
	const trim = multiIncludes(args.flags, "t", "trim")
	if(!reset && !trim && !expectArgs(2, args, true))return
	if(reset){
		console.log(colorize("[red]Setting all options to default."))
		resetOptions()
		return
	}
	if(trim){
		trimOptions()
		console.log(colorize("[yellow]Trimmed extra values."))
		return
	}
	var val:JSONValue = args.arguments[1]
	if(val == "true" || val == "false"){
		val = (val == "true")
	}
	if(!isNaN(parseFloat(val.toString())))val = Number(val)
	modifyOptions(args.arguments[0], val)
}

export const hasHelp = true
