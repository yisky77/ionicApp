import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController, ModalController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { ConfigProvider } from '../../providers/config/config';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { UtilProvider } from './../../providers/util/util';

@IonicPage({
  name: 'GoodsbackPage',
  segment: 'GoodsbackPage',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-goodsback',
  templateUrl: 'goodsback.html',
})
export class GoodsbackPage {
  public navigatorBackColor;
  public ftype: string = "1";
  public content = '';
  public infoitems;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public config: ConfigProvider,public httpService:HttpServicesProvider,public storage:StorageProvider, public util: UtilProvider, public modalCtrl: ModalController) {
    let data = this.storage.get('globoalSet');
    this.navigatorBackColor = data.navigatorBackColor;
    this.infoitems = this.navParams.get('item');
    if(!this.infoitems) this.infoitems = JSON.parse(this.storage.get('infoitems'));
    else this.storage.set('infoitems',this.infoitems);
    console.log(this.infoitems.orderProductList);
  }

  // 退换货
  exchangepro () {
    if (this.content == '') {
      this.util.showAlert('请填写反馈内容！','温馨提醒');
      return false;
    }
    let url = '';
    switch (this.ftype) {
      case '1': url = '/member/doproductback';break;
      case '2': url = '/member/doproductexchange';break;
    }
    this.util.showLoading('');
    let info = {
      sellerId:this.infoitems.sellerId,
      seller:this.infoitems.sellerId,
      orderId:this.infoitems.id,
      orderProductId:this.infoitems.orderProductList[0].id,
      productId:this.infoitems.orderProductList[0].productId,
      number:this.infoitems.orderProductList[0].number,
      question:this.content
    }
    this.httpService.requestPostTokenDataform(this.config.requesturl+url,info, (res) => {
      if (res.code == 200) {
        this.util.Toast('已提交信息！','top');
        this.viewCtrl.dismiss();
      }  else if (res.code == 401) {
        this.gologinpage();          
      } else {
        this.util.Toast(res.msg,'top');
      }
      this.util.dismiss(0);
    })
  }

  gologinpage () {
    let profileModal = this.modalCtrl.create('LoginPage');
    profileModal.present();
  }
}
