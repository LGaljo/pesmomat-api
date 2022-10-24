import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MongoClient } from 'mongodb';
import { env } from '../../config/env';

@Injectable()
export class SyncService implements OnModuleInit {
  async onModuleInit() {
    await this.handleCron();
  }

  // @Cron(new Date(Date.now() + 1000))
  @Cron('0 */30 * * * *')
  async handleCron() {
    console.log('Start job ' + new Date().toISOString());
    await this.connectToDB();
  }

  private async connectToDB() {
    const remote = new MongoClient(env.MONGO2_URI);
    const client = new MongoClient(env.MONGO_URI);
    try {
      await remote.connect();
      await client.connect();

      for (const tName of ['songs', 'authors', 'categories']) {
        const docs = await remote.db().collection(tName).find({}).toArray();
        console.log(`Found ${docs.length} ${tName} to sync`);
        for (const doc of docs) {
          await client
            .db()
            .collection(tName)
            .updateOne({ _id: doc._id }, { $set: doc }, { upsert: true });
        }
      }

      console.log('Job completed ' + new Date().toISOString());
    } catch (e) {
      console.error(e);
    } finally {
      await remote.close();
    }
  }
}
