import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import {PipesModule} from '../../pipes/pipes.module'
@NgModule({
  declarations: [
    HomePage
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(HomePage),
  ],
})
export class HomePageModule {}
