# Generated by Django 5.1.2 on 2024-11-07 13:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Signup', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='Education_Level',
            field=models.CharField(choices=[('primary', 'Primary'), ('middle', 'Middle'), ('high school', 'High School')], max_length=20),
        ),
    ]
