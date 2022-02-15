import { Arguments } from "../argumentHandler";
import { getConfig } from "../settings";
import { textSync, fontsSync } from "figlet"
import { multiIncludes } from "../lib";

export default async function figlet(args:Arguments){
	const cfg = await getConfig()
	const get = multiIncludes(args.flags, "g", "get", "r", "read")
	if(get){
		var fonts = fontsSync()
		var maxPerPage = cfg.elements_per_list_page
		var page = (Number(args.arguments[0]) || 1) - 1
		var offset = page * maxPerPage
		var showable = fonts.slice(offset, maxPerPage+offset)
		console.log(`Listing fonts (page ${page+1}/${Math.ceil(fonts.length / maxPerPage)})`)
		showable.forEach(name=>{
			console.log(name)
		})
		console.log(`\nType "figlet -g ${page+2}" for more.`)
		return
	}
	var font = args.arguments[0]
	var text = args.arguments.slice(1).join(" ")
	console.log(textSync(text, {font:font}))
}