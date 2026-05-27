from django.contrib.auth.models import User
from django.test import TestCase

class UserModelTest(TestCase):

    def test_create_user(self):

        User.objects.create_user(
            username='Test User',
            email='testuser@email.com',
            password='password123'
        )

        saved_user = User.objects.get(username='Test User')
        self.assertEqual(saved_user.email, 'testuser@email.com')
        self.assertTrue(saved_user.check_password("password123"))
