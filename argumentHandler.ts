export default function handleArguments(args:string | string[]){
	args = typeof args == "string" ? args.trim().split(" ") : args
	var output:Arguments = {
		flags:[],
		command:args.splice(0, 1)[0],
		arguments:[],
		rawArguments:args.join(" ")
	}
	args.forEach(arg=>{
		const flagReg = /^(?:-|--|\/)(\w+)/
		if(arg.match(flagReg)){
			output.flags.push(arg.replace(flagReg, "$1"))
		}else{
			output.arguments.push(arg)
		}
	})
	return output
}
export interface Arguments{
	flags:string[], // -f, --foobar, or /f
	command:string,
	arguments:string[], //Anything that isn't a command or a flag
	rawArguments:string
}