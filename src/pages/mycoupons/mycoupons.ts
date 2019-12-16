import { ProductPage } from './../product/product';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { ConfigProvider } from '../../providers/config/config';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { UtilProvider } from '../../providers/util/util';


@IonicPage({
  name: 'MycouponsPage',
  segment: 'MycouponsPage',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-mycoupons',
  templateUrl: 'mycoupons.html',
})
export class MycouponsPage {
  public navigatorBackColor:any; 
  public currentIndex = 0;
  public cid = 0;
  public pageNum = 1;
  public showflag = false;
  public Productlist = [];
  public imageUrl = '';
  public orderList = ['未使用','已使用','已失效'];
  public ProductPage = ProductPage;
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider, public config:ConfigProvider,public httpService:HttpServicesProvider, public util: UtilProvider, public modalCtrl: ModalController) {
    let data = this.storage.get('globoalSet');
    this.navigatorBackColor = data.navigatorBackColor;
    this.getTopCateDatalist(0);
  }

  getTopCateDatalist (i) {
    this.cid = this.currentIndex = Number(i);
    console.log(this.currentIndex)
    this.util.showLoading('请稍后');
    // member/collectseller收藏店铺接口
    this.httpService.requestGetTokenData(this.config.requesturl+'/member/coupon', (res) => {
      let responsedata = JSON.parse(res._body);
      if(responsedata.code == 200){
        // this.imageUrl = responsedata.imgUrl;
        this.Productlist = responsedata.couponUsers;
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
      this.getTopCateDatalist(0)
    })
    profileModal.present();
  }

  showflagbtn () {
    this.showflag  = !this.showflag;
  }

  getRefresh (refresher) {
    this.getTopCateDatalist(this.cid)
    refresher.complete();
  }

  //  去主页
  gohome () {
    this.navCtrl.popToRoot();
  }
}
