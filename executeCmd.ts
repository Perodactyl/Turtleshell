import * as cp from "child_process"
import * as stream from "stream"

export default function exec(
	command:string,
	line:CmdLine="cmd",
	stdout?:stream.Writable,
	stderr?:stream.Writable
){ //Run a process with a command line
	var output = stdout || null
	var err =	 stderr || null
	var p = cp.exec(command,{
		"shell":`C:/Windows/System32/${line}.exe`
	})
	if(output)	p.stdout.pipe(output)
	if(err)		p.stderr.pipe(err)
	return {
		output:output,
		err:err,
		process:p
	}
}
type CmdLine = "cmd" | "bash"