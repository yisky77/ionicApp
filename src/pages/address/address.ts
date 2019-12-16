import { UtilProvider } from './../../providers/util/util';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController, ModalController} from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { ConfigProvider } from '../../providers/config/config';
import { HttpServicesProvider } from '../../providers/http-services/http-services';


@IonicPage({
  name: 'AddressPage',
  segment: 'AddressPage',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-address',
  templateUrl: 'address.html',
})
export class AddressPage {
  public navigatorBackColor:any;
  public showpAddresslist = [];
  constructor(public navCtrl: NavController, public util:UtilProvider,public navParams: NavParams, public storage: StorageProvider,public viewCtrl: ViewController, public config:ConfigProvider,public httpService:HttpServicesProvider,public modalCtrl: ModalController) {
    let data = this.storage.get('globoalSet');
    this.navigatorBackColor = data.navigatorBackColor;
  }

  ionViewDidEnter(){
    this.getaddresslist();
  } 

  // 获取地址列表
  getaddresslist () {
    this.util.showLoading('');
    this.httpService.requestGetTokenData(this.config.requesturl+'/member/address', (res) => {
      let responsedatas = JSON.parse(res._body);
      if(responsedatas.code == 200){
        this.showpAddresslist = responsedatas.addressList.reverse();
        // console.log(this.showpAddresslist)
      } else if (responsedatas.code == 401) {
        let profileModal = this.modalCtrl.create('LoginPage');
        profileModal.onDidDismiss(data => {
          this.getaddresslist();   
        })
        profileModal.present();
      } else {
        this.util.Toast(responsedatas.msg,'top');
      }
      this.util.dismiss(0);
    })
  }

  // 设为默认
  setaddress (item) {
    console.log(item);
    // this.util.showLoading('设为默认地址中...');
    this.httpService.requestGetTokenData(this.config.requesturl+'/member/address/setdefaultaddress?id='+item.id, (res) => {
      let responsedatas = JSON.parse(res._body);
      // this.util.dismiss(0);
      if(responsedatas.code == 200){
        // this.getaddresslist();
        let address = item.addAll + item.addressInfo;  
        this.storage.set('address',address)      
      } else {
        this.util.Toast(responsedatas.msg,'top');        
      }
    })
    setTimeout(()=>{
      this.viewCtrl.dismiss();    
    },100)
  }

  //下拉刷新请求数据
  doRefresh(refresher){
    this.getaddresslist();
    refresher.complete();  /*加载完成以后重新渲染页面*/
  }

}
