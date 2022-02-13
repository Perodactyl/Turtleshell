import * as chalk from "chalk"
import * as colors from "colors"
import * as figlet from "figlet"
export function colorize(text:string): string{
	var out = text
	var colorsReg = /\[([@!$^]?)(\w+|#[0-9a-fA-F])?\](.*)/g
	var stack = 0
	while(out.match(colorsReg)){
		stack++
		out = out.replace(colorsReg, (substr, ...args)=>{
			try{
				var executor = args[0].includes("@") ? colors[args[1]] : (
					args[0].includes("$") ? chalk[args[1]] : (
						args[0].includes("^") ? figlet.textSync(args[2]) : (
							args[0].includes("!") ? chalk.bgKeyword(args[1]) : chalk.keyword(args[1])
						)
					)
				)
				return executor ? executor(args[2]) : substr
			}catch(e){return substr}
		})
		if(stack == 1024)break
	}
	return out
}