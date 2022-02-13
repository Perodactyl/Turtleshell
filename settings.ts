import * as fs from "fs"
export function synchronizeOptions(){
	var df = JSON.parse(fs.readFileSync("default_config.json").toString())
	var cf = JSON.parse(fs.readFileSync("config.json")?.toString() || "{}")
}