import * as cp from "child_process"
import * as stream from "stream"

export default function exec(
	command:string,
	line:CmdLine="cmd",
	stdout?:stream.Duplex,
	stdin?:stream.Duplex,
	stderr?:stream.Duplex
){ //Run a process with a command line
	var input  = stdin || null
	var output = stdout || null
	var err =	 stderr || null
	var p = cp.execSync(`start /B "" "${command}"`)
	return p.toString()
	// if(input){
	// 	input.pipe(p.stdin)
	// }
	// if(output)	p.stdout.pipe(output)
	// if(err)		p.stderr.pipe(err)
	// process.stdin["stopListening"] = true
	// p.on("exit", (code)=>{
	// 	input.unpipe(p.stdin)
	// 	p.stdout.unpipe(stdout)
	// 	p.stderr.unpipe(stderr)
	// 	process.stdin["stopListening"] = false
	// })
	// return {
	// 	input:input,
	// 	output:output,
	// 	err:err,
	// 	process:p
	// }
}
type CmdLine = "cmd" | "bash"