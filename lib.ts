import * as fs from "fs/promises"
import * as chalk from "chalk"
import * as colors from "colors"
import * as figlet from "figlet"
import { Arguments } from "./argumentHandler"
import { getConfig, JSONFile, JSONValue } from "./settings"

export function colorize(text:string, vars?:boolean, envAdditions?:Object): string{
	var out = text
	var cfg = getConfig()
	if(vars){
		const varsReg = /\${((?:\w|>)+)}/g
		var env = {
			process:process,
			env:process.env,
			config:cfg,
			...envAdditions
		}
		Object.keys(cfg.env_mask).forEach(key=>{
			env.env[key] = cfg.env_mask[key]
		})
		out = out.replace(varsReg, (substr:string, ...args:string[])=>{
			var value:any = env
			var path = args[0]
			var segments = path.split(">")
			segments.forEach(seg=>{
				value = value[seg]
			})
			return value.toString()
		})
	}
	var colorsReg = /(?<!\\)\[([@!$^~]?)(\w+|#[0-9a-fA-F])?\](.*)/g
	var stack = 0
	while(out.match(colorsReg)){
		stack++
		out = out.replace(colorsReg, (substr:string, ...args:string[])=>{
			if(!cfg.allow_color)return args[2]
			try{
				var executor = args[0].includes("@") ? colors[args[1]] : (
					args[0].includes("$") ? chalk[args[1]] : (
						args[0].includes("^") ? figlet.textSync(args[2]) : (
							args[0].includes("!") ? chalk.bgKeyword(args[1]) : chalk.keyword(args[1])
						)
					)
				)
				var thisOut = executor ? executor(args[2]) : substr
				if(args[0].includes("~")){
					if(executor){
						var sub = args[1].slice(args[1].indexOf(":"), args[1].indexOf("]"))
						console.log(sub)
						executor(sub)
					}else{
						thisOut = substr
					}
				}
				return thisOut
			}catch(e){return substr}
		})
		if(stack == 1024)break
	}
	var escapeReg = /(?<=\\)\[/g
	out = out.replace(escapeReg, "[")
	return out
}

export function multiIncludes(arr:any[]|string, ...terms:string[]): boolean{
	var doesInclude = false
	terms.forEach(term=>{
		doesInclude = doesInclude || arr.includes(term)
	})
	return doesInclude
}

export async function handleHelp(args:Arguments){
	if(multiIncludes(args.flags, "help", "h")){
		var file = (await fs.readFile("commands/help/"+args.command+".txt")).toString()
		var lines = file.split("\n")
		lines.forEach(ln=>{
			if(ln.startsWith(">"))return
			console.log(colorize(ln))
		})
		return true
	}
	return false
}

export function expectArgs(amt:number, args:Arguments, exact?:boolean){
	var match = (args.arguments.length >= amt && !exact) || (args.arguments.length == amt && exact)
	if(!match){
		console.error(`Command "${args.command}" expects ${!exact ? "at least " : ""}${amt} arguments, got ${args.arguments.length}`)
	}
	return match
}

export function verboseString(data:any): string{
	if(typeof data !== "object"){
		return data.toString()
	}else{
		return JSON.stringify(data, null, "\t")
	}
}
export function toRight(text:string): string{
	if(!process.stdout.columns)return text
	return " ".repeat(process.stdout.columns-text.length)+text
}

export function tabify(text:string, tabs:number, character:string=" "): string{
	return text + character.repeat(Math.max(0, tabs*4 - text.length))
}

export function getCwd(): string{
	return process["wd"] || process.cwd()
}

export async function readChalkColor(color:string): Promise<chalk.Chalk|Function>{
	const cfg = await getConfig()
	if(!cfg.allow_color){
		return (text)=>text
	}
	if(color.startsWith("#")){
		return chalk.hex(color)
	}else if(color.match(/^....?\(.+\)/)){
		var match = color.match(/(...)\((\d+),\s*(\d+),\s*(\d+)\)/)
		var type = match[1]
		var r = Number(match[2])
		var g = Number(match[3])
		var b = Number(match[4])
		return chalk[type](r, g, b)
	}else{
		return chalk.keyword(color)
	}
}

export async function recursiveList(data:JSONValue, stack:number, depth:number){
	const cfg = await getConfig()
	if(typeof data === "object"){
		for(var key in data){
			if(typeof data[key] === "object"){
				await log(key, "", depth, cfg)
				await recursiveList(data[key], stack-1, depth+1)
			}else{
				await log(key, data[key], depth, cfg)
			}
		}
	}
}
async function log(key, val, depth, cfg?:JSONFile){
	cfg = cfg || await getConfig()
	var emphasize = false
	try{
		if(!val.toString().trim()){
			key = (await readChalkColor(cfg.tree_colors.obj))(key)
		}else{
			key = (await readChalkColor(cfg.tree_colors.key))(key)
		}
		if(val.toString().trim()){
			if(typeof val === "boolean"){
				emphasize = true
				val = (await readChalkColor(cfg.tree_colors.bool))(val.toString())
			}else if(typeof val === "number"){
				emphasize = true
				val = (await readChalkColor(cfg.tree_colors.num))(val.toString())
			}else if(typeof val === "string"){
				emphasize = true
				val = (await readChalkColor(cfg.tree_colors.str))(`"${val}"`)
			}
		}
		if(emphasize){
			val = chalk[cfg.emphasis_effect?.toString()](val)
		}
	}catch(e){
		if(cfg.debug_mode)console.error(e)
		val = chalk.bold.bgMagenta.grey(val)
	}
	console.log("\t".repeat(depth)+key+":"+val)
}
export function strToPossibleBool(val:string):string | boolean{
	if(val == "true" || val == "false"){
		return (val == "true")
	}
	return val
}

export async function readAliasFile(parse?:false): Promise<string>
export async function readAliasFile(parse:true): Promise<Object>
export async function readAliasFile(parse?:boolean): Promise<string | Object>{
	var aliasesFile
	try{
		aliasesFile = (await fs.readFile("aliases.txt")).toString()
	}catch(e){
		aliasesFile = (await fs.readFile("default_aliases.txt")).toString()
		await fs.writeFile("aliases.txt", aliasesFile)
		console.log("No aliases file found. Cloning default.")
	}
	if(parse){
		const aliasesArr = aliasesFile.replace(/\r/g,"").split("\n").map(ln=>ln.split("\t"))
		const aliasesObj = {}
		aliasesArr.forEach(el=>aliasesObj[el[0]] = el[1])
		return aliasesObj
	}
	return aliasesFile
}
export async function showTitle(firstLine?:boolean){
	const config = await getConfig()
	var file = colorize((await fs.readFile("startupMessage.txt")).toString(), true)
	if(firstLine)file = file.split("\n")[0]
	file = file.replace("%ft", (await readChalkColor(config.startup_colors.title_color))(figlet.textSync(config.terminal_name, {
		font:config.title_font
	})))
	console.log(file)
}