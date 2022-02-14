import { Arguments } from "../argumentHandler";
import loadCommands from "../loadcmdlist";
import * as fs from "fs/promises"
import { tabify } from "../lib";

export default async function help(args:Arguments){
	var commands = await loadCommands()
	console.log(tabify("Command", 5)+"Description")
	console.log("-".repeat(40))
	for(var cmd in commands){
		var command = commands[cmd]
		try{
			var file = (await fs.readFile(`commands/help/${cmd}.txt`)).toString()
		}catch(e){var file = ""}
		var important = file.split("\n").filter(ln=>ln.startsWith(">"))
		if(important.length){
			var cmd = important[0].slice(2)
			var desc = important[1].slice(2)
		}else{
			var cmd = command.name
			var desc = "No description."
		}
		var column = `${tabify(cmd, 10)}${desc}`
		console.log(column)
	}
}