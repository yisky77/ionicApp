import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController,ModalController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { UtilProvider } from './../../providers/util/util';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { ConfigProvider } from '../../providers/config/config';

@IonicPage({
  name: 'SetpwdPage',
  segment: 'SetpwdPage',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-setpwd',
  templateUrl: 'setpwd.html',
})
export class SetpwdPage {
  public navigatorBackColor:any; 
  public phone:any; 
  public logininfo = {password1:'', password2:''}; 
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider, public util:UtilProvider,public httpService:HttpServicesProvider, public config:ConfigProvider,public viewCtrl: ViewController,public modalCtrl: ModalController) {
    let data = this.storage.get('globoalSet');
    this.navigatorBackColor = data.navigatorBackColor;
    this.phone = this.storage.get('phone');
  }

  updatepwd () {
    if (this.logininfo.password1.length < 6){
      this.util.showAlert('密码长度最少6位数','温馨提醒');  
      return false;
    }
    if (this.logininfo.password2 !== '' && this.logininfo.password1 === this.logininfo.password2){
      this.util.showLoading('请稍后');
      // let data = JSON.stringify({newPwd:this.logininfo.password2})
      this.httpService.requestGetTokenData(this.config.requesturl+'/member/setpassword?newPwd='+this.logininfo.password2, (res) => {
      // this.httpService.requestPostTokenData(this.config.requesturl+'/member/setpassword',{newPwd:this.logininfo.password2}, (res) => {
        let responsedatas = JSON.parse(res._body);
        if(responsedatas.code == 200){
          this.util.showAlert('密码修改成功！','温馨提醒');   
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
    } else {
      this.util.showAlert('两次密码输入不一致,请确认！','温馨提醒');   
    }
  }

}
