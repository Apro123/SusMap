import { Component, OnInit, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Environment } from '@ionic-native/google-maps';
import { Storage } from '@ionic/storage';
import { EventService } from './events/event.service';
import { AppDataService } from './services/app-data.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})

export class AppComponent implements OnInit {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private events: EventService,
    private appData: AppDataService,
    private router: Router,
    private zone: NgZone,
    private menu: MenuController
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    // get filter and building data
    // await this.events.subscribe("Building and Filter Names", async (data :any) => {
    //   this.buildings = data[0];
    //   for (let i = 0; i < this.buildings.length; i++) {
    //     this.buildings[i]['URL'] = "/folder/" + this.buildings[i]['BUILDING_ID'];
    //   }
    //   this.filters = data[1];
    // });

    this.platform.ready().then(() => {
      // google maps
      Environment.setEnv({
        // api key for server
        'API_KEY_FOR_BROWSER_RELEASE': '',

        // api key for local development
        'API_KEY_FOR_BROWSER_DEBUG': ''
      });

      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // console.log("inside plaform");
    });
    // console.log("after plaform");
  }

  ngOnInit() {
  }

}
