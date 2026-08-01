// Import Angular testing utilities
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Import the Login component
import { Login } from './login';


// Unit tests for the Login component
describe('Login', () => {

  // Component and fixture used during testing
  let component: Login;
  let fixture: ComponentFixture<Login>;

  // Configure the testing environment before each test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  // Verify that the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });

});