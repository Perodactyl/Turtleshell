import { Arguments } from "../argumentHandler";
import { writeFile } from "fs/promises"
import { readAliasFile } from "../lib";

export default async function alias(args:Arguments){
	var file = await readAliasFile(true)
	file[args.arguments[0]] = args.arguments[1]
	var arr = []
	for(var key in file){
		arr.push([key, file[key]])
	}
	var lines = arr.map(ln=>ln.join("\t"))
	var newFile = lines.join("\n")
	console.log(`Successfully mapped command "${args.arguments[0]}" to "${args.arguments[1]}."`)
	await writeFile("aliases.txt", newFile)
	console.log("Alias saved.")
}

export const expectedArgs = 2