import fs from 'fs';
import path from 'path';

import Discord from 'discord.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Command from './Command';
import Event from './Event';
import Process from './Process';

const intents = new Discord.Intents(['GUILDS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_VOICE_STATES']);

class Client extends Discord.Client {
  readonly prefix: string;
  commands: Discord.Collection<string, Command>;
  timers: Discord.Collection<string, NodeJS.Timer>;

  constructor() {
    super({ intents });
    this.prefix = process.env.PREFIX!;
    this.commands = new Discord.Collection();
    this.timers = new Discord.Collection();
  }

  start(token: string) {
    // Initializing text commands
    const commandFiles = fs
      .readdirSync(path.join(__dirname, '..', 'Commands'))
      .filter((file) => /^.+(\.ts|\.js)$/.test(file));
    const commands: Command[] = commandFiles.map((file) => require(`../Commands/${file}`));

    commands.forEach((cmd) => {
      console.log(`Command ${cmd.name} loaded`);
      this.commands.set(cmd.name, cmd);
    });

    // Initialization slash commands
    const slashCommands = commands
      .filter((cmd) => ['BOTH', 'SLASH'].includes(cmd.type))
      .map((cmd) => ({
        name: cmd.name.toLowerCase(),
        description: cmd.description,
        permissions: [],
        options: cmd.slashCommandOptions,
        defaultPermission: true,
      }));

    this.removeAllListeners();

    // Ready event
    this.on('ready', async () => {
      try {
        await mongoose.connect(<string>process.env.MONGOOSE_URI);
        console.log('Successfully connected to MongoDB!');
      } catch (err) {
        console.log('Unable to connect to DB:', err);
      }

      const guild = this.guilds.cache.get(process.env.GUILD_ID ?? '');
      const cmds = guild
        ? await guild.commands.set(slashCommands)
        : await this.application?.commands.set(slashCommands);

      cmds?.forEach((cmd) => console.log(`Slash Command ${cmd.name} registered`));
    });

    // Initialization events
    fs.readdirSync(path.join(__dirname, '..', 'Events'))
      .filter((file) => /^.+(\.ts|\.js)$/.test(file))
      .forEach((file) => {
        const eventObj: Event<keyof Discord.ClientEvents> = require(`../Events/${file}`);
        console.log(`Event ${eventObj.event} loaded`);
        this.on(eventObj.event, eventObj.run.bind(null, this));
      });

    // Initializing startup processes
    fs.readdirSync(path.join(__dirname, '..', 'Processes'))
      .filter((file) => /^.+(\.ts|\.js)$/.test(file))
      .forEach((file) => {
        const process: Process = require(`../Processes/${file}`);
        console.log(`Process ${file} initialized`);
        process.run(this);
      });

    this.login(token);
  }
}

export default Client;
