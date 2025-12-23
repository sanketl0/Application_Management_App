import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';

import { CandidateService } from '../../../core/services/candidate.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { LoaderService } from '../../../core/services/loader.service';
import { Candidate, CandidateStatus } from '../../../core/models/candidate.model';
import { CandidateFormComponent } from '../candidate-form/candidate-form.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-candidate-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatChipsModule,
    MatMenuModule,
    MatToolbarModule,
    FormsModule
  ],
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.scss']
})
export class CandidateListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'phone', 'position_applied', 'status', 'actions'];
  dataSource = new MatTableDataSource<Candidate>([]);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  // Pagination
  totalCount = 0;
  pageSize = 10;
  currentPage = 1;
  
  // Filters
  searchTerm = '';
  selectedStatus = 'All';
  statusOptions: string[] = ['All', 'Applied', 'Interview', 'Selected', 'Rejected'];
   statuses: CandidateStatus[] = [
    'Applied',
    'Interview',
    'Selected',
    'Rejected'
  ];
  
  // Search debounce
  private searchSubject = new Subject<string>();
  
  // User info
  currentUser: any = null;

  constructor(
    private candidateService: CandidateService,
    private authService: AuthService,
    private toastService: ToastService,
    private loaderService: LoaderService,
    private dialog: MatDialog,
    private router: Router
  ) {
    // Setup search debounce
    this.searchSubject.pipe(
      debounceTime(500)
    ).subscribe(searchTerm => {
      this.searchTerm = searchTerm;
      this.currentPage = 1;
      this.loadCandidates();
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadCandidates();
  }

  /**
   * Load candidates from API
   */
  loadCandidates(): void {
    this.loaderService.show();
    
    this.candidateService.getCandidates(this.currentPage, this.searchTerm, this.selectedStatus)
      .subscribe({
        next: (response) => {
          this.dataSource.data = response.results;
          this.totalCount = response.count;
          this.loaderService.hide();
        },
        error: (error) => {
          this.loaderService.hide();
          this.toastService.error('Failed to load candidates');
        }
      });
  }

  /**
   * Handle search input
   */
  onSearch(event: any): void {
    this.searchSubject.next(event.target.value);
  }

  /**
   * Handle status filter change
   */
  onStatusFilterChange(): void {
    this.currentPage = 1;
    this.loadCandidates();
  }

  /**
   * Handle pagination change
   */
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadCandidates();
  }

  /**
   * Open add candidate dialog
   */
  openAddDialog(): void {
    const dialogRef = this.dialog.open(CandidateFormComponent, {
      width: '600px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCandidates();
      }
    });
  }

  /**
   * Open edit candidate dialog
   */
  openEditDialog(candidate: Candidate): void {
    const dialogRef = this.dialog.open(CandidateFormComponent, {
      width: '600px',
      data: { mode: 'edit', candidate: { ...candidate } }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCandidates();
      }
    });
  }

  /**
   * Update candidate status
   */
   updateStatus(candidate: Candidate, newStatus: CandidateStatus): void {
    this.loaderService.show();

    this.candidateService.updateCandidateStatus(candidate.id!, newStatus)
      .subscribe({
        next: (response) => {
          this.loaderService.hide();
          this.toastService.success(
            response.message || 'Status updated successfully'
          );
          this.loadCandidates();
        },
        error: () => {
          this.loaderService.hide();
        }
      });
  }


  /**
   * Delete candidate with confirmation
   */
  deleteCandidate(candidate: Candidate): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete ${candidate.name}? This action cannot be undone.`
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.loaderService.show();
        
        this.candidateService.deleteCandidate(candidate.id!)
          .subscribe({
            next: (response) => {
              this.loaderService.hide();
              this.toastService.success(response.message || 'Candidate deleted successfully');
              this.loadCandidates();
            },
            error: (error) => {
              this.loaderService.hide();
            }
          });
      }
    });
  }

  /**
   * Get status color for chip
   */
  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'Applied': 'primary',
      'Interview': 'accent',
      'Selected': 'success',
      'Rejected': 'warn'
    };
    return colors[status] || 'default';
  }

  /**
   * Logout user
   */
  logout(): void {
    this.authService.logout();
  }
}