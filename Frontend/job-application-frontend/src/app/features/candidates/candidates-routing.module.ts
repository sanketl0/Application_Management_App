import { Routes } from '@angular/router';
import { CandidateListComponent } from './candidate-list/candidate-list.component';
import { CandidateFormComponent } from './candidate-form/candidate-form.component';

export const CANDIDATE_ROUTES: Routes = [
  {
    path: '',
    component: CandidateListComponent
  },
  {
    path: 'add',
    component: CandidateFormComponent
  },
  {
    path: 'edit/:id',
    component: CandidateFormComponent
  }
];
