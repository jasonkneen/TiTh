# TiTh

Allows you to switch Alloy themes from the command line and also supports theme based TiApp.xml files.

## Why?

This was an experiement to solve an issue I have with an app (or series of apps) built from a single code base. I first attempted to solve it with [TiCh](https://github.com/jasonkneen/tich) which kind of works, but isn't great when it comes to having Android sections in the Tiapp.xml file.

The only way to resolve that was to have separate TiApp.xml files for each app. So the solution I came up with was have a "throwaway" tiapp.xml file that can get replaced with the correct one for each theme.

## Install [![NPM version](https://badge.fury.io/js/tith.svg)](http://badge.fury.io/js/tith)

As global CLI:

    $ npm install -g tith

## Usage

This will show the current theme name:
```
$ tith  
```
##Switch themes (Alloy)
```
$ tith set <name> <platform>
```
(remember to do a ti clean)

if you omit a platform (ios or android) it'll default to **ios**.

##Theme-based tiapp.xml

A handy  feature is the ability to switch tiapp.xml files with the theme change. This means you can have one code base, use themes for different clients / apps and switch the tiapp.xml file to change the app name, id etc. 

The simplest way to use the tiapp.xml theming is to place your tiapp.xml file for each theme in the relevant folder. There's support for a single tiapp.xml file, or files per platform.

Valid paths are (in order they are checked):
<pre>
app/themes/app1/ios/tiapp.xml
app/themes/app1/android/tiapp.xml
app/themes/app1/tiapp.xml
</pre>

##Setting themes

Using the config above, the following will update the theme to **app1** and copy the tiapp.xml file from it's theme folder to the app root. It'll also clean the project.

```
$ tith select app1 ios ; ti clean; 
```

##Clearing themes

To clear the theme, just use 

$ tith clear;

However, if you want to have a default tiapp.xml file when no theme is specified, you can do this by creating a specially named folder in themes folder, prexied with an underscore. So:

<pre>
app/themes/_default/tiapp.xml
app/themes/_default/ios/tiapp.xml
app/themes/_default/android/tiapp.xml
</pre>

(If a theme folder is prefixed with _ then the theme will be cleared in config.json but the tiapp.xml will still be used).

Suggestions, improvements, PRs, welcome!

##License
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

