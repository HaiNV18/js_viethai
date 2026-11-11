import { Routes } from '@angular/router';

import { DashboardComponent } from './admin/dashboard/dashboard';

import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';

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
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    }
];
