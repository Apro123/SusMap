import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';

import { IonicStorageModule } from '@ionic/storage';
import { AppDataService } from './services/app-data.service';
import { EventService } from './events/event.service';

//import all the modals
import { BuildingModalPageModule } from './building-modal/building-modal.module';
import { FilterModalPageModule } from './filter-modal/filter-modal.module';
import { BuildingListModalPageModule } from './building-list-modal/building-list-modal.module';
import { AboutPageModule } from './about/about.module';

// import { TextToSpeech } from '@ionic-native/text-to-speech/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      mode: 'ios'
    }),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot({
      name: 'awesome_db',
      driverOrder: ['indexeddb', 'websql', 'sqlite']
    }),
    BuildingModalPageModule,
    FilterModalPageModule,
    BuildingListModalPageModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    HammerModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AppDataService,
    EventService,
    // TextToSpeech,
    Geolocation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
