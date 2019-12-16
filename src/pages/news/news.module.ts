import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewsPage } from './news';
import {PipesModule} from '../../pipes/pipes.module'

@NgModule({
  declarations: [
    NewsPage
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(NewsPage),
  ],
})
export class NewsPageModule {}
