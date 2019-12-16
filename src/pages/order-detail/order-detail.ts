import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { ConfigProvider } from '../../providers/config/config';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { UtilProvider } from '../../providers/util/util';

@IonicPage({
  name: 'OrderDetailPage',
  segment: 'OrderDetailPage/:cid',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html',
})
export class OrderDetailPage {
  public navigatorBackColor:any; 
  public currentIndex = 0;
  public cid = '0';
  public pageNum = 1;
  public orderLogList = [];
  public Productlist={mobile:'',name:'',addressAll:'',id:'',orderProductList:[],orderSn:'',moneyDiscount:0,
  addressInfo:'',paySn:'',updateTime:'',paymentName:'',orderState:0};
  public imageUrl = '';
  public orderList = ['全 部','待付款','','待发货','已发货','已完成'];
  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: StorageProvider, public config:ConfigProvider,public httpService:HttpServicesProvider, public util: UtilProvider, public modalCtrl: ModalController) {
    let data = this.storage.get('globoalSet');
    this.navigatorBackColor = data.navigatorBackColor;
    this.cid = this.navParams.get('cid');
    if (this.cid == null || this.cid == undefined) this.cid = this.storage.get('orderid');
    else this.storage.set('orderid',this.cid);
    // console.log(this.cid)
  }

  ionViewDidLoad(){
    this.getTopCateDatalist(this.cid);   
  }

  getTopCateDatalist (i) {
    this.currentIndex = Number(i);
    this.util.showLoading('');
    this.httpService.requestGetTokenData(this.config.requesturl+'/member/order/'+i, (res) => {
      let responsedata = JSON.parse(res._body);
      if(responsedata.code == 200){
        this.imageUrl = responsedata.imgUrl;
        this.Productlist = JSON.parse(JSON.stringify(responsedata.order));
        this.orderLogList = JSON.parse(JSON.stringify(responsedata.orderLogList));
      }  else if (responsedata.code == 401) {
        this.gologinpage();
      } else {
          this.util.Toast(responsedata.msg,'top');
      }
      this.util.dismiss(0);
    })
  }

  gologinpage () {
    let profileModal = this.modalCtrl.create('LoginPage');
    profileModal.onDidDismiss(data => {
      this.getTopCateDatalist(this.cid)
    })
    profileModal.present();
  }

  //  取消订单
  cancelOrder () {
    var id = this.Productlist.id;
    this.util.showConfirm('是否取消此订单？',()=>{
      // this.util.showLoading('');
      this.httpService.requestGetTokenData(this.config.requesturl+'/member/cancalorder/'+id, (res) => {
        let responsedata = JSON.parse(res._body);
        if(responsedata.code == 200){
          this.getTopCateDatalist(this.cid);
          this.util.Toast('已取消该订单','top');
        }  else if (responsedata.code == 401) {
          this.gologinpage();          
        } else {
          this.util.Toast(responsedata.msg,'top');
        }
        // this.util.dismiss(0);
      })
    })
  }

  // 判断是否可以退换货
  exchange (item,num) {
    console.log(this.Productlist)
    this.util.showConfirm(num==0?'确认是否退货？':'确认是否换货？',()=>{
      this.util.showLoading('');
      this.httpService.requestGetTokenData(this.config.requesturl+'/member/canbackorexchange?orderProductId='+item.id+'&orderId='+this.cid, (res) => {
        let responsedata = JSON.parse(res._body);
        if(responsedata.code == 200){
          if (responsedata.data >= 1) {
            this.navCtrl.push('GoodsbackPage',{'item':JSON.stringify(this.Productlist)});
          } else {
            this.util.Toast('该订单已处于退换货状态！', 'top');
          }
        }  else if (responsedata.code == 401) {
          this.gologinpage();          
        } else {
          this.util.Toast(responsedata.msg,'top');
        }
        this.util.dismiss(0);
      })
    })
  }
}
