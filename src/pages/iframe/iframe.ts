import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageProvider } from '../../providers/storage/storage';
import { DomSanitizer } from '@angular/platform-browser';
import { UtilProvider } from '../../providers/util/util';
import { Events } from 'ionic-angular'; //订阅

@IonicPage({
  name: 'IframePage',
  segment: 'IframePage',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-iframe',
  templateUrl: 'iframe.html',
})
export class IframePage {
  public viewlocation:any;
  public iframeurl:any;
  // public navigatorBackColor:any;
  constructor(public navCtrl: NavController, public params: NavParams, public storage: StorageProvider,public sanitizer: DomSanitizer, public util: UtilProvider, public events: Events) {
    let iframeurls = this.params.get('iframeurl');
    if (iframeurls == null || iframeurls == undefined) this.iframeurl = this.storage.get('iframeurl');
    else this.storage.set('iframeurl',iframeurls);
    this.iframeurl = iframeurls;
    this.util.showLoading('');
    this.viewlocation = this.sanitizer.bypassSecurityTrustResourceUrl(this.iframeurl);
    this.util.dismiss(500);
  }

  // 回到根目录首页
  back () {
    this.navCtrl.pop();
  }
}
