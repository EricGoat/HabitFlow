// Import Angular testing utilities
import { TestBed } from '@angular/core/testing';

// Import the authentication service
import { AuthService } from './auth.service';


// Unit tests for the AuthService
describe('Auth', () => {

  // Service instance used during testing
  let service: AuthService;

  // Configure the testing environment before each test
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  // Verify that the service is created successfully
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});