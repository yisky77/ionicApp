import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EvaluationPage } from './evaluation';

@NgModule({
  declarations: [
    EvaluationPage,
  ],
  imports: [
    IonicPageModule.forChild(EvaluationPage),
  ],
})
export class EvaluationPageModule {}
