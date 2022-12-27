# Generated by Django 4.0 on 2022-12-07 21:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('skiresort', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Employee',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('social_security_number', models.IntegerField(help_text='Polish social security number PESEL')),
                ('surname', models.CharField(max_length=128)),
                ('name', models.CharField(max_length=128)),
                ('job', models.CharField(max_length=128)),
                ('salary', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Guest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('social_security_number', models.IntegerField(help_text='Polish social security number PESEL')),
                ('surname', models.CharField(max_length=128)),
                ('name', models.CharField(max_length=128)),
                ('email', models.EmailField(max_length=254)),
                ('address', models.CharField(max_length=256)),
            ],
        ),
        migrations.AddField(
            model_name='room',
            name='room_id',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='room',
            name='wing',
            field=models.CharField(max_length=128, null=True),
        ),
        migrations.CreateModel(
            name='Reservation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_from', models.CharField(max_length=128)),
                ('date_to', models.CharField(max_length=128)),
                ('number_of_people', models.IntegerField()),
                ('employee', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reservations', to='skiresort.employee')),
                ('guest', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reservations', to='skiresort.guest')),
                ('room', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rooms', to='skiresort.room')),
            ],
        ),
    ]
