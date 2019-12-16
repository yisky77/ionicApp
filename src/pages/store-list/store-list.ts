import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController, ModalController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { UtilProvider } from './../../providers/util/util';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { ConfigProvider } from '../../providers/config/config';

@IonicPage({
  name: 'StoreListPage',
  segment: 'StoreListPage',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-store-list',
  templateUrl: 'store-list.html',
})
export class StoreListPage {
  public navigatorBackColor;
  public sellerlist;
  public imgurl;
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider, public util:UtilProvider,public httpService:HttpServicesProvider, public config:ConfigProvider,public viewCtrl: ViewController,public modalCtrl: ModalController) {
    let data = this.storage.get('globoalSet');
    this.navigatorBackColor = data.navigatorBackColor;
    this.getStoreList();
  }

  getStoreList () {
    this.httpService.requestGetData(this.config.requesturl+'/seller', (res) => {
      let responsedatas = JSON.parse(res._body);
      if(responsedatas.code == 200){
        this.imgurl = responsedatas.imgUrl;
        this.sellerlist = responsedatas.seller;
      } else if (responsedatas.code == 401) {
        this.gologinpage();          
      } else {
        this.util.Toast(responsedatas.msg,'top');        
      }
      // this.util.dismiss(0);
    })
  }

  gologinpage () {
    let profileModal = this.modalCtrl.create('LoginPage');
    profileModal.onDidDismiss(data => {
      this.getStoreList();
    })
    profileModal.present();
   }
}
