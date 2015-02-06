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

// main function
function tith() {

    // status command, shows the current config
    function status() {        
        console.log('\n');
        console.log('Current Alloy theme is: ' + chalk.cyan(alloyCfg.global.theme));
        console.log('\n');
    }

    // select a new config by name
    function select(name) {

        if (name) {
            alloyCfg.global.theme = name
            console.log('\nUpdated Theme to ' + chalk.cyan(alloyCfg.global.theme));
            fs.writeFileSync("./app/config.json", JSON.stringify(alloyCfg, null,4));
        }

    }

    var alloyCfg = JSON.parse(fs.readFileSync("./app/config.json", "utf-8"));

    // setup CLI
    program
        .version(pkg.version, '-v, --version')
        .usage('[options]')
        .description(pkg.description)
        .option('-s, --select <name>', 'Updates config.json to use the theme specified by <name>')

    program.parse(process.argv);

    // check for a new version
    updateNotifier({
        packageName: pkg.name,
        packageVersion: pkg.version
    }).notify();

    if (program.select) {
        select(program.args[0]);
    } else {
        status();
    }

}
