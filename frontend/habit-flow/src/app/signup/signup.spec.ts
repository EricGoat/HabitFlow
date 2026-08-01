// Import Angular testing utilities
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Import the Signup component
import { Signup } from './signup';


// Unit tests for the Signup component
describe('Signup', () => {

  // Component and fixture used during testing
  let component: Signup;
  let fixture: ComponentFixture<Signup>;

  // Configure the testing environment before each test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Signup],
    }).compileComponents();

    fixture = TestBed.createComponent(Signup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  // Verify that the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });

});