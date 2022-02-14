import { Arguments } from "../argumentHandler";
import * as path from "path"

export default function cd(args:Arguments){
	var newPath = args.arguments[0]
	newPath = path.resolve(newPath)
	process["wd"] = newPath
}

export const exactArgs = true
export const expectedArgs = 1