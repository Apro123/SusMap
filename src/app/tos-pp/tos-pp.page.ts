import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonSlides, Platform, IonContent } from '@ionic/angular';

@Component({
  selector: 'app-tos-pp',
  templateUrl: './tos-pp.page.html',
  styleUrls: ['./tos-pp.page.scss'],
})
export class TosPpPage {

  public agreeButton: boolean;
  @ViewChild('tosSlider', {static: false}) slides: IonSlides;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    // autoHeight: true
    // allowTouchMove: false
  };
  @ViewChild(IonContent, {static: true}) content: IonContent;
  public didInit: boolean = false;

  constructor(
    private modalController: ModalController,
    private platform: Platform
  ) {
  }

  // ngAfterViewInit() {
  //     // this.didInit = true;
  // }

  ionViewWillEnter() {
    // @ViewChild('tosSlider', {static: true}) this.slides;
    // @ViewChild(IonContent, {static: true}) this.content: IonContent;
    this.platform.ready().then(() => {
      this.didInit = true;
      console.log(this.agreeButton);
      // this.slides.lockSwipeToNext(true);
      setTimeout(() => {
        // this.slides.getActiveIndex().then((n) => {
        //   console.log(n);
        // });
        this.slides.lockSwipes(this.agreeButton);
      }, 400);
      // this.slides.lockSwipes(true);
    });
  }

  scroll() {
    this.content.scrollToTop(400);
  }

  nextSlide() {
    // console.log("next sldie")
    // this.slides.getActiveIndex().then((n) => {
    //   console.log(n);
    // });
    // console.log(this.agreeButton);
    if(this.agreeButton) {
        this.slides.lockSwipes(false).then(() => {
          // console.log("callingnfunct")
          this.slides.slideNext();
          this.slides.lockSwipes(true);
        });
    } else {
      // console.log("in jhere");
      this.slides.slideNext();
    }

  }

  slidetoNext(index) {
    this.slides.slideTo(index);
  }

  dismiss() {
    console.log("dismissing")
    this.modalController.dismiss();
  }

}
