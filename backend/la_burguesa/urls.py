# la_burguesa/urls.py
from django.urls import path
from la_burguesa.views import get_email, login, get_client_details, list_clients, delete_client

urlpatterns = [
    path('get-email/<str:username>/', get_email, name='get_email'),
    path('api/login/', login, name='login'),  # Add this line for the login endpoint
    path('client/<int:client_id>/', get_client_details, name='get-client-details'),  # URL pattern for client details
    path('clients/', list_clients, name='list-clients'),  # URL pattern for listing clients
    path('delete-client/<int:id>/', delete_client, name='delete-client'),  # URL per eliminar un client
]