import { Injectable } from '@angular/core';
import { LoadingController, Platform } from 'ionic-angular';
// declare var Wechat: any;
// declare var QQSDK;

@Injectable()
export class AppshareProvider {
  constructor(public loadingCtrl: LoadingController, platform: Platform) {
    // if (platform.is('ios')) {
    //   this.link = "https://www.baidu.com";
    // }
  }

  wxShare(scene,shareinfo) {
      var loading = this.loadingCtrl.create({ showBackdrop: false });
      loading.present();
      try {
        let Wechat = (<any>window).Wechat;
        Wechat.isInstalled(function (installed) {
          if(!installed){
            alert('您没有安装微信！');
            return ;
          }
        }, function (reason) {
            alert("分享失败,请确定是否开通了微信开放平台分享功能！" + reason);
        });
        console.log(shareinfo)
        Wechat.share({
            message: {
                title: shareinfo.title,
                description: shareinfo.description,
                thumb: shareinfo.image,
                mediaTagName: "TEST-TAG-001",
                messageExt: "111",  // 这是第三方带的测试字段
                messageAction: "222", // <action>dotalist</action>
                media: {
                  type: Wechat.Type.WEBPAGE,
                  webpageUrl: shareinfo.link
                }
            },
            scene: scene == 0 ? Wechat.Scene.SESSION : Wechat.Scene.Timeline  // share to Timeline
          }, function (data) {
            alert("分享成功！");
          }, function (reason) {
            alert("分享失败,请确定是否开通了微信开放平台分享功能！" + reason);
          });
      } catch (error) {
        alert('分享失败,请确定是否开通了微信开放平台分享功能！'+ error);
      } finally {
        loading.dismiss();
      }
  }

  // qqShare(scene) {
  //     var loading = this.loadingCtrl.create({ showBackdrop: false });
  //     loading.present();
  //     try {
  //         var args: any = {};
  //         if (scene == 0) {
  //             args.scene = QQSDK.Scene.QQ;//QQSDK.Scene.QQZone,QQSDK.Scene.Favorite
  //         }
  //         else {
  //             args.scene = QQSDK.Scene.QQZone;
  //         }
  //         args.url = this.link;
  //         args.title = this.title;
  //         args.description = this.description;
  //         args.image = this.image;
  //         QQSDK.shareNews(function () {
  //             loading.dismiss();
  //         }, function (failReason) {
  //             loading.dismiss();
  //         }, args);
  //     } catch (error) {
  //         console.log(error);
  //     } finally {
  //         loading.dismiss();
  //     }
  // }

}
