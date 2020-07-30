(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["home-home-module"],{

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/home/home.page.html":
/*!***************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/home/home.page.html ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<ion-header *ngIf=\"search\" [translucent]=\"true\" color=\"translucent\" no-border no-shadow>\n  <ion-toolbar color=\"translucent\">\n\n    <img class=\"about-icon\" slot=\"start\" src=\"assets/icon/favicon.png\" (click)=\"openAboutModal()\">\n    <!-- <ion-icon slot=\"end\" name=\"search\" (click)=\"search = true\"></ion-icon> -->\n\n    <ion-searchbar showCancelButton=\"always\" type=\"text\" placeholder=\"Search\" inputmode=\"text\" debounce=\"350\" animated=\"true\"  (ionChange)=\"getItems($event)\" (ionCancel)=\"closeEverything();\"></ion-searchbar>\n    <ion-list class=\"search-filters\" *ngIf=\"itemAvailable\">\n      <ion-item *ngFor=\"let it of filteredItems\" (click)=\"closeEverything(); goToItem(it);\">\n        <img class=\"search-icon\" *ngIf=\"it['ICON']\" src=\"{{it['ICON']['url']}}\" slot=\"end\">\n        <!-- building does not have icon -->\n        <img class=\"search-icon\" *ngIf=\"!it['ICON']\" src=\"svg/business-outline.svg\" slot=\"end\">\n\n        <ion-label slot=\"start\">\n          <p *ngIf=\"it['TITLE']\">{{it['TITLE']}}</p>\n          <p *ngIf=\"!it['TITLE']\">{{it['SHORTENED_NAME']}}</p>\n          <small class=\"ion-text-nowrap des\">{{it['DESCRIPTION']}}</small>\n        </ion-label>\n      </ion-item>\n    </ion-list>\n    <!-- <ion-button (click)=\"printData()\">print</ion-button> -->\n  </ion-toolbar>\n</ion-header>\n\n<!-- [fullscreen]=\"true -->\n\n<ion-content padding (contextmenu)=\"stop_close($event);\" (onContextMenu)=\"stop_close($event);\">\n  <div [ngClass]=\"{'search' : search, 'nosearch' : !search}\" id=\"map_canvas\">\n    <ion-fab vertical=\"top\" horizontal=\"start\" slot=\"fixed\">\n      <ion-fab-button color=\"success\">\n        <ion-icon name=\"color-filter-outline\"></ion-icon>\n      </ion-fab-button>\n      <ion-fab-list side=\"bottom\">\n        <ion-fab-button class=\"fab-button-show\" *ngFor=\"let filter of filters\" (click)=\"stop_close($event); filter['ACTIVE'] = !filter['ACTIVE']; publishEvent(filter['FILTER_NAME'], filter);\" (press)=\"onPress(filter)\" (pressup)=\"stop_close($event); onPressUp()\">\n          <ion-icon *ngIf=\"!filter['ACTIVE']\" [name]=\"filter['ICON']\"></ion-icon>\n          <ion-icon *ngIf=\"filter['ACTIVE']\" [name]=\"filter['ICON-SELECTED']\"></ion-icon>\n        </ion-fab-button>\n      </ion-fab-list>\n      <ion-fab-list side=\"end\">\n        <ion-fab-button (click)=\"changeStatus('PARKING_MARKER_CLUSTER')\">\n          <ion-icon *ngIf=\"!parkingMarkerFlag\" name=\"car-outline\"></ion-icon>\n          <ion-icon *ngIf=\"parkingMarkerFlag\" name=\"car\"></ion-icon>\n        </ion-fab-button>\n        <ion-fab-button>\n          <ion-icon name=\"business-outline\" (click)=\"openBuildingListModal();\"></ion-icon>\n        </ion-fab-button>\n        <ion-fab-button>\n          <ion-icon name=\"search-circle-outline\" (click)=\"search = !search\"></ion-icon>\n        </ion-fab-button>\n        <ion-fab-button>\n          <ion-icon name=\"information-circle-outline\" (click)=\"openAboutModal();\"></ion-icon>\n        </ion-fab-button>\n      </ion-fab-list>\n    </ion-fab>\n    <ion-button class=\"location\" (click)=\"closeEverything(); handleLocationChange();\" shape=\"round\">\n      <ion-icon *ngIf=\"locationNumber == 0\" slot=\"icon-only\" name=\"home-outline\"></ion-icon>\n      <ion-icon *ngIf=\"locationNumber != 0\" slot=\"icon-only\" name=\"locate-outline\"></ion-icon>\n    </ion-button>\n  </div>\n</ion-content>\n");

/***/ }),

/***/ "./src/app/home/home-routing.module.ts":
/*!*********************************************!*\
  !*** ./src/app/home/home-routing.module.ts ***!
  \*********************************************/
/*! exports provided: HomePageRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomePageRoutingModule", function() { return HomePageRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _home_page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./home.page */ "./src/app/home/home.page.ts");




const routes = [
    {
        path: '',
        component: _home_page__WEBPACK_IMPORTED_MODULE_3__["HomePage"]
    }
];
let HomePageRoutingModule = class HomePageRoutingModule {
};
HomePageRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]],
    })
], HomePageRoutingModule);



/***/ }),

/***/ "./src/app/home/home.module.ts":
/*!*************************************!*\
  !*** ./src/app/home/home.module.ts ***!
  \*************************************/
/*! exports provided: HomePageModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomePageModule", function() { return HomePageModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm2015/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm2015/forms.js");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/fesm2015/ionic-angular.js");
/* harmony import */ var _home_routing_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./home-routing.module */ "./src/app/home/home-routing.module.ts");
/* harmony import */ var _home_page__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./home.page */ "./src/app/home/home.page.ts");
/* harmony import */ var _building_modal_building_modal_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./../building-modal/building-modal.module */ "./src/app/building-modal/building-modal.module.ts");
/* harmony import */ var _filter_modal_filter_modal_module__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./../filter-modal/filter-modal.module */ "./src/app/filter-modal/filter-modal.module.ts");
/* harmony import */ var _about_about_module__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./../about/about.module */ "./src/app/about/about.module.ts");










let HomePageModule = class HomePageModule {
};
HomePageModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
            _ionic_angular__WEBPACK_IMPORTED_MODULE_4__["IonicModule"],
            _home_routing_module__WEBPACK_IMPORTED_MODULE_5__["HomePageRoutingModule"],
            _building_modal_building_modal_module__WEBPACK_IMPORTED_MODULE_7__["BuildingModalPageModule"],
            _filter_modal_filter_modal_module__WEBPACK_IMPORTED_MODULE_8__["FilterModalPageModule"],
            _about_about_module__WEBPACK_IMPORTED_MODULE_9__["AboutPageModule"]
        ],
        declarations: [_home_page__WEBPACK_IMPORTED_MODULE_6__["HomePage"]],
        entryComponents: []
    })
], HomePageModule);



/***/ }),

/***/ "./src/app/home/home.page.scss":
/*!*************************************!*\
  !*** ./src/app/home/home.page.scss ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (".search {\n  top: 0vh;\n  width: 100%;\n  height: 94vh;\n  z-index: 1;\n}\n\n.nosearch {\n  top: 0vh;\n  width: 100%;\n  height: 100vh;\n  z-index: 1;\n}\n\nion-icon {\n  font-size: 24px;\n}\n\n.search-icon {\n  width: 24px;\n  height: 24px;\n}\n\n.des {\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.search-filters {\n  overflow-x: hidden;\n  overflow-y: scroll;\n  width: 100%;\n  max-height: 40vh;\n}\n\nion-searchbar {\n  padding: 0px;\n  margin: 1px;\n  height: 6vh;\n}\n\n.about-icon {\n  width: 40px;\n  height: 40px;\n  padding: 5px;\n  margin-top: 2px;\n}\n\nion-header {\n  height: 6vh;\n  z-index: 5;\n}\n\n.title {\n  height: 6vh;\n  overflow: hidden;\n}\n\n.location {\n  top: 88vh;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9tbnQvYy9Vc2Vycy9hcm1hYS9EZXNrdG9wL2NvZGluZy9zdXNXb3JrL3N1c01hcHYxL3NyYy9hcHAvaG9tZS9ob21lLnBhZ2Uuc2NzcyIsInNyYy9hcHAvaG9tZS9ob21lLnBhZ2Uuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQTtFQUNFLFFBQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtFQUNBLFVBQUE7QUNIRjs7QURNQTtFQUNFLFFBQUE7RUFDQSxXQUFBO0VBQ0EsYUFBQTtFQUNBLFVBQUE7QUNIRjs7QURNQTtFQUNFLGVBQUE7QUNIRjs7QURNQTtFQUNFLFdBQUE7RUFDQSxZQUFBO0FDSEY7O0FETUE7RUFDRSxnQkFBQTtFQUNBLHVCQUFBO0FDSEY7O0FETUE7RUFDRSxrQkFBQTtFQUNBLGtCQUFBO0VBQ0EsV0FBQTtFQUNBLGdCQUFBO0FDSEY7O0FETUE7RUFDRSxZQUFBO0VBQ0EsV0FBQTtFQUNBLFdBQUE7QUNIRjs7QURNQTtFQUNFLFdBQUE7RUFDQSxZQUFBO0VBQ0EsWUFBQTtFQUNBLGVBQUE7QUNIRjs7QURNQTtFQUNFLFdBQUE7RUFDQSxVQUFBO0FDSEY7O0FETUE7RUFDRSxXQUFBO0VBQ0EsZ0JBQUE7QUNIRjs7QURVQTtFQUNFLFNBQUE7QUNQRiIsImZpbGUiOiJzcmMvYXBwL2hvbWUvaG9tZS5wYWdlLnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIjbWFwX2NhbnZhcyB7XG5cbn1cblxuLnNlYXJjaCB7XG4gIHRvcDogMHZoO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiA5NHZoO1xuICB6LWluZGV4OiAxO1xufVxuXG4ubm9zZWFyY2gge1xuICB0b3A6IDB2aDtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwdmg7XG4gIHotaW5kZXg6IDE7XG59XG5cbmlvbi1pY29uIHtcbiAgZm9udC1zaXplOiAyNHB4O1xufVxuXG4uc2VhcmNoLWljb24ge1xuICB3aWR0aDogMjRweDtcbiAgaGVpZ2h0OiAyNHB4O1xufVxuXG4uZGVzIHtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG59XG5cbi5zZWFyY2gtZmlsdGVycyB7XG4gIG92ZXJmbG93LXg6IGhpZGRlbjtcbiAgb3ZlcmZsb3cteTogc2Nyb2xsO1xuICB3aWR0aDogMTAwJTtcbiAgbWF4LWhlaWdodDogNDB2aDtcbn1cblxuaW9uLXNlYXJjaGJhciB7XG4gIHBhZGRpbmc6IDBweDtcbiAgbWFyZ2luOiAxcHg7XG4gIGhlaWdodDogNnZoO1xufVxuXG4uYWJvdXQtaWNvbiB7XG4gIHdpZHRoOiA0MHB4O1xuICBoZWlnaHQ6IDQwcHg7XG4gIHBhZGRpbmc6IDVweDtcbiAgbWFyZ2luLXRvcDogMnB4O1xufVxuXG5pb24taGVhZGVyIHtcbiAgaGVpZ2h0OiA2dmg7XG4gIHotaW5kZXg6IDU7XG59XG5cbi50aXRsZSB7XG4gIGhlaWdodDogNnZoO1xuICBvdmVyZmxvdzogaGlkZGVuO1xufVxuXG4udG9hc3Qge1xuXG59XG5cbi5sb2NhdGlvbiB7XG4gIHRvcDogODh2aDtcbn1cbiIsIi5zZWFyY2gge1xuICB0b3A6IDB2aDtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogOTR2aDtcbiAgei1pbmRleDogMTtcbn1cblxuLm5vc2VhcmNoIHtcbiAgdG9wOiAwdmg7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMHZoO1xuICB6LWluZGV4OiAxO1xufVxuXG5pb24taWNvbiB7XG4gIGZvbnQtc2l6ZTogMjRweDtcbn1cblxuLnNlYXJjaC1pY29uIHtcbiAgd2lkdGg6IDI0cHg7XG4gIGhlaWdodDogMjRweDtcbn1cblxuLmRlcyB7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xufVxuXG4uc2VhcmNoLWZpbHRlcnMge1xuICBvdmVyZmxvdy14OiBoaWRkZW47XG4gIG92ZXJmbG93LXk6IHNjcm9sbDtcbiAgd2lkdGg6IDEwMCU7XG4gIG1heC1oZWlnaHQ6IDQwdmg7XG59XG5cbmlvbi1zZWFyY2hiYXIge1xuICBwYWRkaW5nOiAwcHg7XG4gIG1hcmdpbjogMXB4O1xuICBoZWlnaHQ6IDZ2aDtcbn1cblxuLmFib3V0LWljb24ge1xuICB3aWR0aDogNDBweDtcbiAgaGVpZ2h0OiA0MHB4O1xuICBwYWRkaW5nOiA1cHg7XG4gIG1hcmdpbi10b3A6IDJweDtcbn1cblxuaW9uLWhlYWRlciB7XG4gIGhlaWdodDogNnZoO1xuICB6LWluZGV4OiA1O1xufVxuXG4udGl0bGUge1xuICBoZWlnaHQ6IDZ2aDtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbn1cblxuLmxvY2F0aW9uIHtcbiAgdG9wOiA4OHZoO1xufSJdfQ== */");

/***/ }),

/***/ "./src/app/home/home.page.ts":
/*!***********************************!*\
  !*** ./src/app/home/home.page.ts ***!
  \***********************************/
/*! exports provided: HomePage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomePage", function() { return HomePage; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/fesm2015/ionic-angular.js");
/* harmony import */ var _ionic_native_google_maps__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ionic-native/google-maps */ "./node_modules/@ionic-native/google-maps/index.js");
/* harmony import */ var _mapStyle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./mapStyle */ "./src/app/home/mapStyle.ts");
/* harmony import */ var _events_event_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../events/event.service */ "./src/app/events/event.service.ts");
/* harmony import */ var _services_app_data_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./../services/app-data.service */ "./src/app/services/app-data.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");
/* harmony import */ var _building_modal_building_modal_page__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./../building-modal/building-modal.page */ "./src/app/building-modal/building-modal.page.ts");
/* harmony import */ var _filter_modal_filter_modal_page__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./../filter-modal/filter-modal.page */ "./src/app/filter-modal/filter-modal.page.ts");
/* harmony import */ var _building_list_modal_building_list_modal_page__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./../building-list-modal/building-list-modal.page */ "./src/app/building-list-modal/building-list-modal.page.ts");
/* harmony import */ var _about_about_page__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./../about/about.page */ "./src/app/about/about.page.ts");













let HomePage = class HomePage {
    constructor(toastCtrl, platform, events, appData, router, zone, loadingController, modalController) {
        this.toastCtrl = toastCtrl;
        this.platform = platform;
        this.events = events;
        this.appData = appData;
        this.router = router;
        this.zone = zone;
        this.loadingController = loadingController;
        this.modalController = modalController;
        this.buildings = [];
        this.filters = [];
        this.parkingMarkerOpts = [];
        this.parkingMarkerFlag = true;
        //toast and loading
        this.dataFlag = false; //used in couplation of loading controller and loading data
        this.toastFlagFilter = false;
        this.toastFlagLocation = false;
        //press, hold, search features
        this.pressFlag = false; //press and hold for filter items
        this.search = false; //for search functionality
        this.itemAvailable = false; //for search functionality
        this.filteredItems = []; //for search functionality
        this.toSearch = []; //for search functionality
        //settings and about page
        this.about = {};
        this.settings = {};
        //location feature
        this.locationNumber = 1; //current location
    }
    ionViewWillEnter() {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function* () {
            try {
                this.closeEverything();
            }
            catch (error) {
            }
        });
    }
    ngOnInit() {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function* () {
            var pArr = [];
            pArr.push(this.appData.getOneLineData("SETTINGS"));
            pArr.push(this.appData.getBuildingFilterNames(true, "home"));
            pArr.push(this.appData.getOneLineData("ABOUT"));
            Object(rxjs__WEBPACK_IMPORTED_MODULE_8__["forkJoin"])(pArr).subscribe((data) => tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function* () {
                this.parseSettings(data[0]).then(() => {
                    this.parseBuildingFilterNames(data[1]); //for load map
                });
                this.parseAbout(data[2]);
            }));
            this.loading = yield this.loadingController.create({
                spinner: "bubbles",
                duration: 500 * this.filters.length,
                message: "Fetching Data...",
                translucent: true,
                backdropDismiss: false
            });
            // Since ngOnInit() is executed before `deviceready` event,
            // you have to wait the event.
            this.platform.ready().then(() => {
                this.htmlInfoWindow = new _ionic_native_google_maps__WEBPACK_IMPORTED_MODULE_3__["HtmlInfoWindow"]();
            });
            //lowest priority
            this.setToastFlags();
        });
    }
    parseSettings(data) {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function* () {
            return yield new Promise((res, rej) => {
                try {
                    this.settings = data;
                    var locs = [];
                    for (let i = 1; i <= this.settings["LOCATIONS"]; i++) {
                        var temp = {
                            lat: parseFloat(this.settings["LATITUDE " + i]),
                            lng: parseFloat(this.settings["LONGITUDE " + i])
                        };
                        locs.push(temp);
                        ;
                        delete this.settings["LATITUDE " + i];
                        delete this.settings["LONGITUDE " + i];
                    }
                    this.settings["LOCATIONS"] = locs;
                    this.settings["ZOOM"] = parseFloat(this.settings["ZOOM"]);
                    this.settings["MIN_ZOOM"] = parseFloat(this.settings["MIN_ZOOM"]);
                    this.settings["MAX_ZOOM"] = parseFloat(this.settings["MAX_ZOOM"]);
                    res();
                }
                catch (e) {
                    console.log(e);
                    rej();
                }
            });
        });
    }
    parseBuildingFilterNames(data) {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function* () {
            this.buildings = data[0];
            this.filters = data[1];
            // console.log("got it");
            // this.events.publish("Building and Filter Names", data); //so there is no repeat
            //load the map
            yield this.loadMap();
            //close everything when map is clicked
            this.map.on(_ionic_native_google_maps__WEBPACK_IMPORTED_MODULE_3__["GoogleMapsEvent"].MAP_CLICK).subscribe((latlng) => {
                // console.log("map click", latlng);
                this.closeEverything();
            });
            //drag end check if need to add home only if no other spots
            // this.map.on(GoogleMapsEvent.MAP_DRAG_END).subscribe(() => {
            //   console.log("map drag end")
            //   console.log(this.map.getCameraTarget());
            // var visibleReg: VisibleRegion = this.map.getVisibleRegion();
            // console.log(visibleReg.contains(this.locations[0]));
            // if(!visibleReg.contains(this.locations[0]) && this.locationNumber == -1) {
            //   this.locationNumber = 0;
            // } else if(visibleReg.contains(this.locations[0]) && this.locationNumber == 0) {
            //   this.locationNumber = -1
            // }
            // });
            //below is only possible with the data recieved
            // add the buildings
            this.addBuildings();
            //get the filter data whenever
            this.appData.getAllFilterData(true).then((data) => {
                this.filters = data;
                var promArr = [];
                for (let i = 0; i < this.filters.length; i++) {
                    promArr.push(this.createFilterMarkers(this.filters[i]));
                }
                Object(rxjs__WEBPACK_IMPORTED_MODULE_8__["forkJoin"])(promArr).subscribe((data) => {
                    //following must be included after the filters
                    for (let i = 0; i < this.filters.length; i++) {
                        //triggered by trigger function in changes status method
                        this.map.addEventListener(this.filters[i]['FILTER_NAME']).subscribe(() => tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function* () {
                            if (!this.toastFlagFilter) {
                                const toast = yield this.toastCtrl.create({
                                    header: "TIP",
                                    message: "Hold the filter icon to see a list of all filters",
                                    position: 'bottom',
                                    translucent: true,
                                    keyboardClose: true,
                                    cssClass: 'toast',
                                    color: 'light',
                                    buttons: [
                                        {
                                            side: 'end',
                                            role: 'cancel',
                                            icon: 'checkmark-outline',
                                            handler: () => {
                                                console.log("cancel clicked");
                                                toast.dismiss();
                                            }
                                        }
                                    ]
                                });
                                toast.present();
                                setTimeout(() => {
                                    toast.dismiss();
                                }, 5000);
                                this.toastFlagFilter = true;
                            }
                            //actual code to toggle the visibility of the markers
                            for (let j = 0; j < this.filters[i]['MARKER_DATA'].length; j++) {
                                // const element = this.filters[i]['MARKER_DATA'][j];
                                if (this.filters[i]['MARKER_DATA'][j]['MARKER']) {
                                    //if it is an individual marker then
                                    this.filters[i]['MARKER_DATA'][j]['MARKER'].setVisible(this.filters[i]['ACTIVE']);
                                }
                                else {
                                    // if it is a cluster then call function
                                    this.toggleClusterMarker(this.filters[i]['MARKER_DATA'][j], this.filters[i]['ACTIVE']);
                                }
                            }
                        }));
                    }
                    this.dataFlag = true;
                    //try to dismiss the loading if it is necessary
                    try {
                        this.loading.dismiss();
                    }
                    catch (error) {
                        console.log("not needed: " + error);
                    }
                    console.log("added all markers and listeners");
                });
            });
            // updated event filters active status
            for (let i = 0; i < this.filters.length; i++) {
                //make filter active/not active
                yield this.events.subscribe(this.filters[i]['FILTER_NAME'], (data) => {
                    // update active status
                    this.filters[i]['ACTIVE'] = data['ACTIVE'];
                    //first check if data has come in
                    if (!this.dataFlag) {
                        console.log("U GOTTA WAIT");
                        this.loading.present().then(() => {
                            this.loading.onWillDismiss().then(() => {
                                this.changeStatus(this.filters[i]['FILTER_NAME']);
                            });
                        });
                    }
                    else {
                        // if(!this.filters[i]['DATA'][0]['MARKER']) {
                        //   console.log("NO MARKER....AHH SHIT");
                        // }
                        //if it has then update the visible status
                        this.changeStatus(this.filters[i]['FILTER_NAME']);
                    }
                });
            }
        });
    }
    parseAbout(val) {
        this.about = val;
        // console.log(this.about);
        var tempT = [];
        var tempD = [];
        for (let i = 1; i <= this.about["NUM_GOALS"]; i++) {
            tempT.push(this.about["GOAL TITLE " + i]);
            tempD.push(this.about["GOAL DESCRIPTION " + i]);
        }
        var img;
        if (this.about["IMAGE"]) {
            if (this.about["IMAGE"].slice(0, 3) == "data" || this.about["IMAGE"].slice(0, 3) == "http" || this.about["IMAGE"].includes('www') || this.about["IMAGE"].includes('.edu')) {
                //do nothing base64 data or external link
            }
            else {
                //image stored in images folder
                this.about["IMAGE"] = 'assets/images/' + this.about["IMAGE"];
            }
        }
        else {
            //if it does not exist
            this.about["IMAGE"] = "assets/images/campus.jpg";
        }
        this.about["GOAL TITLES"] = tempT;
        this.about["GOAL DESCRIPTIONS"] = tempD;
        // console.log(this.about);
    }
    loadMap() {
        let style = [];
        style = _mapStyle__WEBPACK_IMPORTED_MODULE_4__["mapStyle"];
        this.map = _ionic_native_google_maps__WEBPACK_IMPORTED_MODULE_3__["GoogleMaps"].create('map_canvas', {
            camera: {
                target: this.settings["LOCATIONS"][0],
                zoom: this.settings["ZOOM"],
                tilt: 0,
            },
            'gestures': {
                'scroll': true, 'tilt': true, 'rotate': false, 'zoom': true
            },
            styles: style,
            preferences: {
                zoom: {
                    minZoom: this.settings["MIN_ZOOM"],
                    maxZoom: this.settings["MAX_ZOOM"]
                },
            }
        });
        this.map.setIndoorEnabled(true);
        this.map.setMyLocationEnabled(false);
        this.map.setMyLocationButtonEnabled(false);
    }
    setToastFlags() {
        this.appData.getUpdatedToastTips("Filter").then((val) => {
            this.toastFlagFilter = val;
        });
        this.appData.getUpdatedToastTips("Location").then((val) => {
            this.toastFlagLocation = val;
        });
    }
    animateCamera(lat, long) {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function* () {
            console.log("animating camera");
            this.map.animateCamera({
                target: { lat: lat, lng: long },
                zoom: 17,
                tilt: 0,
                // bearing: 140,
                duration: 10000
            });
        });
    }
    handleLocationChange() {
        this.animateCamera(this.settings["LOCATIONS"][this.locationNumber]['lat'], this.settings["LOCATIONS"][this.locationNumber]['lng']).then(() => tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function* () {
            this.locationNumber += 1;
            if (this.locationNumber == this.settings["LOCATIONS"].length) {
                this.locationNumber = 0;
            }
            if (!this.toastFlagLocation) {
                const toast = yield this.toastCtrl.create({
                    header: "TIP",
                    message: "Click some filters on the top right to see what's available here in the area!",
                    position: 'bottom',
                    translucent: true,
                    keyboardClose: true,
                    cssClass: 'toast',
                    color: 'light',
                    buttons: [
                        {
                            side: 'end',
                            role: 'cancel',
                            icon: 'checkmark-outline',
                            handler: () => {
                                console.log("cancel clicked");
                                toast.dismiss();
                            }
                        }
                    ]
                });
                toast.present();
                setTimeout(() => {
                    toast.dismiss();
                }, 5000);
                this.toastFlagLocation = true;
            }
        }));
    }
    addBuildings() {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function* () {
            for (let i = 0; i < this.buildings.length; i++) {
                const building = this.buildings[i];
                //set up for icons at this location
                this.buildings[i]["ICONS"] = [];
                // add the coordinates
                var coords = [];
                for (let coor = 1; coor <= building['NUM_COORDINATES']; coor++) {
                    var latC = building['LATITUDE ' + coor];
                    var longC = building['LONGITUDE ' + coor];
                    var tempCoorSet = {
                        lat: latC,
                        lng: longC
                    };
                    coords.push(tempCoorSet);
                }
                // let buildingCoors: ILatLng = coords
                this.buildings[i]['COORS'] = coords;
                //if it is not a parking structure
                var fillC = '#eaf0ff';
                var strokeC = '#537ed0';
                //if it is a parking structure
                if (building['PARKING'] == "TRUE") {
                    fillC = '#808080';
                    strokeC = '#454545';
                }
                // create polygon
                let polygon = this.map.addPolygonSync({
                    points: this.buildings[i]['COORS'],
                    strokeColor: strokeC,
                    fillColor: fillC,
                    strokeWidth: 5,
                    zIndex: 1,
                    clickable: true
                });
                if (building['PARKING'] == "TRUE") {
                    //If this building is a parking lot
                    polygon.setClickable(false);
                    let parkingMarkerOpt = {
                        position: (new _ionic_native_google_maps__WEBPACK_IMPORTED_MODULE_3__["LatLngBounds"](this.buildings[i]['COORS'])).getCenter(),
                        icon: {
                            url: 'assets/icon/parking.png',
                            size: {
                                width: 30,
                                height: 30
                            }
                        },
                        flat: true,
                        visible: true,
                        disableAutoPan: true,
                        zIndex: 2,
                        name: building['FULL_NAME'],
                        des: building['DESCRIPTION']
                    };
                    //add to cluster and opts array
                    // this.parkingMarkerCluster.addMarker(parkingMarkerOpt, true);
                    this.parkingMarkerOpts.push(parkingMarkerOpt);
                }
                // when clicked open htmlinfo window.
                polygon.on(_ionic_native_google_maps__WEBPACK_IMPORTED_MODULE_3__["GoogleMapsEvent"].POLYGON_CLICK).subscribe((data) => {
                    // if parking then set polygon clickable to false
                    polygon.setClickable(!building['PARKING']);
                    // console.log("polygon clicked");
                    // this.filterFab.close(); //close the fab
                    // html info window when polygon is clicked
                    let frame = document.createElement('div');
                    frame.innerHTML = `
          <div class="infoWindow ion-text-nowrap">
          ` + building['SHORTENED_NAME'] + `
          </div>`;
                    if (building['LEED_CERTIFICATION']) { //if the building has a leed certification, parking building do not have leed certifications
                        frame.getElementsByClassName("infoWindow")[0].addEventListener("click", () => {
                            //open modal instead
                            this.htmlInfoWindow.close();
                            this.goToPage(building);
                        });
                    }
                    this.htmlInfoWindow.setContent(frame, {
                        "text-align": 'center',
                        "height": "5vh",
                        "width": "auto",
                        "padding": "0px",
                        "margin": "-5px",
                        "margin-top": "1vh"
                    });
                    let centerMarker = this.map.addMarkerSync({
                        position: (new _ionic_native_google_maps__WEBPACK_IMPORTED_MODULE_3__["LatLngBounds"](this.buildings[i]['COORS'])).getCenter(),
                        visible: false,
                        zIndex: 0
                    });
                    this.htmlInfoWindow.open(centerMarker);
                });
                this.buildings[i]['POLYGON'] = polygon;
                this.toSearch.push(this.buildings[i]);
            }
            //set up for parking marker cluster
            this.parkingMarkerClusterOpts = {
                markers: this.parkingMarkerOpts,
                icons: [
                    {
                        min: 3,
                        max: 200,
                        url: 'assets/icon/parking.png',
                        label: {
                            bold: true,
                            fontSize: 32,
                            color: "black" //#24f42f
                        }
                    }
                ],
                boundsDraw: false,
                maxZoomLevel: 18
            };
            this.parkingMarkerCluster = this.map.addMarkerClusterSync(this.parkingMarkerClusterOpts);
            // this is for events from model in settings if possible
            this.events.subscribe("PARKING_MARKER_CLUSTER", (data) => {
                this.changeStatus("PARKING_MARKER_CLUSTER");
            });
            // turn on and off the parking
            this.map.addEventListener("PARKING_MARKER_CLUSTER").subscribe(() => {
                // console.log("parking marker cluster");
                this.parkingMarkerFlag = !this.parkingMarkerFlag;
                if (this.parkingMarkerFlag) {
                    //if from false to true create marker cluster.
                    this.parkingMarkerCluster = this.map.addMarkerClusterSync(this.parkingMarkerClusterOpts);
                }
                else {
                    this.parkingMarkerCluster.remove();
                }
            });
            //open html info window when parking marker is clicked
            this.parkingMarkerCluster.on(_ionic_native_google_maps__WEBPACK_IMPORTED_MODULE_3__["GoogleMapsEvent"].MARKER_CLICK).subscribe((params) => {
                let marker = params[1];
                let frame = document.createElement('div');
                frame.innerHTML = `
        <div class="ion-text-wrap">
        <p>` + marker.get('name') + `</p>`;
                for (let i = 0; i < marker.get('des').length; i++) {
                    frame.innerHTML += `<small>` + marker.get('des')[i] + `</small>`;
                }
                frame.innerHTML += `</div>`;
                this.htmlInfoWindow.setContent(frame, {
                    "text-align": 'center',
                    "height": "auto",
                    "width": "auto",
                    "padding": "0px",
                    "margin": "-5px",
                });
                this.htmlInfoWindow.open(marker);
            });
        });
    }
    addIconToBuilding(iconUrl, buildingID) {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function* () {
            const ind = this.buildings.findIndex(building => building['BUILDING_ID'] === buildingID);
            this.buildings[ind]["ICONS"].push(iconUrl);
        });
    }
    createHtmlInfoWindow(marker) {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function* () {
            this.closeEverything();
            let frame = document.createElement('div');
            frame.innerHTML = `
      <div class="markerInfoWindow">
        <h5>` + marker.get('TITLE') + `</h5>
        <p><small>` + marker.get('DESCRIPTION') + `<small></p>
      </div>
      `;
            this.htmlInfoWindow.setContent(frame, {
                "text-align": 'center',
                "min-height": "20vh",
                // "max-height": "40vh",
                "min-width": "45vw",
                // "max-width": "65vw",
                "padding": "0px",
                "margin": "-1vw",
            });
            this.htmlInfoWindow.open(marker);
        });
    }
    toggleClusterMarker(markerDataIndv, create) {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function* () {
            if (create) {
                if (!markerDataIndv['MARKER_CLUSTER']) {
                    markerDataIndv['MARKER_CLUSTER'] = this.map.addMarkerClusterSync(markerDataIndv['MARKER_CLUSTER_OPTIONS']);
                    markerDataIndv['MARKER_CLUSTER'].on(_ionic_native_google_maps__WEBPACK_IMPORTED_MODULE_3__["GoogleMapsEvent"].MARKER_CLICK).subscribe((params) => {
                        let marker = params[1];
                        this.createHtmlInfoWindow(marker);
                    });
                }
            }
            else {
                //otherwise remove the cluster
                markerDataIndv['MARKER_CLUSTER'].remove();
                delete markerDataIndv['MARKER_CLUSTER'];
            }
        });
    }
    createClusterMarkerOptions(markerDataIndv) {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function* () {
            let markerClusterDataOpt;
            // console.log(markerDataIndv['ICON']);
            markerClusterDataOpt = {
                markers: markerDataIndv['MARKER_OPTIONS'],
                icons: [
                    {
                        min: 3,
                        max: 200,
                        url: markerDataIndv['ICON']['url'],
                        label: {
                            bold: true,
                            fontSize: 32,
                            color: "#24f42f"
                        }
                    }
                ],
                boundsDraw: false,
                maxZoomLevel: 18
            };
            markerDataIndv['MARKER_CLUSTER_OPTIONS'] = markerClusterDataOpt;
        });
    }
    //array of data of json objects to create the markers for. This is only for one filter
    createFilterMarkers(filt) {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function* () {
            return yield new Promise((resolve, reject) => {
                //collapse the data
                filt['MARKER_DATA'] = [];
                for (let i = 0; i < filt['DATA'].length; i++) {
                    // current item = filt['DATA'][i]; or arr[j]
                    if (filt['DATA'][i]['ICON'].slice(0, 3) == "data") {
                        filt['DATA'][i]['ICON'] = filt['DATA'][i]['ICON']; //base64 data
                    }
                    else if (filt['DATA'][i]['ICON']) {
                        filt['DATA'][i]['ICON'] = 'assets/icon/' + filt['DATA'][i]['ICON'] + '.png';
                    }
                    else {
                        filt['DATA'][i]['ICON'] = "assets/icon/favicon_cluster.png";
                    }
                    var icon = {
                        url: filt['DATA'][i]['ICON'],
                        size: {
                            width: 35,
                            height: 35
                        }
                    };
                    if (parseInt(filt['DATA'][i]['BUILDING_ID']) != 0) {
                        this.addIconToBuilding(filt['DATA'][i]['ICON'], filt['DATA'][i]['BUILDING_ID']);
                    }
                    var markerOpt = {
                        position: {
                            lat: filt['DATA'][i]['LATITUDE'],
                            lng: filt['DATA'][i]['LONGITUDE']
                        },
                        icon: icon,
                        visible: false,
                        zIndex: 2,
                        disableAutoPan: true,
                        "TITLE": filt['DATA'][i]['TITLE'],
                        "DESCRIPTION": filt['DATA'][i]['DESCRIPTION']
                    };
                    //if marker data is not empty check last elemnet of marker data and see if the icons match
                    if (filt['MARKER_DATA'].length != 0 && filt['MARKER_DATA'][filt['MARKER_DATA'].length - 1]['ICON']['url'] == filt['DATA'][i]['ICON']) {
                        //set viisibility to true
                        filt['MARKER_DATA'][filt['MARKER_DATA'].length - 1]['MARKER_OPTIONS'][0]['visible'] = true;
                        markerOpt['visible'] = true;
                        //add into the list of markers
                        filt['MARKER_DATA'][filt['MARKER_DATA'].length - 1]['MARKER_OPTIONS'].push(markerOpt);
                    }
                    else {
                        //then simply add a new one into marker data
                        var markerDataOPT = {};
                        markerDataOPT['TITLE'] = filt['DATA'][i]['TITLE'];
                        markerDataOPT['DESCRIPTION'] = filt['DATA'][i]['DESCRIPTION'];
                        markerDataOPT['ICON'] = icon;
                        markerDataOPT['MARKER_OPTIONS'] = [markerOpt];
                        filt['MARKER_DATA'].push(markerDataOPT);
                    }
                } //end for
                for (let i = 0; i < filt['MARKER_DATA'].length; i++) {
                    // element = filt['MARKER_DATA'][i];
                    if (filt['MARKER_DATA'][i]['MARKER_OPTIONS'].length > 1) {
                        // marker options length is greater than 1 then cluster else create individual marker
                        this.createClusterMarkerOptions(filt['MARKER_DATA'][i]);
                    }
                    else {
                        //create the individual marker
                        // console.log(filt['MARKER_DATA'][i]['MARKER_OPTIONS'][0]);
                        filt['MARKER_DATA'][i]['MARKER'] = this.map.addMarkerSync(filt['MARKER_DATA'][i]['MARKER_OPTIONS'][0]);
                        filt['MARKER_DATA'][i]['MARKER'].on(_ionic_native_google_maps__WEBPACK_IMPORTED_MODULE_3__["GoogleMapsEvent"].MARKER_CLICK).subscribe(() => {
                            this.createHtmlInfoWindow(filt['MARKER_DATA'][i]['MARKER']);
                        });
                    }
                    this.toSearch.unshift(filt['MARKER_DATA'][i]);
                }
                //go across and make markers for each of the ones that are not clustered
                //otherwise form marker cluster options and THEN make a function call to create the marker cluster with parameter on whether to remove the marker cluster or create one.
                //add into tosearch within this new loop
                resolve(filt);
            });
        });
    }
    changeStatus(filter_name) {
        this.map.trigger(filter_name);
    }
    goToPage(buildingData) {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function* () {
            // console.log(buildingData);
            const modal = yield this.modalController.create({
                component: _building_modal_building_modal_page__WEBPACK_IMPORTED_MODULE_9__["BuildingModalPage"],
                componentProps: {
                    building: buildingData
                },
                swipeToClose: true,
                cssClass: 'my-modal'
            });
            modal.onDidDismiss().then((detail) => {
                try {
                    if (detail.data.redirect) {
                    }
                }
                catch (error) {
                    // console.log("no redirect");
                }
            });
            this.closeEverything();
            yield modal.present();
        });
    }
    stop_close(event) {
        try {
            event.preventDefault();
        }
        catch (e) { }
        try {
            event.stopPropagation();
        }
        catch (e) { }
        return false;
    }
    publishEvent(eventName, data) {
        this.events.publish(eventName, data);
    }
    onPress(filterData) {
        // console.log("press");
        this.pressFlag = true;
        setTimeout(() => {
            if (this.pressFlag) {
                this.openFilterModal(filterData);
            }
            else {
                // console.log("did not hold");
            }
        }, 500); //hold for 500 ms
    }
    onPressUp() {
        // console.log("press up");
        this.pressFlag = false;
    }
    openFilterModal(filterData) {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function* () {
            // console.log("filter modal");
            const modal = yield this.modalController.create({
                component: _filter_modal_filter_modal_page__WEBPACK_IMPORTED_MODULE_10__["FilterModalPage"],
                componentProps: {
                    filter: filterData
                },
                swipeToClose: true,
                cssClass: 'filter-modal'
            });
            modal.onDidDismiss().then((detail) => {
                try {
                    // console.log(detail.data);
                    if (detail.data.redirect) {
                        const loc = detail.data['marker'].getPosition();
                        this.animateCamera(loc['lat'], loc['lng']);
                        detail.data['marker'].setVisible(true);
                        detail.data['marker'].trigger(_ionic_native_google_maps__WEBPACK_IMPORTED_MODULE_3__["GoogleMapsEvent"].MARKER_CLICK, loc);
                    }
                }
                catch (error) {
                    // console.log("no redirect");
                }
            });
            this.closeEverything();
            yield modal.present();
        });
    }
    getItems(ev) {
        this.filteredItems = []; //reset filteredItems
        const val = ev.target.value;
        if (val && val.trim() != "") {
            this.itemAvailable = true;
            //adding dynamically the fitlered items
            for (let index = 0; index < this.toSearch.length; index++) {
                const item = this.toSearch[index];
                if (((item['FULL_NAME'] + "").toUpperCase().search(val.toUpperCase()) > -1) || ((item['TITLE'] + "").toUpperCase().search(val.toUpperCase()) > -1) || (item['DESCRIPTION'].toUpperCase().search(val.toUpperCase()) > -1) || ((item['SHORTENED_NAME'] + "").toUpperCase().search(val.toUpperCase()) > -1)) {
                    this.filteredItems.push(item);
                }
            }
        }
        else {
            this.itemAvailable = false;
        }
    }
    goToItem(item) {
        // this.search = false;
        var loc;
        if (item['MARKER']) {
            //filter item
            loc = item['MARKER'].getPosition();
            item['MARKER'].setVisible(true);
            item['MARKER'].trigger(_ionic_native_google_maps__WEBPACK_IMPORTED_MODULE_3__["GoogleMapsEvent"].MARKER_CLICK, loc);
        }
        else if (item['POLYGON']) {
            //building or parking
            loc = (new _ionic_native_google_maps__WEBPACK_IMPORTED_MODULE_3__["LatLngBounds"](item['COORS'])).getCenter();
            item['POLYGON'].trigger(_ionic_native_google_maps__WEBPACK_IMPORTED_MODULE_3__["GoogleMapsEvent"].POLYGON_CLICK, loc);
        }
        else if (item['MARKER_CLUSTER_OPTIONS']) {
            //cluster item
            //see if cluster is active
            loc = item['MARKER_OPTIONS'][0]['position'];
            if (!item['MARKER_CLUSTER']) {
                this.toggleClusterMarker(item, true);
            }
        }
        this.animateCamera(loc['lat'], loc['lng']);
    }
    openAboutModal() {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function* () {
            const modal = yield this.modalController.create({
                component: _about_about_page__WEBPACK_IMPORTED_MODULE_12__["AboutPage"],
                componentProps: {
                    about: this.about
                },
                swipeToClose: true,
                cssClass: 'about-modal' //same css class
            });
            modal.onDidDismiss().then((detail) => { });
            this.closeEverything();
            yield modal.present();
        });
    }
    openBuildingListModal() {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function* () {
            const modal = yield this.modalController.create({
                component: _building_list_modal_building_list_modal_page__WEBPACK_IMPORTED_MODULE_11__["BuildingListModalPage"],
                componentProps: {
                    buildings: this.buildings,
                },
                swipeToClose: true,
                cssClass: 'filter-modal' //same css class
            });
            modal.onDidDismiss().then((detail) => {
                try {
                    // console.log(detail.data);
                    if (!detail.data.redirect) {
                        const loc = (new _ionic_native_google_maps__WEBPACK_IMPORTED_MODULE_3__["LatLngBounds"](detail.data['building']['COORS'])).getCenter();
                        this.animateCamera(loc['lat'], loc['lng']);
                        detail.data['building']['POLYGON'].trigger(_ionic_native_google_maps__WEBPACK_IMPORTED_MODULE_3__["GoogleMapsEvent"].POLYGON_CLICK, loc);
                    }
                    else {
                        // console.log("redirect to building page");
                    }
                }
                catch (error) {
                    // console.log("regular close");
                }
            });
            this.closeEverything();
            yield modal.present();
        });
    }
    closeEverything() {
        this.htmlInfoWindow.close();
        this.search = false;
        this.itemAvailable = false;
        this.filteredItems = [];
    }
};
HomePage.ctorParameters = () => [
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_2__["ToastController"] },
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_2__["Platform"] },
    { type: _events_event_service__WEBPACK_IMPORTED_MODULE_5__["EventService"] },
    { type: _services_app_data_service__WEBPACK_IMPORTED_MODULE_6__["AppDataService"] },
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_7__["Router"] },
    { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgZone"] },
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_2__["LoadingController"] },
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_2__["ModalController"] }
];
HomePage = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-home',
        template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./home.page.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/home/home.page.html")).default,
        styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./home.page.scss */ "./src/app/home/home.page.scss")).default]
    }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ionic_angular__WEBPACK_IMPORTED_MODULE_2__["ToastController"],
        _ionic_angular__WEBPACK_IMPORTED_MODULE_2__["Platform"],
        _events_event_service__WEBPACK_IMPORTED_MODULE_5__["EventService"],
        _services_app_data_service__WEBPACK_IMPORTED_MODULE_6__["AppDataService"],
        _angular_router__WEBPACK_IMPORTED_MODULE_7__["Router"],
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["NgZone"],
        _ionic_angular__WEBPACK_IMPORTED_MODULE_2__["LoadingController"],
        _ionic_angular__WEBPACK_IMPORTED_MODULE_2__["ModalController"]])
], HomePage);



/***/ }),

/***/ "./src/app/home/mapStyle.ts":
/*!**********************************!*\
  !*** ./src/app/home/mapStyle.ts ***!
  \**********************************/
/*! exports provided: mapStyle */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapStyle", function() { return mapStyle; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

const mapStyle = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ebe3cd"
            }
        ]
    },
    {
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#523735"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#f5f1e6"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#c9b2a6"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#dcd2be"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#ae9e90"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dfd2ae"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dfd2ae"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#93817c"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#a5b076"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#447530"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f1e6"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#fdfcf8"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f8c967"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#e9bc62"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e98d58"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#db8555"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#806b63"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dfd2ae"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#8f7d77"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#ebe3cd"
            }
        ]
    },
    {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dfd2ae"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#b9d3c2"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#92998d"
            }
        ]
    }
];


/***/ })

}]);
//# sourceMappingURL=home-home-module-es2015.js.map