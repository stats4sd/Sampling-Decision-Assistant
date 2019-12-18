import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  {
    path: "home",
    loadChildren: () =>
      import("./pages/home/home.module").then(m => m.HomePageModule)
  },
  {
    path: "changelog",
    loadChildren: () =>
      import("./pages/changelog/changelog.module").then(
        m => m.ChangelogPageModule
      )
  },
  {
    path: "glossary",
    loadChildren: () =>
      import("./pages/glossary/glossary.module").then(m => m.GlossaryPageModule)
  },
  {
    path: "glossary/:slug",
    loadChildren: () =>
      import("./pages/glossary/glossary.module").then(m => m.GlossaryPageModule)
  },
  {
    path: "tutorial",
    loadChildren: () =>
      import("./pages/tutorial/tutorial.module").then(m => m.TutorialPageModule)
  },
  {
    path: "resources",
    loadChildren: () =>
      import("./pages/resources/resources.module").then(
        m => m.ResourcesPageModule
      )
  },
  {
    path: "tool",
    loadChildren: () =>
      import("./pages/tool/tool.module").then(m => m.ToolPageModule)
  }
  // { path: "**", redirectTo: "home" }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
