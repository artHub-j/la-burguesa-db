from decimal import Decimal
from faker import Faker
import random
from random import choice, randint
import datetime
from django.db import connection
from django.utils import timezone
from la_burguesa.models import Empleat, Producte, Client, Beguda, Hamburguesa, Acompanyament, Postre, Menu, Comanda, Valoracio, Ingredient, ADomicili, DeRecollida, EstatComandaADomicili, EstatComandaRecollida, Item, Propietat
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User


fake = Faker()

carrecs = ['Transport', 'Elaboració']
adjetivos_hamburguesas = ['Deluxe', 'Doble', 'Premium', 'De Pollo', 'Vegetariana', 'Picante', 'Gourmet', 'Con Queso', 'Clásica', 'Especial']
adjetivos_bebidas = ['Fresco', 'Natural', 'Exótico', 'Con Gas', 'Sin Azúcar', 'Premium', 'Artesanal', 'Refrescante', 'Energizante', 'Frutal']
adjetivos_acompanyaments = ['Crujiente', 'Sabroso', 'Delicioso', 'Fresco', 'Caliente', 'Picante', 'Rico', 'Sazonado', 'Suave', 'Saludable', 'Exquisito', 'Aromático']
adjetivos_postres = ['Dulce', 'Delicioso', 'Cremoso', 'Esponjoso', 'Fresco', 'Rico', 'Suave', 'Festivo', 'Exquisito', 'Gourmet', 'Fresco', 'Frutal']
nombres_menu = ["Menú clásico", "Menú especial", "Menú premium", "Menú del día", "Menú gourmet", "Menú saludable", "Menú infantil", "Menú festivo", "Menú vegetariano", "Menú picante", "Menú exótico", "Menú familiar", "Menú completo", "Menú ligero", "Menú del chef", "Menú express", "Menú de temporada", "Menú para compartir", "Menú de la casa", "Menú feliz"]
ingredientes_hamburguesas = ['carne de res', 'carne de pollo', 'queso cheddar', 'queso feta', 'lechuga', 'tomate', 'cebolla', 'pepinillos', 'salsa de tomate', 'mostaza', 'mayonesa', 'pan de hamburguesa']
ingredient_prices = {
    'carne de res': 2.50,
    'carne de pollo': 2.00,
    'queso cheddar': 1.50,
    'queso feta': 2.00,
    'lechuga': 0.50,
    'tomate': 0.50,
    'cebolla': 0.50,
    'pepinillos': 0.50,
    'salsa de tomate': 0.75,
    'mostaza': 0.75,
    'mayonesa': 0.75,
    'pan de hamburguesa': 1.00,
    'bacon': 1.50,
    'huevo frito': 1.25,
    'cebolla caramelizada': 1.00,
    'aguacate': 1.50,
    'jalapeños': 0.75,
    'hongos': 1.00,
    'salsa barbacoa': 1.00,
    'salsa ranch': 1.00,
    'pimiento': 0.75,
    'queso suizo': 1.50,
    'queso azul': 2.00,
    'rúcula': 0.75,
    'salsa picante': 0.75,
    'cebolla morada': 0.75,
    'queso de cabra': 2.00,
    'piña': 1.00,
    'guacamole': 1.50
}

comentaris = [
    "The burger was juicy and flavorful, definitely worth trying!",
    "¡La hamburguesa estaba jugosa y llena de sabor, definitivamente vale la pena probarla!",
    "La hamburguesa estava sucosa i plena de sabor, definitivament val la pena provar-la!",
    "The cheeseburger was a bit overcooked, but still tasty.",
    "¡La cheeseburger estaba un poco cocida, pero aún así sabrosa!",
    "La cheeseburger estava una mica cuita, però encara saborosa.",
    "I loved the variety of toppings on the burger, it added so much flavor!",
    "¡Me encantó la variedad de ingredientes en la hamburguesa, añadió mucho sabor!",
    "Em va encantar la varietat d'ingredients a la hamburguesa, va afegir molt de sabor!",
    "The vegetarian burger option was surprisingly delicious.",
    "¡La opción de hamburguesa vegetariana estaba sorprendentemente deliciosa!",
    "L'opció de hamburguesa vegetariana estava sorprenentment deliciosa!",
    "The bacon on the bacon cheeseburger was perfectly crispy, just how I like it.",
    "¡El bacon en la bacon cheeseburger estaba perfectamente crujiente, justo como me gusta!",
    "El bacon a la bacon cheeseburger estava perfectament cruixent, just com m'agrada!",
    "The burger bun was a bit stale, but the patty made up for it.",
    "¡El pan de hamburguesa estaba un poco duro, pero la carne lo compensaba!",
    "El pa de hamburguesa estava una mica dur, però la carn ho compensava!",
    "The restaurant's signature burger was hands down the best I've ever had!",
    "¡La hamburguesa insignia del restaurante fue sin duda la mejor que he probado!",
    "La hamburguesa insígnia del restaurant va ser sens dubte la millor que he provat!",
    "The portion size of the burger was huge, I couldn't finish it all.",
    "¡El tamaño de la hamburguesa era enorme, no pude terminarla!",
    "La mida de la hamburguesa era enorme, no vaig poder acabar-la!",
    "I wish there were more vegetarian options on the menu, but the veggie burger was good.",
    "¡Ojalá hubiera más opciones vegetarianas en el menú, pero la hamburguesa vegetariana estaba buena!",
    "Ojalá hi hagués més opcions vegetarianes al menú, però la hamburguesa vegetariana estava bona!",
    "The burger was a bit greasy for my taste, but still enjoyable.",
    "¡La hamburguesa estaba un poco grasosa para mi gusto, pero aún así disfrutable!",
    "La hamburguesa estava una mica grassa pel meu gust, però encara agradable.",
    "The presentation of the burger was impressive, it looked as good as it tasted!",
    "¡La presentación de la hamburguesa fue impresionante, se veía tan bien como sabía!",
    "La presentació de la hamburguesa va ser impressionant, semblava tan bé com sabia!",
    "The burger joint's special sauce really made the burger stand out.",
    "¡La salsa especial del restaurante realmente destacaba la hamburguesa!",
    "La salsa especial del restaurant realment destacava la hamburguesa!",
    "The price of the burger was reasonable for the quality and size.",
    "¡El precio de la hamburguesa era razonable para la calidad y el tamaño!",
    "El preu de la hamburguesa era raonable per la qualitat i la mida!",
    "The burger patty was cooked to perfection, juicy and tender.",
    "¡La hamburguesa estaba cocinada a la perfección, jugosa y tierna!",
    "La hamburguesa estava cuinada a la perfecció, sucosa i tendra!",
    "I was disappointed with the lack of options for customizing my burger.",
    "¡Me decepcionó la falta de opciones para personalizar mi hamburguesa!",
    "Em va decebre la manca d'opcions per personalitzar la meva hamburguesa!",
    "The burger was nothing special, I've had better elsewhere.",
    "¡La hamburguesa no era nada especial, he probado mejores en otros lugares!",
    "La hamburguesa no era res d'especial, he provat millors en altres llocs!",
    "The restaurant's ambiance added to the overall burger experience.",
    "¡El ambiente del restaurante sumó a la experiencia general de la hamburguesa!",
    "L'ambient del restaurant va sumar a l'experiència general de la hamburguesa!",
    "The service was excellent, and the burger arrived promptly.",
    "¡El servicio fue excelente y la hamburguesa llegó rápidamente!",
    "El servei va ser excel·lent, i la hamburguesa va arribar ràpidament!",
    "I appreciated the option to substitute fries for a salad with my burger.",
    "¡Aprecié la opción de cambiar las papas fritas por una ensalada con mi hamburguesa!",
    "Vaig apreciar l'opció de canviar les patates fregides per una amanida amb la meva hamburguesa!",
    "The bun was soft and fresh, making every bite enjoyable.",
    "¡El pan era suave y fresco, haciendo que cada bocado fuera agradable!",
    "El pa era tou i fresc, fent que cada mos fos agradable!"
]

comandes = []
clients = []
productes = []
tot_beguda = []
tot_postre = []
tot_acompanyament = []
tot_hamburguesa = []

class Command(BaseCommand):
    help = 'Comando para crear datos ficticios'

    def handle(self, *args, **kwargs):
        # Tu lógica para crear datos ficticios aquí
        main()
        pass

# Generate fake employees
def generate_empleats(num_employees):
    for _ in range(num_employees):
        dni = str(fake.random_number(digits=7)) + fake.random_uppercase_letter()
        nom = fake.name()
        data_naix = fake.date_of_birth(minimum_age=18, maximum_age=65)
        data_contractacio = fake.date_between(start_date='-10y', end_date='today')
        sou = fake.random.uniform(900.00, 1500.00)
        carrec = random.choice(list(carrecs))
        Empleat.objects.create(dni=dni, nom=nom, data_naix=data_naix, data_contractacio=data_contractacio,
                               sou=sou, carrec=carrec)
    print("Empleats generats correctament")

def generate_ingredient():
    for ingredient_i, preu_i in ingredient_prices.items():
        Ingredient.objects.create(nom = ingredient_i, preu = preu_i)
    print("Ingredients generats correctament")

# Generate fake products
def generate_productes(num_products):
    for num in range(num_products):
        particio = num_products/5
        if  num < particio:  # 20% de hamburgesa
            nom = "Hamburguesa " + random.choice(adjetivos_hamburguesas)
            preu = random.uniform(6, 10)
            producte = Producte.objects.create(nom=nom, preu=round(preu, 2))
            generate_hamburguesa(producte.id)
        elif num < particio*2: # 20% de beguda
            nom = "Refresco " + random.choice(adjetivos_bebidas)
            preu = random.uniform(1, 3)
            producte = Producte.objects.create(nom=nom, preu=round(preu, 2))
            generate_beguda(producte.id)
        elif num < particio*3:  # 20% de acompañamient
            nom = "Acompañamiento " + random.choice(adjetivos_acompanyaments)
            preu = random.uniform(1, 4)
            producte = Producte.objects.create(nom=nom, preu=round(preu, 2))
            generate_acompanyament(producte.id)
        elif num < particio*4:  # 20% de postre
            nom = "Postre " + random.choice(adjetivos_postres)
            preu = random.uniform(2, 6)
            producte = Producte.objects.create(nom=nom, preu=round(preu, 2))
            generate_postre(producte.id)
        else: # Generar Menu
            tot_acompanyament = Acompanyament.objects.all()
            tot_hamburguesa = Hamburguesa.objects.all()
            tot_postre = Postre.objects.all()
            tot_beguda = Beguda.objects.all()
            nom = random.choice(nombres_menu)
            h = random.choice(tot_hamburguesa)
            a = random.choice(tot_acompanyament)
            b = random.choice(tot_beguda)
            p = random.choice(tot_postre)
            producte_h=Producte.objects.get(id=h.producte.id)
            producte_a=Producte.objects.get(id=a.producte.id)
            producte_b=Producte.objects.get(id=b.producte.id)
            producte_p=Producte.objects.get(id=p.producte.id)
            sum_preus = producte_h.preu + producte_a.preu + producte_b.preu + producte_p.preu
            preu_menu = sum_preus - sum_preus/5 # 20% de descompte
            producte = Producte.objects.create(nom=nom, preu=round(preu_menu, 2))
            generate_menu(producte.id, h, a, b, p, sum_preus)
    print("Productes generats correctament")
            
            
def generate_beguda(id):
    Beguda.objects.create(producte_id=id)

def generate_hamburguesa(id):
    ingredients = Ingredient.objects.order_by('?')[:random.randint(1, 8)]
    desc = fake.sentence(nb_words=6)
    hamb = Hamburguesa.objects.create(producte_id=id, descripcio = desc)
    hamb.ingredients_conte.set(ingredients)
    
def generate_acompanyament(id):
    desc = "Delicioso acompañamiento " + random.choice(["de", "con"]) + " " + random.choice(["patatas", "patatas fritas", "ensalada", "cebollas fritas", "nuggets de pollo", "alitas de pollo", "anillos de cebolla"]) + " " + random.choice(["crujientes", "frescas", "calientes", "sabrosas"]) + "."
    Acompanyament.objects.create(producte_id=id, descripcio = desc)

def generate_postre(id):
    desc = "Exquisito postre " + random.choice(["de", "con"]) + " " + random.choice(["chocolate", "fresas", "helado", "tarta", "bizcocho", "crema"]) + " " + random.choice(["frescas", "cremosas", "dulces", "suaves", "deliciosas"]) + "."
    Postre.objects.create(producte_id=id, descripcio = desc)

def generate_menu(id, h, a, b, p, sum_preus):
    Menu.objects.create(producte_id=id, suma_preus=sum_preus, hamburguesa=h, acompanyament=a, beguda=b, postre=p)
    

# Generate fake clients
# def generate_clients(num_clients):
#     for _ in range(num_clients):
#         # correu = fake.unique.email()
#         # nom = fake.name()
#         num_telefon = fake.random_number(digits=9, fix_len=True)
#         adreca = fake.address()
#         data_naix = fake.date_of_birth(minimum_age=18, maximum_age=90)
#         preferits = Producte.objects.order_by('?')[:random.randint(0, 5)]
#         client = Client.objects.create(
#             # correu=correu, 
#             # nom=nom, 
            
#             num_telefon=num_telefon, 
#             adreca=adreca,
#             data_naix=data_naix)
        
#         client.preferits.set(preferits)
#     print ('Fi proces creacio clients')

# Generate fake clients
def generate_clients(num_clients):
    for _ in range(num_clients):
        naive_datetime = fake.date_time_between(start_date='-2y', end_date='now')
        aware_datetime = timezone.make_aware(naive_datetime, timezone.get_current_timezone())

        is_active = choice([True, False])
        password = fake.password(length=10)
        username = fake.user_name() + str(randint(0, 1000))
        first_name = fake.first_name()
        last_name = fake.last_name()
        email = fake.email()
        date_joined = aware_datetime
        preferits = Producte.objects.order_by('?')[:random.randint(0, 5)]

        # Create Client object
        client = Client.objects.create(
            password = password,
            is_superuser = False,
            username=username,
            first_name=first_name,
            last_name=last_name,
            email=email,
            is_staff=False,  # Set to True if needed
            is_active=is_active,  # Set to False if needed
            date_joined=date_joined,
            # user_ptr_id=user.id,
            num_telefon = fake.random_number(digits=9, fix_len=True),
            adreca = fake.address(),
            data_naix = fake.date_of_birth(minimum_age=18, maximum_age=90)
            # Add other fields specific to Client if needed
        )
        # client.preferits.set(preferits)

    print ('Fi proces creacio clients')


def generate_comanda(num_comandes):

    today = timezone.now().date()
    
    one_day_ago = today - timezone.timedelta(days=1)

    E = Empleat.objects.all()
    C = Client.objects.all()
    for _ in range(num_comandes):

        hora_creacio = fake.date_time_between(start_date='-7d', end_date='now', tzinfo=timezone.get_current_timezone())

        # Generate random data for the Comanda
        data = fake.date()
        preu_total = 0; 
        # preu_total = 
        dni_processada = random.choice(E)
        username_client = random.choice(C)

        # Create a Comanda instance
        comanda = Comanda.objects.create(
            data=data,
            hora_creacio=hora_creacio,
            preu_total=preu_total,
            dni_processada=dni_processada,
            username_client=username_client
        )

        # Generate additional data for DeRecollida or ADomicili
        if random.choice([True, False]):
            if hora_creacio.date() <= one_day_ago:
                estat = EstatComandaRecollida.COMPLETADA
            else:
                estat = random.choice(list(EstatComandaRecollida))

            # estat = random.choice(list(EstatComandaRecollida))
            # hora_recollida = (datetime.now() + timedelta(hours=random.randint(1, 24))).time()
            DeRecollida.objects.create(comanda=comanda, hora_recollida=hora_creacio, estat = estat)
        else:
            if hora_creacio.date() <= one_day_ago:
                estat = EstatComandaADomicili.COMPLETADA
            else:
                estat = random.choice(list(EstatComandaADomicili))
            # estat = random.choice(list(EstatComandaADomicili))
            # hora_entrega = (datetime.now() + timedelta(hours=random.randint(1, 24))).time()
            adreca_lliurament = "Adreça " + str(random.randint(1, 100))
            dni_entrega = Empleat.objects.order_by('?').first()
            ADomicili.objects.create(
                comanda=comanda,
                hora_entrega=hora_creacio,
                adreca_lliurament=adreca_lliurament,
                dni_entrega=dni_entrega,
                estat = estat
            )
    print ('Fi proces creacio comanda')


def generate_valoracio(num_valoracions):
    global clients
    global productes
    for _ in range(num_valoracions):
        correu = random.choice(list(clients))
        id_prod = random.choice(list(productes))
        val = random.randint(0, 5)
        com = random.choice(list(comentaris))

        Valoracio.objects.create(correu_client = correu, producte_id = id_prod, valor = val, comentari = com)
    print ('Fi proces creacio valoracio')
    

def generate_a_domicili():
    hour = random.randint(8, 12 - 1)
    minute = random.randint(0, 59)
    second = random.randint(0, 59)

    id_com = random(Comanda.objects.all())
    hora = datetime.time(hour, minute, second)
    adreca = fake.address()
    dni_ent = random(Empleat.objects.filter(carrec='Transport'))
    ADomicili.objects.create(comanda_id = id_com, hora_entrega = hora, adreca_lliurament = adreca, dni_entrega = dni_ent)
    print ('Fi proces creacio a domicili')
    

def generate_de_recollida():
    hour = random.randint(8, 12 - 1) 
    minute = random.randint(0, 59)
    second = random.randint(0, 59)
    id_com = random(Comanda.objects.all())
    hora = datetime.time(hour, minute, second)
    DeRecollida.objects.create(comanda_id = id_com, hora_recollida = hora)
    print ('Fi proces creacio recollida')



def generate_item(comandes, rang1, rang2):
    for comanda in comandes:
        ite = random.randint(rang1, rang2)
        for _ in range(ite):
            quant_prod = random.randint(1, 6)
            producte = Producte.objects.order_by('?').first()
            Item.objects.create(quantitat_prod = quant_prod, preu_pagat_producte = 0, comanda_id = comanda.id, producte_id = producte.id)
    print ('Fi proces creacio items')
    
            

# def generate_propietat_old(rang1, rang2):
#     items = Item.objects.all()
#     for item in items: # iterador items
#         ite = random.randint(rang1, rang2)
#         preu_total_afegit_suplements = 0.0
#         for _ in range(ite): # iterador propietats
#             quant_prop = random.randint(0, item.quantitat_prod)
#             ingredients_suplement = Ingredient.objects.order_by('?')[:random.randint(0, 3)]
#             ingredients_descartat = Ingredient.objects.order_by('?')[:random.randint(0, 3)]
#             prop = Propietat.objects.create(quantitat_propietat = quant_prop, item_id = item.id)

#             prop.suplements.set(ingredients_suplement)
#             prop.descartats.set(ingredients_descartat)

#             #Calcul preu producte individual
#             for i in ingredients_suplement:
#                 preu_total_afegit_suplements += float(i.preu)
#             preu_pagat = float(item.producte.preu) + float(preu_total_afegit_suplements)
#             item.preu_pagat_producte = round(preu_pagat, 2)
#             item.save()
#             print(round(preu_pagat, 2))
            
#             #Calcul preu total de la comanda
#             (item.comanda).preu_total = round(float(item.comanda.preu_total) + float(preu_pagat) * item.quantitat_prod, 2) # calcular i assignar preu_total de comanda
#             (item.comanda).save()

def generate_propietat():
    items = Item.objects.all()
    for item in items:
        try:
            ham = Hamburguesa.objects.get(producte_id=item.producte.id)
            ingr = list(ham.ingredients_conte.all())
            
            ingredients_descartat = ingr[:random.randint(0, len(ingr) -1)] # un item pot tenir de 0 a 3 ing descarats
            ingredients_suplement = Ingredient.objects.order_by('?')[:random.randint(0, 3)] # un item pot tenir de 0 a 3 ing suplements
            quantitat_de_item = item.quantitat_prod
            prop = Propietat.objects.create(quantitat_propietat = quantitat_de_item, item_id = item.id)

            prop.suplements.set(ingredients_suplement)
            prop.descartats.set(ingredients_descartat)
            
            #Calcul preu producte individual
            preu_total_afegit_suplements = Decimal('0.0')
            for i in ingredients_suplement:
                preu_total_afegit_suplements += round(i.preu, 2)
            preu_pagat = round(item.producte.preu, 2) + round(preu_total_afegit_suplements, 2)
            item.preu_pagat_producte = round(preu_pagat, 2)
            item.save()
            # print(round(preu_pagat, 2))
            #Calcul preu total de la comanda
            (item.comanda).preu_total += round((item.comanda.preu_total) + round(preu_pagat) * item.quantitat_prod, 2) # calcular i assignar preu_total de comanda
            (item.comanda).save()

        except Hamburguesa.DoesNotExist:
            preu_pagat = round(item.producte.preu, 2)
            item.preu_pagat_producte = round(preu_pagat, 2)
            item.save()
            (item.comanda).preu_total += round(item.comanda.preu_total + round(preu_pagat) * item.quantitat_prod, 2) # calcular i assignar preu_total de comanda
            (item.comanda).save()
            continue
        
    print ('Fi proces creacio propietats')

# from decimal import Decimal
# from random import randint, sample
# from django.db import transaction

# def generate_propietat():
#     items = Item.objects.all()

#     # Obtener todos los ingredientes de una vez
#     all_ingredients = list(Ingredient.objects.all())

#     with transaction.atomic():
#         for item in items:
#             quantitat_de_item = item.quantitat_prod

#             # Obtener ingredientes descartados y suplementos de forma aleatoria
#             ingredients_descartat = sample(all_ingredients, randint(0, 3))
#             ingredients_suplement = sample(all_ingredients, randint(0, 3))

#             prop = Propietat.objects.create(quantitat_propietat=quantitat_de_item, item=item)

#             prop.suplements.set(ingredients_suplement)
#             prop.descartats.set(ingredients_descartat)

#             # Calcular precio total del producto individual
#             preu_total_afegit_suplements = sum(i.preu for i in ingredients_suplement)
#             preu_pagat = round(item.producte.preu + preu_total_afegit_suplements, 2)
#             item.preu_pagat_producte = preu_pagat

#             # Calcular precio total de la comanda
#             item.comanda.preu_total += round(preu_pagat * item.quantitat_prod, 2)
#             item.comanda.save()

#     print("Proceso de generación de propiedades completado.")


    # quant_prop = random.randint(1, quantitat_de_item) # una propietat pot tenir de 0 a quant item 
    # prop = Propietat.objects.create(quantitat_propietat = quant_prop, item_id = item.id)

    # prop.suplements.set(ingredients_suplement)
    # prop.descartats.set(ingredients_descartat)


def truncate_table(table_name):
    with connection.cursor() as cursor:
        cursor.execute("TRUNCATE TABLE {} CASCADE;".format(table_name))

def main():

    truncate_table("la_burguesa_client")
    truncate_table("auth_user")
    truncate_table("la_burguesa_producte")
    truncate_table("la_burguesa_empleat")
    truncate_table("la_burguesa_valoracio")
    truncate_table("la_burguesa_comanda")
    truncate_table("la_burguesa_ingredient")
    truncate_table("la_burguesa_item")
    truncate_table("la_burguesa_propietat")

    truncate_table("auth_user")

    num_clients = 20
    num_productes = 100 # divisibles de 5 millor
    num_empleats = 10
    num_comandes = 100

    generate_ingredient() # Va sense numero
    generate_empleats(num_empleats)
    generate_productes(num_productes)
    generate_clients(num_clients)
    
    global productes
    global clients
    productes = Producte.objects.values_list('id', flat=True)
    #clients = Client.objects.values_list('correu', flat=True)
    clients = Client.objects.all()
    comandes = Comanda.objects.all()

    generate_comanda(num_comandes)
    # generate_valoracio(num_clients)
    generate_item(comandes, 1, 4) # rang de items possibles per comanda
    generate_propietat()

# TODO: debugar el preu en propietat
# Id a valoracio generat automaticament pero no present al UML. Saber si en Jordi es queixara/baixara nota.
# Posar preu total de comanda a default 0. Quan es crea l'item es podra calcular el preu total. Abans no, ja que depen de ingredient descartat/suplement i item en si.



# OUTDATED

# def generate_ingredient_descartat():
#     for i in ingredient_prices:
#         ingredients = random.choice(list(ingredient_prices.keys())) # CREANT UNA PK AMB UN RANDOM (PERILL)
#         IngredientDescartat.objects.create(nom = ingredients)
    

# def generate_ingredient_supplement():
#     ing_pric = random.choice(list(ingredient_prices)) # CREANT UNA PK AMB UN RANDOM (PERILL)
#     ingredients = ing_pric
#     pre = ingredient_prices[ing_pric]
#     IngredientSuplement.objects.create(nom = ingredients, preu = pre)