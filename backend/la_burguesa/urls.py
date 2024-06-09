# la_burguesa/urls.py
from django.urls import path
from la_burguesa.views import get_email, login, get_client_details, list_clients, delete_client, edit_client, list_comandas, list_productes, list_items

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
    #PRODUCTES
     path('productes/', list_productes, name='list-productes'),  # URL per llistar els productes
    #ITEMS
     path('items/', list_items, name='list-items'),  # URL per llistar els items

]