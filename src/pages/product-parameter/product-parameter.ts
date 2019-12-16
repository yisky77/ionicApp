import { Component, ViewChild, ElementRef} from '@angular/core';
import { IonicPage, NavController, ViewController, ModalController,NavParams } from 'ionic-angular';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { StorageProvider } from '../../providers/storage/storage';
import { UtilProvider } from '../../providers/util/util';
import { ConfigProvider } from '../../providers/config/config';

@IonicPage({
  name: 'ProductParameterPage',
  segment: 'ProductParameterPage',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-product-parameter',
  templateUrl: 'product-parameter.html',
})
export class ProductParameterPage {
  @ViewChild('myattr') myattr:ElementRef;
  public showmask;
  public parameter;
  public norid='';
  public arr = [];
  public currentPara = [];
  public paraNum = 1;
  public navigatorBackColor;
  public product_attr = '请选择规格数量';
  public mallMobilePrice;
  public finishpara = true;
  public paraid;
  public collectflag;
  public finishparakucun = true;
  public flag = false;
  public shoptitles = '';
  public srcimg = ''
  public imageUrl = 'https://image-clwebsite.cangluxmt.com/jcshopimage';
  constructor(public navCtrl: NavController, public util: UtilProvider, public storage: StorageProvider, public httpService: HttpServicesProvider, public config: ConfigProvider, public viewCtrl: ViewController, public modalCtrl: ModalController, public params: NavParams) {
    let data = this.storage.get('globoalSet');
    this.navigatorBackColor = data.navigatorBackColor;
    this.parameter = this.params.data;
    this.mallMobilePrice = this.parameter.goods.mallMobilePrice;
    this.srcimg = this.parameter.imageUrl + this.parameter.goods.images;
    this.paraid = this.parameter.goods.id;
    console.log(this.parameter)
    this.collectflag = this.parameter.collectedProduct;
  }
  
  ionViewDidLoad(){
    this.bindEvent();
  }
//绑定事件的方法
bindEvent(){
  let $this = this;
  // console.log(this.myattr.nativeElement);
  var attrDom=this.myattr.nativeElement;
  attrDom.onclick=function(e){
    // console.log(e.srcElement.nodeName);// 元素名称
    // console.log(e.target);  // DOM节点
    if(e.srcElement.nodeName=='SPAN'){
      var ele:any=e.target;   /*获取点击的元素       注意*/
      var parentNode=ele.parentNode;  /*获取当前元素的父节点*/
      var children=parentNode.children;   /*获取父节点下面的所有子节点  去掉空白节点*/
      for(var i=0;i<children.length;i++){
        children[i].className='tab';
      }
      ele.className = 'tab current';
      //es5 获取dom节点的方式
      var activeDom=document.querySelectorAll('#myattr .current');
      var norid = '';
      $this.product_attr = '';
      for(var a=0;a<activeDom.length;a++){
        norid += activeDom[a].getAttribute('data')+',';
        $this.product_attr += activeDom[a].innerHTML+'、';
        $this.norid = norid.substring(0,norid.lastIndexOf(','));
      }
      // $this.product_attr = $this.product_attr+'(x'+$this.paraNum+')';
      console.log($this.product_attr)
      $this.selectPara();
    }
  }
}

// 选择规格
selectPara () {
  this.util.showLoading('');
  //规格切换
  this.httpService.requestGetTokenData(this.config.requesturl + '/goodsInfo?productId='+this.parameter.goods.productId+'&normAttrId='+this.norid, (res) => {
    let responsedatas = JSON.parse(res._body);
    if (responsedatas.code == 200 && responsedatas.data && responsedatas.data !== null) {
      this.mallMobilePrice = responsedatas.data.mallMobilePrice;
      this.paraid = responsedatas.data.id;
      this.finishpara = true;
      this.srcimg = responsedatas.imgUrl+responsedatas.data.images;
      this.finishparakucun = true;
      this.parameter.goods.productStock = responsedatas.data.productStock;
      if(responsedatas.data.state === 0) {
        this.finishparakucun = false;
        this.util.Toast('抱歉,当前规格库存数量不足,请重新选择！', 'top');
      }
    } else if (responsedatas.code == 401) {
      this.gologinpage();
    }
     else {
      this.finishpara = false;
      this.shoptitles = responsedatas.msg;
      // this.util.Toast(responsedatas.msg, 'top');
    }
    this.util.dismiss(0);
  })
  // console.log(id,this.tab)
}


// 增加数量
incNum(){
  if(this.paraNum < this.parameter.goods.productStock) this.paraNum+=1;
  else this.util.Toast('抱歉,库存数量不足哦！', 'top');
}

//减少数量
decNum(){
  if(this.paraNum>1){
    this.paraNum-=1;
  }
}

closebtn () {
  this.viewCtrl.dismiss({'product_attr':this.product_attr,flag:this.flag});
}

// 加入购物车
addCart () {
// productId 商品ID
// productGoodId 货品ID
  if(this.paraNum > this.parameter.goods.productStock) {
    this.util.Toast('抱歉,库存数量不足哦！', 'top');
    return false;
  } else if (!this.finishpara) {
    this.util.Toast(this.shoptitles, 'top');
    return false;
  } else if (!this.finishparakucun) {
    this.util.Toast('抱歉,当前规格库存数量不足,请重新选择！', 'top');
    return false;
  } 
  // this.util.showLoading('');
  this.httpService.requestPostTokenDataform(this.config.requesturl + '/cart/addtocart',{productId:this.parameter.goods.productId,productGoodId:this.paraid,number:this.paraNum}, (res) => {
    let responsedatas = res;
    // console.log(responsedatas)
    // this.util.dismiss(0);
    if (responsedatas.code == 200) {
      this.flag = true;
      this.viewCtrl.dismiss({'product_attr':this.product_attr,flag:this.flag});
      // this.util.Toast('添加购物车成功！', 'top');         
    } else if (responsedatas.code == 401) {
      this.gologinpage();
    } else {
      this.util.Toast(responsedatas.msg, 'top');
    }
  })
}

  gologinpage() {
    let profileModal = this.modalCtrl.create('LoginPage');
    profileModal.present();
  }

  // 收藏
  collectbtn () {
    this.util.showLoading('请稍后');
    if(this.collectflag) {
      this.cancelcollectbtn();
    } else {
      this.httpService.requestGetTokenData(this.config.requesturl+'/member/docollectproduct?productId='+this.parameter.goods.productId, (res) => {
        let responsedatas = JSON.parse(res._body);
        if(responsedatas.code == 200){
          this.collectflag = true;
          this.flag = true;
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
    this.httpService.requestGetTokenData(this.config.requesturl+'/member/cancelcollectproduct?productId='+this.parameter.goods.productId, (res) => {
      let responsedatas = JSON.parse(res._body);
      if(responsedatas.code == 200){
        this.collectflag = false;
        this.flag = true;
        this.util.Toast('已取消收藏！', 'top');         
      } else {
        this.gologinpage();
      }
      this.util.dismiss(0);
    })
  }

  // 去购买
  goBuy () {
    if(this.paraNum > this.parameter.goods.productStock) {
      this.util.Toast('抱歉,库存数量不足哦！', 'top');
      return false;
    } else if (!this.finishpara) {
      this.util.Toast(this.shoptitles, 'top');
      return false;
    } else if (!this.finishparakucun) {
      this.util.Toast('抱歉,当前规格库存数量不足,请重新选择！', 'top');
      return false;
    }
    this.util.showLoading('');
    this.httpService.requestPostTokenDataform(this.config.requesturl + '/cart/addtocart',{productId:this.parameter.goods.productId,productGoodId:this.paraid,number:this.paraNum}, (res) => {
      let responsedatas = res;
      console.log(responsedatas)
      this.util.dismiss(0);
      if (responsedatas.code == 200) {
        this.navCtrl.push('BuyPage')
      } else if (responsedatas.code == 401) {
        this.gologinpage();
      } else {
        this.util.Toast(responsedatas.msg, 'top');
      }
    })
  }

}
