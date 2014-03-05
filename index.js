  var watch = require('watch'),
  	fsTools = require('fs-tools'),
  	colors = require('colors');
  	fs = require('fs');

  colors.setTheme({
  	verbose: 'cyan',
  	info: 'green',
  	error: 'red'
  });

  var file = __dirname + '/config.json';
  fs.readFile(file, 'utf8', function(err, data) {
  	if (err) {
  		console.log('Error: ' + err);
  		return;
  	}

  	data = JSON.parse(data);  	
  	startWatch(data.folderToWatch, data.destinationFolder);
  });

  function startWatch(folderToWatch, destinationFolder) {
  	watch.createMonitor(folderToWatch, function(monitor) {
  		console.log(("Watching folder " + folderToWatch + " for changes...").verbose);
  		//monitor.files['/home/mikeal/.zshrc'] // Stat object for my zshrc.
  		monitor.on("created", function(f, stat) {
  			// Handle new files
  			console.log("created");
  		});
  		monitor.on("changed", function(f, curr, prev) {
  			// Handle file changes  	
  			console.log('\u0007');
  			console.log("File change detected: ".verbose + f);
  			copyFile(f);

  		});
  		monitor.on("removed", function(f, stat) {
  			// Handle removed files
  			console.log("removed");
  		});
  	});

  	function copyFile(sourceFile) {
  		var folderToCopy = destinationFolder + sourceFile.substring(folderToWatch.length, sourceFile.length);
  		fsTools.copy(sourceFile, folderToCopy, function(err) {
  			if (err) {
  				console.log('error coping to: '.error + folderToCopy);
  				throw err;
  			}
  			console.log('copied to: '.info + folderToCopy);
  		});
  	};
  };