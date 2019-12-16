import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { StorageProvider } from '../../providers/storage/storage';
import { ConfigProvider } from '../../providers/config/config';
import { UtilProvider } from '../../providers/util/util';

@IonicPage({
  name: 'PersonPage',
  segment: 'PersonPage',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-person',
  templateUrl: 'person.html',
})
export class PersonPage {
  public container = [];
  public titleName:any;
  public bgcolor:any;
  public bgImg:any;
  public navigatorBackColor:any;
  public jishutxt = {content:{}};
  public msg = {contract:'',telephone:'',content:''}
  constructor(public navCtrl: NavController, public util: UtilProvider, public params: NavParams, public config:ConfigProvider, public httpService:HttpServicesProvider, public storage: StorageProvider) {
    let data = this.storage.get('globoalSet');
    this.bgcolor = data.bgcolor;
    this.bgImg = data.bgImg;
    this.jishutxt.content = data.jishutxt;
    this.navigatorBackColor = data.navigatorBackColor;
  }
  ionViewDidLoad() {
    this.navCtrl.push('LoginPage')
    // this.loadPagedata();
  }
  loadPagedata(){
    this.util.showLoading('');
    let tabsdata = JSON.parse(this.storage.get('tabslist'))[4];
    if(this.config.templateId !== undefined){
      this.config.pageurl = '/pre/'+ this.config.templateId +'/page/'+tabsdata.id;
    } else if(this.config.historyId !== undefined) {
      this.config.pageurl = '/pre/page?historyId='+ this.config.historyId+'&pageId=' + tabsdata.id;
    } else {
      this.config.pageurl = this.config.pageurl_p+ '/' + tabsdata.id;
    }
    this.httpService.requestGetData(this.config.requesturl+this.config.pageurl , (res) => {
      let responsedata = JSON.parse(res._body);
      if(responsedata.code == 200){
        let resdata = responsedata.data;
        this.container = JSON.parse(resdata.indexPageInfo.pageDetails).pages1;
        this.titleName = resdata.indexPageInfo.pageName
        this.util.dismiss(0);   
        this.util.mapinit(this.container,4)
      }
    })
    this.titleName = tabsdata.name;
  }
  stylefun (item) {
    return this.httpService.stylefuns(item);
  }
  stylefunbg (bgImg) {
    return this.httpService.stylefunbgs(bgImg);
  }
  
  //下拉刷新请求数据
  doRefresh(refresher){
    this.ionViewDidLoad();
    refresher.complete();  /*加载完成以后重新渲染页面*/
  }

  gosearch () {
    this.navCtrl.push('SearchPage')
  }
  // 商品或文章
  gopageshop(items,flag) {
    if(items.id !== ''){
      // 进入商城外链
      if(flag)// 跳转商品
        this.navCtrl.push('ProductPage',{cid: items.id})
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
      if(String(items.link).indexOf('?id=') !== -1) linkid = items.pid.id;
      this.navCtrl.push('PagecontentPage', {id: linkid, name: items.tt});
    }
    else if (openT === 1) this.util.gopage(items.link,items.pid);
    else if (openT === 3) this.navCtrl.push('IframePage',{iframeurl: items.link});
    else if (openT === '' || openT == null) {return false;}
    else if (openT == 'contact') {
      this.util.showConfirm('即将跳转手机qq客服:'+items.qq, () => {
        window.location.href="http://wpa.qq.com/msgrd?v=3&uin="+items.qq;
      })
    }
  }

   // 留言接口
   submsginfo() {
    this.util.submsginfo(this.msg);
  }
}
