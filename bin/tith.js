#!/usr/bin/env node

var program = require('commander'),
    chalk = require('chalk'),
    updateNotifier = require('update-notifier'),
    fs = require("fs"),
    pkg = require('../package.json'),
    tiappxml = require('tiapp.xml'),
    xpath = require('xpath')

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


    // Select a TiCH
    function tichSelect(name) {
        var regex = /\$tiapp\.(.*)\$/;

        if(name){

            //Update the theme on config.json
            if (name.substring(0, 1) == "_") {
                alloyCfg.global.theme = ""
                console.log(chalk.yellow("\nClearing theme in config.json\n"));
            } else {
                alloyCfg.global.theme = name
                console.log(chalk.yellow('\nUpdated Theme to ') + chalk.cyan(alloyCfg.global.theme) + "\n");
            }

            fs.writeFileSync("./app/config.json", JSON.stringify(alloyCfg, null, 4));

            console.log("Entering TiCh Legacy Mode");

            var cfgfile = program.cfgfile ? program.cfgfile : 'tich.cfg';
            var infile = './tiapp.xml';
            var outfilename = './tiapp.xml';

            // check that all required input paths are good
            [cfgfile, infile].forEach(function (file) {
                if (!fs.existsSync(file)) {
                    console.log(chalk.red('Cannot find ' + file));
                    program.help();
                }
            });

            // read in our config
            var cfg = JSON.parse(fs.readFileSync(cfgfile, "utf-8"));

            // read in the app config
            var tiapp = tiappxml.load(infile);

            // find the config name specified
            cfg.configs.forEach(function(config) {

                if (config.name === name) {
                    console.log('\nFound a config for ' + chalk.cyan(config.name) + '\n');

                    for (var setting in config.settings) {

                        if (!config.settings.hasOwnProperty(setting)) continue;

                        if (setting != "properties" && setting != "raw") {

                            var now = new Date();
                            var replaceWith = config.settings[setting]
                                .replace('$DATE$', now.toLocaleDateString())
                                .replace('$TIME$', now.toLocaleTimeString())
                                .replace('$DATETIME$', now.toLocaleString())
                                .replace('$TIME_EPOCH$', now.getTime().toString());

                            var matches = regex.exec(replaceWith);
                            if (matches && matches[1]) {
                                var propName = matches[1];
                                replaceWith = replaceWith.replace(regex, tiapp[propName]);
                            }

                            tiapp[setting] = replaceWith;

                            console.log('Changing ' + chalk.cyan(setting) + ' to ' + chalk.yellow(replaceWith));
                        }

                    }

                    if (config.settings.properties) {
                        for (var property in config.settings.properties) {

                            if (!config.settings.properties.hasOwnProperty(property)) continue;

                            var replaceWith = config.settings.properties[property]
                                .replace('$DATE$', new Date().toLocaleDateString())
                                .replace('$TIME$', new Date().toLocaleTimeString())
                                .replace('$DATETIME$', new Date().toLocaleString())
                                .replace('$TIME_EPOCH$', new Date().getTime().toString());


                            var matches = regex.exec(replaceWith);
                            if (matches && matches[1]) {
                                var propName = matches[1];
                                replaceWith = replaceWith.replace(regex, tiapp[propName]);
                            }

                            tiapp.setProperty(property, replaceWith);

                            console.log('Changing App property ' + chalk.cyan(property) + ' to ' + chalk.yellow(replaceWith));

                        }
                    }

                    if (config.settings.raw) {

                        var doc = tiapp.doc;
                        var select = xpath.useNamespaces({
                            "ti": "http://ti.appcelerator.org",
                            "android": "http://schemas.android.com/apk/res/android"
                        });
                        for (var path in config.settings.raw) {

                            if (!config.settings.raw.hasOwnProperty(path)) continue;

                            var node = select(path, doc, true);
                            if (!node) {
                                console.log(chalk.yellow('Could not find ' + path + ", skipping"));
                                continue;
                            }

                            var replaceWith = config.settings.raw[path]
                                .replace('$DATE$', new Date().toLocaleDateString())
                                .replace('$TIME$', new Date().toLocaleTimeString())
                                .replace('$DATETIME$', new Date().toLocaleString())
                                .replace('$TIME_EPOCH$', new Date().getTime().toString());


                            var matches = regex.exec(replaceWith);
                            if (matches && matches[1]) {
                                var propName = matches[1];
                                replaceWith = replaceWith.replace(regex, tiapp[propName]);
                            }

                            node.value = replaceWith;

                            console.log('Changing Raw property ' + chalk.cyan(path) + ' to ' + chalk.yellow(replaceWith));

                        }
                    }

                    console.log(chalk.green('\n' + outfilename + ' updated\n'));

                    tiapp.write(outfilename);

                }
            });

        }
    }    

    var alloyCfg = JSON.parse(fs.readFileSync("./app/config.json", "utf-8"));

    // setup CLI
    program
        .version(pkg.version, '-v, --version')
        .usage('[options]')
        .description(pkg.description)
        .option('-s, --set <name> <platform>', 'Updates config.json to use the theme specified by <name> and <platform>')
        .option('--legacy', 'Enables legacy mode and uses TiCh config files')
        .option('-f, --cfgfile <path>', 'Specifies the legacy tich config file to use')

    program.parse(process.argv);

    // check for a new version
    updateNotifier({
        packageName: pkg.name,
        packageVersion: pkg.version
    }).notify();

    if (program.set) {
        if( program.legacy ){
            tichSelect(program.args[0]);
        }
        else{
            set(program.args[0], program.args[1]);
        }

    } else {
        status();
    }

}
