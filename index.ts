import inputHandler from "./inputHandler"
import { getConfig, synchronizeOptions } from "./settings"
import { readFileSync } from "fs"
import { colorize, readChalkColor } from "./lib"
import * as figlet from "figlet"

async function main(){
	const config = await getConfig()
	console.clear()
	synchronizeOptions()
	var file = colorize(readFileSync("startupMessage.txt").toString(), true)
	file = file.replace("%ft", (await readChalkColor(config.startup_colors.title_color))(figlet.textSync(config.terminal_name, {
		font:config.title_font
	})))
	console.log(file)
	await inputHandler()
}

main()