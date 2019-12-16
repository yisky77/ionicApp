import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { UtilProvider } from './../../providers/util/util';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { ConfigProvider } from '../../providers/config/config';

@IonicPage({
  name: 'ExchangePage',
  segment: 'ExchangePage/:cid',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-exchange',
  templateUrl: 'exchange.html',
})
export class ExchangePage {
  public navigatorBackColor;
  public currentIndex = 0;
  public cid = 0;
  public prolist;
  public orderList = ['我的退货','我的换货'];
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider, public util:UtilProvider,public httpService:HttpServicesProvider, public config:ConfigProvider,public viewCtrl: ViewController,public modalCtrl: ModalController) {
    let data = this.storage.get('globoalSet');
    this.navigatorBackColor = data.navigatorBackColor;
    this.cid = this.navParams.get('cid');
    if(this.cid !== null && this.cid !== undefined) {
      this.storage.set('backid',this.cid);
    } else {
      this.cid = this.storage.get('backid');
    }
    this.getexchange(this.cid);
  }

  getexchange (i) {
    this.cid = this.currentIndex = Number(i);
    this.storage.set('backid',this.cid);
    if (this.cid !== 1) this.exchange(this.config.requesturl+'/member/backlist')
    else this.exchange(this.config.requesturl+'/member/exchangelist')
  }

  exchange (url) {
    this.util.showLoading('请稍后');
    this.httpService.requestGetTokenData(url, (res) => {
      let responsedatas = JSON.parse(res._body);
      if(responsedatas.code == 200){
        if(this.cid == 0) this.prolist = responsedatas.backList;
        else this.prolist = responsedatas.exchangeList;
      } else if (responsedatas.code == 401) {
        let profileModal = this.modalCtrl.create('LoginPage');
        profileModal.onDidDismiss(data => {
          this.viewCtrl.dismiss();
        })
        profileModal.present();       
      } else {
        this.util.Toast(responsedatas.msg,'top');
      }
      this.util.dismiss(0);
    })
  }

  getRefresh (refresher) {
    this.getexchange(this.cid);
    refresher.complete();
   }

}
