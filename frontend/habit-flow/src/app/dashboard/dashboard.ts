// Import Angular core modules
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

// Import Angular common directives and forms
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Import the habit service
import { HabitService } from '../services/habit.service';


// Handles the main dashboard and habit management
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  // Controls whether the Add Habit section is visible
  showAddHabit: boolean = false;

  // Stores the user's custom habit information
  customTitle: string = '';
  customDescription: string = '';

  // Stores all active habits for the logged-in user
  habits: any[] = [];

  // Stores notification information
  notificationMessage: string = '';
  notificationType: string = '';

  // Controls the delete confirmation modal
  showDeleteModal: boolean = false;
  habitToDelete: any = null;

  // Predefined habits that users can quickly add
  suggestedHabits = [
    {
      title: 'Sleep Earlier',
      description: 'Go to bed at a consistent time.'
    },
    {
      title: 'Study',
      description: 'Study for at least 30 minutes.'
    },
    {
      title: 'Take a Walk',
      description: 'Walk outside for 15 minutes.'
    },
    {
      title: 'Limit Screen Time',
      description: 'Spend less time on your phone.'
    },
    {
      title: 'Stretch',
      description: 'Stretch for 10 minutes.'
    }
  ];

  constructor(
    private habitService: HabitService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  // Load the user's habits when the dashboard opens
  ngOnInit() {
    this.loadHabits();
  }

  // Display a temporary notification
  showNotification(message: string, type: string) {
    this.notificationMessage = message;
    this.notificationType = type;

    setTimeout(() => {
      this.notificationMessage = '';
      this.notificationType = '';
      this.changeDetectorRef.detectChanges();
    }, 3000);
  }

  // Retrieve all habits from the backend
  loadHabits() {
    this.habitService.getHabits().subscribe({
      next: (response: any) => {
        this.habits = [...response];
        this.changeDetectorRef.detectChanges();
      },
      error: () => {
        this.showNotification('Could not load habits.', 'error');
      }
    });
  }

  // Show or hide the Add Habit section
  toggleAddHabit() {
    this.showAddHabit = !this.showAddHabit;
    this.changeDetectorRef.detectChanges();
  }

  // Add one of the suggested habits
  addSuggestedHabit(habit: any) {
    this.habitService.addHabit({
      title: habit.title,
      description: habit.description
    }).subscribe({
      next: (newHabit: any) => {
        this.habits = [...this.habits, newHabit];
        this.showNotification('Habit added successfully.', 'success');
        this.changeDetectorRef.detectChanges();
      },
      error: () => {
        this.showNotification('That habit already exists.', 'error');
      }
    });
  }

  // Create a custom habit
  addCustomHabit() {

    // Ensure a habit title has been entered
    if (!this.customTitle.trim()) {
      this.showNotification('Please enter a habit title.', 'error');
      return;
    }

    this.habitService.addHabit({
      title: this.customTitle,
      description: this.customDescription
    }).subscribe({
      next: (newHabit: any) => {
        this.habits = [...this.habits, newHabit];
        this.customTitle = '';
        this.customDescription = '';
        this.showNotification('Habit created successfully.', 'success');
        this.changeDetectorRef.detectChanges();
      },
      error: () => {
        this.showNotification('That habit already exists.', 'error');
      }
    });
  }

  // Update the completion status of a habit
  toggleCompleted(habit: any) {

    // Determine the new completion state
    const newCompletedStatus = !habit.completed;

    this.habitService.completeHabit(habit.id, newCompletedStatus).subscribe({
      next: (updatedHabit: any) => {

        // Replace the updated habit in the local list
        this.habits = this.habits.map(currentHabit =>
          currentHabit.id === updatedHabit.id ? updatedHabit : currentHabit
        );

        this.changeDetectorRef.detectChanges();
      },
      error: () => {
        this.showNotification('Could not update habit.', 'error');
      }
    });
  }

  // Open the delete confirmation dialog
  openDeleteModal(habit: any) {
    this.habitToDelete = habit;
    this.showDeleteModal = true;
    this.changeDetectorRef.detectChanges();
  }

  // Close the delete confirmation dialog
  closeDeleteModal() {
    this.habitToDelete = null;
    this.showDeleteModal = false;
    this.changeDetectorRef.detectChanges();
  }

  // Remove the selected habit
  confirmDeleteHabit() {

    // Exit if no habit has been selected
    if (!this.habitToDelete) {
      return;
    }

    this.habitService.deleteHabit(this.habitToDelete.id).subscribe({
      next: () => {

        // Remove the habit from the displayed list
        this.habits = this.habits.filter(
          habit => habit.id !== this.habitToDelete.id
        );

        this.showNotification('Habit removed successfully.', 'success');
        this.closeDeleteModal();
        this.changeDetectorRef.detectChanges();
      },
      error: () => {
        this.showNotification('Could not remove habit.', 'error');
        this.closeDeleteModal();
      }
    });
  }
}