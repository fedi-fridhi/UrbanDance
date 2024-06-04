import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

import { AboutComponent } from './pages/about/about.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { AuthenticationComponent } from './pages/authentication/authentication.component';
import { ProfileComponent } from './pages/profile/profile.component';


import { UserlistComponent } from './admin/userlist/userlist.component';
import { AjouteventComponent } from './admin/ajoutevent/ajoutevent.component';
import { ListeventsComponent } from './admin/listevents/listevents.component';
import { EditeventComponent } from './admin/editevent/editevent.component';
import { EventSubscribersComponent } from './admin/eventsubscribers/eventsubscribers.component';
import { AjoutgroupComponent } from './admin/ajoutgroup/ajoutgroup.component';
import { EditgroupComponent } from './admin/editgroup/editgroup.component';
import { GrouplistComponent } from './admin/grouplist/grouplist.component';
import { GroupesComponent } from './pages/groupes/groupes.component';
import { GroupStudentsComponent } from './admin/group-students/group-students.component';
import { VerifyCodeComponent } from './pages/verify-code/verify-code.component';
import { ResetpasswordComponent } from './pages/resetpassword/resetpassword.component';
import { ResetRequestComponent } from './pages/reset-request/reset-request.component';


export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactUsComponent },
    { path: 'auth', component: AuthenticationComponent },
    { path: 'profile/:id', component: ProfileComponent },
    { path: 'users', component: UserlistComponent},
    { path: 'ajoutevent', component: AjouteventComponent},
    { path: 'listevents', component: ListeventsComponent},
    { path: 'editevent/:id', component: EditeventComponent},
    { path: 'eventsubscribers/:id', component: EventSubscribersComponent},
    { path: 'ajoutgroupe', component: AjoutgroupComponent},
    { path: 'updategroup/:id', component: EditgroupComponent},
    { path: 'listgroups', component: GrouplistComponent},
    { path: 'groupes/:type', component: GroupesComponent},
    { path: 'groupstudents/:id', component: GroupStudentsComponent},
    { path: 'resetpassword', component: ResetRequestComponent},
    { path: 'verify-code', component: VerifyCodeComponent},
    { path: 'reset-password', component: ResetpasswordComponent},
    { path: '**', redirectTo: 'home' }


];
