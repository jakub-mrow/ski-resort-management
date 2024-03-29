# Generated by Django 4.0 on 2022-12-28 23:10

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('skiresort', '0004_alter_guest_social_security_number'),
    ]

    operations = [
        migrations.AlterField(
            model_name='employee',
            name='social_security_number',
            field=models.BigIntegerField(help_text='Polish social security number PESEL', validators=[django.core.validators.MaxValueValidator(99999999999)]),
        ),
    ]
