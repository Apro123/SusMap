import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { ToastController, Platform, LoadingController, ModalController, IonFab } from '@ionic/angular';
import { EventService } from '../events/event.service';
import { AppDataService } from '../services/app-data.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { OverlayEventDetail } from '@ionic/core';
import { BuildingModalPage } from '../building-modal/building-modal.page';
import { FilterModalPage } from '../filter-modal/filter-modal.page';
import { BuildingListModalPage } from '../building-list-modal/building-list-modal.page';
import { AboutPage } from '../about/about.page';
import { TosPpPage } from '../tos-pp/tos-pp.page';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import * as $ from 'jquery'; //used for leaflet bug
import * as Leaflet from 'leaflet';
import 'leaflet.markercluster';

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

    //map
    public map: Leaflet.Map;

    //main toast variable
    private toast;

    //toast and loading
    public loading; //loading controller
    private toastFlagFilter = false;
    private toastFlagLocation = false;

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
            locs.push(temp);
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
            outsideThis.toggleClusterMarker(outsideThis.filters[i]);
          });
        }

        //dismiss the loading container
        this.loading.dismiss();
      });
    }

    async addIconToBuilding(iconUrl:string, buildingID) {
      const ind = this.buildings.findIndex(building => building['BUILDING_ID'] === buildingID);
      this.buildings[ind]["ICONS"].push(iconUrl);
    }

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
    }

    //array of data of json objects to create the markers for. This is only for one filter
    async createFilterMarkers(filt): Promise<any> {
      return await new Promise<any>((resolve, reject) => {
        // //collapse the data

        //array of leaflet marker cluster groups
        filt['CLUSTER'] = [];

        // previous icon, used for clustering of similar icons
        let prevIcon = "";

        filt['CLUSTEREDATA'] = [];
        for (let i = 0; i < filt['DATA'].length; i++) {
          // current item = filt['DATA'][i]; or arr[j]

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

          // add to building modal
          if(parseInt(filt['DATA'][i]['BUILDING_ID']) != 0) {
            this.addIconToBuilding(iconURL, filt['DATA'][i]['BUILDING_ID']);
          }

          //create Leaflet marker object with specific popup
          var marker = Leaflet.marker([filt['DATA'][i]['LATITUDE'], filt['DATA'][i]['LONGITUDE']], {icon: lIcon}).bindPopup(
            this.createPopupHTML(filt['DATA'][i]['TITLE'], filt['DATA'][i]['DESCRIPTION'], iconURL)
          );

          //check if the previous icon matches. Then if it does, add it to the previous marker cluster
          if(prevIcon != "" && iconURL === prevIcon) {
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
            var newMarkerGrp = Leaflet.markerClusterGroup({
              iconCreateFunction: function(cluster) {
                //cant call outside icon url, since this function gets called whenever there is change in the icon cluster size
                var tempIconURL = cluster.getAllChildMarkers()[0]['_popup']["_content"].split(`hidden;">`)[1].split("<")[0];
            		return Leaflet.divIcon({ html: outsideThis.createClusteredIconHTML(tempIconURL, cluster)});
            	}
            });
            newMarkerGrp.addLayer(marker);

            filt['CLUSTER'].push(newMarkerGrp);
            prevIcon = iconURL;
          }
        } //end for
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
      }

      this.map.addLayer(this.parkingMarkerCluster);

      this.map.addEventListener("PARKING_MARKER_CLUSTER", (data:any) => {
        this.toggleParkingClusterMarker();
      })

    }

    /////////////////////////////// END POLYGON & MARKER & MARKER CLUSTER CREATION METHODS

    /////////////////////////////// BEGIN CAMERA/LOCATION FEATURE FUNCTIONS
    async animateCamera(lat, long) {
      this.map.flyTo({lat:lat, lng:long});
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

    /////////////////////////////// END CAMERA/LOCATION FEATURE FUNCTIONS

    /////////////////////////////// BEGIN TOAST FUNCTIONS

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
        color: toastC,
        duration: 5000,
        buttons: [
          {
            side: 'end',
            role: 'cancel',
            icon: 'checkmark-outline',
            handler: () => {
              this.toast.dismiss();
            }
          }
        ]
      });

      await this.toast.present();
    }

    /////////////////////////////// END TOAST FUNCTIONS

    /////////////////////////////// BEGIN myLocation functions

    createMyLocation(lat, lng, acc) {
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
        title: "You are here!"
      });
      this.mylocationMarker.bindPopup("You are here!")
      this.mylocationMarker.addTo(this.map);
    }

    updateMyLocation(lat, lng, acc) {
      acc = 11-acc;
      this.mylocationCircle.setLatLng({lat: lat, lng: lng});
      this.mylocationCircle.setRadius((acc*50));

      this.mylocationMarker.setLatLng({lat: lat, lng: lng});
    }

    async toggleMyLocation() {
      if(!this.mylocationEnabled && !this.myLocationButtonClicked) {
        this.myLocationButtonClicked = true;
        await this.createToast("Loading", "Retrieving location...", "warning");
        this.geolocation.getCurrentPosition(this.geoOptions).then(async (data: Geoposition) => {
          //creating toast sucess
          await this.createToast("Sucessfully turned ON Location Service", "Hit the location (World) button to turn off location service. Hold the button for more options.", "success");

          if(!this.mylocationFlag) {
            this.createMyLocation(data.coords.latitude, data.coords.longitude, data.coords.accuracy);
            this.mylocationFlag = true;
          } else {
            this.mylocationMarker.addTo(this.map);
            this.mylocationCircle.addTo(this.map);
            this.updateMyLocation(data.coords.latitude, data.coords.longitude, data.coords.accuracy);
          }
          this.animateCamera(data.coords.latitude, data.coords.longitude);
          this.mylocationMarker.openPopup();
          this.mylocationEnabled = true;

          this.watch = this.geolocation.watchPosition(this.geoOptions).subscribe((data: Geoposition) => {
            try {
              this.updateMyLocation(data.coords.latitude, data.coords.longitude, data.coords.accuracy);
            } catch (err) {
              this.createToast("Error in Retrieving Location", "You may have disabled location on the device. Error message: " + err.message, "danger");
              this.mylocationEnabled = false;
            }
          });
        }).catch((err) => {
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

    /////////////////////////////// END myLocation functions


    /////////////////////////////// BEGIN SEARCH functions

    changeStatus(filter_name) {
      this.map.fire(filter_name);
    }

    getItems(ev: any) { //for search functionality
      this.filteredItems = []; //reset filteredItems

      const val = ev.target.value;

      if(val && val.trim() != "") {
        this.itemAvailable = true;

        for (let i = 0; i < this.filters.length; i++) {
          const filt = this.filters[i];
          this.addItemsFromFilters(filt, val); //async
        }

        this.addItemsFromBuilding(val); //async
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
    }

    /////////////////////////////// END SEARCH functions

    /////////////////////////////// BEGIN gesture/ION-FAB related functions

    stop_close(event: any) {
      try {
        event.preventDefault();
      } catch(e) {}
      try {
        event.stopPropagation();
      } catch(e) {}
      return false;
    }

    onPress(fdata, filter=true) {
      this.pressFlag = true;
      setTimeout(() => {
        if(this.pressFlag) {
          if(filter) {
            this.openFilterModal(fdata);
          } else {
            this.openTosPPModal(false);
          }
          this.pressFlag = false
        } else {
        }
      }, 500); // hold for 500 ms
    }

    /////////////////////////////// END gesture/ION-FAB related functions


    /////////////////////////////// MODALS

    async goToPage(buildingData) { // open modal
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
        }
      });
      this.closeEverything();
      await modal.present();
    }

    async openFilterModal(filterData) { //clustered data
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
          if(detail.data.redirect) {
            this.goToItem(filterData, detail.data['markerDataItemIndex']);
          }
        } catch (error) {
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
          if(!detail.data.redirect) {
            this.goToItem(this.buildings[detail.data['index']]);
          } else {
          }
        } catch (error) {
        }
      });

      this.closeEverything();
      await modal.present();
    }

    /////////////////////////////// END MODALS


    /////////////////////////////// EXTRA METHODS

    closeEverything() {
      this.search = false;
      this.itemAvailable = false;
      this.filteredItems = [];
    }

    /////////////////////////////// END EXTRA METHODS


}
