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
            console.log(chalk.yellow('\nUpdated Theme to ') + chalk.cyan(alloyCfg.global.theme) + "\n");
            fs.writeFileSync("./app/config.json", JSON.stringify(alloyCfg, null, 4));

            // check if we have an app config
            if (alloyCfg.global.appConfig) {

                var themeNameToUse;

                if (!alloyCfg.global.theme && alloyCfg.global.appConfig["ios"].default) {
                    // no theme defined but a default TiApp.xml defined
                    console.log(chalk.yellow('\nUsing the default tiapp.xml file\n'));

                    themeNameToUse = "default";

                } else if (!alloyCfg.global.appConfig["ios"].default) {
                    return;
                }

                // get the filename of the app config to switch to
                var appConfigFileName = alloyCfg.global.appConfig["ios"][alloyCfg.global.theme];

                console.log(chalk.yellow("Switching tiapp.xml to use " + chalk.cyan(appConfigFileName) + "\n"));

                // get the new file
                var configToSwitchTo = fs.readFileSync("./" + appConfigFileName, "utf-8");

                // write it to tiapp.xml
                fs.writeFileSync("./tiapp.xml", configToSwitchTo);

            }

            console.log(chalk.red("Remember to do ti clean!\n"));
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
