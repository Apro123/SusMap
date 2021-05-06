import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { ToastController, Platform, LoadingController, ModalController, IonFab } from '@ionic/angular';
import { GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  MarkerOptions,
  MarkerCluster,
  MarkerClusterOptions,
  GoogleMapsAnimation,
  MyLocation,
  ILatLng,
  LatLngBounds,
  PolygonOptions,
  Polygon,
  Poly,
  HtmlInfoWindow,
  VisibleRegion,
  MarkerIcon } from '@ionic-native/google-maps';
// import { mapStyle } from './mapStyle';
import { EventService } from './../events/event.service';
import { AppDataService } from './../services/app-data.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { OverlayEventDetail } from '@ionic/core';
import { BuildingModalPage } from './../building-modal/building-modal.page';
import { FilterModalPage } from './../filter-modal/filter-modal.page';
import { BuildingListModalPage } from './../building-list-modal/building-list-modal.page';
import { AboutPage } from './../about/about.page';
import { TosPpPage } from './../tos-pp/tos-pp.page';
// import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import * as $ from 'jquery'; //used for leaflet bug
import * as Leaflet from 'leaflet';
import 'leaflet.markercluster';
import { createGesture, Gesture } from '@ionic/core';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

    public htmlInfoWindow;
    public buildings = [];
    public filters = [];
    // example json
    //   {
    //     Name: 'Economic',
    //     active: false,
    //     data: [{ all the filter data }],
    //     cluster: [Leaflet marker cluster group objects (clusters+markers)]
    //     clusteredata: [{ clustered filter data }]
    //   },
    // ];

    //parking cluster feature
    public parkingMarkerCluster; //type leaflet marker cluster group
    public parkingMarkerFlag = true;
    // private parkingMarkerOpts = [];
    // private parkingMarkerClusterOpts: MarkerClusterOptions;

    //map
    // public map: GoogleMap;
    public map: Leaflet.Map;

    //main toast variable
    private toast;

    //toast and loading
    public loading; //loading controller
    private toastFlagFilter = false;
    private toastFlagLocation = false;
    // private dataFlag = false; //used in couplation of loading controller and loading data

    //search functionality
    public search = false; //searching right now for items

    private toSearch = []; //for search functionality
    public itemAvailable = false; //for search functionality
    public filteredItems = []; //for search functionality

    //press and hold functionality
    public pressFlag = false; //press and hold for filter items
    // @ViewChild('paragraph') p: ElementRef;

    //settings and about page
    private about = {};
    private settings = {};
    // example json
    // settings = {
    //   "LOCATIONS": [[37, -123], [37, -120], ...],
    //   "ZOOM": 14,
    //   "MIN_ZOOM" : 12
    //   "MAX_ZOOM": 20
    // }

    //location feature
    public locationNumber = 1; //current location

    //my location feature
    public mylocationEnabled = false;
    private watch;
    public mylocationMarker;
    public mylocationCircle;
    private mylocationFlag = false;
    private geoOptions = {
      maximumAge: 4000,
      timeout: 5000,
      enableHighAccuracy: true
    }
    private pressUpLocation = false;
    private myLocationButtonClicked = false;

    constructor(
      public toastCtrl: ToastController,
      private platform: Platform,
      private events: EventService,
      private appData: AppDataService,
      private router: Router,
      private zone: NgZone,
      public loadingController: LoadingController,
      private modalController: ModalController,
      private geolocation: Geolocation
    ) {
      // const gesture: Gesture = createGesture({
      //   el: document.getElementsByClassName("paragraph")[0],
      //   threshold: 15,
      //   gestureName: 'press',
      //   onMove: ev => this.test(ev),
      //   onEnd: ev => this.test(ev)
      // });
      // gesture.enable();
      // console.log("in constructor");
      //check if new to the map
      this.appData.getTOSPP().then((val) => {
        if(val === false) {
          this.openTosPPModal(true); //build the map after tos accepted
        } else {
          this.buildMap();
        }
      });
    }

    //when view will enter, close everything. Just to handle any extra bugs that might be present in the UI
    ionViewWillEnter() {
      try {
        this.closeEverything();
      } catch (error) {
      }
    }

    // async ngOnInit() {
    //   console.log("inside ngoninit");
    // }

    /////////////////////////////// MAIN MAP INITIALIZATION METHODS

    //main beginning method to build the map and all the marker/markerclusters
    async buildMap() {
      //empty everything just in case
      this.buildings = []
      this.filters = [];

      //loading controller object created in case data fetch takes a long time
      this.loading = await this.loadingController.create({
        spinner: "bubbles",
        duration: 500*this.filters.length,
        message: "Fetching Data...",
        translucent: true,
        backdropDismiss: false
      });

      // this.loading.present().then(() => {
      //   this.loading.onWillDismiss().then(() => {
      //   });
      // });
      await this.loading.present();

      var pArr = [];
      pArr.push(this.appData.getOneLineData("SETTINGS"));
      pArr.push(this.appData.getBuildingFilterNames(true, "home"));
      pArr.push(this.appData.getOneLineData("ABOUT"));

      //for join the promises in order to execute them together for performance reasons
      forkJoin(pArr).subscribe(async (data) => {
        //parse the basic map settings
        this.parseSettings(data[0]).then(() => {
          //need to wait for the map to load, then you can start parsing buildings and filters
          this.parseBuildingFilterNames(data[1]); //for load map
        });
        //parse the about page. (not critical)
        this.parseAbout(data[2]);
      });

      // Since ngOnInit() is executed before `deviceready` event,
      // you have to wait the event.
      this.platform.ready().then(() => {
        // this.htmlInfoWindow = new HtmlInfoWindow();
      });

      //lowest priority (not critical)
      this.setToastFlags();
    }

    //setting of the map
    async parseSettings(data) {
      return await new Promise<any>((resolve, reject) => {
        try {
          this.settings = data;
          var locs: Leaflet.latLng[] = [];
          for (let i = 1; i <= parseInt(this.settings["LOCATIONS"]); i++) {
            var temp = Leaflet.latLng({
              lat: parseFloat(this.settings["LATITUDE " + i]),
              lng: parseFloat(this.settings["LONGITUDE " + i])
            })
            locs.push(temp);;
            delete this.settings["LATITUDE " + i];
            delete this.settings["LONGITUDE " + i];
          }
          this.settings["LOCATIONS"] = locs;
          this.settings["ZOOM"] = parseFloat(this.settings["ZOOM"]);
          this.settings["MIN_ZOOM"] = parseFloat(this.settings["MIN_ZOOM"]);
          this.settings["MAX_ZOOM"] = parseFloat(this.settings["MAX_ZOOM"]);
          //reached example json format
          resolve();
        } catch (e) {
          //there is some error
          console.log(e);
          reject();
        }
      });
    }

    parseBuildingFilterNames(data) {
      this.buildings = data[0]; //all the building data
      this.filters = data[1]; //just the names of the filters

      //load the map
      this.loadMap();

      //close everything when map is clicked
      this.map.on("click", this.closeEverything);

      //below is only possible with the data recieved

      // add the buildings
      this.addBuildings();

      //get the filter data whenever
      this.appData.getAllFilterData(true).then((data: []) => {
        this.implementFilterData(data);
      });


    }

    parseAbout(val) {
      this.about = val;
      var tempT = [];
      var tempD = [];
      for (let i = 1; i <= this.about["NUM_GOALS"]; i++) {
        tempT.push(this.about["GOAL TITLE " + i]);
        tempD.push(this.about["GOAL DESCRIPTION " + i]);
      }

      var img;
      if(this.about["IMAGE"]) {
        if(this.about["IMAGE"].slice(0,3) == "data" || this.about["IMAGE"].slice(0,3) == "http" || this.about["IMAGE"].includes('www') || this.about["IMAGE"].includes('.edu')) {
          //do nothing base64 data or external link
        } else {
          //image stored in images folder
          this.about["IMAGE"] = './assets/images/' + this.about["IMAGE"];
        }
      } else {
        //if it does not exist
        this.about["IMAGE"] = "./assets/images/campus.jpg";
      }

      this.about["GOAL TITLES"] = tempT;
      this.about["GOAL DESCRIPTIONS"] = tempD;
      // console.log(this.about);
    }

    //load the actual map instance
    loadMap() {
      //leaflet map setup
      this.map = Leaflet.map('map_canvas',  {zoomControl: false }); //removes top left zoom control

      // set the center with zoom = min zoom plus one
      var center = this.settings["LOCATIONS"][0]; //the first one is the center
      this.map.setView(this.settings["LOCATIONS"][0], this.settings["ZOOM"]);
      // set the minimum zoon
      this.map.setMinZoom(this.settings["MIN_ZOOM"]);
      // set the max zoom
      // this.map.setMaxZoom(this.settings["MAX_ZOOM"]); //disabled for clustering functionality

      /////// following is for leaflet bug of tiles not showing until resize
      this.map.on("load", function() {
        setTimeout(() => {
          this.invalidateSize();
        }, 100);
      });
      $(document).ready(function(){
        $(window).trigger('resize');
        window.dispatchEvent(new Event('resize'));
        var resizeEvent = window.document.createEvent('UIEvents');
        resizeEvent.initEvent('resize', true, false);
        window.dispatchEvent(resizeEvent);
        // comp.init();
      });
      ///////////////////

      // put the zoom controls on the bottom right
      Leaflet.control.zoom({
        position:'bottomright'
      }).addTo(this.map);

      // add the basemap
      Leaflet.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '© Carto Basemaps',
      }).addTo(this.map);
    }

    /////////////////////////////// END MAIN MAP INITIALIZATION METHODS


    /////////////////////////////// BEGIN POLYGON & MARKER & MARKER CLUSTER CREATION METHODS

    //function to call when filter data recived
    implementFilterData(data) {
      this.filters = data; //similar to examplejson without the parsed data yet

      //promise array with fork join for performance reasons
      var promArr = [];
      for (let i = 0; i < this.filters.length; i++) {
        promArr.push(this.createFilterMarkers(this.filters[i]));
      }

      forkJoin(promArr).subscribe((data: []) => {
        //following must be included after the filters
        for (let i = 0; i < this.filters.length; i++) {
          //added in order to call outside functions and variables since leaflet overrides "this" in callback functions
          const outsideThis = this;
          //triggered by trigger function in changes status method
          this.map.addEventListener(this.filters[i]['FILTER_NAME'], function(data) {
            if(!outsideThis.toastFlagFilter) {
              outsideThis.createToast("TIP", "Hold the filter icon to see a list of all filters", "light");
              outsideThis.toastFlagFilter = true;
            }
            // console.log(data)
            // console.log(outsideThis.filters)
            // console.log(outsideThis.pressFlag)
            // console.log(outsideThis)
            outsideThis.toggleClusterMarker(outsideThis.filters[i]);
          });
        }

        //dismiss the loading container
        this.loading.dismiss();
        console.log("added all markers and listeners");
        console.log(this.filters);
      });

      //subscribe to any filter clicks
      // // updated event filters active status
      // for (let i = 0; i < this.filters.length; i++) {
      //
      //   //make filter active/not active
      //   await this.events.subscribe(this.filters[i]['FILTER_NAME'], (data: any) => {
      //     // update active status
      //     this.filters[i]['ACTIVE'] = data['ACTIVE'];
      //
      //     //first check if data has come in
      //     // if(!this.dataFlag) {
      //     //   console.log("U GOTTA WAIT");
      //     //   this.loading.present().then(() => {
      //     //     this.loading.onWillDismiss().then(() => {
      //     //
      //     //       this.changeStatus(this.filters[i]['FILTER_NAME']);
      //     //
      //     //     });
      //     //   });
      //     // } else {
      //       // if(!this.filters[i]['DATA'][0]['MARKER']) {
      //       //   console.log("NO MARKER....AHH SHIT");
      //       // }
      //       //if it has then update the visible status
      //       this.changeStatus(this.filters[i]['FILTER_NAME']);
      //     // }
      //
      //   });
      // }
    }

    async addIconToBuilding(iconUrl:string, buildingID) {
      const ind = this.buildings.findIndex(building => building['BUILDING_ID'] === buildingID);
      this.buildings[ind]["ICONS"].push(iconUrl);
    }

    // async createHtmlInfoWindow(marker: Marker) {
    //   this.closeEverything();
    //   let frame: HTMLElement = document.createElement('div');
    //
    //   frame.innerHTML = `
    //   <div class="markerInfoWindow">
    //     <h5>` + marker.get('TITLE') + `</h5>
    //     <p><small>` + marker.get('DESCRIPTION') + `<small></p>
    //   </div>
    //   `;
    //
    //   this.htmlInfoWindow.setContent(frame, {
    //     "text-align": 'center',
    //     "min-height": "20vh",
    //     // "max-height": "40vh",
    //     "min-width": "45vw",
    //     // "max-width": "65vw",
    //     "padding": "0px",
    //     "margin": "-1vw", //offset
    //   });
    //
    //   this.htmlInfoWindow.open(marker);
    // }

    createPopupHTML(title, desc, iconURL) {
      // min-height: 20vh; min-width: 45vw;
      return `<div class="markerInfoWindow" style="text-align: center; padding: 0px; margin: -1vw ">
        <h5>` + title + `</h5>
        <p>` + desc + `</p>
        <small style="visibility: hidden;">`+iconURL+`</small>
      </div>`;
    }

    async toggleClusterMarker(filt) {
      //flip active status:
      filt['ACTIVE'] = !filt['ACTIVE'];

      for (var i = 0; i < filt['CLUSTER'].length; i++) {
        //need to add the layers of all the marker cluster groups
        if(filt['ACTIVE']) {
          //if the map is already on the map then dont add the layer. This happens when user searches for item
          if(!this.map.hasLayer(filt['CLUSTER'][i])) {
            this.map.addLayer(filt['CLUSTER'][i]);
          }
        } else { //remove all the layers if possible
          //if the map has the layer then remove the layer
          if(this.map.hasLayer(filt['CLUSTER'][i])) {
            this.map.removeLayer(filt['CLUSTER'][i]);
          }
        }

      }



      // if(create) {
      //   if(!markerDataIndv['MARKER_CLUSTER']) {
      //     markerDataIndv['MARKER_CLUSTER'] = this.map.addMarkerClusterSync(markerDataIndv['MARKER_CLUSTER_OPTIONS']);
      //
      //     markerDataIndv['MARKER_CLUSTER'].on(GoogleMapsEvent.MARKER_CLICK).subscribe((params) => {
      //       let marker: Marker = params[1];
      //       this.createHtmlInfoWindow(marker);
      //     });
      //   }
      // } else {
      //   //otherwise remove the cluster
      //   markerDataIndv['MARKER_CLUSTER'].remove();
      //   delete markerDataIndv['MARKER_CLUSTER'];
      // }
    }

    // async createClusterMarkerOptions(markerDataIndv) {
    //   let markerClusterDataOpt: MarkerClusterOptions;
    //   // console.log(markerDataIndv['ICON']);
    //   markerClusterDataOpt = {
    //     markers: markerDataIndv['MARKER_OPTIONS'],
    //     icons: [
    //       {
    //         min: 3,
    //         max: 200,
    //         url: './'+markerDataIndv['ICON']['url'],
    //         label: {
    //           bold: true,
    //           fontSize: 32,
    //           color: "#24f42f"
    //         }
    //       }
    //     ],
    //     boundsDraw: false,
    //     maxZoomLevel: 18
    //   };
    //   markerDataIndv['MARKER_CLUSTER_OPTIONS'] = markerClusterDataOpt;
    // }

    //array of data of json objects to create the markers for. This is only for one filter
    async createFilterMarkers(filt): Promise<any> {
      return await new Promise<any>((resolve, reject) => {
        // //collapse the data
        // filt['MARKER_DATA'] = [];

        //array of leaflet marker cluster groups
        filt['CLUSTER'] = [];

        // previous icon, used for clustering of similar icons
        let prevIcon = "";

        filt['CLUSTEREDATA'] = [];
        for (let i = 0; i < filt['DATA'].length; i++) {
          // current item = filt['DATA'][i]; or arr[j]

          // //if the icon
          // if(filt['DATA'][i]['ICON'].slice(0,3) == "data") {
          //   filt['DATA'][i]['ICON'] = filt['DATA'][i]['ICON']; //base64 data
          // } else if(filt['DATA'][i]['ICON']) {
          //   filt['DATA'][i]['ICON'] = 'assets/icon/'+ filt['DATA'][i]['ICON']+'.png';
          // } else {
          //   filt['DATA'][i]['ICON'] = "assets/icon/favicon_cluster.png";
          // }

          // current iconurl
          var iconURL = "";

          if(filt['DATA'][i]['ICON'].slice(0,3) == "data") {
            iconURL = filt['DATA'][i]['ICON']; //base64 data
          } else if(filt['DATA'][i]['ICON']) {
            iconURL = 'assets/icon/'+ filt['DATA'][i]['ICON']+'.png';
          } else {
            iconURL = "assets/icon/favicon_cluster.png";
          }

          var lIcon = Leaflet.icon({
            iconUrl: iconURL,
            iconSize: [48,48]
          })

          // var icon = {
          //   url: filt['DATA'][i]['ICON'],
          //   size: {
          //     width: 35,
          //     height: 35
          //   }
          // };

          // add to building modal
          if(parseInt(filt['DATA'][i]['BUILDING_ID']) != 0) {
            this.addIconToBuilding(iconURL, filt['DATA'][i]['BUILDING_ID']);
          }

          // var markerOpt = {
          //   position: {
          //     lat: filt['DATA'][i]['LATITUDE'],
          //     lng: filt['DATA'][i]['LONGITUDE']
          //   },
          //   icon: icon,
          //   visible: false,
          //   zIndex: 2,
          //   disableAutoPan: true,
          //   "TITLE": filt['DATA'][i]['TITLE'],
          //   "DESCRIPTION": filt['DATA'][i]['DESCRIPTION']
          // }

          //create Leaflet marker object with specific popup
          var marker = Leaflet.marker([filt['DATA'][i]['LATITUDE'], filt['DATA'][i]['LONGITUDE']], {icon: lIcon}).bindPopup(
            this.createPopupHTML(filt['DATA'][i]['TITLE'], filt['DATA'][i]['DESCRIPTION'], iconURL)
          );

          //check if the previous icon matches. Then if it does, add it to the previous marker cluster
          if(prevIcon != "" && iconURL === prevIcon) {
            // console.log("prev")
            filt['CLUSTER'][filt['CLUSTER'].length-1].addLayer(marker);

            //add the lats and longs
            filt['CLUSTEREDATA'][filt['CLUSTEREDATA'].length-1]['COOR'].push([filt['DATA'][i]['LATITUDE'], filt['DATA'][i]['LONGITUDE']]);
          } else {
            //add toSearch here and the filter list. use promises to search for the items in the multiple individiual filter lists
            filt['CLUSTEREDATA'].push({
              "ICON": iconURL,
              "TITLE": filt['DATA'][i]['TITLE'],
              "DESCRIPTION": filt['DATA'][i]['DESCRIPTION'],
              "COOR": [[filt['DATA'][i]['LATITUDE'], filt['DATA'][i]['LONGITUDE']]]
            });


            //added in order to call outside functions and variables since leaflet overrides "this" in callback functions
            const outsideThis = this;
            // console.log(iconURL);
            var newMarkerGrp = Leaflet.markerClusterGroup({
              iconCreateFunction: function(cluster) {
                //cant call outside icon url, since this function gets called whenever there is change in the icon cluster size
                var tempIconURL = cluster.getAllChildMarkers()[0]['_popup']["_content"].split(`hidden;">`)[1].split("<")[0];
            		return Leaflet.divIcon({ html: outsideThis.createClusteredIconHTML(tempIconURL, cluster)});
            	}
            });
            newMarkerGrp.addLayer(marker);
            // this.map.addLayer(newMarkerGrp);
            // this.map.removeLayer(newMarkerGrp);

            filt['CLUSTER'].push(newMarkerGrp);
            prevIcon = iconURL;
          }

          // //if marker data is not empty check last elemnet of marker data and see if the icons match
          // if(filt['MARKER_DATA'].length != 0 && filt['MARKER_DATA'][filt['MARKER_DATA'].length - 1]['ICON']['url'] == filt['DATA'][i]['ICON']) {
          //   //set viisibility to true
          //   filt['MARKER_DATA'][filt['MARKER_DATA'].length - 1]['MARKER_OPTIONS'][0]['visible'] = true;
          //   markerOpt['visible'] = true;
          //
          //   //add into the list of markers
          //   filt['MARKER_DATA'][filt['MARKER_DATA'].length - 1]['MARKER_OPTIONS'].push(markerOpt);
          //
          // } else {
          //   //then simply add a new one into marker data
          //   var markerDataOPT = {};
          //   markerDataOPT['TITLE'] = filt['DATA'][i]['TITLE'];
          //   markerDataOPT['DESCRIPTION'] = filt['DATA'][i]['DESCRIPTION'];
          //   markerDataOPT['ICON'] = icon;
          //   markerDataOPT['MARKER_OPTIONS'] = [markerOpt];
          //
          //   filt['MARKER_DATA'].push(markerDataOPT);
          //
          // }

        } //end for

        // for (let i = 0; i < filt['MARKER_DATA'].length; i++) {
        //   // element = filt['MARKER_DATA'][i];
        //   if(filt['MARKER_DATA'][i]['MARKER_OPTIONS'].length > 1) {
        //     // marker options length is greater than 1 then cluster else create individual marker
        //     this.createClusterMarkerOptions(filt['MARKER_DATA'][i]);
        //   } else {
        //     //create the individual marker
        //     // console.log(filt['MARKER_DATA'][i]['MARKER_OPTIONS'][0]);
        //     filt['MARKER_DATA'][i]['MARKER'] = this.map.addMarkerSync(filt['MARKER_DATA'][i]['MARKER_OPTIONS'][0]);
        //
        //     filt['MARKER_DATA'][i]['MARKER'].on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        //       this.createHtmlInfoWindow(filt['MARKER_DATA'][i]['MARKER']);
        //     });
        //   }
        //   this.toSearch.unshift(filt['MARKER_DATA'][i]);
        // }
        // //go across and make markers for each of the ones that are not clustered
        // //otherwise form marker cluster options and THEN make a function call to create the marker cluster with parameter on whether to remove the marker cluster or create one.
        // //add into tosearch within this new loop
        // // console.log(this.toSearch);
        resolve(filt);
      });
    }

    toggleParkingClusterMarker() {
      this.parkingMarkerFlag = !this.parkingMarkerFlag;

      //if set to true then add the layer, otherwise remove it
      if(this.parkingMarkerFlag) {
        this.map.addLayer(this.parkingMarkerCluster);
      } else {
        this.map.removeLayer(this.parkingMarkerCluster);
      }
    }

    createClusteredIconHTML(img, cluster) {
      return `<img src='`+img+`' style='margin-left: -100%;
      margin-top: -100%;'><p style='
      margin-bottom: 0px;
      margin-top: -53px;
      margin-left: 23px;
      font-weight: bolder;
      background: greenyellow;
      z-index: 6;
      padding: 2px;
      width: 12px;
      position: absolute;
      border-radius: 100px;
      '>`+cluster.getChildCount()+`</p>`;
    }

    async addBuildings() {
      //added in order to call outside functions and variables since leaflet overrides "this" in callback functions
      const outsideThis = this;

      //initialize the leaflet marker cluster group and clustered icons
      this.parkingMarkerCluster = Leaflet.markerClusterGroup({
        iconCreateFunction: function(cluster) {
      		return Leaflet.divIcon({ html: outsideThis.createClusteredIconHTML("assets/icon/parking.png", cluster)});
      	}
      });

      for (let i = 0; i < this.buildings.length; i++) {
        const building = this.buildings[i];

        //set up for icons at this location. added in the add icon to building method from filter markers
        building["ICONS"] = [];

        // add the coordinates
        var coords = [];
        for (let coor = 1; coor <= building['NUM_COORDINATES']; coor++) {
          var latC = building['LATITUDE ' + coor];
          var longC = building['LONGITUDE ' + coor];
          var tempCoorSet = Leaflet.latLng({
            lat: latC,
            lng: longC
          });
          coords.push(tempCoorSet);
        }

        // let buildingCoors: ILatLng = coords

        // building['COORS'] = Leaflet.latLngBounds(coords);
        building['COORS'] = coords;

        //if it is not a parking structure
        var fillC = '#eaf0ff';
        var strokeC = '#537ed0';

        var polygon;
        //if it is a parking structure
        if(building['PARKING'].toUpperCase() === "TRUE") {
          fillC = '#808080';
          strokeC = '#454545';

          polygon = Leaflet.polygon(building['COORS'], {
            stroke: true,
            color: strokeC,
            fill: true,
            fillColor: fillC,
            fillOpacity: 0.8,
            interactive: false ////////maybe
          });

          //add the parking polygon to the map
          polygon.addTo(this.map);


          //add the parking marker
          //get the center
          var center = polygon.getCenter();
          //build the html
          var parkingHTML = `<div class="ion-text-wrap" style="text-align: center; height: auto; width: auto; padding: 0px; margin: -5px ">
          <p>` + building['FULL_NAME'] + `</p>`;
          for (let i = 0; i < building['DESCRIPTION'].length; i++) {
            parkingHTML += `<small>`+ building['DESCRIPTION'][i] + `</small>`;
          }
          parkingHTML += `</div>`;

          //add the actual marker
          this.parkingMarkerCluster.addLayer(
            Leaflet.marker(center, {
              icon: Leaflet.icon({
                iconUrl: 'assets/icon/parking.png',
                iconSize: [48, 48]
              })
            }).bindPopup(parkingHTML)
          );

        } else {
          //create a regular building polygon

          //create html popup
          var buildingHTML = building['FULL_NAME'];

          if(building['LEED_CERTIFICATION'] && !(building['PARKING']=="TRUE") && building['SHORTENED_NAME']) { //if the building has a leed certification, parking building do not have leed certifications
            buildingHTML = building['SHORTENED_NAME'];
          }

          // TODO: add click events inside the actual html code
          buildingHTML = `<div class="infoWindow ion-text-nowrap">
          `+ buildingHTML + `</div>`;

          // console.log(building['COORS']);
          //create leaflet polygon
          polygon = Leaflet.polygon(building['COORS'], {
            stroke: true,
            color: strokeC,
            fill: true,
            fillColor: fillC,
            fillOpacity: 0.8,
            interactive: true
          }).bindPopup(buildingHTML);

          polygon.addTo(this.map); //add to the map

        }

        building['POLYGON'] = polygon;

        // building['POLYGON'] = polygon;


        // // create polygon
        // let polygon: Polygon = this.map.addPolygonSync({
        //   points: this.buildings[i]['COORS'],
        //   strokeColor : strokeC,
        //   fillColor : fillC,
        //   strokeWidth: 5,
        //   zIndex: 1,
        //   clickable: true
        // });

        // if(building['PARKING'].toUpperCase() == "TRUE") {
        //   //If this building is a parking lot
        //
        //   polygon.setClickable(false);
        //   // console.log("setting building clickable to false...")
        //
        //   let parkingMarkerOpt = {
        //     position: (new LatLngBounds(this.buildings[i]['COORS'])).getCenter(),
        //     icon: {
        //       url: './assets/icon/parking.png',
        //       size: {
        //         width: 30,
        //         height: 30
        //       }
        //     },
        //     flat: true,
        //     visible: true,
        //     disableAutoPan: true,
        //     zIndex: 2,
        //     name: building['FULL_NAME'],
        //     des: building['DESCRIPTION']
        //   }
        //
        //   //add to cluster and opts array
        //   // this.parkingMarkerCluster.addMarker(parkingMarkerOpt, true);
        //   this.parkingMarkerOpts.push(parkingMarkerOpt);
        //
        // }
        // // when clicked open htmlinfo window.
        // polygon.on(GoogleMapsEvent.POLYGON_CLICK).subscribe((data) => {
        //   // if parking then set polygon clickable to false
        //   polygon.setClickable(building['PARKING'].toUpperCase() == "FALSE");
        //   // console.log("setting building clickable to " + building['PARKING'] == "FALSE")
        //
        //   // console.log("polygon clicked");
        //   // this.filterFab.close(); //close the fab
        //   // html info window when polygon is clicked
        //   let frame: HTMLElement = document.createElement('div');
        //
        //   frame.innerHTML = `
        //   <div class="infoWindow ion-text-nowrap">
        //   `+ building['FULL_NAME'] +`
        //   </div>`;
        //
        //   if(building['LEED_CERTIFICATION'] && !(building['PARKING']=="TRUE") && building['SHORTENED_NAME']) { //if the building has a leed certification, parking building do not have leed certifications
        //     frame.innerHTML = `
        //     <div class="infoWindow ion-text-nowrap">
        //     `+ building['SHORTENED_NAME'] +`
        //     </div>`;
        //   }
        //
        //   frame.getElementsByClassName("infoWindow")[0].addEventListener("click", () => {
        //     //open modal instead
        //     // this.htmlInfoWindow.close();
        //     this.goToPage(building);
        //   });
        //   this.htmlInfoWindow.setContent(frame, {
        //     "text-align": 'center',
        //     "height": "5vh",
        //     "width": "auto",
        //     "padding": "0px",
        //     "margin": "-5px", //offset
        //     "margin-top" : "1vh"
        //   });
        //
        //   let centerMarker = this.map.addMarkerSync({
        //     position: (new LatLngBounds(this.buildings[i]['COORS'])).getCenter(),
        //     visible: false,
        //     zIndex: 0
        //   });
        //   this.htmlInfoWindow.open(centerMarker);
        // });
        //
        // this.buildings[i]['POLYGON'] = polygon;
        //
        // this.toSearch.push(this.buildings[i]);
      }

      this.map.addLayer(this.parkingMarkerCluster);

      console.log(this.buildings);


      this.map.addEventListener("PARKING_MARKER_CLUSTER", (data:any) => {
        this.toggleParkingClusterMarker();
      })

      // //set up for parking marker cluster
      // this.parkingMarkerClusterOpts = {
      //   markers: this.parkingMarkerOpts,
      //   icons: [
      //     {
      //       min: 3,
      //       max: 200,
      //       url: './assets/icon/parking.png',
      //       label: {
      //         bold: true,
      //         fontSize: 32,
      //         color: "black" //#24f42f
      //       }
      //     }
      //   ],
      //   boundsDraw: false,
      //   maxZoomLevel: 18
      // };
      // this.parkingMarkerCluster = this.map.addMarkerClusterSync(this.parkingMarkerClusterOpts);
      //
      // // this is for events from model in settings if possible
      // this.events.subscribe("PARKING_MARKER_CLUSTER", (data: any) => {
      //   this.changeStatus("PARKING_MARKER_CLUSTER");
      // });
      //
      // // turn on and off the parking
      // this.map.addEventListener("PARKING_MARKER_CLUSTER").subscribe(() => {
      //   // console.log("parking marker cluster");
      //   this.parkingMarkerFlag = !this.parkingMarkerFlag;
      //   if(this.parkingMarkerFlag) {
      //     //if from false to true create marker cluster.
      //     this.parkingMarkerCluster = this.map.addMarkerClusterSync(this.parkingMarkerClusterOpts);
      //     this.openParkingMarkerCluster();
      //   } else {
      //     this.parkingMarkerCluster.remove();
      //   }
      // });
      //
      // this.openParkingMarkerCluster();

    }

    // openParkingMarkerCluster() {
    //   //open html info window when parking marker is clicked
    //   this.parkingMarkerCluster.on(GoogleMapsEvent.MARKER_CLICK).subscribe((params) => {
    //     let marker: Marker = params[1];
    //     let frame: HTMLElement = document.createElement('div');
    //
    //     frame.innerHTML = `
    //     <div class="ion-text-wrap">
    //     <p>` + marker.get('name') + `</p>`;
    //
    //     for (let i = 0; i < marker.get('des').length; i++) {
    //       frame.innerHTML += `<small>`+ marker.get('des')[i] + `</small>`;
    //     }
    //     frame.innerHTML += `</div>`;
    //     this.htmlInfoWindow.setContent(frame, {
    //       "text-align": 'center',
    //       "height": "auto",
    //       "width": "auto",
    //       "padding": "0px",
    //       "margin": "-5px", //offset
    //     });
    //
    //     this.htmlInfoWindow.open(marker);
    //   });
    // }

    /////////////////////////////// END POLYGON & MARKER & MARKER CLUSTER CREATION METHODS

    async animateCamera(lat, long) {
      console.log("animating camera");
      this.map.flyTo({lat:lat, lng:long});
      // this.map.animateCamera({
      //   target: {lat: lat, lng: long},
      //   zoom: 17,
      //   tilt: 0,
      //   // bearing: 140,
      //   duration: 10000
      // });
    }

    handleLocationChange() {
      this.animateCamera(this.settings["LOCATIONS"][this.locationNumber]['lat'], this.settings["LOCATIONS"][this.locationNumber]['lng']).then(async () => {
        this.locationNumber += 1;
        if(this.locationNumber ==  this.settings["LOCATIONS"].length) {
          this.locationNumber = 0;
        }
        if(!this.toastFlagLocation) {
          this.createToast("TIP", "Click some filters on the top right to see what's available here in the area!", "light");
          this.toastFlagLocation = true;
        }
      });

    }

    /////////////////////////////// TOAST

    async dismissActiveToast() {
      try {
        await this.toast.dismiss();
      } catch (error) {
      }
    }

    setToastFlags() {
      this.appData.getUpdatedToastTips("Filter").then((val) => {
        this.toastFlagFilter = val;
      });
      this.appData.getUpdatedToastTips("Location").then((val) => {
        this.toastFlagLocation = val;
      });
    }

    async createToast(header, message, toastC) {
      await this.dismissActiveToast();
      this.toast = await this.toastCtrl.create({
        header: header,
        message: message,
        position: 'bottom',
        translucent: (toastC == "light"),
        keyboardClose: true,
        // cssClass: cssClass, //doesnt work
        color: toastC,
        duration: 5000,
        buttons: [
          {
            side: 'end',
            role: 'cancel',
            icon: 'checkmark-outline',
            handler: () => {
              console.log("cancel clicked");
              this.toast.dismiss();
            }
          }
        ]
      });

      await this.toast.present();

      // setTimeout(() => {
      //   this.dismissActiveToast();
      // }, 5000);
    }

    /////////////////////////////// END TOAST

    /////////////////////////////// BEGIN Location functions

    createMyLocation(lat, lng, acc) {
      // console.log(acc);
      acc = 11-acc;
      this.mylocationCircle = Leaflet.circle({lat:lat, lng: lng}, {
        radius: (acc*50),
        fill: true,
        stroke: true,
        color: '#4ecd00',
        fillColor: '#a2fa78'
      });
      this.mylocationCircle.bringToBack();
      this.mylocationCircle.addTo(this.map);

      var lIcon = Leaflet.icon({
        iconUrl: "svg/location-outline.svg",
        iconSize: [48,48]
      })

      this.mylocationMarker = Leaflet.marker({lat:lat, lng: lng}, {
        icon: lIcon,
        title: "You are here!",
        // interactive: false
        // riseOnHover: true
      });
      this.mylocationMarker.bindPopup("You are here!")
      this.mylocationMarker.addTo(this.map);


      // this.mylocationMarker = this.map.addMarkerSync({
      //   position: {
      //     lat: lat,
      //     lng: lng
      //   },
      //   title: "You are here!",
      //   animation: "DROP",
      // });
      // this.mylocationMarker.on(GoogleMapsEvent.MARKER_CLICK).subscribe((p) => {
      //   console.log("marker click");
      //   this.mylocationMarker.showInfoWindow();
      // })
      //
      // this.mylocationCircle = this.map.addCircleSync({
      //   center: this.mylocationMarker.getPosition(),
      //   radius: Math.abs(20-acc),
      //   fillColor: "green",
      //   strokeWidth: 1
      // });

      // this.mylocationMarker.bindTo("position", this.mylocationCircle, "center");
    }

    updateMyLocation(lat, lng, acc) {
      acc = 11-acc;
      this.mylocationCircle.setLatLng({lat: lat, lng: lng});
      this.mylocationCircle.setRadius((acc*50));

      this.mylocationMarker.setLatLng({lat: lat, lng: lng});


      // try {
      //   this.mylocationMarker.setPosition({
      //     lat: lat,
      //     lng: lng
      //   });
      //   this.mylocationCircle.setCenter(this.mylocationMarker.getPosition());
      //   this.mylocationCircle.setRadius(Math.abs(20-acc));
      // } catch (error) {
      //   console.log(error); //in case the markers were not created
      //   this.createMyLocation(lat, lng, acc);
      // }

    }

    async toggleMyLocation() {
      // console.log(this.mylocationEnabled);
      if(!this.mylocationEnabled && !this.myLocationButtonClicked) {
        this.myLocationButtonClicked = true;
        await this.createToast("Loading", "Retrieving location...", "warning");
        this.geolocation.getCurrentPosition(this.geoOptions).then(async (data: Geoposition) => {
          // console.log(data.coords);
          //creating toast sucess
          await this.createToast("Sucessfully turned ON Location Service", "Hit the location (World) button to turn off location service. Hold the button for more options.", "success");

          if(!this.mylocationFlag) {
            this.createMyLocation(37.36389458, -120.4239584, data.coords.accuracy);
            // this.createMyLocation(data.coords.latitude, data.coords.longitude, data.coords.accuracy);
            this.mylocationFlag = true;
          } else {
            this.mylocationMarker.addTo(this.map);
            this.mylocationCircle.addTo(this.map);
            this.updateMyLocation(37.36389458, -120.4239584, data.coords.accuracy);
            // this.updateMyLocation(data.coords.latitude, data.coords.longitude, data.coords.accuracy);
          }
          this.animateCamera(37.36389458, -120.4239584);
          // this.animateCamera(data.coords.latitude, data.coords.longitude);
          this.mylocationMarker.openPopup();
          this.mylocationEnabled = true;

          this.watch = this.geolocation.watchPosition(this.geoOptions).subscribe((data: Geoposition) => {
            // console.log("getting location");
            try {
              this.updateMyLocation(37.36389458, -120.4239584, data.coords.accuracy);
              // this.updateMyLocation(data.coords.latitude, data.coords.longitude, data.coords.accuracy);
            } catch (err) {
              // console.log(err);
              this.createToast("Error in Retrieving Location", "You may have disabled location on the device. Error message: " + err.message, "danger");
              this.mylocationEnabled = false;
            }
          });
        }).catch((err) => {
          // console.log(err);
          this.createToast("Error in Retrieving Location", "You may have disabled location on the device. Error message: " + err.message, "danger");
          this.mylocationEnabled = false;
        });



      } else {
        this.createToast("Sucessfully turned OFF Location Service", "Hit the location (World) button to turn on location service again or hold for more options.", "tertiary");
        this.mylocationEnabled = false;
        this.watch.unsubscribe();
        this.mylocationMarker.remove();
        this.mylocationCircle.remove();
        this.myLocationButtonClicked = false;
      }
    }

    /////////////////////////////// END location functions

    changeStatus(filter_name) {
      this.map.fire(filter_name);
      // console.log("firing" + filter_name)
    }



    getItems(ev: any) { //for search functionality
      this.filteredItems = []; //reset filteredItems

      const val = ev.target.value;

      if(val && val.trim() != "") {
        this.itemAvailable = true;
        // console.log(this.toSearch);

        for (let i = 0; i < this.filters.length; i++) {
          const filt = this.filters[i];
          this.addItemsFromFilters(filt, val); //async
        }

        this.addItemsFromBuilding(val); //async

        //adding dynamically the filtered items
        // for (let index = 0; index < this.toSearch.length; index++) {
        //   const item = this.toSearch[index];
        //   if(((item['FULL_NAME']+"").toUpperCase().search(val.toUpperCase()) > -1) || ((item['TITLE']+"").toUpperCase().search(val.toUpperCase()) > -1) || (item['DESCRIPTION'].toUpperCase().search(val.toUpperCase()) > -1) || ((item['SHORTENED_NAME']+"").toUpperCase().search(val.toUpperCase()) > -1)) {
        //     this.filteredItems.push(item);
        //   }
        // }
      } else {
        this.itemAvailable = false;
      }
    }

    async addItemsFromBuilding(val) {
      for (let i = 0; i < this.buildings.length; i++) {
        const item = this.buildings[i];
        if(((item['FULL_NAME']+"").toUpperCase().search(val.toUpperCase()) > -1) || (item['DESCRIPTION'].toUpperCase().search(val.toUpperCase()) > -1) || ((item['SHORTENED_NAME']+"").toUpperCase().search(val.toUpperCase()) > -1)) {
          this.filteredItems.push(item);
        }
      }
    }

    async addItemsFromFilters(filt, val) {
      for (let i = 0; i < filt['CLUSTEREDATA'].length; i++) {
        const item = filt['CLUSTEREDATA'][i];
        item['INDEX'] = i;
        item['FILT'] = filt;
        //Todo: combine "clusteredata" and "cluster"
        if(((item['TITLE']+"").toUpperCase().search(val.toUpperCase()) > -1) || (item['DESCRIPTION'].toUpperCase().search(val.toUpperCase()) > -1)) {
          this.filteredItems.push(item);
        }
      }
    }

    goToItem(fdata, index=-1) {
      console.log(fdata)

      if(fdata['BUILDING_ID']) { //building or parking
        //zoom to bounds
        this.map.fitBounds(fdata['COORS']);

        //if parking cluster
        if(fdata['PARKING']) {
          //toggle parking cluster
          if(!this.map.hasLayer(this.parkingMarkerCluster)) {
            this.map.addLayer(this.parkingMarkerCluster);
          }
        }
        //open popup
        fdata['POLYGON'].openPopup();
      } else {
        // zoom to bounds
        this.map.fitBounds(fdata['CLUSTEREDATA'][index]['COOR']);
        // toggle the cluster marker
        this.map.addLayer(fdata['CLUSTER'][index]);
      }


      //go to location
      // console.log(fdata['CLUSTER'])
      //
      // console.log(index);
      //
      // console.log(fdata['CLUSTER'][index])

      // console.log(fdata['CLUSTER'][index].zoomToBounds({padding: [20, 20]}));

      // this.search = false;

      // var loc: ILatLng;
      // if(item['MARKER']) {
      //   //filter item
      //   loc = item['MARKER'].getPosition();
      //   item['MARKER'].setVisible(true);
      //   item['MARKER'].trigger(GoogleMapsEvent.MARKER_CLICK, loc);
      // } else if (item['POLYGON']){
      //   //building or parking
      //   loc = (new LatLngBounds(item['COORS'])).getCenter();
      //   item['POLYGON'].trigger(GoogleMapsEvent.POLYGON_CLICK, loc);
      // } else if(item['MARKER_CLUSTER_OPTIONS']) {
      //   //cluster item
      //   //see if cluster is active
      //   loc = item['MARKER_OPTIONS'][0]['position'];
      //   if(!item['MARKER_CLUSTER']) {
      //     this.toggleClusterMarker(item);
      //   }
      // }
      // this.animateCamera(loc['lat'], loc['lng']);
    }

    /////////////////////////////// BEG gesture/ION-FAB related functions

    stop_close(event: any) {
      try {
        event.preventDefault();
      } catch(e) {}
      try {
        event.stopPropagation();
      } catch(e) {}
      return false;
    }

    // publishEvent(eventName: string, data: any) {
    //   this.events.publish(eventName, data);
    // }

    test() {
      console.log("test")
    }

    onPress(fdata, filter=true) {
      console.log("press");
      this.pressFlag = true;
      // this.pressUpLocation = true;
      setTimeout(() => {
        if(this.pressFlag) {
          if(filter) {
            this.openFilterModal(fdata);
          } else {
            console.log("mylocation hold");
            this.openTosPPModal(false);
            // this.pressUpLocation = false;
          }
          this.pressFlag = false
        } else {
          // console.log("did not hold");
        }
      }, 500); // hold for 500 ms
    }

    /////////////////////////////// END gesture/ION-FAB related functions


    /////////////////////////////// MODALS

    async goToPage(buildingData) { // open modal
      // console.log(buildingData);
      const modal = await this.modalController.create({
        component: BuildingModalPage,
        componentProps: {
          building: buildingData
        },
        swipeToClose: true,
        cssClass: 'my-modal'
      });

      modal.onDidDismiss().then((detail: OverlayEventDetail) => {
        try {
          if(detail.data.redirect) {
          }
        } catch (error) {
          // console.log("no redirect");
        }
      });
      this.closeEverything();
      await modal.present();
    }

    async openFilterModal(filterData) { //clustered data
      // console.log(filterData);
      const modal = await this.modalController.create({
        component: FilterModalPage,
        componentProps: {
          filter: filterData['CLUSTEREDATA'],
          name: filterData['FILTER_NAME'],
          icon: filterData['ICON']
        },
        swipeToClose: true,
        cssClass: 'filter-modal'
      });

      modal.onDidDismiss().then((detail: OverlayEventDetail) => {
        try {
          // console.log(detail.data);
          if(detail.data.redirect) {
            console.log(filterData)
            this.goToItem(filterData, detail.data['markerDataItemIndex']);
          }
        } catch (error) {
          // console.log("no redirect");
        }
      });

      this.closeEverything();
      await modal.present();
    }

    async openAboutModal() {
      const modal = await this.modalController.create({
        component: AboutPage,
        componentProps: {
          about: this.about
        },
        swipeToClose: true,
        cssClass: 'about-modal' // same css class
      });

      modal.onDidDismiss().then((detail: OverlayEventDetail) => {});

      this.closeEverything();
      await modal.present();
    }

    async openTosPPModal(agreeBtn: boolean) {
      const modal = await this.modalController.create({
        component: TosPpPage,
        componentProps: {
          agreeButton: agreeBtn
        },
        swipeToClose: !agreeBtn,
        cssClass: agreeBtn? 'about-modal' : 'filter-modal' //take up most of the page but not all of it
      });

      modal.onDidDismiss().then((detail: OverlayEventDetail) => {
        if(agreeBtn) {
          this.appData.setTOSPP(true);
          this.buildMap();
        }
      });
      if(!agreeBtn) {
        this.closeEverything();
      }

      await modal.present();
    }

    async openBuildingListModal() {
      const modal = await this.modalController.create({
        component: BuildingListModalPage,
        componentProps: {
          buildings: this.buildings,
        },
        swipeToClose: true,
        cssClass: 'filter-modal' // same css class
      });

      modal.onDidDismiss().then((detail: OverlayEventDetail) => {
        try {
          // console.log(detail.data);
          if(!detail.data.redirect) {
            this.goToItem(this.buildings[detail.data['index']]);

            // const loc: ILatLng = (new LatLngBounds(detail.data['building']['COORS'])).getCenter();
            // this.animateCamera(loc['lat'], loc['lng']);
            // detail.data['building']['POLYGON'].trigger(GoogleMapsEvent.POLYGON_CLICK, loc);
          } else {
            // console.log("redirect to building page");
          }
        } catch (error) {
          // console.log("regular close");
        }
      });

      this.closeEverything();
      await modal.present();
    }

    /////////////////////////////// END MODALS


    /////////////////////////////// EXTRA METHODS

    closeEverything() {
      // console.log("close")
      // try {
      //   this.htmlInfoWindow.close();
      // } catch (error) {
      //
      // }
      this.search = false;
      this.itemAvailable = false;
      this.filteredItems = [];
    }

    /////////////////////////////// END EXTRA METHODS


}
