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

To use the callbacks for `$badges`, add a hook for the `after.dialogue.start` middleware. See [Callbacks](#callbacks).

The badges data is set on `this.$user.data` during the `before.response.start` middleware so that it will be auto saved to storage on `response.start`.


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

## Configuration

The plugin has the following values:

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| userStorageKey | string | "badgerific" | Required. The key is used with `this.$user.data` to store the badges data. |
| autoSession | boolean | true | Required. When `true`, automatically calls `$badges.startSession()` and `$badges.endSession()` to match the platform session. |
| onInit | function | | Required. Allows you to set the `timeZone` and `rules` and is called during the `dialogue.start` middleware. A callback allows you to execute code to set the values. For example, you can use the [Time Zone Plugin](https://www.jovo.tech/marketplace/plugin-timezone) to determine the timezone or get the rules from a [CMS plugin](https://www.jovo.tech/docs/cms). |

## Usage

This plugin allows for easier usage of the [Badgerific](https://github.com/rmtuckerphx/badgerific#readme) library with Jovo v4 by using the `this.$badges`.

### Create Rules

Rules are contained in a JSON array: 

```json
[
  {
      "id": "b01",
      "description": "First game started",
      "active": true,
      "max": 1,
      "updatePeriod": "GLOBAL",
      "condition": "system.isNewGame && system.lifetimeGames == 1"
  }
]
```


Learn more about creating rules [here](https://github.com/rmtuckerphx/badgerific#rules). A list of sample rules can be found [here](https://github.com/rmtuckerphx/badgerific/blob/main/docs/RULES.md).

### Custom Properties

Set custom properties in handlers and hooks like this:

```ts
this.$badges.setValue('prop1', 1);
this.$badges.setValue('prop2', true);
this.$badges.setValue('prop3', 'test');

this.$badges.addValue('prop4');
this.$badges.addValue('prop5', 1);
this.$badges.addValue('prop6', 2);

this.$badges.subtractValue('prop7');
this.$badges.subtractValue('prop8', 1);
this.$badges.subtractValue('prop9', 2);
```

### Get Earned Badges

Examples of getting list of earned badges:

```ts
// changing a property value
const earned = this.$badges.setValue('prop1', 'test');
const earned = this.$badges.addValue('prop2');
const earned = this.$badges.subtractValue('prop3');

// start/end session
const earned = this.$badges.startSession('prop3');
const earned = this.$badges.endSession('prop3');

// start/end game
const earned = this.$badges.startGame('prop3');
const earned = this.$badges.endGame('prop3', GameEndReason.Win);

// all badges earned
const earned = this.$badges.getEarnedBadges();

// all or current year, month, week, day, hour, session, game
const earned = this.$badges.getEarnedBadges(Period.Game); 

// since a given UTC time
const earned = this.$badges.getEarnedBadgesSince('2022-07-11T04:45:52.815Z');

// since a bookmark
this.$badges.setBookmark('mark1');
const earned = this.$badges.getEarnedBadgesSinceBookmark('mark1');
```


### Callbacks

Badgerific has callbacks that you can use. Define these in `app.js` or `app.ts` with a hook. The best middleware to do this is `after.dialogue.start`:

```ts
import { GameEndReason, ReadonlyBadgeProperties, ReadonlyEarnedBadge } from 'badgerific';

app.hook('after.dialogue.start', (jovo: Jovo): void => {
  
  // onBadgeEarned
  jovo.$badges.onBadgeEarned = (badge: ReadonlyEarnedBadge) => {
    console.log('Badgerific:onBadgeEarned');
  };

  // onNewTimePeriod
  jovo.$badges.onNewTimePeriod = (
    props: ReadonlyBadgeProperties,
    systemProps: ReadonlyBadgeProperties,
  ) => {
    console.log('Badgerific:onNewTimePeriod');

    if (systemProps.isNewDay) {
      jovo.$badges.setValue('dailyWins', 0, true);
    }
  };

  // onSessionStart
  jovo.$badges.onSessionStart = (
    props: ReadonlyBadgeProperties,
    systemProps: ReadonlyBadgeProperties
  ) => {
    console.log('Badgerific:onSessionStart');
  };

  // onSessionEnd
  jovo.$badges.onSessionEnd = (
    props: ReadonlyBadgeProperties,
    systemProps: ReadonlyBadgeProperties
  ) => {
    console.log('Badgerific:onSessionEnd');
  };

  // onGameStart
  jovo.$badges.onGameStart = (
    props: ReadonlyBadgeProperties,
    systemProps: ReadonlyBadgeProperties
  ) => {
    console.log('Badgerific:onGameStart');
  };
  
  // onGameEnd
  jovo.$badges.onGameEnd = (
    props: ReadonlyBadgeProperties,
    systemProps: ReadonlyBadgeProperties,
    reason: GameEndReason,
  ) => {
    console.log('Badgerific:onGameEnd');

    if (reason === GameEndReason.Win) {
      jovo.$badges.addValue('dailyWins', 1, true);
    }
  };
});
```
## Jovo Debugger
If using the Jovo Debugger, you must add `$badges` to the list of properties the debugger ignores:

```ts
// app.dev.ts

new JovoDebugger({
  ignoredProperties: ['$app', '$handleRequest', '$platform', '$badges'],
}),
```

# License

MIT