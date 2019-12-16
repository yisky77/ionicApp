import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { UtilProvider } from './../../providers/util/util';
import { ConfigProvider } from '../../providers/config/config';


@IonicPage({
  name: 'MycommentsPage',
  segment: 'MycommentsPage',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-mycomments',
  templateUrl: 'mycomments.html',
})
export class MycommentsPage {
  public navigatorBackColor;
  public commentslist=[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider, public util:UtilProvider,public httpService:HttpServicesProvider, public config:ConfigProvider,public modalCtrl: ModalController) {
    let data = this.storage.get('globoalSet');
    this.navigatorBackColor = data.navigatorBackColor;
    this.integralinit();
  }

  integralinit() {
    this.util.showLoading('请稍后');
    this.httpService.requestGetTokenData(this.config.requesturl+'/member/comment', (res) => {
      let responsedatas = JSON.parse(res._body);
      if(responsedatas.code == 200){
        this.commentslist = responsedatas.commentsList;
      } else if (responsedatas.code == 401) {
        this.gologinpage();
      } else {
        this.util.Toast(responsedatas.msg,'top');        
      }
      this.util.dismiss(0);
    })
  }

  gologinpage () {
    let profileModal = this.modalCtrl.create('LoginPage');
    profileModal.onDidDismiss(data => {
      this.integralinit();
    })
    profileModal.present();
  }

  getRefresh (refresher) {
    this.integralinit();
    refresher.complete();
    /*加载完成以后重新渲染页面*/
  }

}
