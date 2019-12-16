import { UtilProvider } from './../../providers/util/util';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController, ModalController} from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { ConfigProvider } from '../../providers/config/config';
import { HttpServicesProvider } from '../../providers/http-services/http-services';

@IonicPage({
  name: 'AddresslistPage',
  segment: 'AddresslistPage',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-addresslist',
  templateUrl: 'addresslist.html',
})

export class AddresslistPage {
  public navigatorBackColor:any;
  public showpAddresslist = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider,public viewCtrl: ViewController,public httpService:HttpServicesProvider, public util: UtilProvider, public config:ConfigProvider,public modalCtrl: ModalController) {
    let data = this.storage.get('globoalSet');
    this.navigatorBackColor = data.navigatorBackColor;
  }

  ionViewDidEnter(){
    this.getaddresslist();
  } 

  changeAddress (item) {
    console.log(JSON.stringify(item))
    this.navCtrl.push('AddAddressPage',{'item':JSON.stringify(item)});
  }

  // 获取地址列表
  getaddresslist () {
    // this.util.showLoading('请稍后');
    this.httpService.requestGetTokenData(this.config.requesturl+'/member/address', (res) => {
      let responsedatas = JSON.parse(res._body);
      if(responsedatas.code == 200){
        this.showpAddresslist = responsedatas.addressList;
        console.log(this.showpAddresslist)
      } else if (responsedatas.code == 401) {
        let profileModal = this.modalCtrl.create('LoginPage');
        profileModal.onDidDismiss(data => {
          this.getaddresslist();   
        })
        profileModal.present();
      } else {
        this.util.Toast(responsedatas.msg,'top');
      }
      // this.util.dismiss(0);
    })
  }

  closeService () {
    this.viewCtrl.dismiss();    
  }

  // 删除地址
  trash (id) {
    this.util.showConfirm('确定删除改地址',() => {
      this.httpService.requestDeleteTokenData(this.config.requesturl+'/member/address/'+id, (res) => {
        let responsedatas = JSON.parse(res._body);
        if(responsedatas.code == 200){
          this.getaddresslist();
          this.util.Toast('删除地址成功！','top');
        } else {
          this.util.Toast(responsedatas.msg,'top');
        }
      })
    })
  }

  // 设为默认
  setDefault (id) {
    this.util.showLoading('设为默认地址中...');
    this.httpService.requestGetTokenData(this.config.requesturl+'/member/address/setdefaultaddress?id='+id, (res) => {
      let responsedatas = JSON.parse(res._body);
      if(responsedatas.code == 200){
        this.getaddresslist();        
      } else {
        this.util.Toast(responsedatas.msg,'top');
      }
    })
  }

  // 选择地址
  seladdress () {
    this.viewCtrl.dismiss();    
  }

  //下拉刷新请求数据
  doRefresh(refresher){
    this.getaddresslist();
    refresher.complete();  /*加载完成以后重新渲染页面*/
  }
}
