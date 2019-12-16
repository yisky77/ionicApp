import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { UtilProvider } from '../../providers/util/util';
import { ApploginProvider } from '../../providers/applogin/applogin';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { ConfigProvider } from '../../providers/config/config';

@IonicPage({
  name: 'InteBuyPage',
  segment: 'InteBuyPage',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-inte-buy',
  templateUrl: 'inte-buy.html',
})
export class InteBuyPage {
  public list = [];
  public cartInfoVO={finalAmount:0,logisticsFeeAmount:0,checkedDiscountedAmount:0};
  public address={addAll:'请选择地址',addressInfo:'',mobile:'',memberName:'',id:0};
  public navigatorBackColor;
  public imgUrl;
  public responsedatas;
  public pricenum = 1;
  constructor(public navCtrl: NavController, public util: UtilProvider, public storage: StorageProvider, public httpService: HttpServicesProvider, public params: NavParams, public modalCtrl: ModalController, public config: ConfigProvider, public viewCtrl: ViewController, public applogin: ApploginProvider) {
    let data = this.storage.get('globoalSet');
    this.navigatorBackColor = data.navigatorBackColor;
    this.responsedatas = this.params.get('responsedatas');
    this.address = this.responsedatas.address;
    this.pricenum = this.params.get('pricenum');
  }

  // ionViewDidEnter(){
  // //  this.getorderlist();
  // }
  
  getorderlist() {
    this.util.showLoading('');
    this.httpService.requestGetTokenData(this.config.requesturl + '/order/info', (res) => {
      let responsedatas = JSON.parse(res._body);
      if (responsedatas.code == 200) {
        this.imgUrl = responsedatas.imgUrl;
        this.address = responsedatas.address;
        this.cartInfoVO = responsedatas.cartInfoVO;
        // this.list = this.cartInfoVO.cartListVOs;
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

  // 去支付
  goPay(){
    this.util.showLoading('');
    this.httpService.requestPostTokenDataform(this.config.requesturl + '/order/ordercommitforintegral',{addressId:this.address.id,paymentName:'在线支付',paymentCode:'ONLINE',productId:this.responsedatas.product.id,productGoodsId:this.responsedatas.productGoods.id,sellerId:this.responsedatas.seller.id,actIntegralId:this.responsedatas.actIntegral.id,number:this.pricenum}, (res) => {
      let responsedatas = res;
      this.util.dismiss(0);
      if (responsedatas.code == 200) {
        this.util.Toast('恭喜,兑换成功！请到订单中心查看详情', 'top');
        this.navCtrl.pop();
      } else if (responsedatas.code == 401) {
        this.gologinpage();
      } else {
        this.util.Toast(responsedatas.msg, 'top');
        this.navCtrl.pop();
      }
    })
  }

}
