from rest_framework import serializers

from skiresort import models


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = ("name", "role")


class RoomSerializer(serializers.ModelSerializer):
    room_id = serializers.IntegerField()
    wing = serializers.CharField(required=False)
    description = serializers.CharField(required=False, help_text="description")
    beds = serializers.IntegerField(required=False)
    price = serializers.IntegerField(required=False)

    class Meta:
        model = models.Room
        fields = "__all__"


class EmployeeSerializer(serializers.ModelSerializer):
    social_security_number = serializers.IntegerField(help_text="Polish social security number PESEL")
    surname = serializers.CharField(required=False, max_length=128)
    name = serializers.CharField(required=False, max_length=128)
    job = serializers.CharField(required=False, max_length=128)
    salary = serializers.IntegerField(required=False)

    class Meta:
        model = models.Employee
        fields = "__all__"


class GuestSerializer(serializers.ModelSerializer):
    social_security_number = serializers.CharField(required=False)
    surname = serializers.CharField(required=False)
    name = serializers.CharField(required=False)
    email = serializers.EmailField(required=False)
    address = serializers.CharField(required=False)
    #reservations = ReservationSerializer(many=True, required=False)

    class Meta:
        model = models.Guest
        fields = "__all__"


class ReservationSerializer(serializers.ModelSerializer):
    #room = RoomSerializer()
    date_from = serializers.CharField(required=False, max_length=128)
    date_to = serializers.CharField(required=False, max_length=128)
    number_of_people = serializers.IntegerField(required=False)
    #employee = EmployeeSerializer()
    #guest = GuestSerializer()

    class Meta:
        model = models.Reservation
        fields = "__all__"

    def create(self, validated_data):
        reservation = models.Reservation.objects.create(**validated_data)

        return reservation



