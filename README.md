# coffee-machine-app
Coffee Machine Application
# Technology Stack
## Backend Layer: Nest.js
## Frontend Layer: Vue.js
# Analiza
Podczas analizowania rozwiązania wysunąłem następujące główne założenia co do docelowego działania aplikacji
#### 1. Jako Firma powinniśmy kontrolować ile mamy instancji maszyn do kawy -> architektura klient-zdalny serwer jest tutaj logiczna
#### 2. Urządzenie posiadać będzie wewnętrzną pamięć ulotną po jej restarcie -> warstwa backendowa utrzymuje swój stan za pomocą danych w pamięci
#### 3. Urządzenie powinno umożliwiać:
###### 3.1 Zlecanie realizacji zamówienia na kawę
###### 3.2 Udostępniać dane diagnostyczne i jego stanie technicznym
###### 3.3 Posiadać wewnętrzny mechanizm utrzymujący urządzenie w stabilnym stanie poprzez kontrolne czyszczenie
###### 3.4 Lista możliwych przepisów na kawę będzie utrzymywana po stronie pamięci wewnętrznej urządzenia -> konfiguracja trzymana w pliku
###### 3.5 Urządzenie powinno mieć zbiór konfigurowalnych parametrów -> plik z konfiguracją ładowany podczas startu urządzenia
###### 3.6 Urządzenie umożliwia pobranie listy przepisów przez klienta przeglądarkowego
###### Punkt 3.1, 3.2 oraz 3.6 realizowany został przez wystawienie REST API dla klienta
#### 4. Aby urealistycznić wykonywanie zlecenia wprowadzono do aplikacji sztuczne opóźnienie w czasie przygotowywania kawy

#### 5. Podczas implementacji modelu założyłem istnienie następujących bytów:
###### 5.1. Zlecenie wykonania kawy
###### 5.2. Przepis na kawę
###### 5.3. Status urządzenia
###### Powyższe byty mają odzwierciedlenie w modelu aplikacji

#### 6. W urządzeniu założyłem istnieje następujących modułów:
###### 6.1 Moduł do realizacji zamówienia na kawę
###### 6.2 Moduł odpowiedzialny za pojemnik z wodą
###### 6.3 Moduł odpowiedzialny za pojemnik z ziarnami kawy
###### 6.4 Moduł odpowiedzialny za pojemnik na zużytą kawę
###### 6.5 Moduł odpowiedzialny za dostarczanie mleka do kawy
###### 6.6 Moduł odpowiedzialny za utrzymywanie czystości technicznej urządzenia
###### Wszystkie powyższe moduły mają odzwierciedlenie w serwisach w warstwie backendowej aplikacji

#### 7. Z perspektywy użytkownika powinny być dostępne dwa ekrany/widoki
###### 7.1 Widok głowny z listą możliwych kaw do realizacji
###### 7.2 Widok diagnostyczny z statusem technicznym urządzenia

# Do realizacji/dokończenia w aplikacji
## Test e2e dla operacji pobierania listy przepisów na kawę
## Aplikacja frontend po zamówieniu na kawę powinna monitorować status zlecenia, użycie WebWorkera do aktualizacji stanu urządzenia po stronie aplikacji Frontend
## Refactor po stronie Frontendowej m.in. adres do REST API Backendu, refactor ogólny kodu
## Opcjonalne wprowadzenie opóźnień czasowych w serwisach odpowiedzialnych za pobieranie ziaren kawy, wody oraz mleka
## Poprawki estetyczne warstwy Frontend
