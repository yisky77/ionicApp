import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController,ModalController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { UtilProvider } from './../../providers/util/util';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { ConfigProvider } from '../../providers/config/config';

@IonicPage({
  name: 'ChangephonePage',
  segment: 'ChangephonePage',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-changephone',
  templateUrl: 'changephone.html',
})
export class ChangephonePage {
  public navigatorBackColor:any; 
  public phone:any; 
  public loadtime = 300;
  public sendtime = false;
  public logininfo = {mobile:'', verifyCode:'', password:''}; 
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider, public util:UtilProvider,public httpService:HttpServicesProvider, public config:ConfigProvider,public viewCtrl: ViewController,public modalCtrl: ModalController) {
    let data = this.storage.get('globoalSet');
    this.navigatorBackColor = data.navigatorBackColor;
    this.phone = this.storage.get('phone');
  }


  updatemobile () {
    if (this.logininfo.mobile == '' || !(/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(this.logininfo.mobile))) {
      this.util.Toast('请正确填写手机号！','top');
      return false;
    } else if (this.logininfo.verifyCode.length < 4){
      this.util.Toast('请输入正确的验证码！','top');  
      return false;
    } else if (this.logininfo.password.length < 6){
      this.util.Toast('密码长度最少6位数！','top');  
      return false;
    }
    if (this.logininfo.password !== '' && this.logininfo.verifyCode !== '') {
      this.util.showLoading('请稍后');
      this.httpService.requestGetTokenData(this.config.requesturl+'/member/bindmobile?verifyCode='+this.logininfo.verifyCode+'&mobile='+this.logininfo.mobile+'&password='+this.logininfo.password, (res) => {
        let responsedatas = JSON.parse(res._body);
        if(responsedatas.code == 200){
          this.util.Toast('修改手机号码成功！','top');
          this.viewCtrl.dismiss();  
          this.storage.set('phone', this.logininfo.mobile);
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
    }
  }

  // 获取验证码
  getcheckcode () {
    if (this.logininfo.mobile == '' || !(/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(this.logininfo.mobile))) {
      this.util.Toast('请正确填写手机号','top');       
      return false;
    } else if (this.logininfo.mobile === this.phone) {
      this.util.Toast('新的手机号不能和当前手机号相同！','top');
      return false;
    }
    this.util.showLoading('请稍后');
    this.httpService.requestGetData(this.config.requesturl+'/sendmsg?mobile='+this.logininfo.mobile, (res) => {
      let responsedata = JSON.parse(res._body);
      this.util.dismiss(0);
      if(responsedata.code == 200){
        this.sendtime = true;
        let gettime = setInterval(() => {
          this.loadtime--;
          if(this.loadtime <= 0) {
            clearInterval(gettime);
            this.loadtime = 300;
            this.sendtime = false;
          }
        }, 1000)
      } else {
        this.util.Toast(responsedata.msg,'top');
      }
    })
  }


}