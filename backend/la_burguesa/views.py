from django.shortcuts import render

# Create your views here.
from django.core.paginator import Paginator
from .models import Client, Comanda, Producte, Hamburguesa, Acompanyament, Beguda, Postre, Menu, Ingredient, Item
from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse_lazy
from django.http import JsonResponse
from django.db.models import Q
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from django.http import HttpResponse

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
    clients = Client.objects.all().order_by('id')  # Order by ID to have consistent pagination
    paginator = Paginator(clients, 10)  # Show 10 clients per page

    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    client_list = []
    for client in page_obj:
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

    response_data = {
        'results': client_list,
        'count': paginator.count,
        'num_pages': paginator.num_pages,
        'current_page': page_obj.number,
    }

    return JsonResponse(response_data, safe=False)

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
    
    # Update the client fields from the POST data
    client.username = request.POST.get('username', client.username)
    client.first_name = request.POST.get('first_name', client.first_name)
    client.last_name = request.POST.get('last_name', client.last_name)
    client.email = request.POST.get('email', client.email)
    client.num_telefon = request.POST.get('num_telefon', client.num_telefon)
    client.adreca = request.POST.get('adreca', client.adreca)
    client.data_naix = request.POST.get('data_naix', client.data_naix)

    # Save the client object after updating the fields
    client.save()
    
    return JsonResponse({'status': 'success', 'client_id': client.id})

##############################################
################# COMANDES ###################
##############################################
def list_comandas(request):
    comandas = Comanda.objects.all().order_by('-data', '-hora_creacio')  # Order by date and hour, newer first
    paginator = Paginator(comandas, 10)  # Show 10 comandes per page

    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    comandas_list = []
    for comanda in page_obj:
        comandas_list.append({
            'id': comanda.id,
            'data': comanda.data,
            'hora_creacio': comanda.hora_creacio,
            'preu_total': comanda.preu_total,
            'dni_processada': comanda.dni_processada.dni,
            'username_client': comanda.username_client.username,
        })

    response_data = {
        'results': comandas_list,
        'count': paginator.count,
        'num_pages': paginator.num_pages,
        'current_page': page_obj.number,
    }

    return JsonResponse(response_data, safe=False)

def comanda_details(request, comanda_id):
    try:
        comanda = Comanda.objects.get(id=comanda_id)
        items = Item.objects.filter(comanda=comanda)
        items_list = [{
            'producte_id': item.producte.id,
            'producte_nom': item.producte.nom,
            'quantitat_prod': item.quantitat_prod,
            'preu_pagat_producte': item.preu_pagat_producte,
        } for item in items]

        comanda_details = {
            'id': comanda.id,
            'data': comanda.data,
            'hora_creacio': comanda.hora_creacio,
            'preu_total': comanda.preu_total,
            'dni_processada': comanda.dni_processada.dni,
            'username_client': comanda.username_client.username,
            'items': items_list
        }

        return JsonResponse(comanda_details, safe=False)
    except Comanda.DoesNotExist:
        return JsonResponse({'error': 'Comanda not found'}, status=404)

##############################################
################# PRODUCTES ##################
##############################################
def list_productes(request):
    product_type = request.GET.get('type', None)
    productes = Producte.objects.all().order_by('-id')  # Order by ID in descending order
    
    if product_type:
        if product_type == 'Hamburguesa':
            productes = productes.filter(hamburguesa__isnull=False)
        elif product_type == 'Acompanyament':
            productes = productes.filter(acompanyament__isnull=False)
        elif product_type == 'Beguda':
            productes = productes.filter(beguda__isnull=False)
        elif product_type == 'Postre':
            productes = productes.filter(postre__isnull=False)
        elif product_type == 'Menu':
            productes = productes.filter(menu__isnull=False)

    paginator = Paginator(productes, 10)  # Show 10 products per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    productes_list = []

    for producte in page_obj:
        producte_data = {
            'id': producte.id,
            'nom': producte.nom,
            'preu': producte.preu,
            'tipus': '',
            'detalls': {}
        }

        try:
            hamburguesa = Hamburguesa.objects.get(producte=producte)
            ingredients = hamburguesa.ingredients_conte.all()
            ingredients_list = [{'nom': ingredient.nom, 'preu': ingredient.preu} for ingredient in ingredients]
            producte_data['tipus'] = 'Hamburguesa'
            producte_data['detalls'] = {
                'descripcio': hamburguesa.descripcio,
                'ingredients': ingredients_list
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

    response_data = {
        'results': productes_list,
        'count': paginator.count,
        'num_pages': paginator.num_pages,
        'current_page': page_obj.number,
    }

    return JsonResponse(response_data, safe=False)


@csrf_exempt
def delete_product(request, product_id):
    if request.method == 'DELETE':
        try:
            product = Producte.objects.get(id=product_id)
            product.delete()
            return JsonResponse({'message': 'Product deleted successfully'})
        except Producte.DoesNotExist:
            return JsonResponse({'error': 'Product not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Invalid HTTP method'}, status=405)


########### HAMBURGUESA ################
@csrf_exempt
def create_hamburguesa(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        try:
            producte = Producte.objects.create(nom=data['nom'], preu=data['preu'])
            hamburguesa = Hamburguesa.objects.create(
                producte=producte,
                descripcio=data['descripcio']
            )
            for ingredient_id in data['ingredients_conte']:
                ingredient = Ingredient.objects.get(nom=ingredient_id)
                hamburguesa.ingredients_conte.add(ingredient)
            hamburguesa.save()
            return JsonResponse({'id': hamburguesa.producte.id}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def edit_hamburguesa(request, id):
    if request.method == 'PUT':
        data = json.loads(request.body.decode('utf-8'))
        try:
            producte = Producte.objects.get(id=id)
            producte.nom = data['nom']
            producte.preu = data['preu']
            producte.save()

            hamburguesa = Hamburguesa.objects.get(producte=producte)
            hamburguesa.descripcio = data['descripcio']
            hamburguesa.ingredients_conte.clear()

            for ingredient_nom in data['ingredients_conte']:
                ingredient = Ingredient.objects.get(nom=ingredient_nom)
                hamburguesa.ingredients_conte.add(ingredient)

            hamburguesa.save()
            return JsonResponse({'id': hamburguesa.producte.id}, status=200)
        except Producte.DoesNotExist:
            return JsonResponse({'error': 'Product not found'}, status=404)
        except Ingredient.DoesNotExist:
            return JsonResponse({'error': 'One or more ingredients not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

################ ACOMPANYAMENT ################
@csrf_exempt
def create_acompanyament(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        try:
            producte = Producte.objects.create(nom=data['nom'], preu=data['preu'])
            acompanyament = Acompanyament.objects.create(
                producte=producte,
                descripcio=data['descripcio']
            )
            return JsonResponse({'id': acompanyament.producte.id}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def edit_acompanyament(request, id):
    if request.method == 'PUT':
        data = json.loads(request.body.decode('utf-8'))
        try:
            producte = Producte.objects.get(id=id)
            producte.nom = data['nom']
            producte.preu = data['preu']
            producte.save()

            acompanyament = Acompanyament.objects.get(producte=producte)
            acompanyament.descripcio = data['descripcio']
            acompanyament.save()
            return JsonResponse({'id': acompanyament.producte.id}, status=200)
        except Producte.DoesNotExist:
            return JsonResponse({'error': 'Product not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

################ BEGUDA ################
@csrf_exempt
def create_beguda(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        try:
            producte = Producte.objects.create(nom=data['nom'], preu=data['preu'])
            beguda = Beguda.objects.create(producte=producte)
            return JsonResponse({'id': beguda.producte.id}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def edit_beguda(request, id):
    if request.method == 'PUT':
        data = json.loads(request.body.decode('utf-8'))
        try:
            producte = Producte.objects.get(id=id)
            producte.nom = data['nom']
            producte.preu = data['preu']
            producte.save()

            beguda = Beguda.objects.get(producte=producte)
            beguda.save()
            return JsonResponse({'id': beguda.producte.id}, status=200)
        except Producte.DoesNotExist:
            return JsonResponse({'error': 'Product not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

############### POSTRE ################
@csrf_exempt
def create_postre(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        try:
            producte = Producte.objects.create(nom=data['nom'], preu=data['preu'])
            postre = Postre.objects.create(
                producte=producte,
                descripcio=data['descripcio']
            )
            return JsonResponse({'id': postre.producte.id}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def edit_postre(request, id):
    if request.method == 'PUT':
        data = json.loads(request.body.decode('utf-8'))
        try:
            producte = Producte.objects.get(id=id)
            producte.nom = data['nom']
            producte.preu = data['preu']
            producte.save()

            postre = Postre.objects.get(producte=producte)
            postre.descripcio = data['descripcio']
            postre.save()
            return JsonResponse({'id': postre.producte.id}, status=200)
        except Producte.DoesNotExist:
            return JsonResponse({'error': 'Product not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

#################### MENU #####################
@csrf_exempt
def create_menu(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        try:
            hamburguesa = Hamburguesa.objects.get(producte_id=data['hamburguesa'])
            acompanyament = Acompanyament.objects.get(producte_id=data['acompanyament'])
            beguda = Beguda.objects.get(producte_id=data['beguda'])
            postre = Postre.objects.get(producte_id=data['postre'])
            
            suma_preus = (
                hamburguesa.producte.preu +
                acompanyament.producte.preu +
                beguda.producte.preu +
                postre.producte.preu
            )
            
            producte = Producte.objects.create(nom=data['nom'], preu=data['preu'])
            
            menu = Menu.objects.create(
                producte=producte,
                suma_preus=suma_preus,
                hamburguesa=hamburguesa,
                acompanyament=acompanyament,
                beguda=beguda,
                postre=postre
            )
            return JsonResponse({'id': menu.producte.id}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

def list_hamburgueses(request):
    hamburgueses = Hamburguesa.objects.all().select_related('producte').values('producte_id', 'producte__nom')
    return JsonResponse(list(hamburgueses), safe=False)

def list_acompanyaments(request):
    acompanyaments = Acompanyament.objects.all().select_related('producte').values('producte_id', 'producte__nom')
    return JsonResponse(list(acompanyaments), safe=False)

def list_begudes(request):
    begudes = Beguda.objects.all().select_related('producte').values('producte_id', 'producte__nom')
    return JsonResponse(list(begudes), safe=False)

def list_postres(request):
    postres = Postre.objects.all().select_related('producte').values('producte_id', 'producte__nom')
    return JsonResponse(list(postres), safe=False)
        
@csrf_exempt
def edit_menu(request, id):
    if request.method == 'PUT':
        data = json.loads(request.body.decode('utf-8'))
        try:
            producte = Producte.objects.get(id=id)
            producte.nom = data['nom']
            producte.preu = data['preu']
            producte.save()

            hamburguesa = Hamburguesa.objects.get(producte_id=data['hamburguesa'])
            acompanyament = Acompanyament.objects.get(producte_id=data['acompanyament'])
            beguda = Beguda.objects.get(producte_id=data['beguda'])
            postre = Postre.objects.get(producte_id=data['postre'])
            
            # Calculate the suma_preus
            suma_preus = (
                hamburguesa.producte.preu +
                acompanyament.producte.preu +
                beguda.producte.preu +
                postre.producte.preu
            )

            menu = Menu.objects.get(producte=producte)
            menu.suma_preus = suma_preus
            menu.hamburguesa = hamburguesa
            menu.acompanyament = acompanyament
            menu.beguda = beguda
            menu.postre = postre
            menu.save()
            
            return JsonResponse({'id': menu.producte.id}, status=200)
        except Producte.DoesNotExist:
            return JsonResponse({'error': 'Product not found'}, status=404)
        except Hamburguesa.DoesNotExist:
            return JsonResponse({'error': 'Hamburguesa not found'}, status=404)
        except Acompanyament.DoesNotExist:
            return JsonResponse({'error': 'Acompanyament not found'}, status=404)
        except Beguda.DoesNotExist:
            return JsonResponse({'error': 'Beguda not found'}, status=404)
        except Postre.DoesNotExist:
            return JsonResponse({'error': 'Postre not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)


##############################################
################## INGREDIENTS ###############
##############################################

@csrf_exempt
def list_ingredients(request):
    search_query = request.GET.get('search', '')
    if search_query:
        ingredients = Ingredient.objects.filter(nom__icontains=search_query)
    else:
        ingredients = Ingredient.objects.all().order_by('preu')

    paginator = Paginator(ingredients, 10)
    page_number = request.GET.get('page', 1)
    page_obj = paginator.get_page(page_number)

    ingredient_list = [{
        'nom': ingredient.nom,
        'preu': ingredient.preu,
    } for ingredient in page_obj]

    return JsonResponse({
        'results': ingredient_list,
        'num_pages': paginator.num_pages,
        'current_page': page_obj.number,
    })



@csrf_exempt
def create_ingredient(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        try:
            ingredient = Ingredient.objects.create(nom=data['nom'], preu=data['preu'])
            return JsonResponse({'nom': ingredient.nom, 'preu': ingredient.preu}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def update_ingredient(request, nom):
    if request.method == 'PUT':
        try:
            ingredient = Ingredient.objects.get(nom=nom)
            data = json.loads(request.body.decode('utf-8'))
            ingredient.preu = data.get('preu', ingredient.preu)
            ingredient.save()
            return JsonResponse({'nom': ingredient.nom, 'preu': ingredient.preu})
        except Ingredient.DoesNotExist:
            return JsonResponse({'error': 'Ingredient not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
def delete_ingredient(request, nom):
    if request.method == 'DELETE':
        try:
            ingredient = Ingredient.objects.get(nom=nom)
            ingredient.delete()
            return HttpResponse(status=204)
        except Ingredient.DoesNotExist:
            return JsonResponse({'error': 'Ingredient not found'}, status=404)



##############################################
#################### ITEMS ###################
##############################################
# def list_items(request):
#     items = Item.objects.all()
#     items_list = []

#     for item in items:
#         item_data = {
#             'id': item.id,
#             'producte': {
#                 'id': item.producte.id,
#                 'nom': item.producte.nom,
#                 'preu': item.producte.preu
#             },
#             'comanda': {
#                 'id': item.comanda.id,
#                 'data': item.comanda.data,
#                 'hora_creacio': item.comanda.hora_creacio,
#                 'preu_total': item.comanda.preu_total,
#                 'dni_processada': item.comanda.dni_processada.id,
#                 'username_client': item.comanda.username_client.username,
#             },
#             'quantitat_prod': item.quantitat_prod,
#             'preu_pagat_producte': item.preu_pagat_producte
#         }
#         items_list.append(item_data)

#     return JsonResponse(items_list, safe=False)
