import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangelogPage } from './changelog.page';

const routes: Routes = [
  {
    path: '',
    component: ChangelogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangelogPageRoutingModule {}
