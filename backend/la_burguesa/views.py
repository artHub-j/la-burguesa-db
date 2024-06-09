from django.shortcuts import render

# Create your views here.
from .models import Client, Comanda, Producte, Hamburguesa, Acompanyament, Beguda, Postre, Menu, Item
from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse_lazy
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
        
@csrf_exempt
@require_http_methods(["POST"])
def edit_client(request, client_id):
    client = get_object_or_404(Client, pk=client_id)
    if request.method == 'POST':
        client.username = request.POST.get('username')
        client.first_name = request.POST.get('first_name')
        client.last_name = request.POST.get('last_name')
        client.email = request.POST.get('email')
        client.num_telefon = request.POST.get('num_telefon')
        client.adreca = request.POST.get('adreca')
        client.data_naix = request.POST.get('data_naix')
        
        # Save the client object after updating the fields
        client.save()
        return redirect('client_detail', client_id=client.id)
    return render(request, 'edit_client.html', {'client': client})

##############################################
################# COMANDES ###################
##############################################
def list_comandas(request):
    comandas = Comanda.objects.all()
    comandas_list = []

    for comanda in comandas:
        comandas_list.append({
            'id': comanda.id,
            'data': comanda.data,
            'hora_creacio': comanda.hora_creacio,
            'preu_total': comanda.preu_total,
            'dni_processada': comanda.dni_processada.dni,
            'username_client': comanda.username_client.username,
        })

    return JsonResponse(comandas_list, safe=False)

##############################################
################# PRODUCTES ##################
##############################################
def list_productes(request):
    productes = Producte.objects.all()
    productes_list = []

    for producte in productes:
        producte_data = {
            'id': producte.id,
            'nom': producte.nom,
            'preu': producte.preu,
            'tipus': '',
            'detalls': {}
        }

        try:
            hamburguesa = Hamburguesa.objects.get(producte=producte)
            producte_data['tipus'] = 'Hamburguesa'
            producte_data['detalls'] = {
                'descripcio': hamburguesa.descripcio,
                #ingredients_conte': list(hamburguesa.ingredients_conte.values('id', 'nom'))
            }
        except Hamburguesa.DoesNotExist:
            pass

        try:
            acompanyament = Acompanyament.objects.get(producte=producte)
            producte_data['tipus'] = 'Acompanyament'
            producte_data['detalls'] = {
                'descripcio': acompanyament.descripcio
            }
        except Acompanyament.DoesNotExist:
            pass

        try:
            beguda = Beguda.objects.get(producte=producte)
            producte_data['tipus'] = 'Beguda'
            producte_data['detalls'] = {}
        except Beguda.DoesNotExist:
            pass

        try:
            postre = Postre.objects.get(producte=producte)
            producte_data['tipus'] = 'Postre'
            producte_data['detalls'] = {
                'descripcio': postre.descripcio
            }
        except Postre.DoesNotExist:
            pass

        try:
            menu = Menu.objects.get(producte=producte)
            producte_data['tipus'] = 'Menu'
            producte_data['detalls'] = {
                'suma_preus': menu.suma_preus,
                'hamburguesa': menu.hamburguesa.producte.nom,
                'acompanyament': menu.acompanyament.producte.nom,
                'beguda': menu.beguda.producte.nom,
                'postre': menu.postre.producte.nom,
            }
        except Menu.DoesNotExist:
            pass

        productes_list.append(producte_data)

    return JsonResponse(productes_list, safe=False)

##############################################
#################### ITEMS ###################
##############################################
def list_items(request):
    items = Item.objects.all()
    items_list = []

    for item in items:
        item_data = {
            'id': item.id,
            'producte': {
                'id': item.producte.id,
                'nom': item.producte.nom,
                'preu': item.producte.preu
            },
            'comanda': {
                'id': item.comanda.id,
                'data': item.comanda.data,
                'hora_creacio': item.comanda.hora_creacio,
                'preu_total': item.comanda.preu_total,
                'dni_processada': item.comanda.dni_processada.id,
                'username_client': item.comanda.username_client.username,
            },
            'quantitat_prod': item.quantitat_prod,
            'preu_pagat_producte': item.preu_pagat_producte
        }
        items_list.append(item_data)

    return JsonResponse(items_list, safe=False)
