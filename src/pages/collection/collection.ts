import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { ConfigProvider } from '../../providers/config/config';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { UtilProvider } from '../../providers/util/util';

@IonicPage({
  name: 'CollectionPage',
  segment: 'CollectionPage',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-collection',
  templateUrl: 'collection.html',
})
export class CollectionPage {
  public navigatorBackColor:any; 
  public currentIndex = 0;
  public cid = '0';
  public pageNum = 1;
  public Productlist = [];
  public imageUrl = '';
  public orderList = ['商品','店铺'];
  public collectUrl;
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider, public config:ConfigProvider,public httpService:HttpServicesProvider, public util: UtilProvider, public modalCtrl: ModalController) {
    let data = this.storage.get('globoalSet');
    this.navigatorBackColor = data.navigatorBackColor;
    this.getTopCateDatalist(0);
  }

  getTopCateDatalist (num) {
    this.currentIndex = Number(num);
    this.util.showLoading('请稍后');
    if (num == 0) this.collectUrl = '/member/collectproduct';
    else this.collectUrl ='/member/collectseller';
    this.httpService.requestGetTokenData(this.config.requesturl+this.collectUrl, (res) => {
      let responsedata = JSON.parse(res._body);
      if(responsedata.code == 200){
        if (num == 0) {
          this.imageUrl = responsedata.imgUrl;
          this.Productlist = responsedata.productList;
        } else {
          this.imageUrl = responsedata.imgUrl;
          this.Productlist = responsedata.sellerList;
          console.log(this.Productlist)
        }
      }  else if (responsedata.code == 401) {
        this.gologinpage();
      } else {
         this.util.showAlert(responsedata.msg,'温馨提醒');
      }
      this.util.dismiss(0);
    })
  }

  gologinpage () {
    let profileModal = this.modalCtrl.create('LoginPage');
    profileModal.onDidDismiss(data => {
      this.getTopCateDatalist(this.currentIndex)
    })
    profileModal.present();
  }

  getRefresh (refresher) {
    this.getTopCateDatalist(this.currentIndex)
    refresher.complete();
  }
}
