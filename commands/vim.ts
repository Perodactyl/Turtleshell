import { Arguments } from "../argumentHandler";
import exec from "../executeCmd";

export default async function vim(args:Arguments){
	var { stdout, stdin, stderr } = process
	await exec("vim "+args.arguments[0] || "", "cmd")
	//stdin.setRawMode(false)
}