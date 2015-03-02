# TiTh

Allows you to switch Alloy themes from the command line and supports switching TiApp.xml files for multiple apps.

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
$ tith select <name> <platform>
```
(remember to do a ti clean)

if you omit a platform it'll default to ios.

##Switch TiApp.xml files

A nice feature is the ability to switch tiapp.xml files with the theme change. This means you can have one code base, use themes for different clients / apps and switch the tiapp.xml file to change the app name, id etc. 

So, make sure you config.json looks like this:

```JSON
{
    "global": {
        "appConfig": {            
            "ios": {
                "default": "tiapp_default.xml",
                "app2": "tiapp_app2.xml",
                "app3": "tiapp_app3.xml"
            },
            "android": {
                "default": "tiapp_default.xml",
                "app2": "tiapp_app2.xml",
                "app3": "tiapp_app3.xml"
            }
        },
        "theme": "app2"
    },
    "env:development": {},
    "env:test": {},
    "env:production": {},
    "os:android": {},
    "os:blackberry": {},
    "os:ios": {},
    "os:mobileweb": {},
    "dependencies": {}
}
```

The key things here are the "theme" reference and the "appConfig" section. In my example, the appIds for the apps I'm building are different (legacy thing), so I need a need a different tiapp.xml for each app *and* platform. (in the example above I use the same one for iOS and Android but they can be different).

My workaround is to have the default tiapp.xml (where no theme is specified) copied to **tiapp_default.xml**, I then create variations of this as **tiapp_app1.xml** etc *and* I set git to ignore the tiapp.xml file I don't get crazy commits going on.

The result of all this is I just need to do the following to build an app (I use TiNy to build so the syntax her might not look familar):

```
$ tith select app2 ios ; ti clean; ti build ios --tall --liveview
```

This will switch theme, clean the project, and build it. Add some interesting sound effects with:-

 ```
$ tith select app2 android ; say "theme updated"; ti clean; say "I'm feeling as fresh as a daisy" ; ti ios --tall --liveview; say "I'm done"
```

:)

<pre>
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

