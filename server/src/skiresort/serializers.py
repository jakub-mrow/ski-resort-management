from rest_framework import serializers

from skiresort import models


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = ("name", "role")


class RoomSerializer(serializers.ModelSerializer):
    description = serializers.CharField(help_text="description")
    beds = serializers.IntegerField()
    price = serializers.IntegerField()

    class Meta:
        model = models.Room
        fields = '__all__'
