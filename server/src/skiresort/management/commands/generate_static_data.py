import json
import os

from django.core.management.base import BaseCommand
from skiresort import serializers

class Command(BaseCommand):
    help = 'Importing mock data from json file to database'
        
    def handle(self, **options):
        module_dir = os.path.dirname(__file__)

        # guests
        file_path = os.path.join(module_dir, '../data/guests.json')
        with open(file_path, 'r') as file:
            mock_data = file.read()
            guests = json.loads(mock_data)
        
        for guest in guests:
            guest_serializer = serializers.GuestSerializer(data=guest)
            guest_serializer.is_valid(raise_exception=True)

            guest_serializer.save() 
        

        # employees
        file_path = os.path.join(module_dir, '../data/employees.json')
        with open(file_path, 'r') as file:
            mock_data = file.read()
            employees = json.loads(mock_data)
        
        for employee in employees:
            employee_serializer = serializers.EmployeeSerializer(data=employee)
            employee_serializer.is_valid(raise_exception=True)

            employee_serializer.save() 
        

        # rooms
        file_path = os.path.join(module_dir, '../data/rooms.json')
        with open(file_path, 'r') as file:
            mock_data = file.read()
            rooms = json.loads(mock_data)
        
        for room in rooms:
            room_serializer = serializers.RoomSerializer(data=room)
            room_serializer.is_valid(raise_exception=True)

            room_serializer.save() 
    

        # dishes
        file_path = os.path.join(module_dir, '../data/dishes.json')
        with open(file_path, 'r') as file:
            mock_data = file.read()
            dishes = json.loads(mock_data)
        
        for dish in dishes:
            dish_serializer = serializers.DishSerializer(data=dish)
            dish_serializer.is_valid(raise_exception=True)

            dish_serializer.save() 


        # desserts
        file_path = os.path.join(module_dir, '../data/desserts.json')
        with open(file_path, 'r') as file:
            mock_data = file.read()
            desserts = json.loads(mock_data)
        
        for dessert in desserts:
            dessert_serializer = serializers.DessertSerializer(data=dessert)
            dessert_serializer.is_valid(raise_exception=True)

            dessert_serializer.save() 


        # gear
        file_path = os.path.join(module_dir, '../data/gear.json')
        with open(file_path, 'r') as file:
            mock_data = file.read()
            gear_list = json.loads(mock_data)
        
        for gear in gear_list:
            gear_serializer = serializers.GearSerializer(data=gear)
            gear_serializer.is_valid(raise_exception=True)

            gear_serializer.save() 


        # localizations
        file_path = os.path.join(module_dir, '../data/localizations.json')
        with open(file_path, 'r') as file:
            mock_data = file.read()
            localizations = json.loads(mock_data)
        
        for localization in localizations:
            localization_serializer = serializers.LocalizationSerializer(data=localization)
            localization_serializer.is_valid(raise_exception=True)

            localization_serializer.save() 
    

        # tasks
        file_path = os.path.join(module_dir, '../data/tasks.json')
        with open(file_path, 'r') as file:
            mock_data = file.read()
            tasks = json.loads(mock_data)
        
        for task in tasks:
            task_serializer = serializers.TaskSerializer(data=task)
            task_serializer.is_valid(raise_exception=True)

            task_serializer.save() 
            