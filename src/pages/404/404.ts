import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';

@IonicPage({
  name: 'WrongPage',
  segment: 'WrongPage',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-404',
  templateUrl: '404.html',
})
export class WrongPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public config:ConfigProvider) {
    console.log(config)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad 404Page');
  }

}
