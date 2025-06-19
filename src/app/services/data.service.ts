import { Injectable } from '@angular/core';
import { TraineeResult } from '../models/trainee.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private results: TraineeResult[] = [];
  private dataChangedSubject = new Subject<void>();
  readonly dataChanged$: Observable<void> = this.dataChangedSubject.asObservable();

  constructor() {
    this.initializeMockData();
  }

  // Basic CRUD - synchronous for simplicity
  getAllResults(): TraineeResult[] {
    return this.results;
  }

  getResultById(id: number): TraineeResult | undefined {
    return this.results.find(result => result.id === id);
  }

  addResult(result: TraineeResult): void {
    this.results.push(result);
    this.dataChangedSubject.next();
  }

  // Returns the result since it was changed, if it doesn't exist it throws.
  updateResult(id: number, result: Partial<TraineeResult>): TraineeResult {
    const index = this.results.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error(`Result with id ${id} not found`);
    }
    const updatedResult = { ...this.results[index], ...result };
    this.results[index] = updatedResult;
    this.dataChangedSubject.next();
    return updatedResult;
  }

  deleteResult(id: number): void {
    const index = this.results.findIndex(result => result.id === id);
    if (index !== -1) {
      this.results.splice(index, 1);
      this.dataChangedSubject.next();
    } else {
      throw new Error(`Result with id ${ id } not found`);
    }
  }

  /* Supports the following filters:
  * ID: 123
  * Date > 2024-01-01, Date < 2024-12-31 (date ranges)
  * Grade > 70, Grade < 90 (grade ranges)
  * ID: 123, Grade > 80, Date < 2024-06-01 (combined filters)
  */
  parseAndFilter(term: string): TraineeResult[] {
    // return all results if the term is empty
    if (!term.trim()) return this.getAllResults();

    const filters = term.split(',').map(f => f.trim()).filter(Boolean);

    // Parse all filters once for efficiency if results is very big
    const idFilter = filters.find(f => f.startsWith('ID:'))?.substring(3).trim();
    const dateGreater = filters.find(f => f.startsWith('Date >'))?.substring(6).trim();
    const dateLess = filters.find(f => f.startsWith('Date <'))?.substring(6).trim();
    const gradeGreater = filters.find(f => f.startsWith('Grade >'))?.substring(7).trim();
    const gradeLess = filters.find(f => f.startsWith('Grade <'))?.substring(7).trim();

    return this.getAllResults().filter(result => {
      const conditions = [
        !idFilter || result.id.toString().includes(idFilter),
        !dateGreater || this.isDateGreater(result.date, dateGreater),
        !dateLess || this.isDateLess(result.date, dateLess),
        !gradeGreater || this.isGradeGreater(result.grade, gradeGreater),
        !gradeLess || this.isGradeLess(result.grade, gradeLess)
      ];

      return conditions.every(condition => condition);
    });
  }

  private isDateGreater(date: Date, filter: string): boolean {
    const filterDate = new Date(filter);
    return !isNaN(filterDate.getTime()) && date > filterDate;
  }

  private isDateLess(date: Date, filter: string): boolean {
    const filterDate = new Date(filter);
    return !isNaN(filterDate.getTime()) && date < filterDate;
  }

  private isGradeGreater(grade: number, filter: string): boolean {
    const filterGrade = parseFloat(filter);
    return !isNaN(filterGrade) && grade > filterGrade;
  }

  private isGradeLess(grade: number, filter: string): boolean {
    const filterGrade = parseFloat(filter);
    return !isNaN(filterGrade) && grade < filterGrade;
  }

  private initializeMockData() {
    this.results = [
      {
        id: 1000,
        name: 'John Doe',
        date: new Date('2023-01-15'),
        grade: 85,
        subject: 'Mathematics',
        email: 'test@bi.com',
        address: '123 Main St',
        city: 'Anytown',
        country: 'USA',
        zip: '12345'
      }
    ];
  }
}
