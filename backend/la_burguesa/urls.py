# la_burguesa/urls.py
from django.urls import path
from la_burguesa.views import get_email, login, get_client_details, list_clients, delete_client, edit_client, list_comandas, list_productes
from la_burguesa.views import create_hamburguesa, create_acompanyament, create_beguda, create_postre, create_menu
from la_burguesa.views import list_ingredients, create_ingredient, update_ingredient, delete_ingredient
from la_burguesa.views import delete_product, comanda_details

from la_burguesa.views import list_hamburgueses, list_acompanyaments, list_begudes, list_postres
from la_burguesa.views import edit_hamburguesa, edit_acompanyament, edit_beguda, edit_postre, edit_menu
# , list_items

urlpatterns = [
    #CLIENT
    path('get-email/<str:username>/', get_email, name='get_email'),
    path('api/login/', login, name='login'),  # Add this line for the login endpoint
    path('client/<int:client_id>/', get_client_details, name='get-client-details'),  # URL pattern for client details
    path('clients/', list_clients, name='list-clients'),  # URL pattern for listing clients
    path('delete-client/<int:id>/', delete_client, name='delete-client'),  # URL per eliminar un client
    path('clients/<int:client_id>/edit/', edit_client, name='edit_client'),
    #COMANDES
     path('comandes/', list_comandas, name='list-comandes'),  # URL per llistar les comandes
     path('comandes/<int:comanda_id>/', comanda_details, name='comanda_details'),
    #PRODUCTES
    path('productes/', list_productes, name='list_productes'),
    path('productes/<int:product_id>/delete/', delete_product, name='delete_product'),
    path('productes/new-hamburguesa/', create_hamburguesa, name='create-hamburguesa'),
    path('productes/new-acompanyament/', create_acompanyament, name='create-acompanyament'),
    path('productes/new-beguda/', create_beguda, name='create-beguda'),
    path('productes/new-postre/', create_postre, name='create-postre'),
    path('productes/new-menu/', create_menu, name='create_menu'),

    path('productes/edit_hamburguesa/<int:id>/', edit_hamburguesa, name='edit_hamburguesa'),
    path('productes/edit_acompanyament/<int:id>/', edit_acompanyament, name='edit_acompanyament'),
    path('productes/edit_beguda/<int:id>/', edit_beguda, name='edit_beguda'),
    path('productes/edit_postre/<int:id>/', edit_postre, name='edit_postre'),
    path('productes/edit_menu/<int:id>/', edit_menu, name='edit_menu'),

    path('productes/hamburgueses/', list_hamburgueses, name='list_hamburgueses'),
    path('productes/acompanyaments/', list_acompanyaments, name='list_acompanyaments'),
    path('productes/begudes/', list_begudes, name='list_begudes'),
    path('productes/postres/', list_postres, name='list_postres'),
    #INGREDIENTS
    path('ingredients/', list_ingredients, name='ingredient-list'),
    path('ingredients/new/', create_ingredient, name='ingredient-create'),
    path('ingredients/<str:nom>/edit/', update_ingredient, name='ingredient-update'),
    path('ingredients/<str:nom>/delete/', delete_ingredient, name='ingredient-delete'),

    #ITEMS
    #  path('items/', list_items, name='list-items'),  # URL per llistar els items

]