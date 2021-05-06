import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { MenuController } from '@ionic/angular';
// import { EventService } from './../events/event.service';
import { AppDataService } from './../services/app-data.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public id;
  public building = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    // private menu: MenuController,
    // private events: EventService,
    private info: AppDataService
  ) { }

  ionViewDidEnter() {
    console.log(this.building);
    // this.menu.enable(true,'outsideMap');
  }

  async ngOnInit() {
    var folder: string;
    folder = this.activatedRoute.snapshot.paramMap.get('id');

    // this.events.publish('page', Number(folder));
    this.id = Number(folder);
    await this.info.getSpecificBuildingData(this.id).then((data) => {
      if(data) {
        this.building = data;
      }
    });
  }


}
