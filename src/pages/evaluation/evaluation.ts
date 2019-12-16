import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';

@IonicPage({
  name: 'EvaluationPage',
  segment: 'EvaluationPage',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-evaluation',
  templateUrl: 'evaluation.html',
})
export class EvaluationPage {
  public navigatorBackColor:any;
  public commentdata_statisticsVO;
  public commentdata_list;
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider,public viewCtrl: ViewController) {
    let data = this.storage.get('globoalSet');
    this.navigatorBackColor = data.navigatorBackColor;
    let evaluation = navParams.get('evaluation');
    this.commentdata_statisticsVO = evaluation.statisticsVO;
    this.commentdata_list = evaluation.data;
    // console.log('UserId', evaluation);
  }

  closeService () {
    this.viewCtrl.dismiss();    
  }

}
