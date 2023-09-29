<div align='center'>
  <img src='https://img.shields.io/badge/License-MIT-blue.svg'>
  <a href="https://linksta.cc/@Bebedi"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png"></a>
</div>

# 📈 Inflation Statistiken Scraper

Dieses Skript überwacht auf Änderungen in den Deutschen Inflationsstatistiken und benachrichtigt Sie über einen Discord-Webhook, wenn Änderungen festgestellt werden. Das Skript schickt außerdem das Bild, das die Inflationsdaten visualisiert, und fügt es der Benachrichtigung hinzu.

![Image Downloader logo](https://i.imgur.com/fwbveCp.png)

## 📋 Voraussetzungen

- Node.js installiert
- Die folgenden Node.js-Pakete installiert:
  - axios
  - cheerio
  - node-cron
  - fs
  - path

## 🛠️ Installation

1. Stellen Sie sicher, dass Node.js auf Ihrem System installiert ist. Sie können Node.js von [nodejs.org](https://nodejs.org/) herunterladen und installieren.

2. Klonen Sie dieses Repository auf Ihren Computer oder laden Sie es herunter.

3. Navigieren Sie in Ihrem Terminal oder Ihrer Befehlszeile zum Verzeichnis des geklonten Projekts.

4. Installieren Sie die erforderlichen Node.js-Pakete, indem Sie den folgenden Befehl ausführen:

    ```bash
    npm install
    ```

## 💻 Verwendung

1. Öffnen Sie die `index.js`-Datei in einem Texteditor Ihrer Wahl.

2. Fügen Sie die Discord Webhook URL in die ```const DISCORD_WEBHOOK_URL``` Variable

3. Führen Sie das Skript aus, indem Sie den folgenden Befehl in Ihrem Terminal ausführen:

    ```bash
    node index.js
    ```

4. Das Skript wird die Website auf Änderungen überwachen und Sie über den Discord-Webhook benachrichtigen, wenn eine Änderung festgestellt wird.

## 😓 Hilfe

**Bei hilfe mich kontaktieren! Discord: "Bebedi"**

## 🤝 Beitrag

Wenn Sie Fehler finden oder Verbesserungsvorschläge haben, können Sie gerne ein Problem eröffnen oder einen Pull-Request erstellen, um zur Weiterentwicklung des Projekts beizutragen.

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert. Weitere Details finden Sie in der [LICENSE](LICENSE)-Datei.
