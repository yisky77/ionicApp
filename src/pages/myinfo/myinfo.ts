import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController,ModalController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { UtilProvider } from './../../providers/util/util';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { ConfigProvider } from '../../providers/config/config';

@IonicPage({
  name: 'MyinfoPage',
  segment: 'MyinfoPage',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-myinfo',
  templateUrl: 'myinfo.html',
})
export class MyinfoPage {
  public navigatorBackColor:any; 
  public headerimg = '../assets/imgs/header.png';
  public logininfo = {nickname:'', gender:1,profilePhoto:'', birthday:'2000/01/01', qq:'', wechatAccount:''};
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider, public util:UtilProvider,public httpService:HttpServicesProvider, public config:ConfigProvider,public viewCtrl: ViewController,public modalCtrl: ModalController) {
    let data = this.storage.get('globoalSet');
    this.navigatorBackColor = data.navigatorBackColor;
    this.getinfo();
  }

  getinfo () {
    this.util.showLoading('请稍后');
    this.httpService.requestGetTokenData(this.config.requesturl+'/member/info', (res) => {
      let responsedatas = JSON.parse(res._body);
      if(responsedatas.code == 200){
        this.logininfo = responsedatas.member;
        this.logininfo.profilePhoto = responsedatas.member.profilePhoto == null?this.headerimg:responsedatas.member.profilePhoto;
        this.timestampToTime(responsedatas.member.birthday)
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

  timestampToTime(timestamp) {
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate();
    this.logininfo.birthday = String(Y+M+D);
  }
  updateinfo () {
    this.util.showLoading('请稍后');
    this.httpService.requestPostTokenData(this.config.requesturl+'/member/info',this.logininfo, (res) => {
      let responsedatas = JSON.parse(res._body);
      if(responsedatas.code == 200){
        this.util.Toast('更新成功！','top');
        this.viewCtrl.dismiss();  
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

  updateGender (flag) {
    this.logininfo.gender = flag;    
  }

  getRefresh (refresher) {
    this.getinfo();
    refresher.complete();
   }
}
