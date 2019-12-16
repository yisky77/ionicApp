import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { StorageProvider } from '../../providers/storage/storage';
import { ConfigProvider } from '../../providers/config/config';
import { UtilProvider } from '../../providers/util/util';

@IonicPage({
  name: 'PagecontentPage',
  segment: 'pagecontent/:id',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-pagecontent',
  templateUrl: 'pagecontent.html',
})
export class PagecontentPage {
  public container = [];
  public bgcolor:any;
  public bgImg:any;
  public titleName:any;
  public pageid:any;
  public msg = {contract:'',telephone:'',content:''}
  public navigatorBackColor:any;
  public jishutxt = {content:{}};
  constructor(public navCtrl: NavController, public util: UtilProvider, public params: NavParams, public config:ConfigProvider, public httpService:HttpServicesProvider, public storage: StorageProvider) {
    this.pageid = this.params.get('id');
    if (this.pageid == null || this.pageid == undefined) this.pageid = this.storage.get('pageid');
    else this.storage.set('pageid',this.pageid);
    let data = this.storage.get('globoalSet');
    this.bgcolor = data.bgcolor;
    this.bgImg = data.bgImg;
    this.jishutxt.content = data.jishutxt;
    this.navigatorBackColor = data.navigatorBackColor;
  }
  ionViewDidLoad() {
    this.loadPagedata()
  }
  loadPagedata(){
    this.util.showLoading('');
    // 如果是模板页面
    if(this.config.templateId !== undefined){
      this.config.pageurl = '/pre/'+ this.config.templateId +'/page/' +this.pageid;
    } else if(this.config.historyId !== undefined) {
      this.config.pageurl = '/pre/page?historyId='+ this.config.historyId+'&pageId=' + this.pageid;
    } else {
      this.config.pageurl = this.config.pageurl_p+ '/' + this.pageid;
    }
    // 请求页面数据
    this.httpService.requestGetData(this.config.requesturl+this.config.pageurl , (res) => {
      let responsedata = JSON.parse(res._body);
      if(responsedata.code == 200){
        let resdata = responsedata.data;
        if(resdata.indexPageInfo !== null){
          this.container =  JSON.parse(resdata.indexPageInfo.pageDetails).pages1
          this.titleName = resdata.indexPageInfo.pageName
        }
        this.util.mapinit(this.container,10)        
      }
      this.util.dismiss(100);   
    })
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
    else if (openT === 0) this.navCtrl.push('PagecontentPage', {id: items.link, name: items.tt});
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
    this.ionViewDidLoad();
    refresher.complete();  /*加载完成以后重新渲染页面*/
  }
  gosearch () {
    this.navCtrl.push('SearchPage')
  }

  // 留言接口
  submsginfo() {
    this.util.submsginfo(this.msg);
  }
}
