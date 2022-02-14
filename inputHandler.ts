import handleArguments, { Arguments } from "./argumentHandler"
import loadCommands from "./loadcmdlist"
import * as chalk from "chalk"
import { colorize, expectArgs, getCwd, handleHelp } from "./lib"
import { getConfig } from "./settings"
import { readFile, writeFile } from "fs/promises"

const p = process
const cout = p.stdout //cout - console out
const cin = p.stdin //cin - console in
export default async function startListening(){
	var commands = await loadCommands()
	await showWd()
	cin.on("data", async buf=>{
		if(cin["stopListening"]){
			console.log("la la la I can't hear you")
			return
		}
		var str = buf.toString()
		if(!str.trim()){
			await showWd()
			return
		}
		var args = handleArguments(str)
		var cmd = args.command
		var commandExists = Object.keys(commands).includes(args.command)
		if(!commandExists){
			var  aliasesFile = ""
			try{
				aliasesFile = (await readFile("aliases.txt")).toString()
			}catch(e){
				aliasesFile = (await readFile("default_aliases.txt")).toString()
				await writeFile("aliases.txt", aliasesFile)
				console.log("No aliases file found. Cloning default.")
			}
			const aliasesArr = aliasesFile.replace(/\r/g,"").split("\n").map(ln=>ln.split("\t"))
			const aliasesObj = {}
			aliasesArr.forEach(el=>aliasesObj[el[0]] = el[1])
			if(Object.keys(aliasesObj).includes(args.command)){
				cmd = aliasesObj[args.command]
			}else{
				console.log(chalk.red("That command doesn't exist."))
				await showWd()
				return
			}
		}
		var executable = commands[cmd]
		var newArgs:Arguments = {
			...args,
			command:cmd
		}
		if(executable?.hasHelp){
			if(await handleHelp(newArgs)){
				await showWd()
				return
			}
		}
		if(executable?.expectedArgs){
			if(!expectArgs(executable.expectedArgs, newArgs, executable.exactArgs)){
				await showWd()
				return
			}
		}
		await executable(newArgs, str)
		await showWd()
	})
}
async function showWd(){
	var options = await getConfig()
	if(!options.show_wd)return
	cout.write(colorize(options.wd_template.toString().replace("%d", getCwd())))
}