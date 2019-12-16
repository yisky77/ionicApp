import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { ConfigProvider } from '../../providers/config/config';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { UtilProvider } from './../../providers/util/util';

@IonicPage({
  name: 'JoinPage',
  segment: 'JoinPage',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-join',
  templateUrl: 'join.html',
})
export class JoinPage {
  public navigatorBackColor;
  public company: string = "";
  public name: string = "";
  public email: string = "";
  public address: string = "";
  public phone:string;
  public content = '';
  public sellerlist;
  public imgurl;
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController, public config:ConfigProvider,public httpService:HttpServicesProvider,public storage:StorageProvider, public util:UtilProvider) {
    let data = this.storage.get('globoalSet');
    this.navigatorBackColor = data.navigatorBackColor;
    this.getStoreList();
  }
  getStoreList () {
    this.httpService.requestGetData(this.config.requesturl+'/seller', (res) => {
      let responsedatas = JSON.parse(res._body);
      if(responsedatas.code == 200){
        this.imgurl = responsedatas.imgUrl;
        this.sellerlist = responsedatas.seller;
      } else {
        this.util.Toast(responsedatas.msg,'top');        
      }
      // this.util.dismiss(0);
    })
  }
  submit () {
    if (this.company == '') {
      this.util.showAlert('请填写公司名称！','温馨提醒');
      return false;
    } else if (this.name == '') {
      this.util.showAlert('请填写联系人姓名！','温馨提醒');
      return false;
    } else if (this.phone == '' || !(/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(this.phone))) {
      this.util.showAlert('请正确填写手机号哦！','温馨提醒');
      return false;
    } 
    this.util.showLoading('');
    this.httpService.requestPostTokenDataform(this.config.requesturl+'/partner',{company:this.company,name:this.name,phone:this.phone,email:this.email,address:this.address}, (res) => {
      // let responsedatas = JSON.parse(res._body);
      if(res.code == 200){
        this.util.Toast('提交成功！请稍等客服联系您！','top');        
      } else {
        this.util.Toast(res.msg,'top');
      }
      this.util.dismiss(0);
    })
  }

}
