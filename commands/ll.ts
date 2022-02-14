import { Arguments } from "../argumentHandler";
import { resolve } from "path"
import { getCwd } from "../lib";
import { readdir, stat } from "fs/promises";
import chalk = require("chalk");
import { getConfig } from "../settings";

export default async function ll(args:Arguments){
	const absPath = resolve(args[0] || getCwd())
	const dirConts = await readdir(absPath)
	const cf = getConfig()
	for(var name of dirConts){
		if(name.match(/^\.{1-2}\/?$/))return //.., ., ../, and ./
		var stats = await stat(resolve(absPath, name))
		var colorizer = stats.isDirectory() 
		? chalk.keyword(cf?.dirColor?.toString() || "orange")
		: chalk.keyword(cf?.fileColor?.toString() || "lime")
		console.log(colorizer(name))
	}
}