from django.conf.urls import include
from django.urls import re_path
from rest_framework.routers import DefaultRouter

from skiresort import views

router = DefaultRouter()
router.register("rooms", views.RoomViewSet, "room")
router.register("guests", views.GuestViewSet, "guests")
router.register("reservations", views.ReservationViewSet, "reservations")
router.register("employees", views.EmployeeViewSet, "employees")

urlpatterns = [
    re_path("", include(router.urls))
]