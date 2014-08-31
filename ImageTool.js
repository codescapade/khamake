var cp = require('child_process');
var os = require('os');
var path = require('path');
var log = require('./log.js');

module.exports = function (from, to, asset, format) {
	if (format === undefined) format = 'png';
	var exe = "kraffiti-osx";
	if (os.platform() === "linux") {
		exe = "kraffiti-linux";
	}
	else if (os.platform() === "win32") {
		exe = "kraffiti.exe";
	}
	
	var child = cp.spawn(path.join(__dirname, '..', '..', 'Kore', 'Tools', 'kraffiti', exe), ['from=' + from, 'to=' + to, 'format=' + format]);
	
	child.stdout.on('data', function (data) {
		log.info('kraffiti stdout: ' + data);
	});
	
	child.stderr.on('data', function (data) {
		log.error('kraffiti stderr: ' + data);
	});
	
	child.on('error', function (err) {
		log.error('kraffiti error: ' + err);
	});
	
	child.on('close', function (code) {
		if (code !== 0) log.error('kraffiti process exited with code ' + code);
	});
};