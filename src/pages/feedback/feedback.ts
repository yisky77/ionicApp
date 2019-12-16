import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { ConfigProvider } from '../../providers/config/config';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { UtilProvider } from './../../providers/util/util';

@IonicPage({
  name: 'FeedbackPage',
  segment: 'FeedbackPage',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {
  public navigatorBackColor;
  public feedbacktype: string = "3";
  public phone:string;
  public content = '';
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController, public config:ConfigProvider,public httpService:HttpServicesProvider,public storage:StorageProvider, public util:UtilProvider) {
    let data = this.storage.get('globoalSet');
    this.navigatorBackColor = data.navigatorBackColor;
    this.phone = this.storage.get('phone');
  } 

  submit () {
    if (this.content == '') {
      this.util.showAlert('请填写反馈内容！','温馨提醒');
      return false;
    } else if (this.phone == '' || !(/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(this.phone))) {
      this.util.showAlert('请正确填写手机号哦！','温馨提醒');
      return false;
    } 
    this.util.showLoading('请稍后');
    this.httpService.requestPostTokenData(this.config.requesturl+'/feedback',{product:this.feedbacktype,content:this.content,contact:this.phone}, (res) => {
      let responsedatas = JSON.parse(res._body);
      if(responsedatas.code == 200){
        this.util.Toast('反馈成功！感谢您的建议！','top');        
        this.viewCtrl.dismiss();      
      } else {
        this.util.Toast(responsedatas.msg,'top');
      }
      this.util.dismiss(0);
    })
  }

  clearphone () {
    this.phone = '';
  }

}
