import Client from './Structures/Client';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client();

client.start(process.env.TOKEN!);
