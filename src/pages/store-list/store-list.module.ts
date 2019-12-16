import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StoreListPage } from './store-list';

@NgModule({
  declarations: [
    StoreListPage,
  ],
  imports: [
    IonicPageModule.forChild(StoreListPage),
  ],
})
export class StoreListPageModule {}
