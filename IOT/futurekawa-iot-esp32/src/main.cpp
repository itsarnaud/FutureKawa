#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <time.h>

// Configuration WiFi
const char* ssid = "Damien's Galaxy S22";
const char* password = "arreteunpeu";

// Configuration MQTT
const char* mqtt_server = "10.214.238.38";
const int mqtt_port = 1883;
const char* mqtt_topic = "bresil/entrepot1/mesures";

// Configuration DHT11
#define DHTPIN 2        // GPIO2 = D4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Clients
WiFiClient espClient;
PubSubClient client(espClient);

// Variables
unsigned long lastMsg = 0;
const long interval = 10000; // 10 secondes pour tester

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connexion au WiFi: ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connecté");
  Serial.print("Adresse IP: ");
  Serial.println(WiFi.localIP());
}

void setup_time() {
  // Configurer NTP pour obtenir l'heure exacte
  configTime(0, 0, "pool.ntp.org", "time.nist.gov");
  
  Serial.print("Synchronisation de l'heure... ");
  time_t now = time(nullptr);
  int retries = 0;
  
  while (now < 24 * 3600 && retries < 20) {
    delay(500);
    Serial.print(".");
    now = time(nullptr);
    retries++;
  }
  
  Serial.println();
  Serial.print("Heure actuelle: ");
  Serial.println(ctime(&now));
}

String get_iso8601_time() {
  time_t now = time(nullptr);
  struct tm* timeinfo = localtime(&now);
  
  char buffer[25];
  strftime(buffer, sizeof(buffer), "%Y-%m-%dT%H:%M:%SZ", timeinfo);
  
  return String(buffer);
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Connexion au broker MQTT...");
    if (client.connect("ESP8266-Bresil-Entrepot1")) {
      Serial.println("connecté");
    } else {
      Serial.print("échec, rc=");
      Serial.print(client.state());
      Serial.println(" nouvelle tentative dans 5s");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  dht.begin();
  setup_wifi();
  setup_time();  // Ajouter cette ligne
  client.setServer(mqtt_server, mqtt_port);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long now_ms = millis();
  if (now_ms - lastMsg > interval) {
    lastMsg = now_ms;

    // Lecture du capteur
    float temp = dht.readTemperature();
    float hum = dht.readHumidity();

    // Vérification des lectures
    if (isnan(temp) || isnan(hum)) {
      Serial.println("Erreur de lecture du capteur DHT!");
      return;
    }

    // Affichage dans le moniteur série
    Serial.print("Température: ");
    Serial.print(temp);
    Serial.print("°C | Humidité: ");
    Serial.print(hum);
    Serial.println("%");

    // Obtenir l'heure ISO 8601
    String iso_time = get_iso8601_time();

    // Construction du payload JSON
    char payload[200];
    snprintf(payload, sizeof(payload), 
             "{\"temperature\":%.1f,\"humidite\":%.1f,\"timestamp\":\"%s\"}", 
             temp, hum, iso_time.c_str());

    // Publication MQTT
    if (client.publish(mqtt_topic, payload, false)) {
      Serial.print("Message publié: ");
      Serial.println(payload);
    } else {
      Serial.println("Échec de publication");
    }
  }
}