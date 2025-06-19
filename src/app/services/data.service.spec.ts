import { TestBed } from '@angular/core/testing';

import { DataService } from './data.service';
import { TraineeResult } from '../models/trainee.model';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    service = TestBed.inject(DataService);
  });

  describe('constructor', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with mock data', () => {
      const results = service.getAllResults();
      expect(results.length).toBeGreaterThan(0);
      expect(results[0]).toHaveProperty('id');
      expect(results[0]).toHaveProperty('name');
    });
  });

  describe('crud operations', () => {
    it('should add a new trainee result', () => {
      const newResult: TraineeResult = { name: 'Test Student', subject: 'Math', grade: 85 } as unknown as TraineeResult;
      service.addResult(newResult);
      expect(service.getResultById(newResult.id)).toEqual(newResult);
    });

    it('should update an existing result', () => {
      const result = service.getAllResults()[0];
      const updatedResult = service.updateResult(result.id, { name: 'Updated Name' });
      expect(updatedResult.name).toEqual('Updated Name');
    });

    it('should throw an error when updating a non-existent result', () => {
      expect(() => service.updateResult(9999, { name: 'Non-existent' })).toThrow('Result with id 9999 not found');
    });

    it('should delete a result', () => {
      const results = service.getAllResults();
      service.deleteResult(results[0].id);
      expect(results.length).toEqual(0);
    });

    it('should throw an error when deleting a non-existent result', () => {
      expect(() => service.deleteResult(9999)).toThrow('Result with id 9999 not found');
    });
  });

  describe('Data Change Notifications', () => {
    it('should emit dataChanged$ when adding a result', (done) => {
      const newResult: TraineeResult = { id: 999, name: 'New Trainee', subject: 'Math', grade: 85 } as TraineeResult;

      service.dataChanged$.subscribe(() => {
        done();
      });

      service.addResult(newResult);
    });

    it('should emit dataChanged$ when updating a result', (done) => {
      const existingResult = service.getAllResults()[0];

      service.dataChanged$.subscribe(() => {
        done();
      });

      service.updateResult(existingResult.id, { name: 'Updated Name' });
    });

    it('should emit dataChanged$ when deleting a result', (done) => {
      const resultId = service.getAllResults()[0].id;

      service.dataChanged$.subscribe(() => {
        done();
      });

      service.deleteResult(resultId);
    });

    it('should not emit dataChanged$ on read operations', () => {
      let emissionCount = 0;
      service.dataChanged$.subscribe(() => emissionCount++);

      service.getAllResults();
      service.getResultById(1000);

      expect(emissionCount).toBe(0);
    });
  });

  describe('Filters', () => {
    let mockResults: TraineeResult[];

    beforeEach(() => {
      // Mock data for testing
      const mockDefault = { email: '', address: '', city: '', country: '', zip: '' };
      mockResults = [
        { id: 101, name: 'John Doe', grade: 85, date: new Date('2024-01-15'), subject: 'Math', ...mockDefault },
        { id: 102, name: 'Jane Smith', grade: 92, date: new Date('2024-02-20'), subject: 'Science', ...mockDefault },
        { id: 203, name: 'Bob Johnson', grade: 78, date: new Date('2024-03-10'), subject: 'Math', ...mockDefault }
      ];

      // Mock getAllResults to return our test data
      jest.spyOn(service, 'getAllResults').mockReturnValue(mockResults);
    });

    it('should return all results when term is empty', () => {
      const result = service['parseAndFilter']('');
      expect(result).toEqual(mockResults);
    });

    it('should return all results when term is whitespace', () => {
      const result = service['parseAndFilter']('   ');
      expect(result).toEqual(mockResults);
    });

    it('should filter by exact ID', () => {
      const result = service['parseAndFilter']('ID: 203');
      expect(result).toEqual([mockResults[2]]);
    });

    it('should filter by ID', () => {
      const result = service['parseAndFilter']('ID: 10');
      expect(result).toEqual([mockResults[0], mockResults[1]]); // IDs 101, 102
    });

    it('should filter by grade greater than', () => {
      const result = service['parseAndFilter']('Grade > 80');
      expect(result).toEqual([mockResults[0], mockResults[1]]); // grades 85, 92
    });

    it('should filter by grade less than', () => {
      const result = service['parseAndFilter']('Grade < 80');
      expect(result).toEqual([mockResults[2]]); // grade 78
    });

    it('should filter by date greater than', () => {
      const result = service['parseAndFilter']('Date > 2024-02-01');
      expect(result).toEqual([mockResults[1], mockResults[2]]); // Feb 20, Mar 10
    });

    it('should filter by date less than', () => {
      const result = service['parseAndFilter']('Date < 2024-02-01');
      expect(result).toEqual([mockResults[0]]); // Jan 15
    });

    it('should handle multiple filters (AND logic)', () => {
      const result = service['parseAndFilter']('Grade > 80, Date < 2024-03-01');
      expect(result).toEqual([mockResults[0], mockResults[1]]); // grade > 80 AND date < Mar 1
    });

    it('should handle date range', () => {
      const result = service['parseAndFilter']('Date > 2024-01-01, Date < 2024-02-25');
      expect(result).toEqual([mockResults[0], mockResults[1]]);
    });

    it('should handle grade range', () => {
      const result = service['parseAndFilter']('Grade > 75, Grade < 90');
      expect(result).toEqual([mockResults[0], mockResults[2]]); // grades 85, 78
    });
  });

  describe('Helper Functions', () => {
    it('should validate date greater correctly', () => {
      const date = new Date('2024-02-15');
      expect(service['isDateGreater'](date, '2024-01-01')).toBe(true);
      expect(service['isDateGreater'](date, '2024-03-01')).toBe(false);
    });

    it('should validate date less correctly', () => {
      const date = new Date('2024-02-15');
      expect(service['isDateLess'](date, '2024-03-01')).toBe(true);
      expect(service['isDateLess'](date, '2024-01-01')).toBe(false);
    });

    it('should handle invalid dates', () => {
      const date = new Date('2024-02-15');
      expect(service['isDateGreater'](date, 'invalid-date')).toBe(false);
      expect(service['isDateLess'](date, 'invalid-date')).toBe(false);
    });

    it('should validate grade greater correctly', () => {
      expect(service['isGradeGreater'](85, '80')).toBe(true);
      expect(service['isGradeGreater'](75, '80')).toBe(false);
    });

    it('should validate grade less correctly', () => {
      expect(service['isGradeLess'](75, '80')).toBe(true);
      expect(service['isGradeLess'](85, '80')).toBe(false);
    });

    it('should handle invalid grades', () => {
      expect(service['isGradeGreater'](85, 'invalid')).toBe(false);
      expect(service['isGradeLess'](75, 'invalid')).toBe(false);
    });
  });
});
