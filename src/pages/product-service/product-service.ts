import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';


@IonicPage({
  name: 'ProductServicePage',
  segment: 'ProductServicePage',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-product-service',
  templateUrl: 'product-service.html',
})
export class ProductServicePage {
  public navigatorBackColor:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider,public viewCtrl: ViewController) {
    let data = this.storage.get('globoalSet');
    this.navigatorBackColor = data.navigatorBackColor;
  }

  closeService () {
    this.viewCtrl.dismiss();    
  }
}
