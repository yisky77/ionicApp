import { Component,ViewChild} from '@angular/core';
import { Platform, Nav, App, MenuController, NavController, ModalController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StorageProvider } from '../providers/storage/storage';
import { HttpServicesProvider } from '../providers/http-services/http-services';
import { ConfigProvider } from '../providers/config/config';
import { Events } from 'ionic-angular'; // 订阅
import { TabsPage } from '../pages/tabs/tabs';
import { UtilProvider } from '../providers/util/util';

declare var wx: any;
// declare var WeixinJSBridge:any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = TabsPage;
  public pages = [];
  public resdata:any;
  public wxresdata:any;
  public hidepic:any;
  public temp = false;
  public globoalSet = {navigatorBackColor:'',jishutxt:{},bgImg:'',bgcolor:''};
  constructor(public menuCtrl:MenuController,public util: UtilProvider, public app: App, platform: Platform, public config:ConfigProvider, public httpService:HttpServicesProvider, public statusBar: StatusBar, splashScreen: SplashScreen, public storage: StorageProvider, public events: Events, public modalCtrl: ModalController) {
    this.statusBar.overlaysWebView(false);
    platform.ready().then((res) => {
      statusBar.styleDefault();
      if (platform.is('ios')) statusBar.hide();
      splashScreen.hide();
      this.storage.remove('homeData');
      if (!this.config.isApp) {
        // let href = location.href;
        // if (href.length > 0 && this.storage.get('locationhref') !== href) {
        //   this.storage.remove('homeData');
        //   this.storage.set('locationhref',href);
        // }
        if (window.location.href.indexOf('/#/home') !== -1) {
          window.location.href = window.location.protocol+'//'+window.location.host;      
        }
        if(this.config.templateId !== undefined) {
          this.temp = true
          this.config.dataurl = '/pre/'+ this.config.templateId;
          this.config.requesturl = '//h5front.cangluxmt.com/h5frontapi';
        } else if(this.config.historyId !== undefined) {
          this.temp = true
          this.config.dataurl = '/pre?historyId='+ this.config.historyId;
          // this.config.requesturl = '//192.168.30.230:8084/history';
          this.config.requesturl = '//h5api.cangluxmt.com/history';
        }
      }
      this.gethttpService();
      this.statistics()
      // this.getWechatShare();
    })
    
    // 默认打开首页
    // this.rootPage = TabsPage;
    // 判断是否打开欢迎界面
    // if(this.storage.get('firstIn')) { 
    //   this.rootPage = TabsPage; 
    // } else {
    //   this.rootPage = WelcomePage;
    // }
    
  } 
  statistics() {
    let types = this.config.isApp?6:2
    if(!this.temp) {
      this.httpService.requestPostTokenDataform(this.config.statistics,{url: this.config.webUrl, type: types}, (res) => {
      })
    }
  }
  gethttpService () {
    // this.httpService.requestGetData('http://h5front.cangluxmt.com/h5frontapi'+this.config.pageurl, (res) => {
      this.httpService.requestGetData(this.config.requesturl+this.config.dataurl, (res) => {
      let responsedata = JSON.parse(res._body);
      if(responsedata.code == 200){
        let resdata = responsedata.data;
        let homeData = JSON.parse(resdata.indexPageInfo.pageDetails).pages1;
        this.storage.set('homeData',homeData);
        let tabsData = resdata.tabbar;
        this.storage.set('tabsData',tabsData);
        this.events.publish('dataSuccess', homeData,tabsData);
        if (resdata.tabbar !== null) {
          let list = JSON.parse(resdata.tabbar.tabBar).list;
          list.forEach((element, index) => {
            let page;
            switch (index) {
              case 0 : page = 'HomePage';break;
              case 1 : page = 'AboutPage';break;
              case 2 : page = 'ContactPage';break;
              case 3 : page = 'NewsPage';break;
              case 4 : page = 'PersonPage';break;
            }
            this.pages.push({name: element.pageName, component: page, id: element.pageInfoId, pagePath: element.pagePath});
          })
          this.globoalSet.navigatorBackColor = tabsData.navigatorBackColor;
          this.globoalSet.bgImg = tabsData.bgImg;
          this.globoalSet.jishutxt = JSON.parse(tabsData.supportText);
          this.globoalSet.bgcolor = tabsData.bgColor;
          this.storage.set('globoalSet',this.globoalSet);
        }
      } else {
        this.navController.push('WrongPage');
      }
    })
  }

  // 公众号微信分享
  getWechatShare () {
    // var link = window.location.href.split('#')[0];
    var that = this;
    // var link = encodeURIComponent(window.location.href.split('#')[0]);
    // 获取微信分享appid等信息
    this.httpService.requestshopGetData(this.config.requesturl+'/share?url=' + this.config.shareDomainUrl, (res) => {
      var data = JSON.parse(res._body);
      if(data.success && data.data.length>0){
        this.resdata = data.data;
        document.title = this.resdata.title;
        // this.storage.set('shareImgurl', this.resdata.shareimage);
        this.storage.set('shareinfo', JSON.stringify(this.resdata));
        // console.log(this.resdata.title)
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: this.resdata.appid, // 必填，公众号的唯一标识
          timestamp: this.resdata.timestamp, // 必填，生成签名的时间戳
          nonceStr: this.resdata.noncestr, // 必填，生成签名的随机串
          signature: this.resdata.signature,// 必填，签名
          jsApiList: [
            'checkJsApi',
            'updateAppMessageShareData',
            'updateTimelineShareData'
          ]
        });
        // wx.checkJsApi({
        //     jsApiList: ['updateAppMessageShareData','updateTimelineShareData'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
        //     success: function(res) {
        //         alert(res);
        //     }
        // })

        wx.ready(function () {
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
            var res = data.data;
            wx.updateAppMessageShareData({
                title: res.title, // 分享标题
                desc: res.description, // 分享标题
                link: that.config.shareDomainUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: res.shareimage, // 分享图标
            }, function (res) {
                //这里是回调函数
                // alert("分享好友成功");
            });

            wx.updateTimelineShareData({ 
              title: res.title, // 分享标题
              link: that.config.shareDomainUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: res.shareimage, // 分享图标
            }, function(res) { 
              //这里是回调函数 
              // alert('分享朋友圈成功')
            }); 
        });
      
      }
    })
    
  }

  //此处才是最重要的代码
  get navController(): NavController {
    return this.app.getRootNav();
  }

  // 侧边栏点击
  openPage(page) {
    this.menuCtrl.close();
    // console.log(page)
    if (page.id === 0 && page.pagePath !== '') {
      let pagepath = page.pagePath;
      this.util.gopage(pagepath,0);
    } else {
      this.navController.push(page.component);
    }
  }
  
  // 回到首页
  goToHome(){
    // this.hidepic = 'showpic';
    // this.navController.push(TabsPage);
    window.location.href= window.location.protocol+'//'+window.location.host;
  }

}
