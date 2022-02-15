import * as chalk from "chalk"
import * as fs from "fs"
import { toRight, verboseString } from "./lib"


export function synchronizeOptions(): JSONFile{
	var printedAny = false
	var df:JSONFile = JSON.parse(fs.readFileSync("default_config.json").toString())
	var cf:JSONFile = (fs.existsSync("config.json") ? getJSON("config.json") : {})
	Object.keys(df).forEach(name=>{
		if(!cf.hasOwnProperty(name)){
			cf[name] = df[name]
		}
		if(typeof cf[name] != typeof df[name] && typeof df[name] !== "undefined"){
			printedAny = true
			console.error(chalk.red("Detected config type mismatch. Reverting value to default."))
			console.info(chalk.yellow(`Reverting "${name}" to default.`))
			console.info(chalk.yellowBright(`Type mismatch - Default is "${typeof df[name]}," got "${typeof cf[name]}"`))
			console.info(chalk.keyword("orange")(`Values: Default is "${verboseString(df[name])}," got "${cf[name]}"`))
			cf[name] = df[name]
		}
	})
	if(printedAny){
		console.log(toRight("Errors when loading options"))
		console.log("━".repeat(process.stdout.columns || 50))
	}
	fs.writeFileSync("config.json", JSON.stringify(cf, null, "\t"))
	return cf
}
export function modifyOptions(key:string, value:JSONValue){
	var cf = getConfig()
	try{
		var obj:JSONValue = cf
		var split = key.split(".")
		split.slice(0, -1).forEach(seg=>{ //Every element except the last one.
			obj = obj[seg]
		})
		if(value !== "undefined"){
			obj[split[split.length-1]] = value
		}else{
			delete obj[split[split.length-1]]
		}
		fs.writeFileSync("config.json", JSON.stringify(cf, null, "\t"))
	}catch(e){
		console.error(chalk.red("Failed to get property."))
	}
}
export function getConfig(){
	var cf:JSONFile = (fs.existsSync("config.json") ? getJSON("config.json") : {"_err":true})
	if(cf["_err"]){
		console.error(chalk.red("No config file found. Synchronizing with default config."))
		cf = synchronizeOptions()
	}
	return cf
}
export function resetOptions(){
	fs.rmSync("config.json")
	synchronizeOptions()
}
export function trimOptions(){ //Opposite of syncing, removes values that aren't in defualt_config.json
	var df:JSONFile = JSON.parse(fs.readFileSync("default_config.json").toString())
	var cf:JSONFile = (fs.existsSync("config.json") ? getJSON("config.json") : {})
	Object.keys(cf).forEach(name=>{
		if(!df.hasOwnProperty(name)){
			console.log(chalk.yellow("Remove: ")+chalk.green(name))
			delete cf[name]
		}
	})
	fs.writeFileSync("config.json", JSON.stringify(cf, null, "\t"))
	return cf
}
function getJSON(path:string): JSONFile{
	return JSON.parse(fs.readFileSync(path).toString())
}
export type JSONFile = {
	[key:string]:JSONValue
}
export type JSONValue = any //string | boolean | number | JSONFile | JSONValue[]