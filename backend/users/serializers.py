# Import Django REST Framework serializer classes
from rest_framework import serializers

# Import Django's built-in User model
from django.contrib.auth.models import User

# Import the Habit model
from .models import Habit


# Serializer used to register a new user account
class RegisterSerializer(serializers.ModelSerializer):

    # Prevent the password from being returned in API responses
    password = serializers.CharField(write_only=True)

    class Meta:
        # Model associated with this serializer
        model = User

        # Fields accepted during registration
        fields = [
            'username',
            'email',
            'password'
        ]

    # Create a new user using Django's built-in create_user method
    # This automatically hashes the user's password before saving it.
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )

        return user


# Serializer used for creating and retrieving habits
class HabitSerializer(serializers.ModelSerializer):

    class Meta:
        # Model associated with this serializer
        model = Habit

        # Fields included in API requests and responses
        fields = [
            'id',
            'title',
            'description',
            'completed',
            'last_completed_date',
            'streak',
            'active',
            'created_at'
        ]

        # Fields that cannot be modified directly by the client
        # These values are managed automatically by the backend.
        read_only_fields = [
            'id',
            'completed',
            'last_completed_date',
            'streak',
            'active',
            'created_at'
        ]