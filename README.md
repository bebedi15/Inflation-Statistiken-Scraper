# 📈 Inflation Statistiken Scraper

Dieses Skript überwacht eine Website auf Änderungen in den Inflationsstatistiken und benachrichtigt Sie über einen Discord-Webhook, wenn Änderungen festgestellt werden. Das Skript lädt außerdem das Bild herunter, das die Inflationsdaten visualisiert, und fügt es der Benachrichtigung hinzu.

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

2. Konfigurieren Sie die Discord-Webhook-URL, den Dateipfad für die gespeicherten Daten und die URL des Bilds, das Sie überwachen möchten, indem Sie die entsprechenden Variablen in der Datei ändern.

3. Führen Sie das Skript aus, indem Sie den folgenden Befehl in Ihrem Terminal ausführen:

    ```bash
    node index.js
    ```

4. Das Skript wird die Website auf Änderungen überwachen und Sie über den Discord-Webhook benachrichtigen, wenn eine Änderung festgestellt wird.

## 🤝 Beitrag

Wenn Sie Fehler finden oder Verbesserungsvorschläge haben, können Sie gerne ein Problem eröffnen oder einen Pull-Request erstellen, um zur Weiterentwicklung des Projekts beizutragen.

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert. Weitere Details finden Sie in der [LICENSE](LICENSE)-Datei.
