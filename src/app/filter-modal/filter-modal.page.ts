import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.page.html',
  styleUrls: ['./filter-modal.page.scss'],
})
export class FilterModalPage implements OnInit {

  filter = {};
  name = "";
  icon = "";

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
    // console.log(this.icon);
  }

  dismiss(redirect: boolean, index) {
    this.modalController.dismiss({
      'dismissed': true,
      'redirect': redirect,
      'markerDataItemIndex': index,
    });
  }

}
