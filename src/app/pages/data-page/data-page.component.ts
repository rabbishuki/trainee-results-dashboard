import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { DataService } from '../../services/data.service'
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { map, merge, Subject, takeUntil } from 'rxjs';
import { TraineeResult } from '../../models/trainee.model';
import {
  TraineeDetailsDialogComponent
} from '../../components/data/trainee-details-dialog/trainee-details-dialog.component';

@Component({
  selector: 'biks-data-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './data-page.component.html',
  styleUrl: './data-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataPageComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private dialog = inject(MatDialog);
  private destroy$ = new Subject<void>();

  // Form controls
  filterControl = new FormControl('');

  // Signals for state management
  selectedTrainee = signal<TraineeResult | null>(null);
  currentPage = signal(0);
  pageSize = signal(10);

  // Computed signals
  filteredResults = signal<TraineeResult[]>([]);
  paginatedResults = computed(() => {
    const results = this.filteredResults();
    const startIndex = this.currentPage() * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    return results.slice(startIndex, endIndex);
  });

  displayedColumns: string[] = ['id', 'name', 'date', 'grade', 'subject'];

  ngOnInit() {
    this.filteredResults.set(this.dataService.getAllResults());

    merge(this.filterControl.valueChanges, this.dataService.dataChanged$)
      .pipe(takeUntil(this.destroy$))
      .pipe(map(() => this.filterControl.value))
      .subscribe(filterValue => {
        const results = filterValue?.trim()
          ? this.dataService.parseAndFilter(filterValue)
          : this.dataService.getAllResults();

        this.filteredResults.set([...results]);
        this.currentPage.set(0);
        this.selectedTrainee.set(null);
      });

    this.loadPageState();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    // Save state when component is destroyed
    this.savePageState();
  }

  selectTrainee(trainee: TraineeResult) {
    const currentSelected = this.selectedTrainee();
    if (currentSelected?.id === trainee.id) {
      // Deselect if clicking the same row
      this.selectedTrainee.set(null);
    } else {
      this.selectedTrainee.set(trainee);
      this.openTraineeDetails(trainee);
    }
  }

  addTrainee() {
    this.openTraineeDetails(null); // null means creating new trainee
  }

  removeTrainee() {
    const trainee = this.selectedTrainee();
    if (!trainee) return;

    // TODO: Add confirmation dialog in future iteration
    this.dataService.deleteResult(trainee.id);
    this.selectedTrainee.set(null);

    // Adjust pagination if needed
    const totalResults = this.filteredResults().length;
    const maxPage = Math.ceil(totalResults / this.pageSize()) - 1;
    if (this.currentPage() > maxPage && maxPage >= 0) {
      this.currentPage.set(maxPage);
    }
  }

  onPageChange(event: PageEvent) {
    this.currentPage.set(event.pageIndex);
    this.pageSize.set(event.pageSize);

    // Clear selection when changing pages
    this.selectedTrainee.set(null);
  }

  private openTraineeDetails(trainee: TraineeResult | null) {
    const dialogRef = this.dialog.open(TraineeDetailsDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: trainee,
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (trainee) {
          this.dataService.updateResult(result.id, result);
        } else {
          this.dataService.addResult(result);
        }

        this.selectedTrainee.set(result);
      }
    });
  }

  private savePageState() {
    const state = {
      filter: this.filterControl.value,
      currentPage: this.currentPage(),
      pageSize: this.pageSize(),
      selectedTraineeId: this.selectedTrainee()?.id || null
    };

    localStorage.setItem('data-page-state', JSON.stringify(state));
  }

  private loadPageState() {
    const savedState = localStorage.getItem('data-page-state');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);

        if (state.filter) {
          this.filterControl.setValue(state.filter);
        }

        if (typeof state.currentPage === 'number') {
          this.currentPage.set(state.currentPage);
        }

        if (typeof state.pageSize === 'number') {
          this.pageSize.set(state.pageSize);
        }
      } catch (error) {
        console.warn('Failed to load saved page state:', error);
      }
    }
  }
}
