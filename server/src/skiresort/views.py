import logging

from skiresort import models, serializers

from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.decorators import action

from django.db import connection

from .utils import generate_range_of_dates, date_range_overlap


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

        if models.Room.objects.filter(room_id=request.data.get("room_id")):
            return Response(data={"msg": "Room with number {} already exists".format(request.data.get("room_id"))}, status=status.HTTP_406_NOT_ACCEPTABLE)
            
        room_serializer = serializers.RoomSerializer(data=request.data)
        room_serializer.is_valid(raise_exception=True)

        logging.info("Creating Room")
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


    @action(detail=False, methods=["get"])
    def unavailabilty(self, request):   
        room_id = request.GET["room_id"]
        reservations = models.Reservation.objects.filter(room_id=room_id)

        unavailability_serializer = serializers.RoomUnavailabiltySerializer(reservations, many=True)

        unavailable_dates = []
        for reservation in unavailability_serializer.data:
            date_from = reservation.get("date_from")
            date_to = reservation.get("date_to")
            date_range = generate_range_of_dates(date_from, date_to)
            unavailable_dates.extend(date_range)

        logging.info("Unavailable dates: {}".format(unavailable_dates))

        return Response(data=unavailable_dates)


class GuestsViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.GuestSerializer
    queryset = models.Guest.objects.all()

    def create(self, request):
        """
        Add a new guest
        """
        guest_serializer = serializers.GuestSerializer(data=request.data)
        guest_serializer.is_valid(raise_exception=True)

        if models.Guest.objects.filter(social_security_number=request.data["social_security_number"]).exists():
            return Response({"msg": "Guest with this social security number already exists"}, status=status.HTTP_406_NOT_ACCEPTABLE)

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

    def update(self, request, pk):
        guest_serializer = serializers.GuestSerializer(data=request.data)
        guest_serializer.is_valid(raise_exception=True)

        guest = models.Guest.objects.filter(id=pk).first()

        if guest.social_security_number == request.data["social_security_number"]:
            guest.name = request.data["name"]
            guest.surname = request.data["surname"]
            guest.address = request.data["address"]
            guest.email = request.data["email"]

            guest.save()

            return Response({"msg": "Guest edited successfully"}, status=status.HTTP_200_OK) 

        if models.Guest.objects.filter(social_security_number=request.data["social_security_number"]).exists():
            return Response({"msg": "Guest with this social security number already exists"}, status=status.HTTP_406_NOT_ACCEPTABLE)

        guest.social_security_number = request.data["social_security_number"]
        guest.name = request.data["name"]
        guest.surname = request.data["surname"]
        guest.address = request.data["address"]
        guest.email = request.data["email"]

        guest.save()

        return Response({"msg": "Guest edited successfully"}, status=status.HTTP_200_OK)


    @action(detail=True, methods=["get"])
    def info(self, request, pk):
        reservations_qs = models.Reservation.objects.filter(guest=pk)
        reservations_serializer = serializers.ReservationListSerializer(reservations_qs, many=True)

        meals_qs = models.Meal.objects.filter(guest=pk)
        meals_serializer = serializers.MealListSerializer(meals_qs, many=True)

        rentals_qs = models.Rental.objects.filter(guest=pk)
        rentals_serializer = serializers.RentalListSerializer(rentals_qs, many=True)

        response_data = {
            "reservations": reservations_serializer.data,
            "meals": meals_serializer.data,
            "rentals": rentals_serializer.data
        }

        return Response(data=response_data, status=status.HTTP_200_OK)
        

class ReservationsViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.ReservationSerializer
    queryset = models.Reservation.objects.all()

    def get_serializer_class(self):
        if self.action == "list":
            return serializers.ReservationListSerializer
        return serializers.ReservationSerializer

    def create(self, request):
        reservation_serializer = serializers.ReservationSerializer(data=request.data)
        reservation_serializer.is_valid(raise_exception=True)

        new_date_from = request.data["date_from"]
        new_date_to = request.data["date_to"]
        new_date_range = generate_range_of_dates(new_date_from, new_date_to)

        room_id = request.data["room"]
        reservations = models.Reservation.objects.filter(room_id=room_id)

        unavailability_serializer = serializers.RoomUnavailabiltySerializer(reservations, many=True)

        logging.info("ROOMS")
        logging.info(unavailability_serializer.data)

        unavailable_dates = []
        for reservation in unavailability_serializer.data:
            date_from = reservation.get("date_from")
            date_to = reservation.get("date_to")
            date_range = generate_range_of_dates(date_from, date_to)
            unavailable_dates.append(date_range)

        for unavailable_dates_range in unavailable_dates:
            if date_range_overlap(new_date_range, unavailable_dates_range):
                return Response(data={"msg": "Chosen date range overlaps with unavailable dates"}, status=status.HTTP_406_NOT_ACCEPTABLE)
        
        beds = models.Room.objects.filter(room_id=room_id).first().beds
        if int(request.data["number_of_people"]) > beds:
            return Response(data={"msg": "Number of people is too big for the room"}, status=status.HTTP_406_NOT_ACCEPTABLE)


        reservation_serializer.save()

        return Response(data={"msg": "Reservation created"}, status=status.HTTP_201_CREATED)


    def update(self, request, pk):
        reservation_serializer = serializers.ReservationSerializer(data=request.data)
        reservation_serializer.is_valid(raise_exception=True)

        new_date_from = request.data["date_from"]
        new_date_to = request.data["date_to"]
        new_date_range = generate_range_of_dates(new_date_from, new_date_to)

        room_id = request.data["room"]
        reservations = models.Reservation.objects.filter(room_id=room_id)

        unavailability_serializer = serializers.RoomUnavailabiltySerializer(reservations, many=True)

        logging.info("ROOMS")
        logging.info(unavailability_serializer.data)

        unavailable_dates = []
        for reservation in unavailability_serializer.data:
            date_from = reservation.get("date_from")
            date_to = reservation.get("date_to")
            if date_to != new_date_to and date_from != new_date_from:
                date_range = generate_range_of_dates(date_from, date_to)
                unavailable_dates.append(date_range)

        for unavailable_dates_range in unavailable_dates:
            if date_range_overlap(new_date_range, unavailable_dates_range):
                return Response(data={"msg": "Chosen date range overlaps with unavailable dates"}, status=status.HTTP_406_NOT_ACCEPTABLE)

        reservation_object = models.Reservation.objects.filter(id=pk).first()

        reservation_object.date_from = request.data["date_from"]
        reservation_object.date_to = request.data["date_to"]
        reservation_object.employee = models.Employee.objects.filter(id=request.data["employee"]).first()
        reservation_object.guest = models.Guest.objects.filter(id=request.data["guest"]).first()
        reservation_object.number_of_people = request.data["number_of_people"]
        reservation_object.room = models.Room.objects.filter(room_id=request.data["room"]).first()

        reservation_object.save()

        return Response(data={"msg": "Reservation edited"}, status=status.HTTP_201_CREATED)

    def list(self, request):
        """
        List all the rooms.
        """
        qs = models.Reservation.objects.all()
        reservation_serializer = self.get_serializer_class()
        serialized_reservations = reservation_serializer(qs, many=True)

        return Response(serialized_reservations.data, status=status.HTTP_200_OK)

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


    def retrieve(self, request, pk):
        if models.Reservation.objects.filter(pk=pk).exists():
            reservation = models.Reservation.objects.filter(pk=pk).first()

            reservation_serializer = serializers.ReservationRetrieveSerializer(reservation)
            return Response(reservation_serializer.data)
        else:
            return Response(data={"msg": "Reservation with id {} does not exist".format(pk)}, status=status.HTTP_404_NOT_FOUND)


class EmployeesViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.EmployeeSerializer
    queryset = models.Employee.objects.all()

    def create(self, request):
        """
        Add a new employee
        """
        employee_serializer = serializers.EmployeeSerializer(data=request.data)
        employee_serializer.is_valid(raise_exception=True)

        if models.Employee.objects.filter(social_security_number=request.data["social_security_number"]).exists():
            return Response({"msg": "Employee with this social security number already exists"}, status=status.HTTP_406_NOT_ACCEPTABLE)

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

    def update(self, request, pk):
        employee_serializer = serializers.EmployeeSerializer(data=request.data)
        employee_serializer.is_valid(raise_exception=True)

        employee = models.Employee.objects.filter(id=pk).first()

        if employee.social_security_number == request.data["social_security_number"]:
            employee.name = request.data["name"]
            employee.surname = request.data["surname"]
            employee.job = request.data["job"]
            employee.salary = request.data["salary"]

            employee.save()
            
            return Response({"msg": "Employee edited successfully"}, status=status.HTTP_200_OK) 

        if models.Employee.objects.filter(social_security_number=request.data["social_security_number"]).exists():
            return Response({"msg": "Employee with this social security number already exists"}, status=status.HTTP_406_NOT_ACCEPTABLE)

        employee.social_security_number = request.data["social_security_number"]
        employee.name = request.data["name"]
        employee.surname = request.data["surname"]
        employee.job = request.data["job"]
        employee.salary = request.data["salary"]

        employee.save()

        return Response({"msg": "Employee edited successfully"}, status=status.HTTP_200_OK)


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

    def get_serializer_class(self):
        if self.action == "list":
            return serializers.MealListSerializer
        return serializers.MealSerializer

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
        meal_serializer = self.get_serializer_class()
        serialized_meal_list = meal_serializer(qs, many=True)

        return Response(serialized_meal_list.data, status=status.HTTP_200_OK)

    def retrieve(self, request, pk):
        if models.Meal.objects.filter(pk=pk).exists():
            meal = models.Meal.objects.filter(pk=pk).first()

            meal_serializer = serializers.MealRetrieveSerializer(meal)
            return Response(meal_serializer.data)
        else:
            return Response(data={"msg": "Meal with id {} does not exist".format(pk)}, status=status.HTTP_404_NOT_FOUND)
    
    # def update(self, request, pk):
    #     """
    #     Update a meal
    #     """
    #     meal_serializer = serializers.MealSerializer(data=request.data)
    #     meal_serializer.is_valid(raise_exception=True)

    #     meal_serializer.save()

    #     return Response({"msg": "Meal edited"}, status=status.HTTP_200_OK)


class MealData(APIView):
    """
    Return guests, dishes and desserts to choose from when making meals
    """
    authentication_classes = []
    permission_classes = []

    def get(self, requset):
        try:
            guests_qs = models.Guest.objects.all()
            guest_serializer = serializers.GuestSerializer(guests_qs, many=True)

            dishes_qs = models.Dish.objects.all()
            dish_serializer = serializers.DishSerializer(dishes_qs, many=True)

            desserts_qs = models.Dessert.objects.all()
            dessert_serializer = serializers.DessertSerializer(desserts_qs, many=True)

            return_data = {
                "guests": guest_serializer.data,
                "dishes": dish_serializer.data,
                "desserts": dessert_serializer.data
            }

            return Response(data=return_data, status=status.HTTP_200_OK)

        except Exception as exc:
            return Response(data={"msg": "Internal server error", "detail": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RentalsViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.RentalSerializer
    queryset = models.Rental.objects.all()

    def get_serializer_class(self):
        if self.action == "list":
            return serializers.RentalListSerializer
        return serializers.RentalSerializer

    def create(self, request):
        """
        Add a new rental
        """
        rental_serializer = serializers.RentalSerializer(data=request.data)
        rental_serializer.is_valid(raise_exception=True)

        new_date_from = request.data["date_from"]
        new_date_to = request.data["date_to"]
        new_date_range = generate_range_of_dates(new_date_from, new_date_to)

        gear_id = request.data["gear"]
        rentals = models.Rental.objects.filter(gear_id=gear_id)

        unavailability_serializer = serializers.GearUnavailabiltySerializer(rentals, many=True)

        unavailable_dates = []
        for rental in unavailability_serializer.data:
            date_from = rental.get("date_from")
            date_to = rental.get("date_to")
            date_range = generate_range_of_dates(date_from, date_to)
            unavailable_dates.append(date_range)

        for unavailable_date_range in unavailable_dates:
            if date_range_overlap(new_date_range, unavailable_date_range):
                print(new_date_range)
                print(unavailable_dates)
                return Response(data={"msg": "Chosen date range overlaps with unavailable dates"}, status=status.HTTP_406_NOT_ACCEPTABLE)

        rental_serializer.save()

        return Response(data={"msg": "Rental created"}, status=status.HTTP_201_CREATED)

    def list(self, request):
        """
        List all the rentals.
        """
        qs = models.Rental.objects.all()
        rental_serializer = self.get_serializer_class()
        serialized_rental_list = rental_serializer(qs, many=True)

        return Response(serialized_rental_list.data, status=status.HTTP_200_OK)

    def retrieve(self, request, pk):
        if models.Rental.objects.filter(pk=pk).exists():
            rental = models.Rental.objects.filter(pk=pk).first()

            rental_serializer = serializers.RentalRetrieveSerializer(rental)
            return Response(rental_serializer.data)
        else:
            return Response(data={"msg": "Rental with id {} does not exist".format(pk)}, status=status.HTTP_404_NOT_FOUND)


class RentalData(APIView):
    """
    Return employees, guests and gear to choose from when making rentals
    """
    authentication_classes = []
    permission_classes = []

    def get(self, requset):
        try:
            employees_qs = models.Employee.objects.all()
            employee_serializer = serializers.EmployeeSerializer(employees_qs, many=True)

            guests_qs = models.Guest.objects.all()
            guest_serializer = serializers.GuestSerializer(guests_qs, many=True)

            gear_qs = models.Gear.objects.all()
            gear_serializer = serializers.GearSerializer(gear_qs, many=True)

            return_data = {
                "employees": employee_serializer.data,
                "guests": guest_serializer.data,
                "gear": gear_serializer.data
            }

            return Response(data=return_data, status=status.HTTP_200_OK)

        except Exception as exc:
            return Response(data={"msg": "Internal server error", "detail": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GearViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.GearSerializer
    queryset = models.Gear.objects.all()

    def create(self, request):
        """
        Add a new gear
        """
        gear_serializer = serializers.GearSerializer(data=request.data)
        gear_serializer.is_valid(raise_exception=True)

        if models.Gear.objects.filter(code=request.data["code"]).exists():
            return Response({"msg": "Gear with this code already exists"}, status=status.HTTP_406_NOT_ACCEPTABLE)

        gear_serializer.save()

        return Response({"msg": "Gear created"}, status=status.HTTP_201_CREATED)

    def list(self, request):
        """
        List all the gear.
        """
        qs = models.Gear.objects.all()
        gear_serializer = serializers.GearSerializer(qs, many=True)

        return Response(gear_serializer.data, status=status.HTTP_200_OK)

    def update(self, request, pk):
        gear_serializer = serializers.GearSerializer(data=request.data)
        gear_serializer.is_valid(raise_exception=True)

        gear = models.Gear.objects.filter(id=pk).first()

        if gear.code == request.data["code"]:
            gear.type = request.data["type"]
            gear.name = request.data["name"]
            gear.brand = request.data["brand"]
            gear.size = request.data["size"]

            gear.save()
            
            return Response({"msg": "Gear edited successfully"}, status=status.HTTP_200_OK) 

        if models.Gear.objects.filter(code=request.data["code"]).exists():
            return Response({"msg": "Gear with this code already exists"}, status=status.HTTP_406_NOT_ACCEPTABLE)

        gear.code = request.data["code"]
        gear.type = request.data["type"]
        gear.name = request.data["name"]
        gear.brand = request.data["brand"]
        gear.size = request.data["size"]

        gear.save()

        return Response({"msg": "Gear edited successfully"}, status=status.HTTP_200_OK)


    @action(detail=False, methods=["get"])
    def unavailabilty(self, request):   
        gear_id = request.GET["gear_id"]
        rentals = models.Rental.objects.filter(gear=gear_id)

        unavailability_serializer = serializers.GearUnavailabiltySerializer(rentals, many=True)

        unavailable_dates = []
        for rental in unavailability_serializer.data:
            date_from = rental.get("date_from")
            date_to = rental.get("date_to")
            date_range = generate_range_of_dates(date_from, date_to)
            unavailable_dates.extend(date_range)

        return Response(data=unavailable_dates)


class DutiesViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.DutySerializer
    queryset = models.Duty.objects.all()

    def get_serializer_class(self):
        if self.action == "list":
            return serializers.DutyListSerializer
        return serializers.DutySerializer

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
        duty_serializer = self.get_serializer_class()
        serialized_duty_list = duty_serializer(qs, many=True)

        return Response(serialized_duty_list.data, status=status.HTTP_200_OK)


    def retrieve(self, request, pk):
        if models.Duty.objects.filter(pk=pk).exists():
            duty = models.Duty.objects.filter(pk=pk).first()

            duty_serializer = serializers.DutyRetrieveSerializer(duty)
            return Response(duty_serializer.data)
        else:
            return Response(data={"msg": "Duty with id {} does not exist".format(pk)}, status=status.HTTP_404_NOT_FOUND)


class DutyData(APIView):
    """
    Return employees, localizations and tasks to choose from when making duties
    """
    authentication_classes = []
    permission_classes = []

    def get(self, requset):
        try:
            employees_qs = models.Employee.objects.all()
            employee_serializer = serializers.EmployeeSerializer(employees_qs, many=True)

            localizations_qs = models.Localization.objects.all()
            localization_serializer = serializers.LocalizationSerializer(localizations_qs, many=True)

            tasks_qs = models.Task.objects.all()
            task_serializer = serializers.TaskSerializer(tasks_qs, many=True)

            return_data = {
                "employees": employee_serializer.data,
                "localizations": localization_serializer.data,
                "tasks": task_serializer.data
            }

            return Response(data=return_data, status=status.HTTP_200_OK)

        except Exception as exc:
            return Response(data={"msg": "Internal server error", "detail": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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



class ReservationCost(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        try:
            reservation_id = request.GET["reservation_id"]
            with connection.cursor() as cursor:

                query = """
                create or replace function reservationCost(pReservationId int) 
                returns real
                language plpgsql
                as $$
                declare
                    pCost real;
                begin
                    SELECT p.price * (r.date_to - r.date_from) INTO pCost
                    FROM skiresort_reservation r JOIN skiresort_room p ON r.room_id = p.room_id
                    WHERE r.id = pReservationId;
                    RETURN pCost;
                end;
                $$;          
                """
                cursor.execute(query)
                cursor.execute("select * from reservationCost({});".format(reservation_id))

                data = cursor.fetchone()
                
            return Response(data={"reservation_cost": data[0]}, status=status.HTTP_200_OK)

        except Exception as exc:
            return Response(data={"msg": "Internal server error", "detail": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class IncreasePrices(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        try:
            increase = request.data["increase"]
            with connection.cursor() as cursor:

                query = """
                create or replace procedure increasePrices(pPercent int) 
                language plpgsql
                as $$
                begin
                    update skiresort_room set price = round((price * (1 + pPercent::numeric/100))::numeric, 2);

                    update skiresort_dessert set price = round((price * (1 + pPercent::numeric/100))::numeric, 2);

                    update skiresort_dish set price = round((price * (1 + pPercent::numeric/100))::numeric, 2);
                end;
                $$          
                """
                cursor.execute(query)
                cursor.execute("call increasePrices({});".format(increase))
                
            return Response(data={"msg": "Prices have been increased by {}%".format(increase)}, status=status.HTTP_200_OK)

        except Exception as exc:
            return Response(data={"msg": "Internal server error", "detail": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DecreasePrices(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        try:
            decrease = request.data["decrease"]
            with connection.cursor() as cursor:

                query = """
                create or replace procedure decreasePrices(pPercent int) 
                language plpgsql
                as $$
                begin
                    update skiresort_room set price = round((price * (1 - pPercent::numeric/100))::numeric, 2);

                    update skiresort_dish set price = round((price * (1 - pPercent::numeric/100))::numeric, 2);

                    update skiresort_dessert set price = round((price * (1 - pPercent::numeric/100))::numeric, 2);
                end;
                $$          
                """
                cursor.execute(query)
                cursor.execute("call decreasePrices({});".format(decrease))
                
            return Response(data={"msg": "Prices have been decreased by {}%".format(decrease)}, status=status.HTTP_200_OK)

        except Exception as exc:
            return Response(data={"msg": "Internal server error", "detail": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
