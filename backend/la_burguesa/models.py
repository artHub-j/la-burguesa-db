from django.db import models
from enum import Enum

# Create your models here.

class Empleat(models.Model):
    dni = models.CharField(max_length=20, primary_key=True)
    nom = models.CharField(max_length=100)
    data_naix = models.DateField()
    data_contractacio = models.DateField()
    sou = models.DecimalField(max_digits=10, decimal_places=2)
    carrec = models.CharField(max_length=100)

class Producte(models.Model):
    id = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=101)
    preu = models.DecimalField(max_digits=10, decimal_places=2)

class Client(models.Model):
    correu = models.CharField(max_length=100, primary_key=True)
    nom = models.CharField(max_length=100)
    num_telefon = models.CharField(max_length=20)
    adreca = models.CharField(max_length=255)
    data_naix = models.DateField()
    preferits = models.ManyToManyField(Producte, related_name='clients_preferits')
    valorats = models.ManyToManyField(Producte, through='Valoracio', related_name='clients_valorats')

class Comanda(models.Model):
    id = models.AutoField(primary_key=True)
    data = models.DateField()
    hora_creacio = models.TimeField()
    preu_total = models.DecimalField(max_digits=10, decimal_places=2)
    valorats = models.ManyToManyField(Producte, through='Item')

    dni_processada = models.ForeignKey(Empleat, on_delete=models.CASCADE)
    correu_client = models.ForeignKey(Client, on_delete=models.CASCADE)

class EstatComandaRecollida(Enum):
    PENDIENTE = 'Pendent'
    CONFIRMADA = 'Confirmada'
    EN_PREPARACIO = 'En preparació'
    EN_CAMI = 'En camí'
    COMPLETADA = 'Completada'

class DeRecollida(models.Model):
    comanda = models.OneToOneField(Comanda, on_delete=models.CASCADE, primary_key=True)
    hora_recollida = models.TimeField()
    estat = models.CharField(max_length=100, choices=[(estat.value, estat.value) for estat in EstatComandaRecollida])

class EstatComandaADomicili(Enum):
    PENDIENT = 'Pendent'
    CONFIRMADA = 'Confirmada'
    EN_PREPARACIO = 'En preparació'
    LLESTA_PER_EMPORTAR = 'Llesta per emportar'
    COMPLETADA = 'Completada'

class ADomicili(models.Model):
    comanda = models.OneToOneField(Comanda, on_delete=models.CASCADE, primary_key=True)
    hora_entrega = models.TimeField()
    adreca_lliurament = models.CharField(max_length=255)
    dni_entrega = models.ForeignKey(Empleat, on_delete=models.CASCADE)
    estat = models.CharField(max_length=100, choices=[(estat.value, estat.value) for estat in EstatComandaADomicili])

class Item(models.Model):
    id = models.AutoField(primary_key=True)
    producte = models.ForeignKey(Producte, on_delete=models.CASCADE)
    comanda = models.ForeignKey(Comanda, on_delete=models.CASCADE)
    quantitat_prod = models.IntegerField()
    preu_pagat_producte = models.DecimalField(max_digits=10, decimal_places=2)

class Ingredient(models.Model):
    nom = models.CharField(max_length=100, primary_key=True)
    preu = models.DecimalField(max_digits=10, decimal_places=2)

class Propietat(models.Model):
    numero_propietat = models.AutoField(primary_key=True)
    quantitat_propietat = models.IntegerField()
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    descartats = models.ManyToManyField(Ingredient, related_name='propietats_descartats')
    suplements = models.ManyToManyField(Ingredient, related_name='propietats_suplements')

class Valoracio(models.Model):
    correu_client = models.ForeignKey(Client, on_delete=models.CASCADE)
    producte = models.ForeignKey(Producte, on_delete=models.CASCADE)
    valor = models.IntegerField()
    comentari = models.TextField()

    # class Meta:
    #     unique_together = ('correu_client', 'producte')

class Hamburguesa(models.Model):
    producte = models.OneToOneField(Producte, on_delete=models.CASCADE, primary_key=True)
    descripcio = models.TextField()
    ingredients_conte = models.ManyToManyField(Ingredient)

class Acompanyament(models.Model):
    producte = models.OneToOneField(Producte, on_delete=models.CASCADE, primary_key=True)
    descripcio = models.TextField()

class Beguda(models.Model):
    producte = models.OneToOneField(Producte, on_delete=models.CASCADE, primary_key=True)

class Postre(models.Model):
    producte = models.OneToOneField(Producte, on_delete=models.CASCADE, primary_key=True)
    descripcio = models.TextField()

class Menu(models.Model):
    producte = models.OneToOneField(Producte, on_delete=models.CASCADE, primary_key=True)
    suma_preus = models.DecimalField(max_digits=10, decimal_places=2)
    hamburguesa = models.ForeignKey(Hamburguesa, on_delete=models.CASCADE)
    acompanyament = models.ForeignKey(Acompanyament, on_delete=models.CASCADE)
    beguda = models.ForeignKey(Beguda, on_delete=models.CASCADE)
    postre = models.ForeignKey(Postre, on_delete=models.CASCADE)


# Taules relacio

# class Preferit(models.Model):
#     correu_client = models.ForeignKey(Client, on_delete=models.CASCADE, primary_key=True)
#     id_producte = models.ForeignKey(Producte, on_delete=models.CASCADE, primary_key=True)

# class Descartat(models.Model):
#     numero_propietat = models.ForeignKey(Propietat, on_delete=models.CASCADE, primary_key=True)
#     nom = models.ForeignKey(IngredientDescartat, on_delete=models.CASCADE, primary_key=True)

# class Suplement(models.Model):
#     numero_propietat = models.ForeignKey(Propietat, on_delete=models.CASCADE, primary_key=True)
#     nom = models.ForeignKey(IngredientSuplement, on_delete=models.CASCADE, primary_key=True)


# Taules obsoletes

# class IngredientDescartat(models.Model):
#     nom = models.CharField(max_length=100, primary_key=True)

# class IngredientSuplement(models.Model):
#     nom = models.CharField(max_length=100, primary_key=True)
#     preu = models.DecimalField(max_digits=10, decimal_places=2)