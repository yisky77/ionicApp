import { Component, ViewChild, ElementRef} from '@angular/core';
import { IonicPage, NavController, ViewController, ModalController,NavParams } from 'ionic-angular';
import { HttpServicesProvider } from '../../providers/http-services/http-services';
import { StorageProvider } from '../../providers/storage/storage';
import { UtilProvider } from '../../providers/util/util';
import { ConfigProvider } from '../../providers/config/config';

@IonicPage({
  name: 'InteParameterPage',
  segment: 'InteParameterPage',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-inte-parameter',
  templateUrl: 'inte-parameter.html',
})
export class InteParameterPage {
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
  public finishpara = false;
  public paraid;
  public collectflag;
  public finishparakucun = true;
  public flag = false;
  public srcimg = ''
  public actIntegral={stock:0,price:0,productId:0,id:0};
  public sellerid;
  constructor(public navCtrl: NavController, public util: UtilProvider, public storage: StorageProvider, public httpService: HttpServicesProvider, public config: ConfigProvider, public viewCtrl: ViewController, public modalCtrl: ModalController, public params: NavParams) {
    let data = this.storage.get('globoalSet');
    this.navigatorBackColor = data.navigatorBackColor;
    this.parameter = this.params.data;
    this.actIntegral = this.parameter.actIntegral;
    this.mallMobilePrice = this.actIntegral.price;
    this.sellerid = this.parameter.sellerid;
    this.srcimg = this.parameter.imageUrl+this.parameter.goods.images;
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
    this.httpService.requestGetTokenData(this.config.requesturl + '/goodsInfo?productId='+this.actIntegral.productId+'&normAttrId='+this.norid, (res) => {
      let responsedatas = JSON.parse(res._body);
      console.log(responsedatas)
      if (responsedatas.code == 200 && responsedatas.data !== null) {
        this.paraid = responsedatas.data.id;
        this.finishpara = true;
        this.srcimg = responsedatas.imgUrl+responsedatas.data.images;
        this.finishparakucun = true;
        if(responsedatas.data.state === 0) {
          this.finishparakucun = false;
          this.util.Toast('抱歉,当前规格库存数量不足,请重新选择！', 'top');
        }
      } else if (responsedatas.code == 401) {
        this.gologinpage();
      } else {
        this.finishpara = false;
        this.util.Toast(responsedatas.msg, 'top');
      }
      this.util.dismiss(0);
    })
    // console.log(id,this.tab)
  }


  // 增加数量
  incNum(){
    if(this.paraNum < this.actIntegral.stock) this.paraNum+=1;
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

  gologinpage() {
    let profileModal = this.modalCtrl.create('LoginPage');
    profileModal.present();
  }

  // 去购买
  goBuy () {
    if(this.paraNum > this.actIntegral.stock) {
      this.util.Toast('抱歉,库存数量不足哦！', 'top');
      return false;
    } else if (!this.finishpara) {
      this.util.Toast('请选择完整的规格！', 'top');
      return false;
    } else if (!this.finishparakucun) {
      this.util.Toast('抱歉,当前规格库存数量不足,请重新选择！', 'top');
      return false;
    }
    this.util.showLoading('');
    this.httpService.requestGetTokenData(this.config.requesturl + '/order/jifen-'+this.actIntegral.productId+'-'+this.paraid+'-'+this.sellerid+'-'+this.actIntegral.id+'-'+this.paraNum, (res) => {
      let responsedatas = JSON.parse(res._body);
      this.util.dismiss(0);
      if (responsedatas.code == 200) {
        this.navCtrl.push('InteBuyPage',{responsedatas:responsedatas,pricenum:this.paraNum})
      } else if (responsedatas.code == 401) {
        this.gologinpage();
      } else {
        this.util.Toast(responsedatas.msg, 'top');
      }
    })
  }
}
