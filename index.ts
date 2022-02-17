import inputHandler from "./inputHandler"
import { getConfig, synchronizeOptions } from "./settings"
import { readFileSync } from "fs"
import { colorize, readChalkColor, showTitle } from "./lib"
import * as figlet from "figlet"

async function main(){
	console.clear()
	synchronizeOptions()
	await showTitle()
	await inputHandler()
}

main()