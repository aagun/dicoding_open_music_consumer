require("dotenv").config();
const amqp = require("amqplib");
const MailSender = require("./MailSender");
const Listener = require("./Listener");
const playlistsService = require("./PlaylistsService");

const init = async () => {
  const mailSender = new MailSender();
  const playlistsService = new PlaylistsService();
  const listener = new Listener(mailSender, playlistsService);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue("export:playlist", {
    durable: true,
  });

  channel.consume("export:playlist", listener.listen, { noAck: true });
};

init();
