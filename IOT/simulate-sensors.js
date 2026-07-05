#!/usr/bin/env node
/**
 * IoT sensor simulator.
 *
 * Publishes MQTT readings on the same topics/payload shape as the real
 * ESP32/DHT11 firmware (see futurekawa-iot-esp32/src/main.cpp), so the
 * backend, alerting pipeline and frontend can be exercised end-to-end in
 * tests/CI or local demos without any physical hardware (cahier des
 * charges §6 / §12).
 *
 * Usage:
 *   node IOT/simulate-sensors.js                 # publish forever, one reading per country every 5s
 *   node IOT/simulate-sensors.js --once           # publish a single reading per country, then exit
 *   node IOT/simulate-sensors.js --count=10       # publish 10 readings per country, then exit
 *   node IOT/simulate-sensors.js --interval=1000  # override the delay between readings (ms)
 *   node IOT/simulate-sensors.js --anomaly        # force out-of-range values (to trigger alerts)
 *   node IOT/simulate-sensors.js --country=bresil # only simulate one country
 *
 * Broker URLs default to the ports docker-compose publishes on localhost;
 * override with MQTT_URL_BR / MQTT_URL_EC / MQTT_URL_CO for other setups.
 */

const mqtt = require('mqtt');

const COUNTRIES = [
  {
    code: 'bresil',
    warehouse: 'entrepot1',
    url: process.env.MQTT_URL_BR || 'mqtt://localhost:1883',
    tempIdeal: 29,
    humidityIdeal: 55,
  },
  {
    code: 'equateur',
    warehouse: 'entrepot1',
    url: process.env.MQTT_URL_EC || 'mqtt://localhost:1884',
    tempIdeal: 31,
    humidityIdeal: 60,
  },
  {
    code: 'colombie',
    warehouse: 'entrepot1',
    url: process.env.MQTT_URL_CO || 'mqtt://localhost:1885',
    tempIdeal: 26,
    humidityIdeal: 80,
  },
];

function parseArgs(argv) {
  const args = { once: false, count: undefined, interval: 5000, anomaly: false, country: undefined };
  for (const raw of argv) {
    if (raw === '--once') args.once = true;
    else if (raw === '--anomaly') args.anomaly = true;
    else if (raw.startsWith('--count=')) args.count = Number(raw.split('=')[1]);
    else if (raw.startsWith('--interval=')) args.interval = Number(raw.split('=')[1]);
    else if (raw.startsWith('--country=')) args.country = raw.split('=')[1];
  }
  return args;
}

function randomInRange(min, max) {
  return Math.round((min + Math.random() * (max - min)) * 10) / 10;
}

function buildReading(country, forceAnomaly) {
  const isAnomaly = forceAnomaly || Math.random() < 0.1;
  const temperature = isAnomaly
    ? randomInRange(country.tempIdeal + 5, country.tempIdeal + 15)
    : randomInRange(country.tempIdeal - 2, country.tempIdeal + 2);
  const humidite = isAnomaly
    ? randomInRange(country.humidityIdeal + 8, country.humidityIdeal + 20)
    : randomInRange(country.humidityIdeal - 2, country.humidityIdeal + 2);

  return {
    temperature,
    humidite,
    timestamp: new Date().toISOString(),
  };
}

async function publishOnce(client, topic, country, anomaly) {
  const reading = buildReading(country, anomaly);
  await new Promise((resolve, reject) => {
    client.publish(topic, JSON.stringify(reading), { qos: 1 }, (err) => (err ? reject(err) : resolve()));
  });
  console.log(`[${country.code}] -> ${topic} :: ${JSON.stringify(reading)}`);
}

async function run() {
  const args = parseArgs(process.argv.slice(2));
  const targets = args.country ? COUNTRIES.filter((c) => c.code === args.country) : COUNTRIES;

  if (targets.length === 0) {
    console.error(`Unknown --country value. Expected one of: ${COUNTRIES.map((c) => c.code).join(', ')}`);
    process.exit(1);
  }

  const clients = targets.map((country) => ({
    country,
    topic: `${country.code}/${country.warehouse}/mesures`,
    client: mqtt.connect(country.url),
  }));

  await Promise.all(
    clients.map(
      ({ client, country }) =>
        new Promise((resolve, reject) => {
          client.on('connect', () => {
            console.log(`[${country.code}] connected to ${client.options.href ?? country.code}`);
            resolve();
          });
          client.on('error', reject);
        }),
    ),
  );

  const iterations = args.once ? 1 : args.count;
  let published = 0;

  const publishRound = async () => {
    for (const { client, topic, country } of clients) {
      await publishOnce(client, topic, country, args.anomaly);
    }
    published += 1;
  };

  await publishRound();

  if (iterations && published >= iterations) {
    clients.forEach(({ client }) => client.end());
    return;
  }

  if (args.once) {
    clients.forEach(({ client }) => client.end());
    return;
  }

  const interval = setInterval(async () => {
    await publishRound();
    if (iterations && published >= iterations) {
      clearInterval(interval);
      clients.forEach(({ client }) => client.end());
    }
  }, args.interval);
}

run().catch((err) => {
  console.error('Simulation failed:', err);
  process.exit(1);
});
