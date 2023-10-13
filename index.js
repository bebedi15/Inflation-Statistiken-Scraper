const axios = require('axios');
const cheerio = require('cheerio');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const DISCORD_WEBHOOK_URL = 'WEEBHOOK_URL_HIER';
const DATA_FILE_PATH = 'data.json';
const IMAGE_URL = 'https://www.mehrwertsteuerrechner.de/wp-content/uploads/inflation/Inflation-Deutschland.png';
const IMAGE_PATH = 'image.png';

async function scrapeWebsite() {
  try {
    const url = 'https://www.destatis.de/DE/Themen/Wirtschaft/Preise/Verbraucherpreisindex/_inhalt.html';
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const inflationData = {
      Inflationsrate: '',
      VerbraucherpreiseEnergie: '',
      VerbraucherpreiseNahrungsmittel: '',
    };

    const targetElements = $('.c-stat__link');

    targetElements.each((index, element) => {
      const text = $(element).text().trim();
      if (text.includes('Inflations­rate')) {
        const matches = text.match(/\+\s*(\d+,\d+)\s*%/);
        if (matches) {
          inflationData.Inflationsrate = `+${matches[1]}`;
        }
      } else if (text.includes('Verbraucherpreise Energie')) {
        const matches = text.match(/(\d+,\d+)\s*%/);
        if (matches) {
          inflationData.VerbraucherpreiseEnergie = `${matches[1]}`;
        }
      } else if (text.includes('Verbraucherpreise Nahrungsmittel')) {
        const matches = text.match(/(\d+,\d+)\s*%/);
        if (matches) {
          inflationData.VerbraucherpreiseNahrungsmittel = `${matches[1]}`;
        }
      }
    });

    // Save the extracted data to the data.json file

    // Check for changes and send a message to Discord
    const oldData = JSON.parse(fs.readFileSync(DATA_FILE_PATH, 'utf8'));

    const hasChanged =
      Object.keys(oldData).length === 0 || JSON.stringify(oldData) !== JSON.stringify(inflationData);

    if (hasChanged) {
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(inflationData), 'utf8');
      const imageResponse = await axios.get(IMAGE_URL, { responseType: 'stream' });
      const imagePath = path.join(__dirname, IMAGE_PATH);

      const imageFile = fs.createWriteStream(imagePath);
      imageResponse.data.pipe(imageFile);

      await new Promise((resolve, reject) => {
        imageFile.on('finish', resolve);
        imageFile.on('error', reject);
      });

      const message = {
        content: 'Es gab eine Änderung in den Daten:',
        embeds: [
          {
            title: 'Neue Daten',
            description: `**Inflationsrate (vorläufig):** \`${inflationData.Inflationsrate || 'Nicht gefunden'}\`\n**Verbraucherpreise Energie:** \`${inflationData.VerbraucherpreiseEnergie || 'Nicht gefunden'}\`\n**Verbraucherpreise Nahrungsmittel:** \`${inflationData.VerbraucherpreiseNahrungsmittel || 'Nicht gefunden'}\` \n\r [Quelle](https://www.destatis.de/DE/Themen/Wirtschaft/Preise/Verbraucherpreisindex/_inhalt.html)`,
            color: 0x00ff00,
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

function startScraping() {
  console.log('Programm wird gestartet...');
  scrapeWebsite();

  cron.schedule('*/01 * * * *', () => {
    console.log('Scraper wird alle 30 Minuten ausgeführt...');
    scrapeWebsite();
  });
}

startScraping();
