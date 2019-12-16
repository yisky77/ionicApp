import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { UtilProvider } from '../../providers/util/util';
import { ApploginProvider } from '../../providers/applogin/applogin';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { ConfigProvider } from '../../providers/config/config';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  rootPage:any;
  public navigatorBackColor:any; 
  public sendtime = false;
  public loadtime = 300;
  public showlogin = true;
  public logintitle = '手机验证码登录';
  public logininfo = {mobile:'',verifyCode:''};
  public logininfo1 = {mobile:'',password:'',verifyCode: ''};
  constructor(public navCtrl: NavController, public util: UtilProvider, public storage: StorageProvider, public httpService:HttpServicesProvider,public params: NavParams,public modalCtrl: ModalController, public config:ConfigProvider,public viewCtrl: ViewController,public applogin:ApploginProvider) {
    let data = this.storage.get('globoalSet');
    this.navigatorBackColor = data.navigatorBackColor;
    // console.log('UserId', this.params.get('pageName'))
  }

  // 调用微信登录
  wechatlogin () {
    this.applogin.weChatAuth();
  }

  // 调用qq登录
  qqlogin () {
    this.viewCtrl.dismiss()    
  }

  closelogin () {
    window.location.href= window.location.protocol+'//'+window.location.host;
    // this.navCtrl.popToRoot();
  }
  
  // 获取验证码
  getcheckcode () {
    if (this.logininfo.mobile == '' || !(/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(this.logininfo.mobile))) {
      this.util.showAlert('请正确填写手机号','温馨提醒');
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
        this.util.showAlert(responsedata.msg,'温馨提醒');
      }
    })
  }

  // 手机号码登录验证
  loginbtn () {
    console.log(this.logininfo.mobile)
    if (this.logininfo.mobile == '' || !(/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(this.logininfo.mobile))) {
      this.util.showAlert('请正确填写手机号','温馨提醒');
      return false;
    } else if (this.logininfo.verifyCode == '' || String(this.logininfo.verifyCode).length !== 4){
      this.util.showAlert('请正确填写手机验证码','温馨提醒');
      return false;
    } else {
      this.util.showLoading('请稍后')
      this.httpService.requestGetData(this.config.requesturl+'/login_by_sms?mobile='+this.logininfo.mobile+'&verifyCode='+this.logininfo.verifyCode, (res) => {
        let responsedata = JSON.parse(res._body);
        if(responsedata.code == 200){
          this.storage.set('token',responsedata.token);
          this.storage.set('phone',this.logininfo.mobile)
          this.viewCtrl.dismiss();
        }else {
           this.util.showAlert(responsedata.msg,'温馨提醒');
        }
        this.util.dismiss(0);
      })
    }
  }

  // 账号密码登录
  gologin () {
    this.showlogin = !this.showlogin;
    if(!this.showlogin) {
      this.logintitle = '账号密码登录'
    } else {
      this.logintitle = '手机验证码登录'
    }
  }

  // 账号密码登录
  gologin1 () {
    if (this.logininfo1.mobile == '') {
      this.util.showAlert('请正确填写账号','温馨提醒');
      return false;
    } else if (this.logininfo1.password == '' || String(this.logininfo1.password).length < 6){
      this.util.showAlert('请正确填写密码','温馨提醒');
      return false;
    } else {
      this.util.showLoading('请稍后')
      this.httpService.requestGetData(this.config.requesturl+'/login_by_password?userName='+this.logininfo1.mobile+'&password='+this.logininfo1.password, (res) => {
        let responsedata = JSON.parse(res._body);
        if(responsedata.code == 200){
          this.viewCtrl.dismiss();
          this.storage.set('token',responsedata.token)
          this.storage.set('phone',this.logininfo1.mobile)
        }else {
           this.util.showAlert(responsedata.msg,'温馨提醒');
        }
        this.util.dismiss(0);
      })
    }
  }

}
