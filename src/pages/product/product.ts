import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage,NavController, NavParams, ModalController  } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { ConfigProvider } from '../../providers/config/config';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { UtilProvider } from '../../providers/util/util';
import { AppshareProvider } from '../../providers/appshare/appshare';

@IonicPage({
  name: 'ProductPage',
  segment: 'ProductPage/:cid',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage {
  @ViewChild('myattr') myattr:ElementRef;

  public navigatorBackColor:any; 
  public cid = 0;
  public imageUrl = 'https://image-clwebsite.cangluxmt.com/jcshopimage';
  public shopSwiperlist = [];
  public tabs='plist';  /*商品列表选中*/
  public item=[];  /*商品列表*/
  public num=1;  /*商品数量*/
  public responsedata;
  public mallMobilePrice;
  public productname1;
  public productname2;
  public shopcanshu;
  public shopcanshu_productname1;
  public shopcanshu_productuptime;
  public shopcanshu_shopname;
  public productAttr;
  public description;
  public evaluations;
  public evaluationlength;
  public virtualSales;
  public productCommentsHighProportion;
  public parameters = [];
  public goods;
  public collectedProduct;
  public address = '';
  public product_attr = '请选择规格数量';
  public cartNumber = 0;
  public openpro = true;
  public shangjia = true;
  public masterImg;
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider, public httpService:HttpServicesProvider, public config:ConfigProvider, public util: UtilProvider,public modalCtrl: ModalController,public appshare:AppshareProvider) {
    let data = this.storage.get('globoalSet');
    this.address = '请选择配送地址';
    this.navigatorBackColor = data.navigatorBackColor;
    this.cid = Number(this.navParams.get('cid'));
    if(!this.cid || this.cid == null || this.cid == undefined){
    this.cid = Number(this.storage.get('proid'));
    } else {
      this.storage.set('proid',this.cid);
    }
      // console.log(this.cid);
      this.getshopDetail();
      this.statistics()
  }

  ionViewDidEnter(){
    let address = this.storage.get('address');
    this.address = address?address:this.address;
  }

  getshopDetail() {
    // 获取数据
    this.httpService.requestGetTokenData(this.config.requesturl+'/product/'+this.cid, (res) => {
      let responsedatas = JSON.parse(res._body);
      if (responsedatas.code == 200) {
        this.cartNumber = responsedatas.cartNumber;
        // this.imageUrl = responsedatas.imageUrl;
        this.shopSwiperlist = responsedatas.productLeadPicList;
        this.mallMobilePrice = responsedatas.goods.mallMobilePrice;
        this.productname1 = responsedatas.product.name1;
        this.productname2 = responsedatas.product.name2;
        this.description = responsedatas.product.description;
        this.masterImg = responsedatas.product.masterImg;
        this.virtualSales = responsedatas.product.virtualSales;
        this.parameters = responsedatas.norms;
        this.goods = responsedatas.goods;
        if(responsedatas.product.state !== 6) this.shangjia = false;
        this.collectedProduct = responsedatas.statisticsVO.collectedProduct;
        // document.getElementById("myVideo").controls=true;
        // document.getElementsByClassName('ql-video')[0].setAttribute('controls','true');
        // document.getElementsByClassName('ql-video')[0].setAttribute('style','color:inherit');
        setTimeout(()=>{
          var len = document.getElementsByTagName('video').length;
          for (var i=0;i<len;i++) {
            document.getElementsByTagName('video')[i].setAttribute('controls','true');
          }
        },1000)
      } else {
        this.openpro = false;
        this.util.Toast(responsedatas.msg,'top');        
      }
    })
    // console.log(this.cid)
    // 获取评论数据
    this.util.showLoading('');
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
      this.util.dismiss(0);
    })
  }
  statistics() {
    let types = this.config.isApp?6:8
    // console.log(this.config.templateId)
    if(this.config.templateId == undefined || this.config.templateId == '') {
      this.httpService.requestPostTokenDataform(this.config.statistics,{url: this.config.webUrl, type: types}, (res) => {
      })
    }
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

  //获取购物车数量
  // getCartsNum(){
  //   var num=0;
  //   var storageData=this.storage.get('carts_data');
  //   if(storageData){
  //       for(var b=0;b<storageData.length;b++){
  //         num+=storageData[b].product_count;
  //       }
  //   }
  //   return num;
  // }

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
    let profileModal = this.modalCtrl.create('ProductParameterPage',{parameters: this.parameters,goods:this.goods,collectedProduct:this.collectedProduct,imageUrl:this.imageUrl});
    profileModal.onDidDismiss(data => {
      console.log(data)
      if (data.flag) this.getshopDetail();
      this.product_attr = data.product_attr;
    })
    profileModal.present();
  }

  doRefresh (refresher) {
    this.util.showLoading('');        
    this.getshopDetail();
    refresher.complete();  /*加载完成以后重新渲染页面*/
  }

  //  判断是否登录获取地址列表
  getAddress () {
    if(this.storage.get('token')){
      this.util.showLoading('');
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

  // 收藏
  collectbtn () {
    if(!this.openpro) return false;
    this.util.showLoading('');
    if(this.collectedProduct) {
      this.cancelcollectbtn();
    } else {
      this.httpService.requestGetTokenData(this.config.requesturl+'/member/docollectproduct?productId='+this.goods.productId, (res) => {
        let responsedatas = JSON.parse(res._body);
        if(responsedatas.code == 200){
          this.collectedProduct = true;
          this.util.Toast('收藏成功！', 'top');         
        } else {
          this.gologinpage();
        }
        this.util.dismiss(0);
      })
    }
  }

  // 取消收藏
  cancelcollectbtn () {
    this.util.showLoading('');
    this.httpService.requestGetTokenData(this.config.requesturl+'/member/cancelcollectproduct?productId='+this.goods.productId, (res) => {
      let responsedatas = JSON.parse(res._body);
      if(responsedatas.code == 200){
        this.collectedProduct = false;
        this.util.Toast('已取消收藏！', 'top');         
      } else {
        this.gologinpage();
      }
      this.util.dismiss(0);
    })
  }

  //  分享微信
  sharebtn () {
     var shareinfos = {
       title:this.productname1==null?'':this.productname1,
       description:this.productname2==null?'':this.productname2,
       image:this.imageUrl+this.masterImg+'?x-oss-process=image/resize,m_mfit,w_500',
       link:this.config.shareDomainUrl+'/#/ProductPage/'+this.storage.get('proid'),
     }
    //  console.log(shareinfos);
    this.appshare.wxShare(0,shareinfos);
  }

}
