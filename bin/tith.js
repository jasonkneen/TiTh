#!/usr/bin/env node

var program = require('commander'),
    chalk = require('chalk'),
    updateNotifier = require('update-notifier'),
    fs = require("fs"),
    pkg = require('../package.json')

// check if the TiApp.xml an TiCh config file exists
if (!fs.existsSync('./app/config.json')) {
    console.log(chalk.red('Please run in an alloy project folder'));
} else {
    tith();
}

// helper, quick copy
function createTiAppFile(fromPath) {
    fs.createReadStream(fromPath).pipe(fs.createWriteStream("tiapp.xml"));
    console.log(chalk.red("Remember to do ti clean!\n"));
}

// main function
function tith() {

    // status command, shows the current config
    function status() {
        console.log('\n');
        console.log('Current Alloy theme is: ' + chalk.cyan(alloyCfg.global.theme || "not defined"));
        console.log('\n');
    }

    // set a new config by name
    function set(name, platform) {

        platform = platform || "ios";

        if (name) {

            if (name.substring(0, 1) == "_") {
                alloyCfg.global.theme = ""
                console.log(chalk.yellow("\nClearing theme in config.json\n"));
            } else {
                alloyCfg.global.theme = name
                console.log(chalk.yellow('\nUpdated Theme to ') + chalk.cyan(alloyCfg.global.theme) + "\n");
            }

            fs.writeFileSync("./app/config.json", JSON.stringify(alloyCfg, null, 4));

            // check if we have an app config
            if (fs.existsSync("./app/themes/" + name + "/" + platform + "/tiapp.xml")) {

                // if it exists in the themes folder, in a platform subfolder
                console.log(chalk.green('Found a tiapp.xml in the theme platform folder\n'));
                createTiAppFile("./app/themes/" + name + "/" + platform + "/tiapp.xml");

            } else if (fs.existsSync("./app/themes/" + name + "/tiapp.xml")) {

                // if it exists in the top level theme folder
                console.log(chalk.green('Found a tiapp.xml in the theme folder\n'));
                createTiAppFile("./app/themes/" + name + "/tiapp.xml");

            } else {
                console.log(chalk.cyan("No tiapp.xml found for " + name) + "\n");
            }

        }
    }

    var alloyCfg = JSON.parse(fs.readFileSync("./app/config.json", "utf-8"));

    // setup CLI
    program
        .version(pkg.version, '-v, --version')
        .usage('[options]')
        .description(pkg.description)
        .option('-s, --set <name>', 'Updates config.json to use the theme specified by <name>')

    program.parse(process.argv);

    // check for a new version
    updateNotifier({
        packageName: pkg.name,
        packageVersion: pkg.version
    }).notify();

    if (program.set) {
        set(program.args[0], program.args[1]);
    } else {
        status();
    }

}
