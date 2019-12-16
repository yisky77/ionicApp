import { Component} from '@angular/core';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { ConfigProvider } from '../../providers/config/config';
import { StorageProvider } from '../../providers/storage/storage';
import { UtilProvider } from '../../providers/util/util';
import { Events, NavController, ModalController} from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root = 'HomePage';
  tab2Root = 'AboutPage';
  tab3Root = 'ContactPage';
  tab4Root = 'NewsPage';
  tab5Root = 'PersonPage';
  public bottomcolor:any;
  public fscolor:any;
  public fsActiveColor:any;
  public tabBarType:any;
  public page1 = {}
  public getlist = [];
  public obj:any;
  public tabNumber:number=0;
  public showtabs = true;
  public tabsNums:any;
  public bgcolor:any;
  public bgImg:any;
  public navigatorBackColor:any;
  public homeData:any;
  public tabsData:any;
  public tabindex:number=0;
  public tabslist = [
    {name: ' ', tab: this.tab1Root, pagePath:'', icon:'icondefault', selecticon:'icondefault', id:1},
    {name: ' ', tab: this.tab2Root, pagePath:'', icon:'icondefault', selecticon:'icondefault', id:1},
    {name: ' ', tab: this.tab3Root, pagePath:'', icon:'icondefault', selecticon:'icondefault', id:1},
    {name: ' ', tab: this.tab4Root, pagePath:'', icon:'icondefault', selecticon:'icondefault', id:1},
    {name: ' ', tab: this.tab5Root, pagePath:'', icon:'icondefault', selecticon:'icondefault', id:1}
  ];
  constructor(public httpService:HttpServicesProvider, public storage: StorageProvider, public config:ConfigProvider, public events: Events, public util: UtilProvider, public navCtrl: NavController,public modalCtrl: ModalController) {
    events.subscribe('dataSuccess', (homeData,tabsData) => {
      this.tabsData=tabsData;
      this.getInit();
    });
    if(!this.storage.get('firstIn')) {
      this.tabsData = this.storage.get('tabsData');
      if(this.tabsData) this.getInit();
    }
  }
  getInit() {
    let sessData = this.tabsData;
    this.bottomcolor = JSON.parse(sessData.tabBar).backgroundColor;
    this.fsActiveColor = JSON.parse(sessData.tabBar).selectedColor;
    this.fscolor = JSON.parse(sessData.tabBar).color;
    this.tabBarType = sessData.tabBarType;
    this.showtabs = sessData.showTabBar == 1?true:false;
    this.bgcolor = sessData?sessData.bgColor:'';
    this.bgImg = sessData?sessData.bgImg:'';
    this.navigatorBackColor = sessData.navigatorBackColor;
    this.getlist = JSON.parse(sessData.tabBar).list;
    this.getlist.forEach((element, index) => {
      this.tabslist[index].name = element.pageName;
      this.tabslist[index].icon=element.selectedIconPath.slice(5,14);
      this.tabslist[index].selecticon=element.iconPath.slice(5,14);
      this.tabslist[index].id=element.pageInfoId;
      this.tabslist[index].pagePath=element.pagePath;
    })
    this.storage.set('tabslist',JSON.stringify(this.tabslist))
  }

  getTabsNum(tabs,index){
    // console.log(tabs)
    // let pageName = 'LoginPage';
    if (tabs.id === 0 && tabs.pagePath !== '') {
      // if (!this.config.isApp) {
      //   this.util.gopage(this.config.domainUrl + tabs.pagePath)
      //   return false;
      // } else {
      // 判断是否登录，如果登录了就跳转到指定页面
      // console.log(tabs.pagePath)
      let pagepath = tabs.pagePath;
      this.util.gopage(pagepath,0);
      return false;
    }
    if (tabs.id !== 0) {
      document.getElementsByClassName('tab-button-text')[this.tabindex].setAttribute('style','color:inherit');
      document.getElementsByClassName('tab-button-text')[index].setAttribute('style','color:' + this.fsActiveColor);;
      this.tabindex = index;
    }
    this.tabsNums=index;
  }

}
