# Wix Backend Setup - Quiz Data Opvangen

## Stap 1: Wix Developer Mode Activeren

1. Open je Wix website editor
2. Klik op **Dev Mode** (rechtsboven) of druk op **Ctrl+Shift+D** (Windows) / **Cmd+Shift+D** (Mac)
3. Klik op **Turn on Dev Mode**

## Stap 2: HTTP Function Aanmaken

1. In de Developer Console (onderkant scherm), klik op **Backend** tab
2. Klik op het **+** icoon
3. Selecteer **New Web Module** > **http-functions.js**
4. Een nieuw bestand `http-functions.js` wordt aangemaakt in de `backend` map

## Stap 3: Code Toevoegen aan http-functions.js

Kopieer de code uit het bestand `wix-http-function.js` naar je Wix `http-functions.js` bestand.

## Stap 4: Database Collection Aanmaken

1. Klik in het linkermenu op **CMS** (Database icoon)
2. Klik op **+ Add a Collection**
3. Naam de collection: **QuizResponses**
4. Voeg de volgende velden toe:

   | Veld Naam   | Type   | Required |
   |-------------|--------|----------|
   | voornaam    | Text   | Ja       |
   | achternaam  | Text   | Ja       |
   | email       | Text   | Ja       |
   | telefoon    | Text   | Ja       |
   | situatie    | Text   | Ja       |
   | gevoel      | Text   | Ja       |
   | omgang      | Text   | Ja       |
   | wens        | Text   | Ja       |
   | timestamp   | Date   | Ja       |

5. Klik op **Create**

## Stap 5: Permissions Instellen

1. Selecteer de **QuizResponses** collection
2. Klik op **Permissions** (slotje icoon)
3. Stel in:
   - **Who can read?** → Site members (of Admin alleen)
   - **Who can create?** → Anyone (zodat de HTTP function kan schrijven)
   - **Who can update?** → Admin
   - **Who can delete?** → Admin

## Stap 6: Website URL Aanpassen

1. Open je `index.html` bestand
2. Zoek naar deze regel:
   ```javascript
   const WIX_ENDPOINT = 'https://JOUW-SITE.wixsite.com/_functions/saveQuizData';
   ```
3. Vervang `JOUW-SITE.wixsite.com` met je werkelijke Wix site URL

**LET OP:** Als je site gepubliceerd is op een custom domein, gebruik dan dat domein:
```javascript
const WIX_ENDPOINT = 'https://www.ruimteomtespreken.nl/_functions/saveQuizData';
```

## Stap 7: Testen

1. Publiceer je Wix site
2. Test de quiz op je website
3. Controleer of de data binnenkomt in je CMS > QuizResponses collection

## Data Bekijken

1. Ga naar je Wix dashboard
2. Klik op **CMS** in het linkermenu
3. Selecteer **QuizResponses**
4. Hier zie je alle inzendingen met alle velden

## Export Mogelijkheden

Je kunt de data exporteren naar:
- CSV bestand (voor Excel/Google Sheets)
- JSON bestand
- Direct verbinden met andere tools via Wix Integrations

## Troubleshooting

**Data komt niet binnen?**
- Check of Dev Mode aan staat
- Controleer de URL in index.html
- Kijk in de browser console (F12) voor foutmeldingen
- Controleer of de collection bestaat en de juiste naam heeft

**CORS errors?**
- Zorg dat je Wix site gepubliceerd is
- Test op de gepubliceerde URL, niet lokaal

**Velden niet gevuld?**
- Controleer of de veldnamen exact matchen (hoofdlettergevoelig)
