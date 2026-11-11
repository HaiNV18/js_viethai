import { Routes } from '@angular/router';

import { AboutComponent } from './ecommerce/about/about';
import { HomeComponent } from './ecommerce/home/home';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'about',
        component: AboutComponent
    }
];
