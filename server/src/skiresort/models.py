from django.db import models


class User(models.Model):
    name = models.CharField(max_length=64, unique=True, help_text="user full name")
    role = models.CharField(max_length=32, blank=True, null=True, help_text="user role")

    def __str__(self):
        return self.name


class Room(models.Model):
    room_id = models.IntegerField(null=True)
    wing = models.CharField(null=True, max_length=128)
    description = models.CharField(max_length=128, help_text="Task description")
    beds = models.IntegerField(blank=True, null=True, help_text="Number of beds in a room")
    price = models.PositiveIntegerField(blank=True, null=True, help_text="Price of the room")


class Guest(models.Model):
    social_security_number = models.IntegerField(help_text="Polish social security number PESEL")
    surname = models.CharField(max_length=128)
    name = models.CharField(max_length=128)
    email = models.EmailField()
    address = models.CharField(max_length=256)


class Employee(models.Model):
    social_security_number = models.IntegerField(help_text="Polish social security number PESEL")
    surname = models.CharField(max_length=128)
    name = models.CharField(max_length=128)
    job = models.CharField(max_length=128)
    salary = models.IntegerField()


class Reservation(models.Model):
    guest = models.ForeignKey(Guest, on_delete=models.CASCADE, related_name="reservations")
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="rooms")
    date_from = models.CharField(max_length=128)
    date_to = models.CharField(max_length=128)
    number_of_people = models.IntegerField()
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="reservations")
