import { ProductPage } from './../product/product';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { ConfigProvider } from '../../providers/config/config';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { UtilProvider } from '../../providers/util/util';

@IonicPage({
  name: 'CouponPage',
  segment: 'CouponPage',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-coupon',
  templateUrl: 'coupon.html',
})
export class CouponPage {
    public navigatorBackColor:any; 
    public currentIndex = 0;
    public cid = 0;
    public pageNum = 1;
    public showflag = false;
    public Productlist = [];
    public imageUrl = '';
    public orderList = ['默认','即将过期'];
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
      this.httpService.requestGetTokenData(this.config.requesturl+'/coupon/?sort='+i, (res) => {
        let responsedata = JSON.parse(res._body);
        if(responsedata.code == 200){
          this.Productlist = responsedata.couponList;
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
    lingqu (items) {
      if (items.personLimitNum !== 0) {
        var id = items.id;
        // this.util.showLoading('请稍后');
        this.httpService.requestPostTokenDataform(this.config.requesturl+'/member/coupon/reveivecoupon',{couponId:id}, (responsedata) => {
          if (responsedata.code == 200) {
            this.util.Toast('已领取','top');
            this.getTopCateDatalist(0);
          }  else if (responsedata.code == 401) {
            this.gologinpage();
          } else {
            this.util.showAlert(responsedata.msg,'温馨提醒');
          }
          // this.util.dismiss(0);
        })
      }
    }
  }
  
