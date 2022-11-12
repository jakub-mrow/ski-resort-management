from django.conf.urls import include
from django.urls import re_path
from rest_framework.routers import DefaultRouter

from skiresort import views

router = DefaultRouter()
router.register("rooms", views.RoomViewSet, "room")

urlpatterns = [
    re_path("", include(router.urls))
]