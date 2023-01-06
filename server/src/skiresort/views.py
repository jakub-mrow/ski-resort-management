import logging

from skiresort import models, serializers

from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView


logger = logging.getLogger(__name__)


class RoomsViewSet(viewsets.ModelViewSet):
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

        logging.info("Creating Room")
        # Room submit
        room_serializer.save()
        logging.info("Room created")

        return Response({"msg": "Room created"}, status=status.HTTP_201_CREATED)


    def list(self, request):
        """
        List all the rooms.
        """
        qs = models.Room.objects.all()
        room_serializer = serializers.RoomSerializer(qs, many=True)

        return Response(room_serializer.data, status=status.HTTP_200_OK)


class GuestsViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.GuestSerializer
    queryset = models.Guest.objects.all()

    def create(self, request):
        """
        Add a new guest
        """
        guest_serializer = serializers.GuestSerializer(data=request.data)
        guest_serializer.is_valid(raise_exception=True)

        guest_serializer.save()

        return Response({"msg": "Guest created"}, status=status.HTTP_201_CREATED)

    def list(self, request):
        """
        List all the guests.
        """
        qs = models.Guest.objects.all()
        guest_serializer = serializers.GuestSerializer(qs, many=True)

        return Response(guest_serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, pk):
        try:
            if models.Guest.objects.filter(pk=pk).exists():
                guest = models.Guest.objects.filter(pk=pk).first()

                guest.delete()

                return Response(data={"msg": "Guest deleted successfully"}, status=status.HTTP_200_OK)
            else:
                return Response(data={"msg": "Guest with pk {} does not exist".format(pk)}, status=status.HTTP_404_NOT_FOUND)

        except Exception as exc:
            return Response(data={"msg": "Internal Server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ReservationsViewSet(viewsets.ModelViewSet):
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

    def destroy(self, request, pk):
        try:
            if models.Reservation.objects.filter(pk=pk).exists():
                reservation = models.Reservation.objects.filter(pk=pk).first()

                reservation.delete()

                return Response(data={"msg": "Reservation deleted successfully"}, status=status.HTTP_200_OK)
            else:
                return Response(data={"msg": "Reservation with id {} does not exist".format(pk)}, status=status.HTTP_404_NOT_FOUND)

        except Exception as exc:
            return Response(data={"msg": "Internal Server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EmployeesViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.EmployeeSerializer
    queryset = models.Employee.objects.all()

    def create(self, request):
        """
        Add a new employee
        """
        employee_serializer = serializers.EmployeeSerializer(data=request.data)
        employee_serializer.is_valid(raise_exception=True)

        employee_serializer.save()


        return Response(data={"msg": "Employee created"}, status=status.HTTP_201_CREATED)

    def list(self, request):
        """
        List all the employees.
        """
        qs = models.Employee.objects.all()
        employee_serializer = serializers.EmployeeSerializer(qs, many=True)

        return Response(employee_serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, pk):
        try:
            if models.Employee.objects.filter(pk=pk).exists():
                employee = models.Employee.objects.filter(pk=pk).first()

                employee.delete()

                return Response(data={"msg": "Employee deleted successfully"}, status=status.HTTP_200_OK)
            else:
                return Response(data={"msg": "Employee with pk {} does not exist".format(pk)}, status=status.HTTP_404_NOT_FOUND)

        except Exception as exc:
            return Response(data={"msg": "Internal Server error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ReservationData(APIView):
    """
    Return employees, guests and rooms to choose from when making reservations
    """
    authentication_classes = []
    permission_classes = []

    def get(self, requset):
        try:
            employees_qs = models.Employee.objects.all()
            employee_serializer = serializers.EmployeeSerializer(employees_qs, many=True)

            guests_qs = models.Guest.objects.all()
            guest_serializer = serializers.GuestSerializer(guests_qs, many=True)

            rooms_qs = models.Room.objects.all()
            room_serializer = serializers.RoomSerializer(rooms_qs, many=True)

            return_data = {
                "employees": employee_serializer.data,
                "guests": guest_serializer.data,
                "rooms": room_serializer.data
            }

            return Response(data=return_data, status=status.HTTP_200_OK)

        except Exception as exc:
            return Response(data={"msg": "Internal server error", "detail": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DessertsViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.DessertSerializer
    queryset = models.Dessert.objects.all()

    def create(self, request):
        """
        Add a new dessert
        """
        dessert_serializer = serializers.DessertSerializer(data=request.data)
        dessert_serializer.is_valid(raise_exception=True)

        dessert_serializer.save()

        return Response({"msg": "Dessert created"}, status=status.HTTP_201_CREATED)

    def list(self, request):
        """
        List all the desserts.
        """
        qs = models.Dessert.objects.all()
        dessert_serializer = serializers.DessertSerializer(qs, many=True)

        return Response(dessert_serializer.data, status=status.HTTP_200_OK)


class DishesViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.DishSerializer
    queryset = models.Dish.objects.all()

    def create(self, request):
        """
        Add a new dish
        """
        dish_serializer = serializers.DishSerializer(data=request.data)
        dish_serializer.is_valid(raise_exception=True)

        dish_serializer.save()

        return Response({"msg": "Dish created"}, status=status.HTTP_201_CREATED)

    def list(self, request):
        """
        List all the dishes.
        """
        qs = models.Dish.objects.all()
        dish_serializer = serializers.DishSerializer(qs, many=True)

        return Response(dish_serializer.data, status=status.HTTP_200_OK)


class MealsViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.MealSerializer
    queryset = models.Meal.objects.all()

    def create(self, request):
        """
        Add a new meal
        """
        meal_serializer = serializers.MealSerializer(data=request.data)
        meal_serializer.is_valid(raise_exception=True)

        meal_serializer.save()

        return Response({"msg": "Meal created"}, status=status.HTTP_201_CREATED)

    def list(self, request):
        """
        List all the meals.
        """
        qs = models.Meal.objects.all()
        meal_serializer = serializers.MealSerializer(qs, many=True)

        return Response(meal_serializer.data, status=status.HTTP_200_OK)


class RentalsViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.RentalSerializer
    queryset = models.Rental.objects.all()

    def create(self, request):
        """
        Add a new rental
        """
        rental_serializer = serializers.RentalSerializer(data=request.data)
        rental_serializer.is_valid(raise_exception=True)

        rental_serializer.save()

        return Response({"msg": "Rental created"}, status=status.HTTP_201_CREATED)

    def list(self, request):
        """
        List all the rentals.
        """
        qs = models.Rental.objects.all()
        rental_serializer = serializers.RentalSerializer(qs, many=True)

        return Response(rental_serializer.data, status=status.HTTP_200_OK)


class GearViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.GearSerializer
    queryset = models.Gear.objects.all()

    def create(self, request):
        """
        Add a new gear
        """
        gear_serializer = serializers.GearSerializer(data=request.data)
        gear_serializer.is_valid(raise_exception=True)

        gear_serializer.save()

        return Response({"msg": "Gear created"}, status=status.HTTP_201_CREATED)

    def list(self, request):
        """
        List all the gear.
        """
        qs = models.Gear.objects.all()
        gear_serializer = serializers.GearSerializer(qs, many=True)

        return Response(gear_serializer.data, status=status.HTTP_200_OK)


class DutiesViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.DutySerializer
    queryset = models.Duty.objects.all()

    def create(self, request):
        """
        Add a new duty
        """
        duty_serializer = serializers.DutySerializer(data=request.data)
        duty_serializer.is_valid(raise_exception=True)

        duty_serializer.save()

        return Response({"msg": "Duty created"}, status=status.HTTP_201_CREATED)

    def list(self, request):
        """
        List all the duties.
        """
        qs = models.Duty.objects.all()
        duty_serializer = serializers.DutySerializer(qs, many=True)

        return Response(duty_serializer.data, status=status.HTTP_200_OK)


class TasksViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.TaskSerializer
    queryset = models.Task.objects.all()

    def create(self, request):
        """
        Add a new task
        """
        task_serializer = serializers.TaskSerializer(data=request.data)
        task_serializer.is_valid(raise_exception=True)

        task_serializer.save()

        return Response({"msg": "Task created"}, status=status.HTTP_201_CREATED)

    def list(self, request):
        """
        List all the tasks.
        """
        qs = models.Task.objects.all()
        task_serializer = serializers.TaskSerializer(qs, many=True)

        return Response(task_serializer.data, status=status.HTTP_200_OK)


class LocalizationsViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.LocalizationSerializer
    queryset = models.Localization.objects.all()

    def create(self, request):
        """
        Add a new localization
        """
        localization_serializer = serializers.LocalizationSerializer(data=request.data)
        localization_serializer.is_valid(raise_exception=True)

        localization_serializer.save()

        return Response({"msg": "Localization created"}, status=status.HTTP_201_CREATED)

    def list(self, request):
        """
        List all the localizations.
        """
        qs = models.Localization.objects.all()
        localization_serializer = serializers.LocalizationSerializer(qs, many=True)

        return Response(localization_serializer.data, status=status.HTTP_200_OK)
