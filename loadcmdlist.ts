import * as fs from "fs/promises"
import { Arguments } from "./argumentHandler"

export default async function loadCommands(){
	var list = await fs.readdir("commands")
	var output:commandList = {}
	for(var file of list){
		if((await fs.stat("commands/"+file)).isDirectory())continue
		var cmdName = file.split(".")[0]
		var i = (await import("./commands/"+file.replace(".ts", ".js")))
		var func = i.default
		if(i.hasOwnProperty("hasHelp")){
			func.hasHelp = i.hasHelp
		}
		if(i.hasOwnProperty("expectedArgs")){
			func.expectedArgs = i.expectedArgs
		}
		if(i.hasOwnProperty("exactArgs")){
			func.exactArgs = i.exactArgs
		}
		output[cmdName] = i.default
	}
	return output
}
interface commandList{
	[key: string]: {
		(args:Arguments, raw:string): void | any
		hasHelp?:boolean
		expectedArgs?:number,
		exactArgs?:boolean
	}
}