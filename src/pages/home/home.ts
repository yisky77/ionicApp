import { Component } from '@angular/core';
import { IonicPage,NavController, Events, NavParams} from 'ionic-angular'
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { ConfigProvider } from '../../providers/config/config';
import { StorageProvider } from '../../providers/storage/storage';
import { UtilProvider } from '../../providers/util/util';
import { TabsPage } from '../tabs/tabs';
@IonicPage({
  name: 'HomePage',
  segment: 'HomePage/:id'
  // segment: 'HomePage'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  rootPage:any = TabsPage;
  public NewsPage:any;
  public params:any;
  public titleName:any;
  public container = [];
  public bgcolor:any;
  public bgImg:any;
  public navigatorBackColor:any;
  public jishutxt = {content:{}};
  public msg = {contract:'',telephone:'',content:''}
  public homeData:any;
  public tabsData:any;
  public showmore:any;
  public shareImgurl:any;
  public pageinit = true;
  public globoalSet = {navigatorBackColor:'',jishutxt:{},bgImg:'',bgcolor:''};
  // public timesup = 6;
  public hasloaddata = false;
  constructor(public util: UtilProvider,
    public navCtrl: NavController, public config:ConfigProvider, public httpService:HttpServicesProvider,
    public storage: StorageProvider, public events: Events,public navParams: NavParams) {
      events.subscribe('dataSuccess', (homeData,tabsData) => {
        this.homeData = homeData;
        this.tabsData = tabsData;
        if(!this.hasloaddata) this.getpageinit(false);
      });
      if(!this.storage.get('firstIn')) {
        this.tabsData = this.storage.get('tabsData')
        this.storage.set('firstIn', true);
        // this.util.showLoading('');
        if(this.tabsData) this.getpageinit(false);
      }
      if(this.storage.get('homeData')) {
        this.getpageinit(false);
      }
    }
    loadPagedata() {
      this.httpService.requestGetData(this.config.requesturl+this.config.dataurl, (res) => {
        let responsedata = JSON.parse(res._body);
        if(responsedata.code == 200){
          let resdata = responsedata.data;
          let homeData = JSON.parse(resdata.indexPageInfo.pageDetails).pages1;
          let tabsData = resdata.tabbar;
          this.storage.set('homeData',homeData);
          this.storage.set('tabsData',tabsData);
          this.getpageinit(true);
        }
      })
    }
    getpageinit(flag) {
      this.hasloaddata = true;
      if (flag) this.util.dismiss(0);
      let sessData = this.storage.get('tabsData');
      this.navigatorBackColor = sessData.navigatorBackColor
      this.container = this.storage.get('homeData');
      this.jishutxt.content = JSON.parse(sessData.supportText);
      this.bgcolor = sessData.bgColor;
      this.bgImg = sessData.bgImg;
      this.util.mapinit(this.container,0);
      //是否展示海报功能
      this.showmore = sessData.openPost == 1;
      this.shareImgurl = sessData.postUrl;
      if(JSON.parse(this.storage.get('tabslist'))){
        let tabsdata = JSON.parse(this.storage.get('tabslist'))[0];
        this.titleName = tabsdata.name;
      }
    }
    stylefun (item) {
      return this.httpService.stylefuns(item);
    }
    stylefunbg (bgImg) {
      return this.httpService.stylefunbgs(bgImg);
    }
    // 商品或文章
    gopageshop(items,flag) {
      // console.log(items)
      if(items.id !== ''){
        // 进入商城
        if(flag) this.navCtrl.push('ProductPage',{cid: items.id})
        else // 跳转文章
          this.navCtrl.push('ArticleDetailPage',{aid: items.id})
      }
    }
    // 跳转1
    gopage(items){
      console.log(items)
      let openT = items.openT;
      if (openT == 'phone') location.href = "tel:" + items.phone;
      else if (openT === 0) {
        let linkid = items.link;
        if(String(items.link).indexOf('id') !== -1) linkid = items.pid.id;
        this.navCtrl.push('PagecontentPage', {id: linkid, name: items.tt});
      }
      else if (openT === 1) this.util.gopage(items.link,items.pid);
      else if (openT === 3) this.navCtrl.push('IframePage',{iframeurl: items.link});
      else if (openT === '' || openT == null) {return false;}
      else if (openT == 'contact') {
        this.util.showConfirm('即将跳转手机qq客服:'+items.qq, () => {
          window.open("http://wpa.qq.com/msgrd?v=3&uin="+items.qq,'_blank');
        })
      }
    }
    //下拉刷新请求数据
    doRefresh(refresher){
      this.util.showLoading('请稍后');        
      this.loadPagedata();
      refresher.complete();  /*加载完成以后重新渲染页面*/
    }
    gosearch () {
      this.navCtrl.push('SearchPage')
    }

    submsginfo() {
      this.util.submsginfo(this.msg);
    }

    // 更多
    moreAction() {
      const shareinfo = this.storage.get('shareinfo');
      var shareinfos = {
        title:shareinfo?shareinfo.title:this.config.shareinfo.title,
        description:shareinfo?shareinfo.description:this.config.shareinfo.description,
        image:shareinfo?shareinfo.image:this.config.shareinfo.image,
        link:shareinfo?shareinfo.link:this.config.shareinfo.link,
      }
      console.log(shareinfo)
      console.log(shareinfos)
      this.util.presentActionSheet(this.shareImgurl,shareinfos);        
    }

    doRefreshbtn () {
      window.location.href= window.location.protocol+'//'+window.location.host;
    }
  }

