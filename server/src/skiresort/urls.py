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
    re_path("reservation_data", views.ReservationData.as_view(), name="reservation_data")
]