import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController  } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { ConfigProvider } from '../../providers/config/config';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { UtilProvider } from '../../providers/util/util';

@IonicPage({
  name: 'InteProductPage',
  segment: 'InteProductPage/:inte_id',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-inte-product',
  templateUrl: 'inte-product.html',
})
export class InteProductPage {
  @ViewChild('myattr') myattr:ElementRef;

  public navigatorBackColor:any; 
  public cid = '';
  public imageUrl = '';
  public tabs='plist';  /*商品列表选中*/
  public item=[];  /*商品列表*/
  public responsedata;
  public mallMobilePrice;
  public productname1;
  public shopcanshu;
  public shopcanshu_productname1;
  public shopcanshu_productuptime;
  public shopcanshu_shopname;
  public productAttr;
  public evaluations;
  public evaluationlength;
  public productCommentsHighProportion;
  public parameters = [];
  public goods;
  public collectedProduct;
  public address = '';
  public product_attr = '请选择规格数量';
  public cartNumber = 0;
  public actIntegral = {};
  public sellerid;
  public openpro = true;
  public shangjia = true;
  public actIntegral_image;
  public description;
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider, public httpService:HttpServicesProvider, public config:ConfigProvider, public util: UtilProvider,public modalCtrl: ModalController) {
    let data = this.storage.get('globoalSet');
    this.navigatorBackColor = data.navigatorBackColor;
    this.cid = this.navParams.get('inte_id');
    if(!this.cid) this.cid = this.storage.get('inte_id');
    else this.storage.set('inte_id',this.cid);
    this.getshopDetail();
  }

  ionViewDidEnter(){
    let address = this.storage.get('address');
    this.address = address?address:this.address;
  }

  getshopDetail() {
    this.util.showLoading('');
    // 获取数据
    this.httpService.requestGetTokenData(this.config.requesturl+'/jifen/'+this.cid, (res) => {
      let responsedatas = JSON.parse(res._body);
      if (responsedatas.code == 200) {
        this.cartNumber = responsedatas.cartNumber;
        this.imageUrl = responsedatas.imgUrl;
        this.actIntegral_image = responsedatas.actIntegral.image;
        this.mallMobilePrice = responsedatas.actIntegral.price;
        this.productname1 = responsedatas.actIntegral.name;
        this.parameters = responsedatas.norms;
        this.goods = responsedatas.goods;
        this.description = responsedatas.actIntegral.descinfo;
        this.actIntegral = responsedatas.actIntegral;
        console.log(this.actIntegral)
        this.sellerid = responsedatas.seller.id;
      } else {
        this.openpro = false;
        this.shangjia = false;
        this.util.Toast(responsedatas.msg,'top');        
      }
      this.util.dismiss(0);
    })

    // 获取评论数据
    this.httpService.requestGetData(this.config.requesturl+'/product/comment/'+this.cid, (res) => {
      let responsedatas = JSON.parse(res._body);
      if(responsedatas.code == 200){
        this.evaluations = responsedatas;
        // console.log(this.evaluations)
        this.evaluationlength = responsedatas.statisticsVO.productCommentsAllCount;
        this.productCommentsHighProportion = responsedatas.statisticsVO.productCommentsHighProportion;
      } else {
        this.util.Toast(responsedatas.msg,'top');        
      }
    })
  }

   //判断购物车有没有数据
   hasData(storageData,product_id){
    if(storageData){
        for(var i=0;i<storageData.length;i++){
          if(storageData[i].product_id==product_id){
            return true;  /*有数据*/
          }
        }
    }
    return false;
   }

  //  打开服务详情
  openService(){
    let profileModal = this.modalCtrl.create('ProductServicePage');
    profileModal.present();
  }

  //  获取评价内容
  getevaluation() {
    // console.log(this.evaluations)
    let profileModal = this.modalCtrl.create('EvaluationPage',{evaluation: this.evaluations});
    profileModal.present();
  }

  //  设置规格参数
  getParameter() {
    if(!this.openpro) return false;
    let profileModal = this.modalCtrl.create('InteParameterPage',{parameters: this.parameters,goods:this.goods,collectedProduct:this.collectedProduct,imageUrl:this.imageUrl,actIntegral:this.actIntegral,sellerid:this.sellerid});
    profileModal.onDidDismiss(data => {
      console.log(data)
      if (data.flag) this.getshopDetail();
      this.product_attr = data.product_attr;
    })
    profileModal.present();
  }

  doRefresh (refresher) {
    this.util.showLoading('请稍后');        
    this.getshopDetail();
    refresher.complete();  /*加载完成以后重新渲染页面*/
  }

  //  判断是否登录获取地址列表
  getAddress () {
    if(this.storage.get('token')){
      this.util.showLoading('请稍后');
      this.httpService.requestGetTokenData(this.config.requesturl+'/member/address', (res) => {
        let responsedatas = JSON.parse(res._body);
        if(responsedatas.code == 200){
          this.navCtrl.push('AddressPage',{'Addressdata': responsedatas})
        } else {
          this.gologinpage();
        }
        this.util.dismiss(0);
      })
    } else {
      this.gologinpage();
    }
  }

  gologinpage () {
    let profileModal = this.modalCtrl.create('LoginPage');
    profileModal.onDidDismiss(data => {
      this.getshopDetail();   
    })
    profileModal.present();
  }

}
