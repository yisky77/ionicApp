import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';

import {MultiPickerModule} from'ion-multi-picker';
import { HttpModule } from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpServicesProvider } from '../providers/http-services/http-services';
import { ConfigProvider } from '../providers/config/config';
import { StorageProvider } from '../providers/storage/storage';
import { UtilProvider } from '../providers/util/util';
import { AppshareProvider } from '../providers/appshare/appshare';
import { ApploginProvider } from '../providers/applogin/applogin';
import { CityDataProvider } from '../providers/city-data/city-data';
import {PipesModule} from '../pipes/pipes.module';

@NgModule({
  declarations: [
    MyApp,TabsPage
  ],
  imports: [
    BrowserModule,
    PipesModule,
    // ComponentsModule, //引入ComponentsModule模块
    HttpModule, 
    MultiPickerModule,
    // IonicPageModule.forChild(JoinPage),
    IonicModule.forRoot(MyApp,{
      tabsHideOnSubPages: 'true' ,      //隐藏全部子页面tabs
      iconMode: 'ios',                  //引用iOS的图标
      mode: 'ios',                      //把平台设置成iOS的风格
      modalEnter: 'modal-slide-in',     //设置返回的动画效果
      modalLeave: 'modal-slide-out',    //设置返回的动画效果
      backButtonText : ''          //设置返回按钮的文本
    }
    // 深度链接
    // ,{
    //   links: [
    //     { component: HomePage, name: 'home', segment: 'home' }
    //     // { component: DetailPage, name: 'Detail', segment: 'detail/:user', defaultHistory: [HomePage] }
    //   ]
    // }
    )
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HttpServicesProvider,
    ConfigProvider,
    StorageProvider,
    UtilProvider,
    AppshareProvider,
    ApploginProvider,
    CityDataProvider
  ]
})
export class AppModule {}
