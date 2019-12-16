import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage({
  name: 'PaysucessPage',
  segment: 'PaysucessPage',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-paysucess',
  templateUrl: 'paysucess.html',
})
export class PaysucessPage {
  public paysuccess = true;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.paysuccess = this.navParams.get('status');
  }
  backbtn () {
    this.viewCtrl.dismiss();
  }
}
