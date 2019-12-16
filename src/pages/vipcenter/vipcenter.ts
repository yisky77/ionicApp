import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController, ModalController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { UtilProvider } from './../../providers/util/util';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { ConfigProvider } from '../../providers/config/config';
import { AppshareProvider } from '../../providers/appshare/appshare';

@IonicPage({
  name: 'VipcenterPage',
  segment: 'VipcenterPage',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-vipcenter',
  templateUrl: 'vipcenter.html',
})
export class VipcenterPage {
  public navigatorBackColor:any; 
  public currentAct0 = false;
  public currentAct1 = false;
  public currentAct2 = false;
  public currentAct3 = false;
  public headerbg = '/assets/imgs/header.png';
  public memberName;
  public memberPhoto;
  public memberNickname;
  public toBeCommentedOrders;
  public toBeDeliveryOrders;
  public toBepaidOrders;
  public toBeReceivedOrders;
  public integral:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider, public util:UtilProvider,public httpService:HttpServicesProvider, public config:ConfigProvider,public viewCtrl: ViewController,public modalCtrl: ModalController,public appshare:AppshareProvider) {
    let data = this.storage.get('globoalSet');
    this.navigatorBackColor = data.navigatorBackColor;
    this.getPersonData();
  }

  tapactive0 () { this.currentAct0 = !this.currentAct0;}
  tapactive1 () { this.currentAct1 = !this.currentAct1;}
  tapactive2 () { this.currentAct2 = !this.currentAct2;}
  tapactive3 () { this.currentAct3 = !this.currentAct3;}

  // 退出登录
  logout () {
    this.util.showConfirm('确定退出登录吗',() => {
      this.util.showLoading('请稍后');
      this.storage.remove('token');
      this.httpService.requestGetData(this.config.requesturl+'/logout', (res) => {
        let responsedatas = JSON.parse(res._body);
        if(responsedatas.code == 200){
          this.gologinpage();
        } else {
          this.util.Toast(responsedatas.msg,'top');        
        }
        this.util.dismiss(0);
      })
    })
  }

  getPersonData () {
    if(this.storage.get('token')){
      this.util.showLoading('请稍后');
      this.httpService.requestGetTokenData(this.config.requesturl+'/member', (res) => {
        let responsedatas = JSON.parse(res._body);
        if(responsedatas.code == 200){
          let res = responsedatas.member;
          this.memberName = res.name;
          let photo = res.profilePhoto == null?this.headerbg:res.profilePhoto;
          this.headerbg = photo;
          this.toBepaidOrders = responsedatas.toBepaidOrders;
          this.toBeReceivedOrders = responsedatas.toBeReceivedOrders;
          this.toBeDeliveryOrders = responsedatas.toBeDeliveryOrders
          this.toBeCommentedOrders = responsedatas.toBeCommentedOrders;
          this.memberNickname = responsedatas.member.nickname;  
          this.integral = responsedatas.member.integral;
          this.storage.set('integral',this.integral)
        } else if (responsedatas.code == 401) {
          this.gologinpage();          
        } else {
          this.util.Toast(responsedatas.msg,'top');        
       }
        this.util.dismiss(0);
      })
    } else {
      this.gologinpage();
    }
   }

   gologinpage () {
    let profileModal = this.modalCtrl.create('LoginPage');
    profileModal.onDidDismiss(data => {
      this.getPersonData();
    })
    profileModal.present();
   }

   getRefresh (refresher) {
    this.getPersonData()
    refresher.complete();
   }

  //  分享微信
   sharebtn () {
     const shareinfo = JSON.parse(this.storage.get('shareinfo'));
     var shareinfos = {
       title:shareinfo?shareinfo.title:this.config.shareinfo.title,
       description:shareinfo?shareinfo.description:this.config.shareinfo.description,
       image:shareinfo?shareinfo.image:this.config.shareinfo.image,
       link:shareinfo?shareinfo.link:this.config.shareinfo.link,
     }
    //  console.log(shareinfo)
    //  console.log(shareinfos)
    this.appshare.wxShare(0,shareinfos);
   }
}
