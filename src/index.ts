import { Badges } from 'badgerific';
import { BadgerificPluginConfig, BadgerificPlugin } from './BadgerificPlugin';

declare module '@jovotech/framework/dist/types/Extensible' {
  interface ExtensiblePluginConfig {
    BadgerificPlugin?: BadgerificPluginConfig;
  }

  interface ExtensiblePlugins {
    BadgerificPlugin?: BadgerificPlugin;
  }
}

declare module '@jovotech/framework/dist/types/Jovo' {
  interface Jovo {
    $badges: Badges;
  }
}

export * from './BadgerificPlugin'
