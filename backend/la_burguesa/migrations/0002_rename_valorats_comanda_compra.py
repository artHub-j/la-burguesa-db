# Generated by Django 5.0.6 on 2024-06-12 21:58

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('la_burguesa', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='comanda',
            old_name='valorats',
            new_name='compra',
        ),
    ]
