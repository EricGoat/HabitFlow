# Import Django's built-in model classes
from django.db import models

# Import Django's built-in User model
from django.contrib.auth.models import User


# Model representing a habit that belongs to a specific user
class Habit(models.Model):

    # User who owns this habit
    # If the user is deleted, all of their habits are deleted as well.
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    # Name of the habit
    title = models.CharField(max_length=100)

    # Optional description providing additional details
    description = models.TextField(blank=True)

    # Indicates whether the habit has been completed for the current day
    completed = models.BooleanField(default=False)

    # Stores the last date the habit was completed
    # Used for daily resets and streak calculations
    last_completed_date = models.DateField(
        null=True,
        blank=True
    )

    # Tracks the user's current consecutive completion streak
    streak = models.PositiveIntegerField(default=0)

    # Soft delete flag
    # False means the habit is hidden instead of permanently deleted
    active = models.BooleanField(default=True)

    # Automatically stores when the habit was created
    created_at = models.DateTimeField(auto_now_add=True)

    # Display the habit title when the object is printed
    def __str__(self):
        return self.title