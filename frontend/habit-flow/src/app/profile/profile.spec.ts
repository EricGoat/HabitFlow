// Import Angular testing utilities
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Import the Profile component
import { ProfileComponent } from './profile';

// Test suite for the Profile component
describe('ProfileComponent', () => {

  // Component instance and test fixture
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  // Configure the testing module before each test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent]
    })
    .compileComponents();

    // Create the component and trigger change detection
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Verify that the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });

});