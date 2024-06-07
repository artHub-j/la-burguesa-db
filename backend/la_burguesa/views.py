from django.shortcuts import render

# Create your views here.
from .models import Client, Comanda
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods


def get_email(request, username):
    try: 
        user = User.objects.get(username = username)
        return JsonResponse({'email': user.email})
    except User.DoesNotExist:
        return JsonResponse({'error': 'User does not exist'}, status=404)
    
def get_client_details(request, client_id):
    try:
        client = Client.objects.get(pk=client_id)
        client_data = {
            'username': client.username,
            'first_name': client.first_name,
            'last_name': client.last_name,
            'email': client.email,
            'num_telefon': client.num_telefon,
            'adreca': client.adreca,
            'data_naix': client.data_naix,
            'preferits': list(client.preferits.values('id', 'name')),
            'valorats': list(client.valorats.values('id', 'name'))
        }
        return JsonResponse(client_data)
    except Client.DoesNotExist:
        return JsonResponse({'error': 'Client does not exist'}, status=404)

def list_clients(request):
    clients = Client.objects.all()
    client_list = []
    for client in clients:
        client_list.append({
            'id': client.id,
            'username': client.username,
            'first_name': client.first_name,
            'last_name': client.last_name,
            'email': client.email,
            'num_telefon': client.num_telefon,
            'adreca': client.adreca,
            'data_naix': client.data_naix,
        })
    return JsonResponse(client_list, safe=False)

@csrf_exempt
@require_http_methods(["DELETE"])
def delete_client(request, id):
    try:
        client = Client.objects.get(user_ptr_id=id)
        
        # Eliminate all orders associated with the client
        Comanda.objects.filter(username_client=client.user_ptr_id).delete()
        
        # Delete the client
        client.delete()
        return JsonResponse({'message': 'Client deleted successfully'})
    except Client.DoesNotExist:
        return JsonResponse({'error': 'Client does not exist'}, status=404)


def login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            # Authentication successful
            return JsonResponse({'success': True})
        else:
            # Authentication failed
            return JsonResponse({'success': False, 'error': 'Invalid username or password'}, status=400)