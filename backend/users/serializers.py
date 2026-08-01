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

    # Validate the password
    def validate_password(self, value):

        # Password must be at least 5 characters long
        if len(value) < 5:
            raise serializers.ValidationError(
                'Password must be at least 5 characters long.'
            )

        # Password must contain at least one uppercase letter
        if not any(character.isupper() for character in value):
            raise serializers.ValidationError(
                'Password must contain at least one uppercase letter.'
            )

        # Password must contain at least one number
        if not any(character.isdigit() for character in value):
            raise serializers.ValidationError(
                'Password must contain at least one number.'
            )

        # Password cannot contain spaces
        if ' ' in value:
            raise serializers.ValidationError(
                'Password cannot contain spaces.'
            )

        return value

    # Create a new user using Django's built-in create_user method
    # This automatically hashes the user's password before saving it.
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )

        return user


# Serializer used to retrieve and update the logged-in user's profile
class ProfileSerializer(serializers.ModelSerializer):

    # Optional password fields used only when changing the password
    current_password = serializers.CharField(write_only=True, required=False)
    new_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        # Model associated with this serializer
        model = User

        # Fields included in profile requests and responses
        fields = [
            'id',
            'username',
            'email',
            'current_password',
            'new_password'
        ]

        # The user ID cannot be changed
        read_only_fields = [
            'id'
        ]

    # Validate profile update information
    def validate(self, data):
        user = self.instance

        # Check if the username is already taken by another user
        username = data.get('username')

        if username and User.objects.exclude(id=user.id).filter(username__iexact=username).exists():
            raise serializers.ValidationError({
                'username': 'This username is already taken.'
            })

        # Check if the email is already taken by another user
        email = data.get('email')

        if email and User.objects.exclude(id=user.id).filter(email__iexact=email).exists():
            raise serializers.ValidationError({
                'email': 'This email is already taken.'
            })

        # Get password fields
        current_password = data.get('current_password')
        new_password = data.get('new_password')

        # Require the current password if a new password is provided
        if new_password and not current_password:
            raise serializers.ValidationError({
                'current_password': 'Current password is required to change your password.'
            })

        # Check that the current password is correct
        if new_password and not user.check_password(current_password):
            raise serializers.ValidationError({
                'current_password': 'Current password is incorrect.'
            })

        # Validate the new password length
        if new_password and len(new_password) < 5:
            raise serializers.ValidationError({
                'new_password': 'Password must be at least 5 characters long.'
            })

        # Validate that the new password contains an uppercase letter
        if new_password and not any(character.isupper() for character in new_password):
            raise serializers.ValidationError({
                'new_password': 'Password must contain at least one uppercase letter.'
            })

        # Validate that the new password contains a number
        if new_password and not any(character.isdigit() for character in new_password):
            raise serializers.ValidationError({
                'new_password': 'Password must contain at least one number.'
            })

        # Validate that the new password does not contain spaces
        if new_password and ' ' in new_password:
            raise serializers.ValidationError({
                'new_password': 'Password cannot contain spaces.'
            })

        return data

    # Update the logged-in user's profile
    def update(self, instance, validated_data):

        # Remove the current password because it is only used for validation
        validated_data.pop('current_password', None)

        # Remove the new password so it can be handled separately
        new_password = validated_data.pop('new_password', None)

        # Update username and email
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)

        # Update password if a new one was provided
        if new_password:
            instance.set_password(new_password)

        instance.save()

        return instance


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