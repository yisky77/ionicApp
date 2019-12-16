import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { UtilProvider } from '../../providers/util/util';
import { ApploginProvider } from '../../providers/applogin/applogin';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { ConfigProvider } from '../../providers/config/config';

@IonicPage({
  name: 'BuyPage',
  segment: 'BuyPage',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-buy',
  templateUrl: 'buy.html',
})
export class BuyPage {
  public list = [];
  public cartInfoVO={finalAmount:0,logisticsFeeAmount:0,checkedDiscountedAmount:0,checkedCartAmount:0,cartListVOs:[]};
  public address={addAll:'请选择地址',addressInfo:'',mobile:'', memberName:'111',id:0};
  public navigatorBackColor;
  public imgUrl;
  public paySn;
  constructor(public navCtrl: NavController, public util: UtilProvider, public storage: StorageProvider, public httpService: HttpServicesProvider, public params: NavParams, public modalCtrl: ModalController, public config: ConfigProvider, public viewCtrl: ViewController, public applogin: ApploginProvider) {
    let data = this.storage.get('globoalSet');
    this.navigatorBackColor = data.navigatorBackColor;
    this.paySn = this.params.data;
    console.log(this.paySn)
  }
  ionViewDidEnter(){
   this.getorderlist();
  }
  getorderlist() {
    this.util.showLoading('');
    this.httpService.requestGetTokenData(this.config.requesturl + '/order/info', (res) => {
      let responsedatas = JSON.parse(res._body);
      if (responsedatas.code == 200) {
        this.imgUrl = responsedatas.imgUrl;
        if (responsedatas.address == null)  this.navCtrl.push('AddressPage'); 
        else this.address = responsedatas.address;
        this.cartInfoVO = responsedatas.cartInfoVO?responsedatas.cartInfoVO:{};
        if (this.cartInfoVO.cartListVOs.length == 0) {
          this.navCtrl.pop();
        }
        console.log(this.address)
      } else if (responsedatas.code == 401) {
        this.gologinpage();
      } else {
        this.util.Toast(responsedatas.msg, 'top');
      }
      this.util.dismiss(0);
    })
  }

  gologinpage() {
    let profileModal = this.modalCtrl.create('LoginPage');
    profileModal.onDidDismiss(data => {
      this.getorderlist();
    })
    profileModal.present();
  }

  getRefresh(refresher) {
    this.getorderlist()
    refresher.complete();
  }

  // 去支付
  goPay(){
    this.util.showLoading('');
    this.httpService.requestPostTokenDataform(this.config.requesturl + '/order/ordercommit',{addressId:this.address.id,paymentName:'在线支付',paymentCode:'ONLINE',integral:0}, (res) => {
      let responsedatas = res;
      this.util.dismiss(0);
      if (responsedatas.code == 200) {
        this.navCtrl.push('PayPage',{'paySn':responsedatas.data.paySn})
      } else if (responsedatas.code == 401) {
        this.gologinpage();
      } else {
        this.util.Toast(responsedatas.msg, 'top');
      }
    })
  }
}
