# sailReservations
Aplikacja służy do rezerwacji żaglówek. Użytkownicy mogą przeglądać dostępne łódki, dokonywać rezerwacji oraz zarządzać swoimi rezerwacjami. Administrator ma możliwość dodawania, edytowania i usuwania łódek oraz przeglądania wszystkich rezerwacji.

System zostal zaprojektowany jako w pelni skonteneryzowane srodowisko deweloperskie. Konfiguracja w pliku docker-compose.yml zapewnia automatyczne instalowanie zaleznosci, synchronizacje kodu na zywo (hot-reloading) oraz trwalosc danych.

## 1. Wymagania wstepne
Aby uruchomic aplikacje, na komputerze hosta musza byc zainstalowane jedynie:
- Docker Desktop (lub Docker Engine + Docker Compose).
- Git (do pobrania repozytorium).
Node.js nie jest wymagany lokalnie – srodowisko uruchamia sie wewnatrz kontenerow.

## 2. Instalacja i uruchomienie
Proces uruchomienia sklada sie z dwoch krokow:
### Pobranie kodu
git clone https://github.com/maciejbikprz/Aplikacje-Webowe-Rezerwacje
cd Aplikacje-Webowe-Rezerwacje

### Uruchomienie kontenerow
W glownym katalogu projektu wykonaj polecenie:
docker compose up -d --build

## 3. Dostep do uslug
| Usluga | Adres URL | Port kontenera | Opis |
| :--- | :--- | :--- | :--- |
| Frontend | http://localhost:5173 | 5173 | Glowny interfejs (React/Vite) |
| Backend API | http://localhost:3001 | 3001 | API Serwera |
| Baza danych GUI | http://localhost:8080 | 80 | phpMyAdmin |

## 4. Konfiguracja Bazy Danych
Parametry polaczenia zdefiniowane w docker-compose.yml:
- Host: localhost (z zewnatrz) lub mysql_db (wewnatrz sieci Docker)
- Port: 3306
- Database Name: mydatabase
- User: user
- Password: password
- Root Password: root_password

## 5. Instrukcja obslugi aplikacji
### Scenariusz A: Uzytkownik (Klient)
1. Wejdz na strone http://localhost:5173.
2. Przejdz do zakladki "Przegladaj lodzie" lub kliknij "Szczegoly".
3. Zaloguj sie na konto testowe:
   - Login: john.doe@example.com
   - Haslo: admin123
4. Wybierz zakres dat w kalendarzu i potwierdz przyciskiem "Confirm Reservation".
5. Zarzadzaj rezerwacjami w zakladce "Moje rezerwacje".

### Scenariusz B: Administrator
1. Zaloguj sie danymi administratora:
   - Login: admin@admin
   - Haslo: admin123
2. Po zalogowaniu wybierz z menu "Admin Panel".
3. Dostepe funkcje:
   - Manage Boats: Dodawanie, edycja i usuwanie lodzi.
   - View Reservations: Podglad wszystkich rezerwacji w systemie.
