import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';

@IonicPage()
@Component({
  selector: 'page-about-us',
  templateUrl: 'about-us.html',
})
export class AboutUsPage {
  public navigatorBackColor:any; 
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider) {
    let data = this.storage.get('globoalSet');
    this.navigatorBackColor = data.navigatorBackColor;
    console.log(this.navigatorBackColor)
  }

}
