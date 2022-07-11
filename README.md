# Jovo Community Plugin - Badgerific

![logo](logo.svg)

## Overview

This plugin for the [Jovo Framework](https://github.com/jovotech/jovo-framework) allows you to add badges and achievements to your games and apps using the [Badgerific](https://github.com/rmtuckerphx/badgerific#readme) library.

## Supports

- Jovo Framework 4.x
- Platforms: any (alexa, googleAssistant, core, web, etc.)
- Requires a [Database Integration](https://www.jovo.tech/docs/databases) for user data storage.

## RIDR Lifecycle

This plugin is registered as part of the `dialogue.start` [middleware](https://www.jovo.tech/docs/middlewares#ridr-middlewares) and is meant to be used in component handlers and hooks after that point. By this time the user's data is loaded from the configured database integration.

If you will use any of the `$badges` callbacks, add a hook for the `after.dialogue.start` middleware.

The badges data is set on user data during the `before.response.start` middleware so that it will be auto saved to storage on `response.start`.


## Install

Install the plugin into your Jovo project:

`npm install @jovo-community/plugin-badgerific --save`

Register the plugin in:

app.js:

```javascript
const { BadgerificPlugin, BadgerificInitData } = require('@jovo-community/plugin-badgerific');
const badgeRules = require('./badgeRules.json');

const app = new App({
  plugins: [
    new BadgerificPlugin({
      onInit: (jovo: Jovo) => {
        console.log('BadgerificPlugin:onInit');
        return {
          timeZone: 'America/Phoenix',
          rules: badgeRules,
        } as BadgerificInitData;
      },
    })    
  ],
});
```

app.ts:

```typescript
import { BadgerificPlugin, BadgerificInitData } from '@jovo-community/plugin-badgerific';
import badgeRules from './badgeRules.json';

const app = new App({
  plugins: [
    new BadgerificPlugin({
      onInit: (jovo: Jovo) => {
        console.log('BadgerificPlugin:onInit');
        return {
          timeZone: 'America/Phoenix',
          rules: badgeRules,
        } as BadgerificInitData;
      },
    })    
  ],
});
```

## Plugin Configuration

The plugin has the following values:

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| userStorageKey | string | "badgerific" | Required. The key is used with `this.$user.data` to store the badges data. |
| autoSession | boolean | true | Required. When `true`, automatically calls `$badges.startSession()` and `$badges.endSession()` to match the platform session. |
| onInit | function | | Required. Allows you to set the `timeZone` and `rules` and is called during the `dialogue.start` middleware. A callback allows you to use the [Time Zone Plugin](https://www.jovo.tech/marketplace/plugin-timezone) to determine the timezone or to get the rules from a [CMS plugin](https://www.jovo.tech/docs/cms). |

## Usage

This plugin allows for easier usage of the [Badgerific](https://github.com/rmtuckerphx/badgerific#readme) library with Jovo v4 by using the `this.$badges`.

Badgerific has callbacks that you can use. Define these in `app.js` or `app.ts` with a hook:

```ts
import { GameEndReason, ReadonlyBadgeProperties, ReadonlyEarnedBadge } from 'badgerific';

app.hook('after.dialogue.start', (jovo: Jovo): void => {
  
  // onBadgeEarned
  jovo.$badges.onBadgeEarned = (badge: ReadonlyEarnedBadge) => {
    console.log('onBadgeEarned');
  };

  // onNewTimePeriod
  jovo.$badges.onNewTimePeriod = (
    props: ReadonlyBadgeProperties,
    systemProps: ReadonlyBadgeProperties,
  ) => {
    console.log('onNewTimePeriod');

    if (systemProps.isNewDay) {
      jovo.$badges.setValue('dailyWins', 0, true);
    }
  };

  // onSessionStart
  jovo.$badges.onSessionStart = (
    props: ReadonlyBadgeProperties,
    systemProps: ReadonlyBadgeProperties
  ) => {
    console.log('onSessionStart');
  };

  // onSessionEnd
  jovo.$badges.onSessionEnd = (
    props: ReadonlyBadgeProperties,
    systemProps: ReadonlyBadgeProperties
  ) => {
    console.log('onSessionEnd');
  };

  // onGameStart
  jovo.$badges.onGameStart = (
    props: ReadonlyBadgeProperties,
    systemProps: ReadonlyBadgeProperties
  ) => {
    console.log('onGameStart');
  };
  
  // onGameEnd
  jovo.$badges.onGameEnd = (
    props: ReadonlyBadgeProperties,
    systemProps: ReadonlyBadgeProperties,
    reason: GameEndReason,
  ) => {
    console.log('onGameEnd');

    if (reason === GameEndReason.Win) {
      jovo.$badges.addValue('dailyWins', 1, true);
    }
  };
});
```

# License

MIT