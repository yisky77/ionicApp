import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { UtilProvider } from '../../providers/util/util';
import { ConfigProvider } from '../../providers/config/config';
import {CityDataProvider} from "../../providers/city-data/city-data";

@IonicPage({
  name: 'AddAddressPage',
  segment: 'AddAddressPage',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-add-address',
  templateUrl: 'add-address.html',
})
export class AddAddressPage {
  // public session: any;
  public cityColumns: any[];
  public citydefault: any;
  public navigatorBackColor;
  public item;
  public stateflag = true;
  public address;
  public create = {addressInfo:'',memberName:'',mobile:'',state:2,provinceId:0,cityId:0,areaId:0,addAll:'北京市-市辖区-东华区'};
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider,public viewCtrl: ViewController,public httpService:HttpServicesProvider, public util: UtilProvider, public config:ConfigProvider,public cityDataProvider: CityDataProvider) {
    this.cityColumns = this.cityDataProvider.citys;
    this.create.addAll = '110000-110100-110101';// 默认的地区id
    let data = this.storage.get('globoalSet');
    this.navigatorBackColor = data.navigatorBackColor;
    let datas = this.navParams.get('item');
    console.log(datas)
    if (!datas || datas == undefined || datas == null) {this.create.mobile = this.storage.get('phone');}
    else this.create = JSON.parse(datas);
    console.log(this.create)
  }

  updateState (state) {
    this.create.state = state==1?2:1;
  }

  // 保存地址
  saveAddress () {
    console.log(this.create)
    if(this.create.memberName == '' || this.create.addressInfo == '') {
      this.util.showAlert('请补充完整收货信息！','温馨提醒');
      return false;
    } else if (!(/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(this.create.mobile)) || this.create.mobile == '') {
      this.util.showAlert('请正确填写手机号!','温馨提醒');
      return false;
    }
    this.util.showLoading('保存中');
    // this.create.addAll.substring(0,)
    // var tempArr = this.create.addAll.split("-");
    // var a = tempArr[0];
    // var b = tempArr[1];
    // var c = tempArr[2];
    // console.log(a,b,c)
    const text = document.getElementsByClassName('multi-picker-text')[0];
    this.address = text== undefined?document.getElementsByClassName('multi-picker-placeholder')[0].innerHTML:text.innerHTML;
    this.create.addAll = this.address;
    this.httpService.requestPostTokenData(this.config.requesturl+'/member/address',this.create, (res) => {
      let responsedatas = JSON.parse(res._body);
      if(responsedatas.code == 200){
        this.util.Toast('保存成功！','top');        
      } else {
        this.util.Toast(responsedatas.msg,'top');
      }
      this.util.dismiss(0);
      this.viewCtrl.dismiss();    
    })
  }
}
