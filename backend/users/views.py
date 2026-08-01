# Import timedelta for streak calculations
from datetime import timedelta

# Django authentication and date utilities
from django.contrib.auth import authenticate
from django.utils import timezone

# Django REST Framework imports
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

# Import project models and serializers
from .models import Habit
from .serializers import RegisterSerializer, ProfileSerializer, HabitSerializer


# Handles user registration
class RegisterView(APIView):

    # Create a new user account
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'User registered successfully'},
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Handles user login and token generation
class LoginView(APIView):

    # Authenticate the user and return an authentication token
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user:
            # Create a token if one does not already exist
            token, created = Token.objects.get_or_create(user=user)

            return Response(
                {'token': token.key},
                status=status.HTTP_200_OK
            )

        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )


# Handles retrieving and updating the logged-in user's profile
class ProfileView(APIView):

    # Require authentication
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    # Return the logged-in user's profile information
    def get(self, request):
        serializer = ProfileSerializer(request.user)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    # Update the logged-in user's profile information
    def put(self, request):
        serializer = ProfileSerializer(
            request.user,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                {
                    'message': 'Profile updated successfully',
                    'user': serializer.data
                },
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


# Handles retrieving and creating habits
class HabitListCreateView(APIView):

    # Require the user to be authenticated
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    # Return all active habits for the logged-in user
    def get(self, request):
        today = timezone.localdate()

        habits = Habit.objects.filter(
            user=request.user,
            active=True
        )

        # Reset completed habits at the start of a new day
        for habit in habits:
            if habit.last_completed_date != today and habit.completed:
                habit.completed = False
                habit.save()

        serializer = HabitSerializer(habits, many=True)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    # Create a new habit for the logged-in user
    def post(self, request):

        # Remove leading and trailing spaces from the title
        title = request.data.get('title', '').strip()

        if not title:
            return Response(
                {'error': 'Habit title is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Prevent duplicate active habits (case-insensitive)
        duplicate = Habit.objects.filter(
            user=request.user,
            title__iexact=title,
            active=True
        ).exists()

        if duplicate:
            return Response(
                {'error': 'You already have this habit'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = HabitSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


# Handles completing and undoing habits
class HabitCompleteView(APIView):

    # Require authentication
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    # Update the completion status of a habit
    def post(self, request, habit_id):

        today = timezone.localdate()
        yesterday = today - timedelta(days=1)

        # Desired completion state sent from Angular
        completed = request.data.get('completed')

        if completed is None:
            return Response(
                {'error': 'Completed status is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Ensure the habit belongs to the logged-in user
        try:
            habit = Habit.objects.get(
                id=habit_id,
                user=request.user,
                active=True
            )

        except Habit.DoesNotExist:
            return Response(
                {'error': 'Habit not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Mark the habit as completed
        if completed is True:

            # Prevent completing an already completed habit
            if habit.completed:
                serializer = HabitSerializer(habit)

                return Response(
                    serializer.data,
                    status=status.HTTP_200_OK
                )

            # Continue the streak if yesterday was completed
            if habit.last_completed_date == today:
                habit.streak += 1

            elif habit.last_completed_date == yesterday:
                habit.streak += 1
                habit.last_completed_date = today

            # Otherwise start a new streak
            else:
                habit.streak = 1
                habit.last_completed_date = today

            habit.completed = True
            habit.save()

            serializer = HabitSerializer(habit)

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )

        # Undo a completed habit
        if completed is False:

            # Ignore the request if already incomplete
            if not habit.completed:
                serializer = HabitSerializer(habit)

                return Response(
                    serializer.data,
                    status=status.HTTP_200_OK
                )

            habit.completed = False

            # Reduce the streak if today's completion is undone
            if habit.last_completed_date == today and habit.streak > 0:
                habit.streak -= 1

            habit.save()

            serializer = HabitSerializer(habit)

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )

        return Response(
            {'error': 'Completed must be true or false'},
            status=status.HTTP_400_BAD_REQUEST
        )


# Handles updating a habit's title and description
class HabitUpdateView(APIView):

    # Require authentication
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    # Update the title and/or description of a habit
    def put(self, request, habit_id):

        try:
            habit = Habit.objects.get(
                id=habit_id,
                user=request.user,
                active=True
            )

        except Habit.DoesNotExist:
            return Response(
                {'error': 'Habit not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Remove leading and trailing spaces from the title
        title = request.data.get('title', '').strip()

        if not title:
            return Response(
                {'error': 'Habit title is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Prevent renaming to another active habit's title (case-insensitive)
        duplicate = Habit.objects.filter(
            user=request.user,
            title__iexact=title,
            active=True
        ).exclude(id=habit_id).exists()

        if duplicate:
            return Response(
                {'error': 'You already have this habit'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = HabitSerializer(habit, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


# Handles soft deletion of habits
class HabitDeleteView(APIView):

    # Require authentication
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    # Mark a habit as inactive instead of permanently deleting it
    def delete(self, request, habit_id):

        try:
            habit = Habit.objects.get(
                id=habit_id,
                user=request.user,
                active=True
            )

        except Habit.DoesNotExist:
            return Response(
                {'error': 'Habit not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Soft delete the habit
        habit.active = False
        habit.save()

        return Response(
            {'message': 'Habit removed successfully'},
            status=status.HTTP_200_OK
        )