import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { ConfigProvider } from '../../providers/config/config';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { UtilProvider } from '../../providers/util/util';

@IonicPage({
  name: 'CategoryListPage',
  segment: 'CategoryListPage/:cid',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-category-list',
  templateUrl: 'category-list.html',
})

export class CategoryListPage {
  public navigatorBackColor:any; 
  public shopCatelist = [];
  public imageUrl = 'https://image-clwebsite.cangluxmt.com/jcshopimage';
  public currentIndex = 0;
  public pageSize = 10;
  public currentPage = 1;
  public cid = '';
  public showalltxt = false
  public topCate = ['全部商品','最新上市','价格高低','销量高低']
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider, public config:ConfigProvider,public httpService:HttpServicesProvider, public util: UtilProvider) {
    let data = this.storage.get('globoalSet');
    this.navigatorBackColor = data.navigatorBackColor;
    this.cid = this.navParams.get('cid');
    if(!this.cid) this.cid = this.storage.get('listid');
    else this.storage.set('listid',this.cid);
    this.getTopCateDatalist(0,false)
  }

  getshoplist(idnum) {
    this.currentPage = 1;
    this.shopCatelist=[]
    this.getTopCateDatalist(idnum,false)
    // this.httpService.requestGetData(this.config.requesturl+'/cate/'+this.cid+'?pageIndex='+this.currentPage, (res) => {
    //   let responsedata = JSON.parse(res._body);
    //   if(responsedata.code == 200){
    //     this.imageUrl = responsedata.imageUrl;
    //     this.shopCatelist = this.shopCatelist.concat(responsedata.productList);
    //     this.currentPage ++;
    //   } else {
    //      this.util.showAlert(responsedata.msg,'温馨提醒');
    //   }
    //   if(infiniteScroll) infiniteScroll.complete(); // 停止上拉加载
    //   this.util.dismiss(0);
    // })
  }

  goProduct() {
    this.navCtrl.push('ProductPage');
  }

  doInfinite(infiniteScroll){
    if(infiniteScroll) {
      this.getTopCateDatalist(this.currentIndex,infiniteScroll)
    }
  }
  getTopCateDatalist (idnum,infiniteScroll) {
    this.currentIndex = idnum;
    this.util.showLoading('请稍后');
    this.httpService.requestGetData(this.config.requesturl+'/cate/'+this.cid+'?type='+idnum+'&pageIndex='+this.currentPage, (res) => {
      let responsedata = JSON.parse(res._body);
      if (responsedata.code == 200) {
        // this.imageUrl = responsedata.imageUrl;
        console.log(this.imageUrl)
        if(responsedata.productList){
          this.shopCatelist =  this.shopCatelist.concat(responsedata.productList);
          this.currentPage ++;
        } else {
          this.showalltxt = true
        }
      } else {
         this.util.showAlert(responsedata.msg,'温馨提醒');
      }
      if(infiniteScroll) infiniteScroll.complete(); // 停止上拉加载
      this.util.dismiss(0);
    })
  }



}
