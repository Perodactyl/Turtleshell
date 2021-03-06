import { Arguments } from "../argumentHandler";
import { resolve } from "path"
import { getCwd, readChalkColor, tabify } from "../lib";
import { readdir, stat } from "fs/promises";
import { getConfig, JSONFile } from "../settings";

export default async function ll(args:Arguments){
	const absPath = resolve(args[0] || getCwd())
	const cf = getConfig()
	console.log(loadDir(absPath, cf))
}
async function loadDir(absPath:string, cf:JSONFile, depth:number=0){
	const dirConts = await readdir(absPath)
	var out = ""
	for(var name of dirConts){
		//		if(name.match(/^\.{1-2}\/?$/))return //.., ., ../, and ./
		var stats = await stat(resolve(absPath, name))
		var colorizer = stats.isDirectory() 
		? await readChalkColor(cf?.dirColor?.toString() || "orange")
		: await readChalkColor(cf?.fileColor?.toString() || "lime")
		var colorized = colorizer(name)
		if(!cf.allow_color && stats.isDirectory()){
			colorized = tabify(colorized, 10, "_")+"<DIR>"
		}
		out += "\t".repeat(depth)+colorized+"\n"
	}
	return out
}