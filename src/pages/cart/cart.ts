import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { UtilProvider } from '../../providers/util/util';
import { ApploginProvider } from '../../providers/applogin/applogin';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { ConfigProvider } from '../../providers/config/config';


@IonicPage({
  name: 'CartPage',
  segment: 'CartPage',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {
  rootPage:any = 'CartPage'
  public list = [];
  public changenum = false;
  public navigatorBackColor;
  public haslogin = true;
  public hasbuylist = false;
  public isChencked=false;  /*全选反选*/
  public imgUrl = '';
  public cartList;
  public listsum = 0;
  public showop = false;
  public showbasket = false;
  public cartInfoVO= {totalCheckedNumber:'',checkedDiscountedCartAmount:''};
  constructor(public navCtrl: NavController, public util: UtilProvider, public storage: StorageProvider, public httpService: HttpServicesProvider, public params: NavParams, public modalCtrl: ModalController, public config: ConfigProvider, public viewCtrl: ViewController, public applogin: ApploginProvider) {
    let data = this.storage.get('globoalSet');
    this.navigatorBackColor = data.navigatorBackColor;
    this.getbuylist();
  }
  
  // 购物车列表
  getbuylist() {
    this.util.showLoading('');
    this.httpService.requestGetTokenData(this.config.requesturl + '/cart/detail', (res) => {
      let responsedatas = JSON.parse(res._body);
      this.util.dismiss(0);
      if (responsedatas.code == 200) {
        this.imgUrl = responsedatas.imgUrl;
        this.list = responsedatas.cartInfoVO.cartListVOs;
        this.cartInfoVO = responsedatas.cartInfoVO;
        if(this.list.length < 1) this.showbasket = true;
        else this.getChenckNumlength();
        // console.log(this.cartList)
      } else if (responsedatas.code == 401) {
        this.haslogin = false;
        this.gologinpage();
      } else {
        this.util.Toast(responsedatas.msg, 'top');
      }
    })
  }

  gologinpage() {
    let profileModal = this.modalCtrl.create('LoginPage');
    profileModal.onDidDismiss(data => {
      this.getbuylist();
    })
    profileModal.present();
  }

  getRefresh(refresher) {
    this.getbuylist()
    refresher.complete();
  }

  //  去主页
  gohome() {
    this.navCtrl.popToRoot();
  }

  getChenckNumlength() {
    console.log(this.getChenckNum(),this.listsum )
    //进来的时候判断有没有全选
    if (this.listsum === this.getChenckNum() && this.list.length > 0) {
      this.isChencked = true;
    } else {
      this.isChencked = false;
    }
  }

  changeCarts(item) {
    item.checked = item.checked?0:1;
    this.httpService.requestPostTokenDataform(this.config.requesturl+'/cart/cartchecked',{checked:item.checked,id:item.id}, (res) => {
      if(res.code == 200){
        this.getbuylist();
      } else {
        this.util.Toast(res.msg,'top');
      }
    })
  }

  /*计算总价*/
  sumPrice(item) {
    console.log(item)
    if(this.changenum) return false;
    this.changenum = true;
    this.httpService.requestPostTokenDataform(this.config.requesturl + '/cart/updateCart',{id:item.id,count:item.count}, (res) => {
      let responsedatas = res;
      if (responsedatas.code == 200) {
        this.getbuylist();
      } else if (responsedatas.code == 401) {
        this.gologinpage();
      } else {
        this.util.Toast(responsedatas.msg, 'top');
      }
      this.changenum = false;
    })
  }

  //数量变化  双向数据绑定
  decCount(item) {
    if (item.count > 1 && !this.changenum) {
      --item.count;
      this.sumPrice(item);
    }
  }

  incCount(item) {
    if(item.count < item.productGoods.productStock && !this.changenum){
      ++item.count;
      this.sumPrice(item);
    }
  }

  //全选反选
  //ionChange  事件只要checkbox改变就会触发
  checkAll() {  /*按钮*/
    if (this.isChencked) this.changeCheck(0);
    else this.changeCheck(1);
  }

  //获取选中的数量
  getChenckNum() {
    let sum = 0;
    this.listsum = 0;
    for (let i = 0; i < this.list.length; i++) {
      for (let j = 0; j < this.list[i].cartList.length; j++) {
        this.listsum += 1;
        if (this.list[i].cartList[j].checked == 1) {
          sum += 1;
        }
      }
    }
    if(sum>0) this.showop = true;
    else this.showop = false;
    return sum;
  }

  changeCheck (ischecked) {
    this.httpService.requestPostTokenDataform(this.config.requesturl+'/cart/cartcheckedall',{checked:ischecked}, (res) => {
      if(res.code == 200){
        this.getbuylist();
        if(ischecked === 1) this.isChencked = true;
        else this.isChencked = false;
      } else {
        this.util.Toast(res.msg,'top');
      }
    })
  }
  
  allcheckflag () {
    let flag = false;
    for (let i = 0; i < this.list.length; i++) {
      for (let j = 0; j < this.list[i].cartList.length; j++) {
        this.listsum += 1;
        if (this.list[i].cartList[j].checked == 1) {
          flag = true;
        }
      }
    }
    return flag;
  }

  //去结算
  doPay() {
    if(this.showop) this.navCtrl.push('BuyPage');
  }

  trash (id) {
    this.util.showConfirm('确定删除吗',() => {
      this.httpService.requestPostTokenDataform(this.config.requesturl+'/cart/deleteCart',{id:id}, (res) => {
        if(res.code == 200){
          this.getbuylist();
        } else {
          this.util.Toast(res.msg,'top');
        }
      })
    })
  }
}
