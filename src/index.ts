import express from 'express';
import { connectToRabbitMQ } from './rabbitmq';
import { simulateSmsSending, Contact } from './smsSender';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const RABBITMQ_QUEUE = process.env.RABBITMQ_QUEUE || 'contact_queue';

const startConsumer = async () => {
  const channel = await connectToRabbitMQ();

  const PREFETCH_COUNT = 50; 
  await channel.prefetch(PREFETCH_COUNT);

  channel.consume(
    RABBITMQ_QUEUE,
    async (msg) => {
      if (msg !== null) {
        try {
          const contact: Contact = JSON.parse(msg.content.toString());
          await simulateSmsSending(contact);
          channel.ack(msg);
        } catch (error) {
          console.error('Error processing message:', error);
          channel.nack(msg, false, false);
        }
      }
    },
    {
      noAck: false,
    }
  );
};

startConsumer().catch((error) => {
  console.error('Error starting consumer:', error);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});