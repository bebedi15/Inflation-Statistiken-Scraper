const axios = require('axios');
const cheerio = require('cheerio');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const DISCORD_WEBHOOK_URL = 'https://ptb.discord.com/api/webhooks/1157061675908870257/_BBuUHyQxF2jrVVF23vQui22jv3H7B6JxWbhd_Hk9zSnby4Dfwt33pJN0juhcxaN5DLY';
const DATA_FILE_PATH = 'data.json';
const IMAGE_URL = 'https://www.mehrwertsteuerrechner.de/wp-content/uploads/inflation/Inflation-Deutschland.png';
const IMAGE_PATH = 'image.png';

// Diese Funktion wird am Programmstart aufgerufen, um die Daten zurückzusetzen
function resetData() {
  fs.unlinkSync(DATA_FILE_PATH); // Löscht die Datei, falls sie existiert
  fs.writeFileSync(DATA_FILE_PATH, '{}', 'utf8'); // Erstellt eine leere Datei
}

// Funktion zum Scrapen der Website und Extrahieren der Texte
async function scrapeWebsite() {
  try {
    const url = 'https://www.destatis.de/DE/Themen/Wirtschaft/Preise/Verbraucherpreisindex/_inhalt.html';
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const targetElements = $('.c-stat__link');

    const newData = {};

    targetElements.each((index, element) => {
      const text = $(element).text().trim();
      const matches = text.match(/\+\s*(\d+,\d+)\s*%/); // Regulärer Ausdruck zum Extrahieren der Zahlen mit Komma
      if (matches) {
        newData[`Daten ${index + 1}`] = `+${matches[1]}`;
      }
    });

    // Laden der alten Daten, wenn vorhanden
    let oldData = {};
    if (fs.existsSync(DATA_FILE_PATH)) {
      oldData = JSON.parse(fs.readFileSync(DATA_FILE_PATH, 'utf8'));
    }

    // Vergleich der alten und neuen Daten
    const hasChanged = Object.keys(oldData).length === 0 || JSON.stringify(oldData) !== JSON.stringify(newData);

    if (hasChanged) {
      // Speichern der neuen Daten
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(newData), 'utf8');

      // Herunterladen und Speichern des Bilds
      const imageResponse = await axios.get(IMAGE_URL, { responseType: 'stream' });
      const imagePath = path.join(__dirname, IMAGE_PATH);

      const imageFile = fs.createWriteStream(imagePath);
      imageResponse.data.pipe(imageFile);

      await new Promise((resolve, reject) => {
        imageFile.on('finish', resolve);
        imageFile.on('error', reject);
      });

      // Benachrichtigung über Discord-Webhook senden
      const message = {
        content: 'Es gab eine Änderung in den Daten:',
        embeds: [
          {
            title: 'Neue Daten',
            description: `**Inflationsrate (vorläufig):** \`${newData['Daten 1'] || 'Nicht gefunden'}\`\n**Verbraucherpreise Energie:** \`${newData['Daten 2'] || 'Nicht gefunden'}\`\n**Verbraucherpreise Nahrungsmittel:** \`${newData['Daten 3'] || 'Nicht gefunden'}\` \n\r [Quelle](https://www.destatis.de/DE/Themen/Wirtschaft/Preise/Verbraucherpreisindex/_inhalt.html)`,
            color: 0x00ff00, // Grün
            image: {
              url: `attachment://${IMAGE_PATH}`,
            },
          },
        ],
      };

      const formData = new FormData();
      formData.append('payload_json', JSON.stringify(message));
      formData.append('file', fs.createReadStream(imagePath));

      const requestOptions = {
        method: 'POST',
        headers: {
          ...formData.getHeaders(),
        },
        data: formData,
        url: DISCORD_WEBHOOK_URL,
      };

      const response = await axios(requestOptions);

      console.log('Nachricht an Discord-Webhook gesendet.');
    } else {
      console.log('Keine Änderung in den Daten festgestellt.');
    }
  } catch (error) {
    console.error('Fehler beim Scrapen der Website:', error);
  }
}

// Diese Funktion wird am Programmstart und dann alle 30 Minuten aufgerufen
function startScraping() {
  console.log('Programm wird gestartet...');
  resetData(); // Daten zurücksetzen
  scrapeWebsite();
  
  cron.schedule('*/30 * * * *', () => {
    console.log('Scraper wird alle 30 Minuten ausgeführt...');
    scrapeWebsite();
  });
}

// Programm starten
startScraping();
