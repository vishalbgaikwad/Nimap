import { Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { HomeComponent } from './home/home.component';


export const routes: Routes = [
    {path: '', component:HomeComponent },
    {path: 'category/:categoryId', component:CategoryComponent }
];
