# HabitFlow

This is a web application designed to help users track and complete their daily habits.

## Contributon

Finished features/stories should be pushed to the develop branch.\
In progress features/stories should be pushed to a feature/name-of-feature branch.\
Develop branch will be merged into master at the end of a 2 week sprint.

## Running App
1. One terminal navigate to backend\
``python manage.py runserver``
2. Another terminal navigate to frontend/habit-flow
``ng serve``

## Clear Local Database
```python manage.py shell```

```
from django.contrib.auth.models import User

User.objects.all().delete()`
```
