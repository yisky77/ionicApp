import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { ConfigProvider } from '../../providers/config/config';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { UtilProvider } from '../../providers/util/util';


@IonicPage({
  name: 'InvoicePage',
  segment: 'InvoicePage',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-invoice',
  templateUrl: 'invoice.html',
})
export class InvoicePage {
  public navigatorBackColor;
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider, public config:ConfigProvider,public httpService:HttpServicesProvider, public util: UtilProvider, public modalCtrl: ModalController) {
    let data = this.storage.get('globoalSet');
    this.navigatorBackColor = data.navigatorBackColor;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InvoicePage');
  }

  // 保存
  savedata () {
    // this.httpService.requestPostTokenDataform(this.config.requesturl + '/payindex',{paySn: this.paySn.paySn,optionsRadios:type}, (res) => {
    //   let responsedatas = res;
    //   this.util.dismiss(0);
    //   if (responsedatas.code == 200) {
    //   } else {
    //     this.util.Toast(responsedatas.msg, 'top');
    //   }
    // })
  }

}
