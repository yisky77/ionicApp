import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AboutPage } from './about';
import {PipesModule} from '../../pipes/pipes.module'

@NgModule({
  declarations: [
    AboutPage
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(AboutPage),
  ],
})
export class AboutPageModule {}
