import { Injectable } from '@angular/core';

import {Http,Headers,RequestOptions} from "@angular/http";
import {stringify} from 'qs';
import 'rxjs/add/operator/map';
import { StorageProvider } from '../../providers/storage/storage';

//配置文件
import { ConfigProvider } from '../config/config';
@Injectable()
export class HttpServicesProvider {
  public api:any;
  private headers = new Headers({'Content-Type': 'application/json'});
  public times = 0;
  constructor(public http: Http,public config:ConfigProvider,public storage:StorageProvider) {
    // this.$width = document.body.clientWidth;
  }

  requestGetData(apiUrl,callback){
    // return new Promise((resolve, reject) => {
      this.http.get(apiUrl).subscribe(function(data){
        callback && callback(data);       /*回调函数*/
        setTimeout(()=>{ document.getElementById('loadingbg').style.display = 'none';},1000)
      },function(err){
        console.log(err);
        callback(err); 
      })
    // })
  }

  requestGetTokenData(apiUrl,callback){
    let configToken = this.storage.get('token');
    let headers = new Headers({'jcshop-Token':configToken});
    this.http.get(apiUrl,{headers: headers}).subscribe(function(data){
      document.getElementById('loadingbg').style.display = 'none';
      callback && callback(data);       /*回调函数*/
    },function(err){
        console.log(err);
        callback(err); 
    })
  }
  
  // 删除操作
  requestDeleteTokenData(apiUrl,callback){
    let configToken = this.storage.get('token');
    let headers = new Headers({'jcshop-Token':configToken});
    this.http.delete(apiUrl,{headers: headers}).subscribe(function(data){
      callback && callback(data);       /*回调函数*/
    },function(err){
        console.log(err);
        callback(err); 
    })
  }

  requestPostTokenData(apiUrl,obj,callback){
    let configToken = this.storage.get('token');
    let headers = new Headers({'Content-Type': 'application/json','jcshop-Token':configToken});
    this.http.post(apiUrl,JSON.stringify(obj), {headers: headers}
    ).subscribe(function(data){
      document.getElementById('loadingbg').style.display = 'none';
        callback && callback(data);       /*回调函数*/
      },function(err){
        callback(err); 
    })
  }

  // x-www-form-urlencoded表单post形式提交
  requestPostTokenDataform(apiUrl,obj,callback){
    let configToken = this.storage.get('token');
    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded','jcshop-Token':configToken});
    let options = new RequestOptions({headers: headers});
    return new Promise((resolve, reject) => {
      this.http.post(apiUrl,stringify(obj), options).map(res => res.json()).subscribe(function(data){
      // this.http.post(apiUrl,stringify(obj), options).subscribe(function(data){
          callback && callback(data);       /*回调函数*/
      document.getElementById('loadingbg').style.display = 'none';
        },function(err){
          callback(err); 
      })
    })
  }

  requestshopGetData(apiUrl,callback){
    // this.api=apiUrl;
    this.http.get(apiUrl,).subscribe(function(data){
      document.getElementById('loadingbg').style.display = 'none';
      callback && callback(data);       /*回调函数*/
    },function(err){
        console.log(err);
        callback(err); 
    })
  }

  requestPostData(apiUrl,obj,callback){
    // this.api=apiUrl;
    this.http.post(apiUrl,
      JSON.stringify(obj),
      {headers: this.headers}
    ).subscribe(function(data){
        // console.log(data);
      document.getElementById('loadingbg').style.display = 'none';
        callback && callback(data);       /*回调函数*/
      },function(err){
        callback(err); 
    })
  }
  
  // 样式渲染
  stylefuns (item) {
    return {
      'width': item.w >= 370 ? '100%' : item.w/375*100+ '%', 'height': item.h === '100%' ? '100%' : item.h + 'px', 'font-size': item.fs + 'px', 'color': item.co, 'background-color': item.bgc, 'border-width': item.bdw + 'px', 'border-color': item.bdc, 'border-style': item.bds, 'border-radius': item.bdr + 'px', 'opacity': item.op, 'position': item.isf ?'fixed':item.pos, 'top': item.t + 'px', 'left': item.l/375*100 + '%', 'z-index': item.zi, 'text-align': item.ta, 'whiteSpace': item.ws, 'font-family': item.ff, 'background': item.bg ? 'url(' + item.bg + ') center center no-repeat' : item.bgc, 'padding': item.pd + 'px', 'margin-top': item.mgt + 'px'
    }
  }

  stylefunbgs (bg) {
    return {
      'background-image': 'url('+ bg +')','background-size': 'cover','background-position': 'center center','width':'100%','height':'100%'
    }
  }
}
