import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mqtt from 'mqtt';

@Injectable()
export class MqttService implements OnModuleInit {
  private readonly logger = new Logger(MqttService.name);
  private client: mqtt.MqttClient;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.connect();
  }

  private connect() {
    const host = this.configService.get<string>('MQTT_HOST', '10.214.238.38');
    const port = this.configService.get<number>('MQTT_PORT', 1883);
    const topic = this.configService.get<string>('MQTT_TOPIC', 'bresil/entrepot1/mesures');

    const url = `mqtt://${host}:${port}`;

    this.client = mqtt.connect(url);

    this.client.on('connect', () => {
      this.client.subscribe(topic, (err) => {
        if (!err) {
          this.logger.log(`Subscribed to topic: ${topic}`);
        } else {
          this.logger.error(`Failed to subscribe to ${topic}`, err.stack);
        }
      });
    });

    this.client.on('message', (topic, message) => {
      this.handleMessage(topic, message.toString());
    });

    this.client.on('error', (err) => {
      this.logger.error('MQTT connection error', err.stack);
    });
  }

  private handleMessage(topic: string, payload: string) {
    try {
      const data = JSON.parse(payload);
      this.logger.log(data);

      // TODO: Save to database and trigger alerting logic

    } catch (e) {
      this.logger.error(`Failed to parse MQTT message: ${payload}`, e.stack);
    }
  }
}
