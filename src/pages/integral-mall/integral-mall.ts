import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { UtilProvider } from './../../providers/util/util';
import { ConfigProvider } from '../../providers/config/config';

@IonicPage({
  name: 'IntegralMallPage',
  segment: 'IntegralMallPage',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-integral-mall',
  templateUrl: 'integral-mall.html',
})
export class IntegralMallPage {
  public navigatorBackColor:any; 
  public showpCatelist = [];
  public imageUrl = '';
  public currentIndex = 0;
  public cid = '';
  public isSign = false;
  public signprice;
  public level;
  public memberInte;
  public topCate = ['人气','最新','销量','价格']
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider, public util:UtilProvider,public httpService:HttpServicesProvider, public config:ConfigProvider,public modalCtrl: ModalController) {
    let data = this.storage.get('globoalSet');
    this.navigatorBackColor = data.navigatorBackColor;
    this.getTopCateDatalist(0);
  }

  // 签到
  sign(){
    this.httpService.requestGetTokenData(this.config.requesturl+'/member/sign', (res) => {
      let responsedata = JSON.parse(res._body);
      if(responsedata.code == 200){
        this.isSign = true;
        this.util.Toast('签到成功！','top');
        this.getTopCateDatalist(0);
      } else if (responsedata.code == 401) {
        this.gologinpage();
      } else {
        this.util.Toast(responsedata.msg,'top');
      }
      this.util.dismiss(0);
    })
  }

  gologinpage() {
    let profileModal = this.modalCtrl.create('LoginPage');
    profileModal.onDidDismiss(data => {
      this.getTopCateDatalist(0);
    })
    profileModal.present();
  }

  getRefresh(refresher) {
    this.getTopCateDatalist(0);
    refresher.complete();
  }

  getTopCateDatalist (idnum) {
    this.currentIndex = idnum;
    this.util.showLoading('请稍后');
    this.httpService.requestGetTokenData(this.config.requesturl+'/jifen', (res) => {
      let responsedata = JSON.parse(res._body);
      if(responsedata.code == 200){
        this.imageUrl = responsedata.imgUrl;
        this.showpCatelist = responsedata.actIntegrals;
        this.isSign = responsedata.isSign;
        this.signprice = responsedata.memberRule.sign;
        this.memberInte = responsedata.member?responsedata.member.integral:0;
        this.storage.set('integral',this.memberInte)
        const level = responsedata.member?responsedata.member.grade:1;
        if (level === 1) this.level = '普通';
        else if (level === 2) this.level = '铜牌';
        else if (level === 3) this.level = '银牌';
        else if (level === 4) this.level = '金牌';
        else if (level === 5) this.level = '钻石';
      } else {
        this.util.Toast(responsedata.msg,'top');
      }
      this.util.dismiss(0);
    })
  }

}
