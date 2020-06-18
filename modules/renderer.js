const path = './modules/py/analysis.py' ;
const { spawn } = require('child_process');
exports.analyze = async function analyze(data) {
	
	//console.log(`data: ${JSON.stringify(data)}`);
	const process = spawn('python3', [path, data]);
	let output = '';
	const logOutput = (name) => (data) => {
		console.log(`[${name}] ${data.toString()}`);
		output += `{ "output" : ${data.toString()}}`;
	};
	process.stdout.on('data', logOutput('stdin'));
	process.stderr.on('data',logOutput('stderr'));
	process.on('exit', () => {
		console.log(`output to be parsed: ${output}`);
		output = JSON.parse(output);
		console.log(`results: ${JSON.stringify(output)}`);
		return output;
	});
	
};



