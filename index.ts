import inputHandler from "./inputHandler"
import { synchronizeOptions } from "./settings"
import { readFileSync } from "fs"
import { colorize } from "./lib"
console.clear()
synchronizeOptions()
console.log(colorize(readFileSync("startupMessage.txt").toString(), true))
inputHandler()