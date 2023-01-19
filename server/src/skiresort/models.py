from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator


class User(models.Model):
    name = models.CharField(max_length=64, unique=True, help_text="user full name")
    role = models.CharField(max_length=32, blank=True, null=True, help_text="user role")

    def __str__(self):
        return self.name


class Room(models.Model):
    room_id = models.IntegerField(primary_key=True, unique=True)
    wing = models.CharField(max_length=128)
    description = models.CharField(max_length=128, help_text="Task description")
    beds = models.PositiveIntegerField(help_text="Number of beds in a room")
    price = models.FloatField(validators=[MinValueValidator(0.0)], help_text="Price of the room")


class Guest(models.Model):
    social_security_number = models.CharField(max_length=11, help_text="Polish social security number PESEL", unique=True)
    surname = models.CharField(max_length=128)
    name = models.CharField(max_length=128)
    email = models.EmailField()
    address = models.CharField(max_length=256)

    def get_full_name(self):
        return "{} {}".format(self.name, self.surname)


class Employee(models.Model):
    social_security_number = models.CharField(max_length=11, help_text="Polish social security number PESEL", unique=True)
    surname = models.CharField(max_length=128)
    name = models.CharField(max_length=128)
    job = models.CharField(max_length=128)
    salary = models.FloatField(validators=[MinValueValidator(0.0)])

    def get_full_name(self):
        return "{} {}".format(self.name, self.surname)


class Reservation(models.Model):
    guest = models.ForeignKey(Guest, on_delete=models.CASCADE, related_name="reservations")
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="rooms")
    date_from = models.DateField()
    date_to = models.DateField()
    number_of_people = models.IntegerField()
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="reservations")


class Dish(models.Model):
    name = models.CharField(max_length=128)
    description = models.CharField(max_length=256)
    calories = models.PositiveIntegerField()
    cost = models.FloatField(validators=[MinValueValidator(0.0)])
    price = models.FloatField(validators=[MinValueValidator(0.0)])


class Dessert(models.Model):
    name = models.CharField(max_length=128)
    description = models.CharField(max_length=256)
    calories = models.PositiveIntegerField()
    cost = models.FloatField(validators=[MinValueValidator(0.0)])
    price = models.FloatField(validators=[MinValueValidator(0.0)])


class Meal(models.Model):
    date = models.DateField()
    time_of_day = models.CharField(max_length=128)
    guest = models.ForeignKey(Guest, on_delete=models.CASCADE, related_name="meals")
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE, related_name="meals")
    dessert = models.ForeignKey(Dessert, on_delete=models.CASCADE, related_name="meals")


class Gear(models.Model):
    code = models.CharField(max_length=128, unique=True)
    type = models.CharField(max_length=256)
    name = models.CharField(max_length=128)
    brand = models.CharField(max_length=128)
    size = models.CharField(max_length=128)


class Rental(models.Model):
    date_from = models.DateField()
    date_to = models.DateField()
    price = models.FloatField(validators=[MinValueValidator(0.0)])
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="rentals")
    gear = models.ForeignKey(Gear, on_delete=models.CASCADE, related_name="rentals")
    guest = models.ForeignKey(Guest, on_delete=models.CASCADE, related_name="rentals")


class Localization(models.Model):
    name = models.CharField(max_length=128)
    address = models.CharField(max_length=256)


class Task(models.Model):
    name = models.CharField(max_length=128)
    description = models.CharField(max_length=256)


class Duty(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="duties")
    localization = models.ForeignKey(Localization, on_delete=models.CASCADE, related_name="duties")
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="duties")
