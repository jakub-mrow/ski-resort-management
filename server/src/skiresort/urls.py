from django.conf.urls import include
from django.urls import re_path
from rest_framework.routers import DefaultRouter

from skiresort import views

router = DefaultRouter()

router.register("rooms", views.RoomsViewSet, "room")
router.register("guests", views.GuestsViewSet, "guests")
router.register("reservations", views.ReservationsViewSet, "reservations")
router.register("employees", views.EmployeesViewSet, "employees")
router.register("dishes", views.DishesViewSet, "disher")
router.register("desserts", views.DessertsViewSet, "desserts")
router.register("meals", views.MealsViewSet, "meals")
router.register("gear", views.GearViewSet, "gear")
router.register("rentals", views.RentalsViewSet, "rentals")
router.register("localizations", views.LocalizationsViewSet, "localizations")
router.register("tasks", views.TasksViewSet, "tasks")
router.register("duties", views.DutiesViewSet, "duties")


urlpatterns = [
    re_path("", include(router.urls)),
    re_path("reservation_data", views.ReservationData.as_view(), name="reservation_data"),
    re_path("rental_data", views.RentalData.as_view(), name="rental_data"),
    re_path("meal_data", views.MealData.as_view(), name="meal_data"),
    re_path("duty_data", views.DutyData.as_view(), name="duty_data"),
    re_path("reservation_cost", views.ReservationCost.as_view(), name="reservation_cost"),
    re_path("increase_prices", views.IncreasePrices.as_view(), name="increase_prices"),
    re_path("decrease_prices", views.DecreasePrices.as_view(), name="decrease_prices"),
]