import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { ConfigProvider } from '../../providers/config/config';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { UtilProvider } from '../../providers/util/util';

// declare let WeixinJSBridge;
declare var Wechat: any;  // 此处声明plugin.xml中clobbers对应的值
export interface WechatPayParam {
  partnerid: string;
  package: string;
  appid: string;
  prepayid: string;
  noncestr: string;
  timestamp: string;
  sign: string;
}

export class WechatPlugin {
  public static isInstalled() {
    return new Promise((resolve, reject) => {
      Wechat.isInstalled(result => {
        console.log(result)
        resolve(result);
      }, error => {
        console.log(error)
        reject(error);
      });
    });
  }

  public static sendPaymentRequest(params: WechatPayParam) {
    return new Promise((resolve, reject) => {
      console.log(params)
      Wechat.sendPaymentRequest(params, result => {
        resolve(result);
      }, error => {
        console.log(error)
        reject(error);
      });
    });
  }
}

@IonicPage({
  name: 'PayPage',
  segment: 'PayPage',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-pay',
  templateUrl: 'pay.html',
})
export class PayPage {
  public navigatorBackColor:any; 
  public state = true;
  public showpay = true;
  public showAlipay = true;
  public showWechat = true;
  public currentpay = 'public';
  public Nov = 'other';
  public paySn;
  public wxstate;
  public alistate;
  public AppPayUrl='http://www.baidu.com';
  public resdata;
  public create = {wxstate:false,alistate:false}
  public order = false;
  public payurl;
  public paylist = [{name:'微信支付',type:'wechatpay',state:true},{name:'支付宝支付',type:'alipay',state:false}]
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public navParams: NavParams, public storage: StorageProvider, public config:ConfigProvider,public httpService:HttpServicesProvider, public util: UtilProvider, public modalCtrl: ModalController) {
    let data = this.storage.get('globoalSet');
    this.navigatorBackColor = data.navigatorBackColor;
    this.paySn = this.navParams.get('paySn');  
    this.order = this.navParams.get('order');  
    this.payurl = this.navParams.get('url');  
    if(!this.paySn || this.paySn == null || this.paySn == undefined){
    this.paySn = this.storage.get('paySn');
    this.order = this.storage.get('order');
    } else {
      this.storage.set('paySn',this.paySn);
      this.storage.set('order',this.order);
    }
    // console.log(this.cid);
    // console.log(this.paySn,this.order)
  }

  ionViewDidLoad(){
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
  }

  updatestate (name) {
    if (name == 'wx') {
      if(this.create.wxstate){
        this.create.alistate = this.create.wxstate = false;
        this.create.wxstate = false;
      } else {
        this.create.alistate = this.create.wxstate = false;
        this.create.wxstate = true;
      }
    } else if (name == 'ali') {
      if(this.create.alistate){
        this.create.alistate = this.create.wxstate = false;
        this.create.alistate = false;
      } else {
        this.create.alistate = this.create.wxstate = false;
        this.create.alistate = true;
      }
    }
  }

  // 支付操作
  submitdata() {
    // 判断是否是微信支付还是支付宝支付
    if (this.create.alistate) {
      this.dopay('alipay');
    } else if(this.create.wxstate && !this.config.isApp) {
      this.dopay('wxpay');
    } else if (this.config.isApp){
      this.weiXinAppPay();
    } 
  }

  // 去支付
  dopay (type) {
    var data;
    if (!this.order) {
      // 从立即下单/购物车入口进来
      data = {paySn: this.paySn, optionsRadios:type}
    } else {
      // 从订单列表入口进来的支付
      data = {orderSn: this.paySn, optionsRadios:type}
    }
    this.util.showLoading('');
    this.httpService.requestPostTokenDataform(this.config.requesturl + '/payindex', data, (res) => {
      let responsedatas = res;
      if (responsedatas.code == 200) {
        if (type == 'alipay') {
          // var newEle = document.getElementById('newEle');
          // newEle.innerHTML = responsedatas.data;
          // alert(JSON.stringify(responsedatas.data))
          // document.forms[0].submit();
          const div = document.createElement('div')
          div.innerHTML = responsedatas.data//此处form就是后台返回接收到的数据
          document.body.appendChild(div)
          document.forms[0].submit();
        } else if (type == 'wxpay') {
          location.href = responsedatas.data;
        }
        this.util.dismiss(0);
      } else if (responsedatas.code == 401) {
        this.gologinpage();          
      } else {
        this.util.Toast(responsedatas.msg, 'top');
      }
    })
  }

  gologinpage() {
    let profileModal = this.modalCtrl.create('LoginPage');
    profileModal.present();
  }

  // App微信支付
  weiXinAppPay(){
    var data;
    var that = this;
    if (!this.order) {
      // 从立即下单/购物车入口进来
      data = {paySn: this.paySn, optionsRadios:'wxpay'}
    } else {
      // 从订单列表入口进来的支付
      data = {orderSn: this.paySn, optionsRadios:'wxpay'}
    }
    this.util.showLoading('');
    this.httpService.requestPostTokenDataform(this.config.requesturl + '/payindexApp', data, (payResult) => {
        // console.log(payResult);
        var params = {
          appid:payResult.appid,
          package:payResult.package,
          partnerid:payResult.partnerid, // merchant id
          prepayid: payResult.prepayid, // prepay id
          noncestr: payResult.nonceStr, // nonce
          timestamp: payResult.timeStamp, // timestamp
          sign: payResult.sign // signed string
        };
        // WechatPlugin.isInstalled();
        // console.log(params)
        WechatPlugin.sendPaymentRequest(params).then((result)=>{
          //支付成功
          that.goPayStatusPage(true);
        },(error)=>{
         //支付失败
          that.goPayStatusPage(false);
        })
      }
    )
  }

  // 去到返回支付状态界面
  goPayStatusPage (status) {
    let profileModal = this.modalCtrl.create('PaysucessPage', {'status':status});
    profileModal.onDidDismiss(() => {
      this.viewCtrl.dismiss();      
    })
    profileModal.present();
  }
}
