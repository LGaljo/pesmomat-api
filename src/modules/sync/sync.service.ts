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
      this.logger.log('Start job ' + new Date().toISOString());
      let amount = await this.runImport();
      amount += await this.syncStats();
      await this.saveLastRun(amount);
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
            const prevDoc = await client
              .db()
              .collection('songs')
              .findOne({ _id: doc._id });

            for (const content of doc.contents) {
              // Has content changed?
              const prev = prevDoc.contents.find(
                (d: any) => d.lang === content.lang,
              );
              if (!prev || content?.content !== prev?.content) {
                this.logger.debug('Song new or updated - recreating');
                sids.add({
                  id: doc?._id.toHexString(),
                  lang: content?.lang,
                });
              }

              // Does media file exists?
              if (
                !this.songsService.ttsExists(doc?._id.toHexString(), {
                  language: content?.lang,
                })
              ) {
                this.logger.debug('MP3 does not exists - recreating');
                sids.add({
                  id: doc?._id.toHexString(),
                  lang: content?.lang,
                });
              }
            }
          }
          await client
            .db()
            .collection(tName)
            .updateOne({ _id: doc._id }, { $set: doc }, { upsert: true });
        }

        this.logger.log(`Syncing ${tName} finished`);
      }

      const promises = [];
      for (const sid of sids) {
        promises.push(
          this.songsService.tts((sid as any)?._id, (sid as any)?.lang),
        );
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

    this.logger.log('Start syncing stats');

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

      if (stats.length) {
        await remote.db().collection('stats').insertMany(stats);
      } else {
        this.logger.log('No stats to sync');
      }
    } catch (e) {
      console.error(e);
    } finally {
      await remote.close();
      this.logger.log('Finish syncing stats');
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
