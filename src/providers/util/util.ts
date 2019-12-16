import { Injectable } from '@angular/core';
import { AlertController, App, NavController, LoadingController, ActionSheetController, ModalController, ToastController} from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';
import { AppshareProvider } from '../../providers/appshare/appshare';
import { HttpServicesProvider } from '../../providers/http-services/http-services';

declare var AMap;

@Injectable()
export class UtilProvider {
  public loader:any;
  public map: any; // 地图对象
  constructor(public appCtrl: App,public alertCtrl: AlertController, public toastCtrl: ToastController, public httpService:HttpServicesProvider,public actionSheetCtrl: ActionSheetController, public loadingCtrl: LoadingController, public config:ConfigProvider,public modalCtrl: ModalController,public appshare:AppshareProvider) {}
  // 确认提示弹窗
  showConfirm(ctx,callback) {
    let confirm = this.alertCtrl.create({
      title: '温馨提示',
      message: ctx,
      buttons: [
        {
          text: '取消',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: '确定',
          handler: () => {
            callback && callback();
          }
        }
      ]
    });
    confirm.present();
  }
  // 信息弹窗
  showAlert(ctx,title) {
    let alert = this.alertCtrl.create({
      title: title?title:'温馨提示',
      subTitle: ctx?ctx:'获取信息失败，请重新获取',
      buttons: ['知道了']
    });
    alert.present();
  }
  // 显示loading
  showLoading(txt) {
     this.loader = this.loadingCtrl.create({
      content: txt,
      // spinner: 'circles',
      enableBackdropDismiss:true,
      duration: 3000
    });
    this.loader.present();
  }
  //关闭loading
  dismiss(time){
    setTimeout(() => {
      this.loader.dismiss();
    }, time);
  }

  Toast(content,pos) {
    let toast = this.toastCtrl.create({
      message: content,
      duration: 1000,
      // cssClass: 'toastbg',
      position: pos
    });
    toast.onDidDismiss(() => {
      // console.log('Dismissed toast');
    });
    toast.present();
  }
  // 地图初始化
  mapinit(container,domNum){
    // 处理地图组件渲染
    let containerArr=container;
    setTimeout(()=>{
      var ids= document.getElementsByClassName('containermap'+domNum);
      let mapList=[];
      // console.log(domNum,'domNum');
      containerArr.forEach((val)=>{
        if(val.mapList.length>0){
          mapList.push(val);
        }
      })
      for(let i=0;i<mapList.length;i++){
        let itemMapList=mapList[i].mapList;
         //  console.log(ids,'ids');
         //  console.log(itemMapList[0].longitude,itemMapList[0].latitude);
         this.map=new AMap.Map(ids[i], {
            view: new AMap.View2D({//创建地图二维视口
              zoom: 15, //设置地图缩放级别
              // center:[113.421696,23.119894],
              center:[itemMapList[0].longitude,itemMapList[0].latitude],
              rotateEnable: true,
              showBuildingBlock: true
            })
          });
      } 
    },300)
  }

  // 留言接口
  submsginfo(msg) {
    console.log(msg)
    if (msg.contract.length>0 && msg.content.length>0 && msg.telephone.length>0) {
      if (!(/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(msg.telephone))) {
        this.showAlert('请正确填写手机号','温馨提醒');
        return false;
      }
      this.httpService.requestPostData(this.config.requesturl+'/message/add' , msg, (res) => {
        // let responsedata = JSON.parse(res._body);
        // if(responsedata.success){
        //   let resdata = responsedata.data;
        //   console.log(responsedata) 
        // }
      })
    } else {
      this.showAlert('请填写完整信息后再提交','温馨提醒');
    }
  }

  // 分享
  presentActionSheet(imgurl,shareinfo) {
    let actionSheet = this.actionSheetCtrl.create({
      title: '',
      cssClass:'sss',
      enableBackdropDismiss:true,//点击背景是否关闭
      buttons: [
        {
          text: '生成制作海报',
          handler: () => {
            this.showAlert('<img src=' + imgurl + '?x-oss-process=image/resize,m_mfit,w_300' + this.config.imageFormat + ' />', '海报展示(长按图片可保存)');
          }
        },
        // {
        //   text: '分享给微信朋友',
        //   handler: () => {
        //     this.appshare.wxShare(0,shareinfo);
        //   }
        // },
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  // 判断跳转
  gopage (pagepath,pid) {
    let activeNav: NavController = this.appCtrl.getActiveNav();
    // console.log(pagepath)
    if(pagepath.indexOf('category') !== -1){
      activeNav.push('CategoryPage',{'id': pid});
    } else if(pagepath.indexOf('shopCart') !== -1){
      activeNav.push('CartPage');
    } else if(pagepath.indexOf('my_indent') !== -1){
      activeNav.push('MyorderPage');
    } else if(pagepath.indexOf('joinUs') !== -1){
      activeNav.push('JoinPage');
    } else if(pagepath.indexOf('/coupon/') !== -1){
      activeNav.push('CouponPage');
    } else if(pagepath.indexOf('my_coupon') !== -1){
      activeNav.push('MycouponsPage');
    } else if(pagepath.indexOf('goods_detail') !== -1){
      activeNav.push('ProductPage',{'cid': pid});
    } else if(pagepath.indexOf('newDetail') !== -1){
      activeNav.push('ArticleDetailPage',{'aid': pid});
    } else if(pagepath.indexOf('goodList') !== -1 || pagepath.indexOf('goods_type') !== -1){
      activeNav.push('CategoryListPage',{'cid': pid});
    } else if(pagepath.indexOf('pages/my/my') !== -1){
      activeNav.push('VipcenterPage');
    } else if(pagepath.indexOf('sellerList') !== -1){
      activeNav.push('StoreListPage');
    } else if(pagepath.indexOf('shop_detail') !== -1){
      activeNav.push('StorePage',{'sid': pid});
    } else if(pagepath.indexOf('tuangou') !== -1){
      activeNav.push('TuangouPage');
    } else if(pagepath.indexOf('resevrveList') !== -1){
      activeNav.push('ResevrveListPage');
    } else if(pagepath.indexOf('jieti') !== -1){
      activeNav.push('JietiPage');
    } else if(pagepath.indexOf('intergral_shop') !== -1){
      activeNav.push('IntegralMallPage');
    } else if(pagepath.indexOf('bargainList') !== -1){
      activeNav.push('BargainListPage');
    } else if(pagepath.indexOf('inTime') !== -1){
      activeNav.push('IntimePage');
    } else if(pagepath.indexOf('pingtuanList') !== -1){
      activeNav.push('PingtuanPage');
    }
  }
}
