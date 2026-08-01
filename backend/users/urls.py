# Import Django's URL routing function
from django.urls import path

# Import all API views used by this application
from .views import (
    RegisterView,
    LoginView,
    ProfileView,
    HabitListCreateView,
    HabitCompleteView,
    HabitUpdateView,
    HabitDeleteView,
)

# Define all API endpoints for the HabitFlow application
urlpatterns = [

    # -------------------------
    # User Authentication Routes
    # -------------------------

    # Register a new user account
    path(
        'register/',
        RegisterView.as_view(),
        name='register'
    ),

    # Log in and return an authentication token
    path(
        'login/',
        LoginView.as_view(),
        name='login'
    ),

    # Retrieve and update the logged-in user's profile
    path(
        'profile/',
        ProfileView.as_view(),
        name='profile'
    ),

    # -------------------------
    # Habit Management Routes
    # -------------------------

    # Retrieve all habits or create a new habit
    path(
        'habits/',
        HabitListCreateView.as_view(),
        name='habits'
    ),

    # Mark a habit as completed or undo completion
    path(
        'habits/<int:habit_id>/complete/',
        HabitCompleteView.as_view(),
        name='complete-habit'
    ),

    # Update a habit's title and/or description
    path(
        'habits/<int:habit_id>/update/',
        HabitUpdateView.as_view(),
        name='update-habit'
    ),

    # Soft delete a habit
    path(
        'habits/<int:habit_id>/delete/',
        HabitDeleteView.as_view(),
        name='delete-habit'
    ),
]