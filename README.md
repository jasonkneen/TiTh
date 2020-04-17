# TiTh

Allows you to switch Alloy themes from the command line and also supports theme based TiApp.xml files.

## Why?

This was an experiement to solve an issue I have with an app (or series of apps) built from a single code base. I first attempted to solve it with [TiCh](https://github.com/jasonkneen/tich) which kind of works, but isn't great when it comes to having Android sections in the Tiapp.xml file.

The only way to resolve that was to have separate TiApp.xml files for each app. So the solution I came up with was have a "throwaway" tiapp.xml file that can get replaced with the correct one for each theme.

## Install [![NPM version](https://badge.fury.io/js/tith.svg)](http://badge.fury.io/js/tith)

As global CLI:

    $ npm install -g tith

## Usage

For detailed usage information use the help option, `-h`
```
$ tith -h
```
or with a specific command
```
$ tith set -h
```

## Actions

This will show the current theme name:
```
$ tith status
```

## Switch themes (Alloy)

```
$ tith set <name> [platform]
```
if you omit a platform (ios or android) it'll default to **ios**.

## Theme-based tiapp.xml

A handy feature is the ability to switch tiapp.xml files with the theme change. This means you can have one code base, use themes for different clients / apps and switch the tiapp.xml file to change the app name, id etc.

The simplest way to use the tiapp.xml theming is to place your tiapp.xml file for each theme in the relevant folder. There's support for a single tiapp.xml file, or files per platform.

Valid paths are (in order they are checked):
<pre>
app/themes/app1/ios/tiapp.xml
app/themes/app1/android/tiapp.xml
app/themes/app1/tiapp.xml
</pre>

## Theme-based DefaultIcon.png

As of version 1.1.2 you can also theme the DefaultIcon.png -- DefaultIcon.png was added in Titanium SDK 5.0.0+ to auto-generate all required App Icons. Unfortunately DefaultIcon.png isn't supported with themes out-of-the-box with Titanium so TiTh now supports this.

Like the tiapp.xml, just drop a DefaultIcon.png in the theme folder OR the platform folder and TiTh will find this and copy to the project root.

Valid paths are (in order they are checked):
<pre>
app/themes/app1/ios/DefaultIcon.png
app/themes/app1/android/DefaultIcon.png
app/themes/app1/DefaultIcon.png
</pre>

## Setting themes

Using the config above, the following will update the theme to **app1** and copy the tiapp.xml file from it's theme folder to the app root.

```
$ tith set app1 ios ;
```

## Clearing themes

To clear the theme, just use

```
$ tith clear;
```

However, if you want to have a default tiapp.xml file when no theme is specified, you can do this by creating a specially named folder in themes folder, prefixed with an underscore. So:

<pre>
app/themes/_default/tiapp.xml
app/themes/_default/ios/tiapp.xml
app/themes/_default/android/tiapp.xml
</pre>

(If a theme folder is prefixed with _ then the theme will be cleared in config.json but the tiapp.xml will still be used).

## Fastlane Option

This module also contains support for building apps with [Fastlane](https://fastlane.tools/). Currently it only supports the copying of Appfiles, but copying application metadata for updating store listings is a planned feature for the future.

To copy Fastlane files use the fastlane option
```
$ tith set -F <theme> <platform>
```
or
```
$ tith set --fastlane <theme> <platform>
```
*Note that the platform parameter is required when using the fastlane option and will not default to ios*

There are a few requirements for setup:
- Your fastlane directory must be located in the root of the project and contain a [Fastfile](https://docs.fastlane.tools/advanced/Appfile/). (A future feature is to add the ability to point to a fastlane directory outside of the project.)
- [Appfiles](https://docs.fastlane.tools/advanced/Appfile/) are theme-specific and platform dependent. The Appfile needs to be located in the theme's `platform/<platform>/fastlane` directory so for example the full path to an Appfile should be `app/themes/<theme>/platform/<platform>/fastlane/Appfile`.
- This step is optional but **highly recommended**. Due to the possible sensitive nature of contents in these Appfiles (emails, passwords, etc.) it would be best if these files were not included in the Titanium build and ending up in your apps. Add 'fastlane' to the Titanium CLI's [ignoreDirs property](https://wiki.appcelerator.org/display/guides2/Titanium+CLI+Options#TitaniumCLIOptions-cli.ignoreDirs). If you are using default config settings, you can do this with `[appc] ti config cli.ignoreDirs "^(\\.svn|_svn|\\.git|\\.hg|\\.?[Cc][Vv][Ss]|\\.bzr|\\$RECYCLE\\.BIN|fastlane)$"`.

If your project is version managed, it is also recommended to add the Appfile located in the fastlane directory to your `.gitignore` since it will only be used as a dummy file to be replaced, much like the root tiapp.xml

## Suggestions, improvements, PRs, welcome!

## License
Copyright 2015 Jason Kneen

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
</pre>
