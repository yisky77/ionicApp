import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { ConfigProvider } from '../../providers/config/config';
import { UtilProvider } from '../../providers/util/util';

@IonicPage({
  name: 'CategoryPage',
  segment: 'CategoryPage/:id',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})

export class CategoryPage {
  public navigatorBackColor:any; 
  public leftCate = [];
  public rightCate = [];
  public rightthirdCate = [];
  public currentIndex = 0;
  public imageUrl = '';
  public cateLevel = '2';
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider,public httpService:HttpServicesProvider, public config:ConfigProvider, public util: UtilProvider) {
    let data = this.storage.get('globoalSet');
    this.navigatorBackColor = data.navigatorBackColor;
    this.currentIndex = Number(this.navParams.get('id'));
    this.getlist();
  }

  getRightCateSecondData() {
    this.navCtrl.push('CategoryListPage');
  }

  getRightCateThirdData() {
    this.navCtrl.push('CategoryListPage');
  }

  // 获取右侧二级内容
  getRightCateDatalist (index) {
    this.currentIndex = index;
    this.rightCate = this.leftCate[index].childs;
    console.log(this.rightCate);
  }

  // 获取右侧三级内容
  getRightCateData (index) {
    this.rightthirdCate = this.rightCate[index].childs;
    console.log(this.rightCate[index].id)
    if (this.rightthirdCate.length == 0) {
      this.navCtrl.push('CategoryListPage',{cid: this.rightCate[index].id})
    } else {
      this.navCtrl.push('CategoryListPage',{cid: this.rightCate[index].id})
    }
  }
  
  getlist () {
    this.util.showLoading('请稍后')
    this.httpService.requestGetData(this.config.requesturl+'/cate', (res) => {
      let responsedata = JSON.parse(res._body);
      if(responsedata.code == 200){
        this.leftCate = responsedata.cateList;
        this.imageUrl = responsedata.imageUrl;
        this.rightCate = this.leftCate[0].childs;
        this.cateLevel = responsedata.cateLevel;
        this.leftCate.forEach((item,index) => {
         if(this.currentIndex == item.id) {
           console.log(item.id)
          if (this.cateLevel == '2') this.getRightCateDatalist(index);
          else this.getRightCateData(index);
         }
        })
      } else {
         this.util.showAlert(responsedata.msg,'温馨提醒');
      }
      this.util.dismiss(0);
    })
  }
}
