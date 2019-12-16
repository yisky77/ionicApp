import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController, ModalController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { UtilProvider } from './../../providers/util/util';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { ConfigProvider } from '../../providers/config/config';


@IonicPage({
  name: 'StorePage',
  segment: 'StorePage/:sid',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-store',
  templateUrl: 'store.html',
})
export class StorePage {
  public navigatorBackColor;
  public sid = 0;
  public currentIndex;
  public list;
  public sellerStore = {sellerName:0,sellerLogo:'',collectionNumber:0,telephone:'',companyAdd:''};
  public imgurl;
  public storeimgUrl;
  public collected = false;
  public topCate = ['全部商品','价格升序','价格降序','销量','評價降序','最新上市',]
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider, public util:UtilProvider,public httpService:HttpServicesProvider, public config:ConfigProvider,public viewCtrl: ViewController,public modalCtrl: ModalController) {
    let data = this.storage.get('globoalSet');
    this.navigatorBackColor = data.navigatorBackColor;
    this.sid = this.navParams.get('sid');
    if(this.sid == null || this.sid == undefined) this.sid = this.storage.get('sid');
    else this.storage.set('sid',this.sid);
    this.getStore();
  }

  getStore () {
    this.httpService.requestGetTokenData(this.config.requesturl+'/seller/'+this.sid, (res) => {
      let responsedatas = JSON.parse(res._body);
      if(responsedatas.code == 200){
        // console.log(responsedatas.seller);
        this.imgurl  = responsedatas.imgUrl
        this.sellerStore = responsedatas.seller;
        this.collected = responsedatas.collected==="false" ? false : true;
        console.log(this.collected)
        this.getTopCateDatalist(0);
      } else if (responsedatas.code == 401) {
        this.gologinpage();       
      } else {
        this.util.Toast(responsedatas.msg,'top');        
      }
    })
  }

  gologinpage () {
    let profileModal = this.modalCtrl.create('LoginPage');
    profileModal.onDidDismiss(data => {
      this.getStore();
    })
    profileModal.present();
  }

  goProduct() {
    this.navCtrl.push('ProductPage');
  }

  // 收藏
  collect () {
    this.util.showLoading('');
    if (this.collected) {
      this.httpService.requestGetTokenData(this.config.requesturl+'/member/cancelcollectshop?sellerId='+this.sid, (res) => {
        let responsedata = JSON.parse(res._body);
        if (responsedata.code == 200) {
          this.collected = false;
          // this.util.Toast('收藏成功','top');
        } else if (responsedata.code == 401) {
          this.gologinpage();
        } else {
          this.util.Toast(responsedata.msg,'top');
        }
        this.util.dismiss(0);
      })
    } else {
      this.httpService.requestGetTokenData(this.config.requesturl+'/member/docollectshop?sellerId='+this.sid, (res) => {
        let responsedata = JSON.parse(res._body);
        console.log(responsedata)
        if (responsedata.code == 200) {
          this.collected = true;
          // this.util.Toast('收藏成功','top');
        } else if (responsedata.code == 401) {
          this.gologinpage();       
        } else {
          this.util.Toast(responsedata.msg,'top');
        }
        this.util.dismiss(0);
      })
    }
    console.log(this.collected)
  }
  //商品列表
  getTopCateDatalist (idnum) {
    this.currentIndex = Number(idnum);
    this.util.showLoading('请稍后');
    this.httpService.requestGetTokenData(this.config.requesturl+'/product-'+this.sid+'-'+idnum+'-0-1', (res) => {
      let responsedata = JSON.parse(res._body);
      if (responsedata.success) {
        this.storeimgUrl = responsedata.data.imgUrl;
        this.list = responsedata.data.allProducts;
        console.log(responsedata)
      } else {
         this.util.Toast(responsedata.msg,'top');
      }
      this.util.dismiss(0);
    })
  }
}
