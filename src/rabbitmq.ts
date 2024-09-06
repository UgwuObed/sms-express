import amqplib, { Connection, Channel } from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const RABBITMQ_HOST = process.env.RABBITMQ_HOST || 'localhost';
const RABBITMQ_PORT = parseInt(process.env.RABBITMQ_PORT || '5672');
const RABBITMQ_USER = process.env.RABBITMQ_USER || 'guest';
const RABBITMQ_PASSWORD = process.env.RABBITMQ_PASSWORD || 'guest';
const RABBITMQ_QUEUE = process.env.RABBITMQ_QUEUE || 'contact_queue';

let channel: Channel;

export const connectToRabbitMQ = async (): Promise<Channel> => {
  if (channel) return channel;

  try {
    const connection: Connection = await amqplib.connect({
      hostname: RABBITMQ_HOST,
      port: RABBITMQ_PORT,
      username: RABBITMQ_USER,
      password: RABBITMQ_PASSWORD,
    });

    channel = await connection.createChannel();
    await channel.assertQueue(RABBITMQ_QUEUE, { durable: true });

    console.log('Connected to RabbitMQ');
    return channel;
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
    throw error;
  }
};
