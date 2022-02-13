import handleArguments from "./argumentHandler"
import loadCommands from "./loadcmdlist"
import * as chalk from "chalk"
import { expectArgs, handleHelp } from "./lib"

const p = process
const cout = p.stdout //cout - console out
const cin = p.stdin //cin - console in
export default async function startListening(){
	var commands = await loadCommands()
	cin.on("data", async buf=>{
		var str = buf.toString()
		var args = handleArguments(str)
		var commandExists = Object.keys(commands).includes(args.command)
		if(!commandExists){
			console.log(chalk.red("That command doesn't exist."))
			return
		}
		var executable = commands[args.command]
		if(executable.hasHelp){
			if(await handleHelp(args))return
		}
		if(executable.expectedArgs){
			if(!expectArgs(executable.expectedArgs, args, executable.exactArgs))return
		}
		executable(args, str)
	})
}