import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {Platform} from 'ionic-angular';
@Injectable()
export class ConfigProvider {
  // 是否是APP应用 默认
  public isApp = true;
  // false 代表线上
  public isPro = true;
  // 模板测试
  public isTemplatetest = true;
  public statistics = '//www.zhihuiyunqi.com/admin/pv/PvAndUvStatistics'
  // public statistics = '//192.168.30.230:9090/admin/pv/PvAndUvStatistics'
  // 访问域名
  // 图片服务器地址
  public imageUrl = this.isPro ? "https://image-clwebsite.cangluxmt.com/jcshopimage":'http://test.image.cangluxmt.com/jcshopimage';
  // 预览页请求接口地址
  public dataurl = '/init';
  public pageurl = '/page';
  public pageurl_p = '/page'
  public domainUrl = '';
  //默认不打开webp格式
  public imageFormat = '';
  // --APP应用指定域名
  // public webUrl = '192.168.30.230:8808';
  public webUrl = 'm.yfjiajv.com';
  public shareDomainUrl = 'http://'+this.webUrl;
  // public shareDomainUrl = 'http://m.chuanxiangdz.com';
  // public requesturl = this.shareDomainUrl;
  public requesturl = this.shareDomainUrl + '/h5frontapi';
  // 是否是作品预览还是模板预览，默认是作品预览
  public templateId;
  public historyId;
  public isShare = false;// 是否可以分享
  // 微信登录要用到
  //微信appid（默认智慧云企）部分客户没有开通微信开放功能账号就不能微信分享、登录、以及app支付功能（这里用来微信登录,分享、支付用不到这个）
  // public APPID: string = 'wxebe72efc857ca584';
  // public appSecret: string = 'a363e9a10d8cbd8776ad29542ea1cffb';
  
  // 起淘客户微信开放平台appid
  // public APPID: string = 'wx8dc1d774c30c86be';
  // public appSecret: string = '66cb39589072138f1cfaee0774b0366e';
  
  // 家禽
  public APPID: string = 'wxc6cc24378593cdf2';//包名：com.cangluxmt.jqyz88
  public appSecret: string = '47b274f4c4ae991c8b67487cd8c9997e';
  // 默认分享文案
  public shareinfo = {
    title:"专业一站式企业上云服务商智慧云企为您服务",
    description:"智慧云企上云系统，一站打通企业走上互联网的所有流量端口，建立属于自己的流量池及大数据分析中心",
    image:"https://image-mnxcx.cangluxmt.com/Mobile/assets/imgs/shareimg.png",
    link:"https://www.zhyq.org.cn"
  }

  constructor(public platform: Platform) {
    this.platform.ready().then((res) => {
    // 判断是否是app还是h5,如果是h5
      if (res !== 'cordova' && location.href.indexOf('localhost') == -1 && location.href.indexOf('192') == -1 && location.href.indexOf('.html') == -1) {
      // if (res !== 'cordova') {
        this.isApp = false;
        console.log('这里是h5')
        let id = window.location.protocol+'//'+window.location.host;
        this.requesturl = id+'/h5frontapi';
        this.shareDomainUrl = id;
        this.webUrl = window.location.host;
        let templateId = this.getQueryString('templateId');
        let historyId = this.getQueryString('historyId');
        // console.log(historyId,templateId)
        // 如果是模板预览页面
        if (templateId && templateId !== null) {
          this.templateId = templateId;
        } else if (historyId && historyId !== null) {
          this.historyId = historyId;
        } else {
          this.isTemplatetest = false
        }
      }
    })
    // 判断是否支持webp
    if(this.checkWebp()) this.imageFormat = '/format,webp';
  }

checkWebp() {
  try {
    return(document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') == 0);
  } catch(err) {
    return false;
  }
}

  getQueryString(name) {  
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");  
    var r = window.location.search.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配
    var context = "";  
    if (r != null)  
         context = r[2];  
    reg = null;  
    r = null;  
    return context == null || context == "" || context == "undefined" ? "" : context;  
  }
}
