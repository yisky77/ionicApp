import { UtilProvider } from './../../providers/util/util';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController, ModalController} from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { ConfigProvider } from '../../providers/config/config';
import { HttpServicesProvider } from '../../providers/http-services/http-services';

@IonicPage({
  name: 'ArticleDetailPage',
  segment: 'ArticleDetailPage/:aid',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-article-detail',
  templateUrl: 'article-detail.html',
})
export class ArticleDetailPage {
  public navigatorBackColor:any;
  public showpAddresslist = [];
  public aid = 0;
  public collected = false;
  public content = {image:'',content:{}, newsSummary:'',createTime:'',title:'',browseCount:'',collectionCount:''};
  public imgurl;
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider,public viewCtrl: ViewController,public httpService:HttpServicesProvider, public util: UtilProvider, public config:ConfigProvider,public modalCtrl: ModalController) {
    let data = this.storage.get('globoalSet');
    this.navigatorBackColor = data.navigatorBackColor;
    this.aid = this.navParams.get('aid');
    if(this.aid !== null && this.aid !== undefined) {
      this.storage.set('aid',this.aid);
    } else {
      this.aid = this.storage.get('aid');
    }
    this.getarticle();
  }

  getarticle () {
    this.util.showLoading('');
    this.httpService.requestGetTokenData(this.config.requesturl+'/news/'+this.aid, (res) => {
      let responsedatas = JSON.parse(res._body);
      if (responsedatas.code == 200) {
        this.content = responsedatas.news;
        this.imgurl = responsedatas.imgUrl;
        this.collected = responsedatas.collected;
      } else if (responsedatas.code == 401) {
        let profileModal = this.modalCtrl.create('LoginPage');
        profileModal.onDidDismiss(data => {
          this.getarticle();
        })
        profileModal.present();
      } else {
        this.util.Toast(responsedatas.msg,'top');
      }
      this.util.dismiss(0);
    })
  }

  // 点赞
  dianzan () {
    // this.util.showLoading('');
    if(!this.collected){
      this.httpService.requestGetTokenData(this.config.requesturl + '/member/docollectnews?newsId='+this.aid, (res) => {
        let responsedatas = JSON.parse(res._body);
        // this.util.dismiss(0);
        if (responsedatas.code == 200) {
          this.getarticle();
        } else if (responsedatas.code == 401) {
          this.gologinpage();
        } else {
          this.util.Toast(responsedatas.msg, 'top');
        }
      })
    }
  }

  gologinpage() {
    let profileModal = this.modalCtrl.create('LoginPage');
    profileModal.present();
  }
}
