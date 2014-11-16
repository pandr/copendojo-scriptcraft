/*

This was started from LunaSquee/Minecraft-Server-Console.js

*/


var exec = require('child_process'),
	readline = require('readline'),
    connect = require('connect'),
	ip = require('ip'),
	bodyParser = require('body-parser'),
    port = 2020, // Website port
	dir = __dirname+"/Frontend", // Website directory
	serverdir = __dirname+"/Server", // Minecraft server directory
	scriptpluginsdir = serverdir + "/plugins/scriptcraft/plugins/",
	express = require('express'),
	fs = require('fs'),
	server = null, // Not null if the server is running
	server_process = null, // Server process
	key = "hest", // Security key
	randomkey = false, // Generate a random key on each run
	ramStart = 1024, // -Xms[THIS]M
	ramMax = 1024, // -Xmx[THIS]M
	jarname = "CanaryMod-1.7.10-1.1.3-SNAPSHOT-shaded.jar", // Name of the server jar
	isReloading = false; // True if the server is in the middle of reloading


var app = express();

app.use(bodyParser.json());
app.use(express.static(dir));

app.post("/mods/:key", function (req, res) {
	var filename = scriptpluginsdir+"/testmod.js";
	fs.writeFile(filename, req.body.code, function(err) {
		if(err) {
			console.log(err);
		}
		else {
			console.log("Saved data to " + filename);
		}
	});
	res.send({});
}); 

app.get("/mods/:key", function (req, res) {
	var filename = scriptpluginsdir+"/testmod.js";
	var data = fs.readFileSync(filename, 'utf8');
	res.send({code:data});
});

var io = require('socket.io')(app.listen(port)); // Socket IO

io.on('connection', function (socket) {
	var adress = socket.handshake.address.address;
	socket.emit('connected', true);
	socket.emit('status', server);
	console.log("Client connected from "+adress);
	var thisClientCanDoThings = false
	socket.on('start', function(cmd) {
		if(thisClientCanDoThings){
			if(!server){
				server = "on " + ip.address();
				console.log("Started");
				server_process = exec.spawn(
					"java",
					["-Xms"+ramStart+"M", "-Xmx"+ramMax+"M", "-Djline.terminal=jline.UnsupportedTerminal", "-jar", jarname, "nogui", "nocontrol"],
					{ cwd:serverdir, stdio:'pipe' }
				);
				socket.emit('status', server);
			}
			server_process.stdout.on('data', function(data) {
				socket.emit('console', ""+data);
				console.log(""+data);
			});
			server_process.stderr.on('data', function(data) {
				socket.emit('console', ""+data);
				console.log(""+data);
			});
			server_process.on('exit', function(data) {
				server_process = server = null;
				socket.emit('status', null);
				console.log("Exited");
			});
		}
	});
	socket.on('authenticate', function(pass) {
		if(pass === key){
			thisClientCanDoThings = true;
			socket.emit('permitted');
		} else {
			socket.emit('denied');
		}
	});
	socket.on('listSettings', function() {
		if(thisClientCanDoThings){
			socket.emit('res_listSettings', {ramStart:ramStart,ramMax:ramMax,jar:jarname});
		}
	});
	socket.on('submitSettings', function(settings) {
		if(thisClientCanDoThings){
			ramStart = settings.ramStart;
			ramMax = settings.ramMax;
			jarname = settings.jar;
		}
	});
	socket.on('command', function(cmd) {
		if(thisClientCanDoThings){
			if(server_process){
				socket.emit('console', ""+cmd);
				server_process.stdin.write(cmd+'\r');
			} else {
				socket.emit('console', "Please start the server before entering any commands.");
			}
		}
	});
	socket.on('disconnect', function(cmd) {
		console.log("Client disconnected from "+adress);
	});
	if(server_process){
		server_process.stdout.on('data', function(data) {
			socket.emit('console', ""+data);
		});
		server_process.stderr.on('data', function(data) {
			socket.emit('console', ""+data);
		});
		server_process.on('exit', function(data) {
			server_process = server = null;
			socket.emit('status', null);
		});
	}
});

if(randomkey) {
	var keylist="abcdefghijklmnopqrstuvwxyz123456789"
	var temp=''

	function generatepass(plength){
		temp=''
		for (i=0;i<plength;i++)
		temp+=keylist.charAt(Math.floor(Math.random()*keylist.length))
		return temp
	}
	
	key = generatepass(10);
	console.log("This servers securty key is "+key);
}

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
rl.setPrompt("");

rl.on('line', function (line) {
	
	if (line === '') {
		return;
	}
	if (line.indexOf('quit') === 0) {
		process.exit(0);
		return;
	} else if(line.indexOf('forgotpassword') === 0) {
		console.log("The server key is "+key);
	} else {
		if(server_process){
			server_process.stdin.write(line+'\r');
		}
	}
	rl.prompt(true);
});
