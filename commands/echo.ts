import { Arguments } from "../argumentHandler";
import { colorize } from "../lib";

export default function echo(args:Arguments, raw:string){
	var out = args.rawArguments
	out = colorize(out)
	console.log(out)
}