import {
  Extensible,
  PluginConfig,
  Plugin,
  HandleRequest,
  InvalidParentError,
  Jovo,
} from '@jovotech/framework';
import { Badges, Rule } from 'badgerific';

export interface BadgerificInitData {
  timeZone: string;
  rules: Rule[]
}

export interface BadgerificPluginConfig extends PluginConfig {
  userStorageKey: string;
  autoSession: boolean;
  onInit?: (jovo: Jovo) => BadgerificInitData | Promise<BadgerificInitData>;
}

export class BadgerificPlugin extends Plugin<BadgerificPluginConfig> {
  config: any;
  mount(parent: Extensible): Promise<void> | void {
    if (!(parent instanceof HandleRequest)) {
      throw new InvalidParentError(this.constructor.name, HandleRequest);
    }

    parent.middlewareCollection.use('dialogue.start', async (jovo: Jovo) => {
      let tz = 'UTC';
      let rules: Rule[] = [];

      if (this.config.onInit) {
        const initData: BadgerificInitData = await this.config.onInit(jovo);
        tz = initData.timeZone;          
        rules = initData.rules;
      }

      jovo.$badges = new Badges(rules, tz);

      const defaultData = {
        systemProps: {},
        props: {},
        periods: {},
        earned: [],
        bookmarks: {}
    };

      const badgeData = jovo.$user.data[this.config.userStorageKey] ?? defaultData;
      jovo.$badges.setData(badgeData);

      if (this.config.autoSession && jovo.$session.isNew) {
        jovo.$badges.startSession();
      }
    });


    parent.middlewareCollection.use('before.response.start', (jovo: Jovo) => {
       const listen = jovo.$output[jovo.$output.length - 1]?.listen ?? true;
      
      if (this.config.autoSession && !listen) {
        jovo.$badges.endSession();
      }

      const badgeData = jovo.$badges.toJson();
      jovo.$user.data[this.config.userStorageKey] = badgeData;
    });

  }

  getDefaultConfig(): BadgerificPluginConfig {
    return {
      userStorageKey: 'badgerific',
      autoSession: true,
    };
  }
}
