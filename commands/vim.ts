import { Arguments } from "../argumentHandler";
import exec from "../executeCmd";

export default async function vim(args:Arguments){
	await exec("vim "+args.arguments[0], "bash")
}