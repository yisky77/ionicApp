import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactPage } from './contact';
import {PipesModule} from '../../pipes/pipes.module'

@NgModule({
  declarations: [
    ContactPage
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(ContactPage),
  ],
})
export class AboutPageModule {}
