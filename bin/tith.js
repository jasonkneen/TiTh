#!/usr/bin/env node
var path = require('path');

var program = require('commander'),
    chalk = require('chalk'),
    updateNotifier = require('update-notifier'),
    fs = require("fs"),
    pkg = require('../package.json'),
    exec = require('child_process').exec;


// check if the TiApp.xml an TiCh config file exists
if (!fs.existsSync('./app/config.json')) {
    console.log(chalk.red('Please run in an alloy project folder'));
} else {
    tith();
}

// helper, quick copy
function createTiAppFile(fromPath) {
    fs.createReadStream(fromPath).pipe(fs.createWriteStream("tiapp.xml"));
    exec("ti clean", function (err, stdout, stderr) {
        if (err) {
            console.log(chalk.red('Ti Clean command failed'));
        } else {
            console.log(chalk.green(stdout));
            console.log(chalk.green('Project cleaned and ready to build'));
        }
    });
}

function copyFile(fromPath, toPath) {
    fs.readFile(fromPath, function (err, data) {
        fs.writeFile(toPath, data, (err) => {
          if(err) throw err;
        });
    });
}

// main function
function tith() {

    // status command, shows the current config
    function status(cmd) {
        console.log('\n');
        console.log('Current Alloy theme is: ' + chalk.cyan(alloyCfg.global.theme || "not defined"));
        console.log('\n');
    }

    // clear command, clears the current theme in config
    function clear(cmd) {
      alloyCfg.global.theme = "";
      console.log(chalk.yellow("\nClearing theme in config.json\n"));
    }

    // set a new config by name
    function set(name, platform, cmd) {

        if (cmd.fastlane) {
          //Require a platform when specifying fastlane option due to differences in metadata
          if (!platform) {
            console.log(chalk.red("\nSpecifying a platform is required with the Fastlane option! Copying of Fastlane files will be skipped."));
            cmd.fastlane = undefined;
          }
        } else {
          platform = platform || "ios";
        }

        if (name) {

            if (typeof name != "string" ) {
                clear();
                cmd = name;
            } else if (name.substring(0, 1) == "_") {
                clear();
            } else {
                alloyCfg.global.theme = name;
                console.log(chalk.green('\nUpdated Theme to ') + chalk.cyan(alloyCfg.global.theme) + "\n");
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

            var externalIcons = ["DefaultIcon", "DefaultIcon-ios", "iTunesConnect", "MarketplaceArtwork"];
            var iconName = '';
            for (var i = 0; i < externalIcons.length; i++) {
                iconName = externalIcons[i];
                // check if we havea DefaultIcon.png
                if (fs.existsSync("./app/themes/" + name + "/" + platform + "/" + iconName + ".png")) {
                    // if it exists in the themes folder, in a platform subfolder
                    console.log(chalk.green('Found a ' + iconName + '.png in the theme platform folder\n'));
                    copyFile("./app/themes/" + name + "/" + platform + "/" + iconName + ".png", "./" + iconName + ".png");
                } else if (fs.existsSync("./app/themes/" + name + "/" + iconName + ".png")) {
                    // if it exists in the top level theme folder
                    console.log(chalk.green('Found a ' + iconName + '.png in the theme folder\n'));
                    copyFile("./app/themes/" + name + "/" + "/" + iconName + ".png", "./" + iconName + ".png");
                } else {
                    console.log(chalk.yellow(iconName + '.png does not exist for this theme.\n'));
                }
            }

            // if it exists in the themes folder, in a platform subfolder
            console.log(chalk.green('Found a DefaultIcon.png in the theme platform folder\n'));
            copyFile("./app/themes/" + name + "/" + platform + "/DefaultIcon.png", "./DefaultIcon.png");

            //TODO: Allow user to set a filePath to their fastlane directory located outside of project.

            // check if a Fastfile exists in the fastlane directory of the root of project
            if (fs.existsSync("./fastlane/Fastfile")) {

              if (cmd.fastlane) {

                //Check for and log which files exist

                // Check for Appfile
                if (fs.existsSync("./app/themes/" + name + "/platform/" + platform + "/fastlane/Appfile")) {

                  console.log(chalk.green("Found an Appfile inside the theme's fastlane folder.\n"));
                  copyFile("./app/themes/" + name + "/platform/" + platform + "/fastlane/Appfile", "./fastlane/Appfile");

                } else {
                    console.log(chalk.yellow("An Appfile does not exist for this theme.\n"));
                }

                /* TODO: Copy over Android's metadata folder
                // Copy over metadata files
                if(platform == "android"){

                }
                */

              } else {
                // Prompt availability of option
                console.log(chalk.yellow("\nA Fastfile exists in your project. Fastlane files can also be copied over from your theme with the --fastlane or -F option."));
              }

            } else {

              // Fastlane? TRUE
              if (cmd.fastlane) {

                // Prompt
                console.log(chalk.yellow("\nYou specified the fastlane option, but no Fastfile can be found in the fastlane directory of your project."));

              }
            }

            function ncp(source, dest, options, callback) {
                var cback = callback;

                // if it exists in the top level theme folder
                console.log(chalk.green('Found a DefaultIcon.png in the theme folder\n'));
                copyFile("./app/themes/" + name + "/" + "/DefaultIcon.png", "./DefaultIcon.png");

                var basePath = process.cwd(),
                        currentPath = path.resolve(basePath, source),
                        targetPath = path.resolve(basePath, dest),
                        filter = options.filter,
                        rename = options.rename,
                        transform = options.transform,
                        clobber = options.clobber !== false,
                        modified = options.modified,
                        dereference = options.dereference,
                        errs = null,
                        started = 0,
                        finished = 0,
                        running = 0,
                        limit = options.limit || 30;

                limit = (limit < 1) ? 1 : (limit > 512) ? 512 : limit;

                startCopy(currentPath);

                function startCopy(source) {
                    started++;
                    if (filter) {
                        if (filter instanceof RegExp) {
                            if (!filter.test(source)) {
                                return cb(true);
                            }
                        } else if (typeof filter === 'function') {
                            if (!filter(source)) {
                                return cb(true);
                            }
                        }
                    }
                    return getStats(source);
                }

                function getStats(source) {
                    var stat = dereference ? fs.stat : fs.lstat;
                    if (running >= limit) {
                        return setImmediate(function () {
                            getStats(source);
                        });
                    }
                    running++;
                    stat(source, function (err, stats) {
                        var item = {};
                        if (err) {
                            return onError(err);
                        }

                        // We need to get the mode from the stats object and preserve it.
                        item.name = source;
                        item.mode = stats.mode;
                        item.mtime = stats.mtime; //modified time
                        item.atime = stats.atime; //access time

                        if (stats.isDirectory()) {
                            return onDir(item);
                        } else if (stats.isFile()) {
                            return onFile(item);
                        } else if (stats.isSymbolicLink()) {
                            // Symlinks don't really need to know about the mode.
                            return onLink(source);
                        }
                    });
                }

                function onFile(file) {
                    var target = file.name.replace(currentPath, targetPath);
                    if (rename) {
                        target = rename(target);
                    }
                    isWritable(target, function (writable) {
                        if (writable) {
                            return copyFile(file, target);
                        }
                        if (clobber) {
                            rmFile(target, function () {
                                copyFile(file, target);
                            });
                        }
                        if (modified) {
                            var stat = dereference ? fs.stat : fs.lstat;
                            stat(target, function (err, stats) {
                                //if souce modified time greater to target modified time copy file
                                if (file.mtime.getTime() > stats.mtime.getTime())
                                    copyFile(file, target);
                                else
                                    return cb();
                            });
                        } else {
                            return cb();
                        }
                    });
                }

                function copyFile(file, target) {
                    var readStream = fs.createReadStream(file.name),
                            writeStream = fs.createWriteStream(target, {mode: file.mode});

                    readStream.on('error', onError);
                    writeStream.on('error', onError);

                    if (transform) {
                        transform(readStream, writeStream, file);
                    } else {
                        writeStream.on('open', function () {
                            readStream.pipe(writeStream);
                        });
                    }
                    writeStream.once('finish', function () {
                        if (modified) {
                            //target file modified date sync.
                            fs.utimesSync(target, file.atime, file.mtime);
                            cb();
                        } else
                            cb();
                    });
                }

                function rmFile(file, done) {
                    fs.unlink(file, function (err) {
                        if (err) {
                            return onError(err);
                        }
                        return done();
                    });
                }

                function onDir(dir) {
                    var target = dir.name.replace(currentPath, targetPath);
                    isWritable(target, function (writable) {
                        if (writable) {
                            return mkDir(dir, target);
                        }
                        copyDir(dir.name);
                    });
                }

                function mkDir(dir, target) {
                    fs.mkdir(target, dir.mode, function (err) {
                        if (err) {
                            return onError(err);
                        }
                        copyDir(dir.name);
                    });
                }

                function copyDir(dir) {
                    fs.readdir(dir, function (err, items) {
                        if (err) {
                            return onError(err);
                        }
                        items.forEach(function (item) {
                            startCopy(path.join(dir, item));
                        });
                        return cb();
                    });
                }

                function onLink(link) {
                    var target = link.replace(currentPath, targetPath);
                    fs.readlink(link, function (err, resolvedPath) {
                        if (err) {
                            return onError(err);
                        }
                        checkLink(resolvedPath, target);
                    });
                }

                function checkLink(resolvedPath, target) {
                    if (dereference) {
                        resolvedPath = path.resolve(basePath, resolvedPath);
                    }
                    isWritable(target, function (writable) {
                        if (writable) {
                            return makeLink(resolvedPath, target);
                        }
                        fs.readlink(target, function (err, targetDest) {
                            if (err) {
                                return onError(err);
                            }
                            if (dereference) {
                                targetDest = path.resolve(basePath, targetDest);
                            }
                            if (targetDest === resolvedPath) {
                                return cb();
                            }
                            return rmFile(target, function () {
                                makeLink(resolvedPath, target);
                            });
                        });
                    });
                }

                function makeLink(linkPath, target) {
                    fs.symlink(linkPath, target, function (err) {
                        if (err) {
                            return onError(err);
                        }
                        return cb();
                    });
                }

                function isWritable(path, done) {
                    fs.lstat(path, function (err) {
                        if (err) {
                            if (err.code === 'ENOENT')
                                return done(true);
                            return done(false);
                        }
                        return done(false);
                    });
                }

                function onError(err) {
                    if (options.stopOnError) {
                        return cback(err);
                    } else if (!errs && options.errs) {
                        errs = fs.createWriteStream(options.errs);
                    } else if (!errs) {
                        errs = [];
                    }
                    if (typeof errs.write === 'undefined') {
                        errs.push(err);
                    } else {
                        errs.write(err.stack + '\n\n');
                    }
                    return cb();
                }

                function cb(skipped) {
                    if (!skipped)
                        running--;
                    finished++;
                    if ((started === finished) && (running === 0)) {
                        if (cback !== undefined) {
                            return errs ? cback(errs) : cback(null);
                        }
                    }
                }
            }

        }
    }
    var alloyCfg = JSON.parse(fs.readFileSync("./app/config.json", "utf-8"));
    // setup CLI
    program
        .version(pkg.version, '-v, --version')
        .description(pkg.description);

    program
      .command('status')
      .description("Shows the current configured theme")
      .action(status);

    program
      .command('set <theme> [platform]')
      .description('Updates config.json to use the theme specified by name and platform')
      .option('-F, --fastlane', 'Also copies a theme\'s fastlane files, platform parameter is required with this option.')
      .action(set);

    program
      .command('clear')
      .description("Clears the configured theme")
      .action(set);

    program
      .command('*')
      .description("Any unhandled command will default to status")
      .action(status);

    program.parse(process.argv);

    // check for a new version
    updateNotifier({
        packageName: pkg.name,
        packageVersion: pkg.version
    }).notify();
}
