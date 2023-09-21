import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MongoClient } from 'mongodb';
import { env } from '../../config/env';
import { SongsService } from '../songs/songs.service';

@Injectable()
export class SyncService implements OnModuleInit {
  private readonly logger = new Logger(SyncService.name);
  constructor(private readonly songsService: SongsService) {}

  async onModuleInit() {
    if (env.SYNC_ENABLED) {
      await this.handleCron(false);
    }
  }

  @Cron('0 */30 * * * *')
  async handleCron(override: boolean) {
    if (env.SYNC_ENABLED || override) {
      let amount = 0;
      this.logger.log('Start job ' + new Date().toISOString());
      // await this.runImport();
      amount += await this.syncStats();
      // await this.saveLastRun(amount);
      this.logger.log('Job completed ' + new Date().toISOString());
    }
  }

  private async runImport() {
    let amount = 0;
    const client = new MongoClient(env.MONGO_URI);
    const remote = new MongoClient(env.MONGO2_URI);
    try {
      await client.connect();
      await remote.connect();

      const sids = new Set();
      for (const tName of ['categories', 'authors', 'songs']) {
        const docs = await remote.db().collection(tName).find({}).toArray();
        this.logger.log(`Found ${docs.length} ${tName} to sync`);
        amount += docs.length;

        for (const doc of docs) {
          if (tName === 'songs') {
            const prev = await client
              .db()
              .collection('songs')
              .findOne({ _id: doc._id });

            // Has content changed?
            if (!prev || doc?.content !== prev?.content) {
              this.logger.debug('Song new or updated - recreating');
              sids.add(doc?._id);
            }

            // Does media file exists?
            if (!this.songsService.ttsExists(doc?._id)) {
              this.logger.debug('MP3 does not exists - recreating');
              sids.add(doc?._id);
            }
          }
          await client
            .db()
            .collection(tName)
            .updateOne({ _id: doc._id }, { $set: doc }, { upsert: true });
        }
      }

      const promises = [];
      for (const sid of sids) {
        promises.push(this.songsService.tts(sid, null));
      }

      await Promise.all(promises);
    } catch (e) {
      console.error(e);
    } finally {
      await remote.close();
    }
    return amount;
  }

  private async syncStats() {
    const client = new MongoClient(env.MONGO_URI);
    const remote = new MongoClient(env.MONGO2_URI);
    let amount = 0;

    try {
      await client.connect();
      await remote.connect();
      const lastRunRes = await client
        .db()
        .collection('sync')
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      const lastRun = lastRunRes[0]?.createdAt ?? new Date('2021-01-01');

      const stats = await client
        .db()
        .collection('stats')
        .find({ createdAt: { $gt: lastRun } })
        .toArray();

      amount += stats.length;

      await remote.db().collection('stats').insertMany(stats);

      console.log(stats);
    } catch (e) {
      console.error(e);
    } finally {
      await remote.close();
    }
    return amount;
  }

  private async saveLastRun(amount: number) {
    const client = new MongoClient(env.MONGO_URI);
    try {
      await client.connect();
      await client
        .db()
        .collection('sync')
        .insertOne({ createdAt: new Date(), amount });
    } catch (e) {
      console.error(e);
    }
  }
}
