import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PagecontentPage } from './pagecontent';
import {PipesModule} from '../../pipes/pipes.module'

@NgModule({
  declarations: [
    PagecontentPage
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(PagecontentPage),
  ],
})
export class PagecontentPageModule {}

// @NgModule({
//   declarations: [
//     PagecontentPage
//   ],
//   imports: [
//     IonicPageModule.forChild(PagecontentPage)
//   ],
//   entryComponents: [
//     PagecontentPage
//   ]
// })
// export class PagecontentPageModule {}
