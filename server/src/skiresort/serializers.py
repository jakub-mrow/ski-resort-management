from rest_framework import serializers
from skiresort import models


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = ("name", "role")


class RoomSerializer(serializers.ModelSerializer):
    room_id = serializers.IntegerField()
    wing = serializers.CharField(max_length=128)
    description = serializers.CharField(max_length=128, help_text="description")
    beds = serializers.IntegerField()
    price = serializers.FloatField()

    class Meta:
        model = models.Room
        fields = "__all__"


class GuestSerializer(serializers.ModelSerializer):
    social_security_number = serializers.CharField(max_length=11)
    surname = serializers.CharField(max_length=128)
    name = serializers.CharField(max_length=128)
    email = serializers.EmailField()
    address = serializers.CharField(required=False, max_length=256)

    class Meta:
        model = models.Guest
        fields = "__all__"

    # def validate_social_security_number(self, soc_num):
    #     if models.Guest.objects.filter(social_security_number=soc_num).exists():
    #         raise serializers.ValidationError("Guest with this social security number already exists")
    #     return soc_num



class EmployeeSerializer(serializers.ModelSerializer):
    social_security_number = serializers.CharField(max_length=11, help_text="Polish social security number PESEL")
    surname = serializers.CharField(max_length=128)
    name = serializers.CharField(max_length=128)
    job = serializers.CharField(max_length=128)
    salary = serializers.FloatField()

    class Meta:
        model = models.Employee
        fields = "__all__"


class ReservationSerializer(serializers.ModelSerializer):
    #room = RoomSerializer()
    date_from = serializers.DateField()
    date_to = serializers.DateField()
    number_of_people = serializers.IntegerField()
    #employee = EmployeeSerializer()
    #guest = GuestSerializer()

    class Meta:
        model = models.Reservation
        fields = "__all__"

    def create(self, validated_data):
        reservation = models.Reservation.objects.create(**validated_data)

        return reservation

    def validate(self, data):
        if data["date_from"] >= data["date_to"]:
            raise serializers.ValidationError("'Date from' should be set up to happen before 'Date to'")
        return data


class ReservationRetrieveSerializer(serializers.ModelSerializer):
    room = RoomSerializer()
    date_from = serializers.DateField()
    date_to = serializers.DateField()
    number_of_people = serializers.IntegerField()
    employee = EmployeeSerializer()
    guest = GuestSerializer()

    class Meta:
        model = models.Reservation
        fields = "__all__"

    def create(self, validated_data):
        reservation = models.Reservation.objects.create(**validated_data)

        return reservation

    def validate(self, data):
        if data["date_from"] >= data["date_to"]:
            raise serializers.ValidationError("'Date from' should be set up to happen before 'Date to'")
        return data


class ReservationListSerializer(serializers.ModelSerializer):
    date_from = serializers.DateField()
    date_to = serializers.DateField()
    number_of_people = serializers.IntegerField()
    employee = serializers.CharField(source='employee.get_full_name')
    guest = serializers.CharField(source='guest.get_full_name')
    room = serializers.CharField(source='room.room_id')

    class Meta:
        model = models.Reservation
        fields = "__all__"


class RoomUnavailabiltySerializer(serializers.ModelSerializer):
    date_from = serializers.DateField()
    date_to = serializers.DateField()

    class Meta:
        model = models.Reservation
        fields = ('date_from', 'date_to')


class DishSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=128)
    description = serializers.CharField(max_length=256)
    calories = serializers.IntegerField()
    cost = serializers.FloatField()
    price = serializers.FloatField()

    class Meta:
        model = models.Dish
        fields = "__all__"


class DessertSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=128)
    description = serializers.CharField(max_length=256)
    calories = serializers.IntegerField()
    cost = serializers.FloatField()
    price = serializers.FloatField()

    class Meta:
        model = models.Dessert
        fields = "__all__"


class MealSerializer(serializers.ModelSerializer):
    date = serializers.DateField()
    time_of_day = serializers.CharField(max_length=128)
    # guest = GuestSerializer()
    # dish = DishSerializer()
    # dessert = DessertSerializer()

    class Meta:
        model = models.Meal
        fields = "__all__"
    
    def create(self, validated_data):
        meal = models.Meal.objects.create(**validated_data)

        return meal


class MealListSerializer(serializers.ModelSerializer):
    date = serializers.DateField()
    time_of_day = serializers.CharField()
    guest = serializers.CharField(source='guest.get_full_name')
    dish = serializers.CharField(source='dish.name')
    dessert = serializers.CharField(source='dessert.name')   

    class Meta:
        model = models.Meal
        fields = "__all__"


class GearSerializer(serializers.ModelSerializer):
    code = serializers.CharField(max_length=128)
    type = serializers.CharField(max_length=128)
    name = serializers.CharField(max_length=128)
    brand = serializers.CharField(max_length=128)
    size = serializers.CharField(max_length=128)

    class Meta:
        model = models.Gear
        fields = "__all__"


class GearUnavailabiltySerializer(serializers.ModelSerializer):
    date_from = serializers.DateField()
    date_to = serializers.DateField()

    class Meta:
        model = models.Rental
        fields = ('date_from', 'date_to')


class RentalSerializer(serializers.ModelSerializer):
    date_from = serializers.DateField()
    date_to = serializers.DateField()
    price = serializers.FloatField()
    # employee = EmployeeSerializer()
    # gear = GearSerializer()
    # guest = GuestSerializer()    

    class Meta:
        model = models.Rental
        fields = "__all__"

    def create(self, validated_data):
        rental = models.Rental.objects.create(**validated_data)

        return rental

    def validate(self, data):
        if data["date_from"] > data["date_to"]:
            raise serializers.ValidationError("'Date from' should be set up to happen before 'Date to'")
        return data

class RentalRetrieveSerializer(serializers.ModelSerializer):
    date_from = serializers.DateField()
    date_to = serializers.DateField()
    price = serializers.FloatField()
    employee = EmployeeSerializer()
    gear = GearSerializer()
    guest = GuestSerializer()    

    class Meta:
        model = models.Rental
        fields = "__all__"

    def create(self, validated_data):
        rental = models.Rental.objects.create(**validated_data)

        return rental

    def validate(self, data):
        if data["date_from"] > data["date_to"]:
            raise serializers.ValidationError("'Date from' should be set up to happen before 'Date to'")
        return data


class RentalListSerializer(serializers.ModelSerializer):
    date_from = serializers.DateField()
    date_to = serializers.DateField()
    price = serializers.FloatField()
    employee = serializers.CharField(source='employee.get_full_name')
    guest = serializers.CharField(source='guest.get_full_name')
    gear = serializers.CharField(source='gear.name')   

    class Meta:
        model = models.Rental
        fields = "__all__"


class LocalizationSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=128)
    address = serializers.CharField(max_length=256)

    class Meta:
        model = models.Localization
        fields = "__all__"


class TaskSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length=128)
    description = serializers.CharField(max_length=256)

    class Meta:
        model = models.Task
        fields = "__all__"


class DutySerializer(serializers.ModelSerializer):
    # employee = EmployeeSerializer()
    # localization = LocalizationSerializer()
    # task = TaskSerializer()    

    class Meta:
        model = models.Duty
        fields = "__all__"

    def create(self, validated_data):
        duty = models.Duty.objects.create(**validated_data)

        return duty

class DutyListSerializer(serializers.ModelSerializer):
    employee = serializers.CharField(source='employee.get_full_name')
    localization = serializers.CharField(source='localization.name')
    task = serializers.CharField(source='task.name')   

    class Meta:
        model = models.Duty
        fields = "__all__"
