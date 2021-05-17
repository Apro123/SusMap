# SusMap

[![Build Status](https://travis-ci.com/Apro123/SusMap.svg?branch=master)](https://travis-ci.com/Apro123/SusMap)

[![forthebadge](https://forthebadge.com/images/badges/made-with-typescript.svg)](https://forthebadge.com)

[![forthebadge](https://forthebadge.com/images/badges/built-by-developers.svg)](https://forthebadge.com)

[![forthebadge](https://forthebadge.com/images/badges/check-it-out.svg)](https://forthebadge.com)

Sustainability Map (or SusMap) is build with Ionic/Angular (Cordova) and is meant to show off the sustainability Features for UC Merced.

  - See all Sustainability features of UC Merced at url()
  - Build your own map using this following the guide [here](#build-your-own-map)
  - :star: this repo if you support this project

# Features! :ok_hand:

  - The Floating Action Button on the top right hold most of the core features of the app
    - When clicked, the right menu shows 4 items
       - Parking spots (Automatically enabled): Shows you icons where parking is allowed. :parking:
       - Building List: Lists all the buildings. When you click on the name you are directed to the location of the building. When you click on the building icon, you are directed to the building page. :office:
       - A Search feature: Searches all of the items and buildings. :mag_right:
       - About: An about section about the school's Sustainable goals ::information_source:
    - When clicked, the bottom menu shows up with the different categories
       - When clicked the group of items associated with the specific filter of items toggle their show/hide status on the map.
       - When held down you can see the list of the filters and can click on any one to see the location of that specific item.
  - Icon/Item: when clicked will give you the title of the item and a short customized description
  - There is a location change button on the bottom left. This changes your lcoation to major areas that may not be together that are still part of the SusMap for the university/school. :school:
  - There is also a bottom right world location button. When clicked on, it shows you your location if you have enabled it. The location will have a circle underneath it, which corresponds to the accuracy of your location. When this button is held you get to view the terms of service, privacy policy, and cookie policy for the app.
  - Icons are also automatically grouped **under certain conditions**
  - The greatest thing about this is that all the data come from an google sheets, which makes it easy for editing information on the app directly for non-developers

    > Creating technology accessible for everyone


### Tech

SusMap uses a number of open source projects to work properly:

* [AngularJS](http://angularjs.org) - HTML enhanced for web apps!
* [Ionic](https://ionicframework.com/) - Cross-Platform Hybrid App Developement
* [NPM](https://www.npmjs.com/) and  [Node.js](https://nodejs.org/) - Used to build the application

### Installation

SusMap tested on [Node.js](https://nodejs.org/) v12.8.3,  [NPM](https://www.npmjs.com/) v6.14.8, and [AngularJS](http://angularjs.org) v8

Install the dependencies and devDependencies and start the server.

```sh
$ git clone https://github.com/Apro123/SusMap.git
$ cd SusMap
$ npm i
$ npm install -g @ionic/cli@6.11.8 cordova@10.0.0
$ ionic integrations enable cordova --quiet
$ ionic cordova platform add browser --no-interactive --confirm
& ionic cordova run browser
```

For production in the www folder...

```sh
$ ionic integrations enable cordova --quiet
$ ionic cordova platform add browser --no-interactive --confirm
$ ionic cordova build browser --prod --release
$ cd ./www
$ ln -s index.html 404.html
$ ln -s favicon.ico apple-touch-icon.png
$ ln -s favicon.ico apple-touch-icon-precomposed.png
$ cd ./..
$ cp platforms/browser/config.xml www/
```

### Plugins

SusMap is currently extended with the following plugins. Instructions on how to use them in your own application are linked below.

| Plugin |
| ------ |
| Leaflet |
| [Cordova Sqlite Storage](https://ionicframework.com/docs/angular/storage) |
|[ Cordova GeoLocation](https://ionicframework.com/docs/native/geolocation) |
| (Optional) [Travis](https://docs.travis-ci.com/) |

### Google Sheets Formatting

SusMap uses google sheets to store and change data on the app
[CURRENT VERSION SAMPLE](https://docs.google.com/spreadsheets/d/12jc_EN3Uh5RHPjjmI-osbys7oHBq9RPSWn71_4zhRSM/edit?usp=sharing)
1. A sheet called "SETTINGS" which has the ZOOM you must specify and the locations for the location button feature.
2. A sheet called "ABOUT" stores the information on the about section of the app
3. The sheet called "FILTERS" stores the name of each of the filter groups that you want to include in the app. Note that the names must be in all CAPS (they are treated as such). The icon names are those from the [Ionicons package](https://ionicons.com/)
4. Each filter item has its own sheet corresponding to the name that you put in "FILTERS". They have their headers which are very specific. The icons here are adapted from various websites and inserted into the src/assets/icon folder as a 48x48 picture.
5. The "BUILDINGS" sheet has a specific header that must be followed. Please refer to the example. The pictures here can be from online, in base64, or the full url such as "/assets/icon/exmaple.png". *The last one not tested!*


### Development

Want to contribute? Great! Submit a Pull request and see if it gets accepted.

### Questions

Either submit a issue or you can email me at akapoor3 @ ucmerced.edu and I would be happy to answer your questions when I have time.
