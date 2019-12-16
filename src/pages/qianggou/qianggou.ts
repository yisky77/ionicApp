import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  name: 'QianggouPage',
  segment: 'QianggouPage',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-qianggou',
  templateUrl: 'qianggou.html',
})
export class QianggouPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QianggouPage');
  }

}
