import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { ConfigProvider } from '../../providers/config/config';
import { NavController} from 'ionic-angular'
import { UtilProvider } from '../../providers/util/util';

@IonicPage({
  name: 'SearchPage',
  segment: 'SearchPage',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
    searchQuery: string = '';
    public searchitems = [];
    public bgcolor:any;
    public bgImg:any;
    public pagenum = 1;
    public imageurl = '';
    public navigatorBackColor:any;  
    public datas = [];
    public searching = false;
    public infinite = true;
    constructor(public storage: StorageProvider, public navCtrl: NavController, public util: UtilProvider, public httpService:HttpServicesProvider, public config:ConfigProvider) {
      // this.initializeItems();
      this.imageurl = this.config.imageUrl;
      let data = this.storage.get('globoalSet');
      this.bgcolor = data.bgcolor;
      this.bgImg = data.bgImg;
      this.navigatorBackColor = data.navigatorBackColor;
    }
    
    getItems() {
      console.log(this.storage.get('tabsData').agentId);
      if (this.searchQuery !== '' && !this.searching) {
        if (this.storage.get('tabsData').agentId == 6887) {
          this.navCtrl.push('IframePage',{iframeurl: "http://search.cxyw.org/index.php?s=/Search/viewinfo/id/"+this.searchQuery});
          return false;
        } else if (this.storage.get('tabsData').agentId == 6888) {
          this.navCtrl.push('IframePage',{iframeurl: "http://search.cxbz.org/index.php?s=/LabelInfo/noInfo/id/"+this.searchQuery});
          return false;
        }
        this.util.showLoading('');
        this.searching = true;
        this.httpService.requestshopGetData(this.config.requesturl+'/searchjson?keyword='+ this.searchQuery + '&pageNum='+this.pagenum, (res) => {
          let responsedata = JSON.parse(res._body);
          // console.log(responsedata)
          if (responsedata.code == 200) {
            let data = responsedata.data;
            console.log(responsedata)
            this.searchitems = data;
            this.pagenum = 1;
            console.log(this.searchitems)
          }
          this.searching = false;
          this.util.dismiss(0);
        })
      }
    }

    // stylefunbg (bgImg) {
    //   console.log(bgImg)
    //   return this.httpService.stylefunbgs(bgImg);
    // }
    // 上拉刷新
    doInfinite(infiniteScroll) {
      this.pagenum++;
      setTimeout(() => {
        if(this.infinite) {
          this.httpService.requestshopGetData(this.config.domainUrl+'/searchJson.html?keyword='+ this.searchQuery + '&pageNum='+ this.pagenum, (res) => {
          if (res.success) {
            let responsedata = JSON.parse(res._body);
            let data = responsedata.rows;
            console.log(data)
            this.searchitems.concat(data);
            console.log(this.searchitems)
            if (data.length == 0) this.infinite = false;
            infiniteScroll.complete();
          }
          })
        }
      }, 1000);
    }

    // 商品或文章
    gopageshop(items) {
      // if(items.id !== ''){
        // 进入商品
      this.navCtrl.push('ProductPage',{cid: items.id})
      // }
    }

  }
