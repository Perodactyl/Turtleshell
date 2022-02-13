import * as fs from "fs/promises"
import { Arguments } from "./argumentHandler"

export default async function loadCommands(){
	var list = await fs.readdir("commands")
	var output:commandList = {}
	for(var file of list){
		var cmdName = file.split(".")[0]
		output[cmdName] = (await import("./commands/"+file.replace(".ts", ".js"))).default
	}
	return output
}
interface commandList{
	[key: string]: (args:Arguments, raw:string) => void
}