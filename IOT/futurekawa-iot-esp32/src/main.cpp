#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

// Configuration WiFi
const char* ssid = "Damien's Galaxy S22";
const char* password = "arreteunpeu";

// Configuration MQTT
const char* mqtt_server = "10.214.238.38";
const int mqtt_port = 1883;
const char* mqtt_topic = "bresil/entrepot1/mesures";

// Configuration DHT11
#define DHTPIN 2        // GPIO2 = D4 sur notre carte
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Clients
WiFiClient espClient;
PubSubClient client(espClient);

// Variables
unsigned long lastMsg = 0;
const long interval = 10000; // 5 minutes

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

void reconnect() {
  while (!client.connected()) {
    Serial.print("Connexion au broker MQTT...");
    if (client.connect("ESP32-Bresil-Entrepot1")) {
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
  client.setServer(mqtt_server, mqtt_port);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long now = millis();
  if (now - lastMsg > interval) {
    lastMsg = now;

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

    // Construction du payload JSON
    char payload[200];
    snprintf(payload, sizeof(payload), 
             "{\"temperature\":%.1f,\"humidite\":%.1f,\"timestamp\":\"%lu\"}", 
             temp, hum, now);

    // Publication MQTT
    if (client.publish(mqtt_topic, payload, false)) {
      Serial.println("Message publié avec succès");
    } else {
      Serial.println("Échec de publication");
    }
  }
}