import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-building-list-modal',
  templateUrl: './building-list-modal.page.html',
  styleUrls: ['./building-list-modal.page.scss'],
})
export class BuildingListModalPage implements OnInit {

  buildings = [];

  constructor(
    private router: Router,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
  }

  dismiss(redirect: boolean, i) {
    if(redirect) {
      this.router.navigate(['/folder/' + this.buildings[i]['BUILDING_ID']]);
    }
    this.modalController.dismiss({
      'dismissed': true,
      'redirect': redirect,
      'index': i,
    });
  }

}
