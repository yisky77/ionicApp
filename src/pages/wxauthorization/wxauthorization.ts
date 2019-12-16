import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { ConfigProvider } from '../../providers/config/config';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { UtilProvider } from '../../providers/util/util';

declare var WeixinJSBridge:any;

@IonicPage({
  name: 'wxauthorization',
  segment: 'wxauthorization/:url',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-wxauthorization',
  templateUrl: 'wxauthorization.html',
})
export class WxauthorizationPage {
  public navigatorBackColor:any; 
  public state = true;
  public showpay = true;
  public showAlipay = true;
  public showWechat = true;
  public currentpay = 'public';
  public Nov = 'other';
  public wxresdata;
  public wxstate;
  public alistate;
  public resdata;
  public create = {wxstate:false,alistate:false}
  public order = false;
  public paylist = [{name:'微信支付',type:'wechatpay',state:true},{name:'支付宝支付',type:'alipay',state:false}]
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider, public config:ConfigProvider,public httpService:HttpServicesProvider, public util: UtilProvider, public modalCtrl: ModalController) {
    let data = this.storage.get('globoalSet');
    this.navigatorBackColor = data.navigatorBackColor;
    console.log(location.href.replace('#/wxauthorization/', "&"))
  }

  ionViewDidLoad(){
    this.util.showLoading('');
    const userAgent = window.navigator.userAgent;
    if (/MicroMessenger/.test(userAgent)) { 
      this.Nov = 'wechat';
      this.currentpay = 'wechatpay';
      this.create.wxstate = true;
    } else if (/AlipayClient/.test(userAgent)) { 
      this.Nov = 'alipay';
      this.create.alistate = true;
      this.currentpay = 'alipay';
    } else {
      this.create.wxstate = true;
      this.create.alistate = false;
      this.currentpay = 'public';
    }
    this.callpaywx();
  }

  //调用微信JS api 支付
  callpaywx () {
    if (location.href.indexOf('agentId') !== -1) {
      let wxurl = location.href.replace('#/wxauthorization/', "&");      
      let wxurls = String(location.protocol+'//'+location.host);
      var len = wxurls.length+1;
      var wxurlstr = wxurl.substring(len,wxurl.length);
      console.log(wxurl.substring(len,wxurl.length));
      // 判断是否来自微信公众号微信支付
      this.httpService.requestGetTokenData(this.config.requesturl+'/wxpay/topay' + wxurlstr, (res) => {
        let responsedata = JSON.parse(res._body);
        if(responsedata.code == 200) {
          this.storage.set('wxpaydata',responsedata);
          // this.navController.push('WxauthorizationPage')
          var wxresdata = this.storage.get('wxpaydata');
          if (typeof WeixinJSBridge == "undefined"){
            if( document.addEventListener ){
              document.addEventListener('WeixinJSBridgeReady', () => {this.onBridgeReady(wxresdata)}, false);
            }
          } else{
          this.onBridgeReady(wxresdata);
        }
        }
      })
    }
  //   var wxresdata = this.storage.get('wxpaydata');
  //   if (typeof WeixinJSBridge == "undefined"){
  //     if( document.addEventListener ){
  //       document.addEventListener('WeixinJSBridgeReady', () => {this.onBridgeReady(wxresdata)}, false);
  //     }
  //   } else{
  //   this.onBridgeReady(wxresdata);
  //  }
  }

  onBridgeReady (wxresdata) {
    this.util.dismiss(0);
    var that = this;
    WeixinJSBridge.invoke(
       'getBrandWCPayRequest', {
          "appId":wxresdata.appid,     //公众号名称，由商户传入     
          "timeStamp":wxresdata.timeStamp,         //时间戳，自1970年以来的秒数     
          "nonceStr":wxresdata.nonceStr, //随机串     
          "package":wxresdata.package,     
          "signType":"MD5",         //微信签名方式：     
          "paySign":wxresdata.sign //微信签名 
       },
       function(res){
        if(res.err_msg == "get_brand_wcpay_request:ok" ){
          // 使用以上方式判断前端返回,微信团队郑重提示：
          //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          that.goPayStatusPage(true)
        } else {
          //返回跳转到根目录
          that.goPayStatusPage(false);
        }
      }
    ); 
 }
  // 去到返回支付状态界面
  goPayStatusPage (status) {
    let profileModal = this.modalCtrl.create('PaysucessPage', {'status':status});
    profileModal.present();
  }
}
