import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';


@IonicPage({
  name: 'WelcomePage',
  segment: 'WelcomePage',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {
  public hidepic:any;
  public timesup = 6;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    var time = setInterval(() => {
      this.timesup--;
      if(this.timesup <= 0) {
        this.goToHome();
        clearInterval(time);
      }
    }, 1000);
  }
  
  goToHome(){
    this.hidepic = 'showpic';
    this.navCtrl.setRoot(TabsPage);
  }
}
