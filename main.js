const electron = require('electron');

const app = electron.app;

const process = require('process');
const fs = require('fs');
const spawn = require('child_process').spawn;
const execSync = require('child_process').execSync;

let openLaunchFile = "";

function appReady() {
    // detect if VASSAL.app is in the current working directory or in /Applications

    if (fs.existsSync('VASSAL.app'))
    {
        process.chdir('VASSAL.app/');
    }
    else if (fs.existsSync('/Applications/VASSAL.app/'))
    {
        process.chdir('/Applications/VASSAL.app/');
    }
    else
    {
        // not found VASSAL.app in an expected location

        app.quit()
        return;
    }
    
    // look for java executable

    var findjava = execSync('which java');
    var command = findjava.toString().trim();

    console.log('Found Java at ' + command);

    // get ready to launch VASSAL

    var args = [
        '-classpath Contents/Resources/Java/Vengine.jar',
        '-Dapple.awt.graphics.UseQuartz=false',
        '-Xdock:name=VASSAL',
        '-Xdock:icon=Contents/Resources/VASSAL.icns',
        'VASSAL.launch.ModuleManager'
    ];
    if (openLaunchFile != "")
    {
        args.push('"' + openLaunchFile + '"');
    }

    console.log('Launch VASSAL');
    
    const child = spawn(command, args, {
        stdio: 'inherit',
        shell: true,
        detached: true
    }).unref();

    // launcher is done, so quit
    
    app.quit();
}

app.on('will-finish-launching', function() {
    app.on('open-file', function(event, filePath){
        event.preventDefault();
        openLaunchFile = filePath;
    });
});

app.on('ready', appReady);
