import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MongoClient } from 'mongodb';
import { env } from '../../config/env';

@Injectable()
export class SyncService {
  // @Cron(new Date(Date.now() + 1000))
  @Cron('0 */30 * * * *')
  async handleCron() {
    console.log('Start job ' + new Date().toISOString());
    await this.connectToDB();
  }

  private async connectToDB() {
    const client = new MongoClient(env.MONGO_URI);
    const client2 = new MongoClient(env.MONGO2_URI);
    try {
      await client.connect();
      await client2.connect();

      for (const tName of ['songs', 'authors', 'categories']) {
        const docs = await client.db().collection(tName).find({}).toArray();
        console.log(`Found ${docs.length} ${tName} to sync`);
        for (const doc of docs) {
          await client2
            .db()
            .collection(tName)
            .updateOne({ _id: doc._id }, { $set: doc }, { upsert: true });
        }
      }

      console.log('Job completed ' + new Date().toISOString());
    } catch (e) {
      console.error(e);
    } finally {
      await client.close();
    }
  }
}
