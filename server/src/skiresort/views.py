import logging

from skiresort import models, serializers

from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


logger = logging.getLogger(__name__)


class RoomViewSet(viewsets.ModelViewSet):
    """
    Return information about task.
    """

    # uncomment the line below to enable authentication with jwt token
    # permission_classes = (IsAuthenticated, )
    serializer_class = serializers.RoomSerializer
    queryset = models.Room.objects.all()

    def create(self, request):
        """
        Submit a new room.
        """
        room_serializer = serializers.RoomSerializer(data=request.data)
        room_serializer.is_valid(raise_exception=True)

        logging.info("Creating task")
        # task submit
        room_serializer.save()
        logging.info("Task created")

        return Response({"msg": "Task created"}, status=status.HTTP_201_CREATED)


    def list(self, request):
        """
        List all the rooms.
        """
        qs = models.Room.objects.all()
        room_serializer = serializers.RoomSerializer(qs, many=True)

        return Response(room_serializer.data, status=status.HTTP_200_OK)


class GuestViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.GuestSerializer
    queryset = models.Guest.objects.all()

    def create(self, request):
        """
                Submit a new room.
        """
        guest_serializer = serializers.GuestSerializer(data=request.data)
        guest_serializer.is_valid(raise_exception=True)

        guest_serializer.save()

        return Response({"msg": "Guest created"}, status=status.HTTP_201_CREATED)

    def list(self, request):
        """
        List all the rooms.
        """
        qs = models.Guest.objects.all()
        guest_serializer = serializers.GuestSerializer(qs, many=True)

        return Response(guest_serializer.data, status=status.HTTP_200_OK)


class ReservationViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.ReservationSerializer
    queryset = models.Reservation.objects.all()

    def create(self, request):
        reservation_serializer = serializers.ReservationSerializer(data=request.data)
        reservation_serializer.is_valid(raise_exception=True)

        reservation_serializer.save()


        return Response(data={"msg": "Reservation created"}, status=status.HTTP_201_CREATED)

    def list(self, request):
        """
        List all the rooms.
        """
        qs = models.Reservation.objects.all()
        reservation_serializer = serializers.ReservationSerializer(qs, many=True)

        return Response(reservation_serializer.data, status=status.HTTP_200_OK)


class EmployeeViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.EmployeeSerializer
    queryset = models.Employee.objects.all()

    def create(self, request):
        employee_serializer = serializers.EmployeeSerializer(data=request.data)
        employee_serializer.is_valid(raise_exception=True)

        employee_serializer.save()


        return Response(data={"msg": "Employee created"}, status=status.HTTP_201_CREATED)

    def list(self, request):
        """
        List all the rooms.
        """
        qs = models.Employee.objects.all()
        employee_serializer = serializers.EmployeeSerializer(qs, many=True)

        return Response(employee_serializer.data, status=status.HTTP_200_OK)
