from django.db import models


class User(models.Model):
    name = models.CharField(max_length=64, unique=True, help_text="user full name")
    role = models.CharField(max_length=32, blank=True, null=True, help_text="user role")

    def __str__(self):
        return self.name


class Room(models.Model):
    description = models.CharField(max_length=128, help_text="Task description")
    beds = models.IntegerField(blank=True, null=True, help_text="Number of beds in a room")
    price = models.PositiveIntegerField(blank=True, null=True, help_text="Price of the room")
