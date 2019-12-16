import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { ConfigProvider } from '../../providers/config/config';

declare let Wechat;

@Injectable()
export class ApploginProvider {

  constructor(public loadingCtrl: LoadingController,public config:ConfigProvider) {

  }

  weChatAuth() {
    let loading = this.loadingCtrl.create({
      content: "跳转微信登录中...",//loading框显示的内容
      dismissOnPageChange: true, // 是否在切换页面之后关闭loading框
      showBackdrop: true  //是否显示遮罩层
    });
    loading.present();
    try {
      let scope = "snsapi_userinfo",
          state = "_" + (+new Date());
      // 1. 获取code
      Wechat.auth(scope, state, (response) => {
          // 2. 获取token，openID
          Wechat.auth('https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + this.config.APPID + '&secret=' + this.config.appSecret + '&code=' + response.code + '&grant_type=authorization_code', function (accessTokenResponse) {
              var accessToken = accessTokenResponse.access_token;
              var openId = accessTokenResponse.openid;
              console.log(accessTokenResponse);
              // 3. 获取用户信息
              Wechat.auth('https://api.weixin.qq.com/sns/userinfo?access_token=' + accessToken + '&openid=' + openId + '&lang=zh_CN', function (userInfoResponse) {
                  console.log(userInfoResponse); // 用户信息
                  // openid    普通用户的标识，对当前开发者帐号唯一
                  // nickname    普通用户昵称
                  // sex    普通用户性别，1为男性，2为女性
                  // province    普通用户个人资料填写的省份
                  // city    普通用户个人资料填写的城市
                  // country    国家，如中国为CN
                  // headimgurl    用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空
                  // privilege    用户特权信息，json数组，如微信沃卡用户为（chinaunicom）
                  // unionid    用户统一标识。针对一个微信开放平台帐号下的应用，同一用户的unionid是唯一的。
              });
          });
      }, (reason) => {
          alert("Failed: " + reason);
      });
  } catch (error) {
      console.log(error);
  } finally {
      loading.dismiss();
  }
    // try {
    //   let scope = "snsapi_userinfo",
    //   state = "_" + (+new Date());
    //   Wechat.auth(scope, state, (response) => {
    //     alert(JSON.stringify(response));
    //   }, (reason) => {
    //     alert("Failed: " + reason);
    //   });
    // } catch (error) {
    //   console.log(error);
    // } finally {
    //   loading.dismiss();
    // }
    
  }
}
