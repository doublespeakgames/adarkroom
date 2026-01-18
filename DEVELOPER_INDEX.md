# A Dark Room - Developer Index

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [File Structure](#file-structure)
3. [Core Systems](#core-systems)
4. [Game Phases](#game-phases)
5. [State Management](#state-management)
6. [Event System](#event-system)
7. [How to Extend the Game](#how-to-extend-the-game)
8. [Common Patterns](#common-patterns)

---

## Architecture Overview

A Dark Room is an incremental/narrative game built with jQuery and vanilla JavaScript. The game follows a modular architecture with clear separation between:

- **Core Engine** (`engine.js`) - Initialization, save/load, module navigation
- **State Manager** (`state_manager.js`) - Centralized state with pub/sub
- **Event System** (`events.js`) - Random and scripted narrative events
- **Game Modules** - Room, Outside, Path, World, Ship, Space, Fabricator
- **UI Components** - Button, Header, Notifications

**Total codebase**: ~16,000 lines of JavaScript

---

## File Structure

```
/home/user/adarkroom/
├── index.html                 # Main entry point
├── script/                    # Core game logic (15,934 lines)
│   ├── engine.js             # Core game engine (943 lines)
│   ├── state_manager.js      # Global state management (440 lines)
│   ├── events.js             # Event framework (1,488 lines)
│   ├── Button.js             # UI button component (132 lines)
│   ├── room.js               # Room module - first phase (1,259 lines)
│   ├── outside.js            # Village module (665 lines)
│   ├── path.js               # Journey preparation (341 lines)
│   ├── world.js              # World exploration (1,109 lines)
│   ├── ship.js               # Spaceship module (177 lines)
│   ├── space.js              # Space flight minigame (631 lines)
│   ├── fabricator.js         # Alien tech crafting
│   ├── header.js             # Tab navigation (34 lines)
│   ├── notifications.js      # Message system (78 lines)
│   ├── audio.js              # Audio engine
│   ├── audioLibrary.js       # Audio asset definitions
│   ├── prestige.js           # New game+ system (103 lines)
│   ├── scoring.js            # Score tracking (34 lines)
│   ├── localization.js       # i18n support (69 lines)
│   └── events/               # Event definitions
│       ├── encounters.js     # Combat encounters (437 lines)
│       ├── room.js           # Room events (687 lines)
│       ├── outside.js        # Village events (297 lines)
│       ├── global.js         # Universal events (67 lines)
│       ├── setpieces.js      # Major story events (3,587 lines)
│       ├── executioner.js    # Endgame content (2,343 lines)
│       └── marketing.js      # Meta events (35 lines)
├── css/                       # Stylesheets
├── lang/                      # Localization (27 languages)
├── lib/                       # Third-party libraries
├── audio/                     # Audio assets
└── img/                       # Images
```

---

## Core Systems

### Engine (`script/engine.js`)

**Purpose**: Central game coordinator

**Key Functions**:
```javascript
Engine.init()                    // Bootstrap game
Engine.travelTo(module)          // Switch game areas
Engine.saveGame()                // Persist to localStorage
Engine.loadGame()                // Load from localStorage
Engine.setInterval(fn, delay)    // Timers with hyper mode
```

**Configuration**:
```javascript
Engine.options = {
  debug: false,
  log: false,
  doubleTime: false  // Hyper mode
}
```

### State Manager (`script/state_manager.js`)

**Purpose**: Centralized state container with validation and events

**State Structure**:
```javascript
State = {
  version: 1.3,
  features: {},     // Unlocked locations, capabilities
  stores: {},       // Resources, items, weapons
  character: {},    // Player stats, perks
  income: {},       // Passive resource generation
  game: {},         // Location state, world map, workers
  playStats: {},    // Metadata, achievements
  previous: {},     // Prestige data
  outfit: {},       // Current expedition loadout
  config: {}        // Settings
}
```

**API**:
```javascript
$SM.set(path, value)              // Set state
$SM.get(path, requestZero)        // Get state (with 0 fallback)
$SM.add(path, value)              // Increment numeric values
$SM.setM(parent, object)          // Batch set
$SM.addM(parent, object)          // Batch add
```

**Pub/Sub**: All state changes fire `'stateUpdate'` events that modules subscribe to

### Button Component (`script/Button.js`)

**Purpose**: Interactive button with cooldowns and costs

**Usage**:
```javascript
new Button.Button({
  id: 'myButton',
  text: 'Do Something',
  click: function() { /* handler */ },
  cooldown: 10,  // seconds
  cost: { 'wood': 5, 'fur': 2 }
}).appendTo(container);
```

---

## Game Phases

### 1. Room (`script/room.js`)
- **Starting module** - Player begins in dark room
- **Progression**: Light fire → builder arrives → gather wood → build traps → build huts
- **Transitions to Outside** when wood appears in stores
- **Key file**: `room.js:1-1259`

### 2. Outside (`script/outside.js`)
- **Village building** and resource management
- **Worker system**: Assign population to gather resources
- **Income collection**: Workers produce resources every N seconds
- **Key file**: `outside.js:1-665`

### 3. Path (`script/path.js`)
- **Expedition preparation** screen
- **Backpack management**: Select items to bring
- **Embark** → launches World module
- **Key file**: `path.js:1-341`

### 4. World (`script/world.js`)
- **Top-down exploration** on 60x60 procedural map
- **Movement**: WASD/Arrow keys
- **Resources**: Food/water consumed while traveling
- **Combat**: Random encounters with enemies
- **Landmarks**: Mines, towns, cities, crashed ship
- **Key file**: `world.js:1-1109`

### 5. Ship (`script/ship.js`)
- **Crashed alien starship**
- **Upgrade hull and thrusters** with alien alloy
- **Lift Off** → launches Space module
- **Key file**: `ship.js:1-177`

### 6. Space (`script/space.js`)
- **Arcade-style** asteroid dodging
- **Reach altitude 70** to escape
- **Win condition** → scoring and prestige
- **Key file**: `space.js:1-631`

### 7. Fabricator (`script/fabricator.js`)
- **Alien technology** crafting station
- **Advanced items**: energy blade, plasma rifle, kinetic armour
- **Blueprint system**: Some items require finding blueprints
- **Key file**: `fabricator.js:1-400+`

---

## State Management

### Reading State
```javascript
// Get with 0 fallback if undefined
var wood = $SM.get('stores.wood', true);

// Get nested
var huts = $SM.get('game.buildings.hut', true);
```

### Writing State
```javascript
// Set value
$SM.set('stores.wood', 100);

// Increment
$SM.add('stores.wood', 50);

// Batch operations
$SM.setM('stores', {
  wood: 10,
  fur: 5
});

// This triggers 'stateUpdate' event
```

### Subscribing to Updates
```javascript
// In your module
$.Dispatch('stateUpdate').subscribe(YourModule.handleStateUpdates);

// Handler
handleStateUpdates: function(category) {
  if(category == 'stores.wood') {
    // Update UI
  }
}
```

---

## Event System

### Event Structure

Events are defined in `script/events/*.js`:

```javascript
{
  title: _('Event Name'),
  isAvailable: function() {
    // Return true if event can trigger
    return $SM.get('features.location.outside');
  },
  scenes: {
    'start': {
      text: [_('narrative text')],
      notification: _('brief notification'),

      buttons: {
        'leave': {
          text: _('leave'),
          nextScene: 'end'
        },
        'investigate': {
          text: _('investigate'),
          cost: { 'torch': 1 },
          nextScene: { 0.5: 'win', 1.0: 'lose' }
        }
      }
    },

    'win': {
      text: [_('you found something!')],
      reward: { wood: 100 },
      loot: {
        'iron sword': { min: 1, max: 1, chance: 0.5 }
      },
      buttons: {
        'leave': { text: _('leave'), nextScene: 'end' }
      }
    }
  }
}
```

### Combat Events

```javascript
{
  title: _('beast'),
  scenes: {
    'start': {
      combat: true,
      enemy: 'beast',
      enemyName: _('snarling beast'),
      deathMessage: _('the snarling beast is dead'),
      chara: 'B',
      damage: 3,      // enemy damage
      hit: 0.8,       // enemy hit chance
      attackDelay: 1, // seconds between attacks
      health: 10,
      loot: {
        'fur': { min: 5, max: 10, chance: 1.0 },
        'meat': { min: 5, max: 10, chance: 1.0 }
      }
    }
  }
}
```

---

## How to Extend the Game

### Adding a New Resource

1. **Add to State** (`state_manager.js:14-50`):
```javascript
// Add to CATEGORIES.stores
stores: {
  wood: 0,
  // ... existing resources
  'new resource': 0  // Add this
}
```

2. **Add to Room Craftables** (`room.js:600-800`):
```javascript
Room.Craftables = {
  // ... existing craftables
  'new item': {
    button: null,
    maximum: 0,
    availableMsg: _('a new item can be crafted'),
    buildMsg: _('new item built'),
    maxMsg: _('new item at max'),
    type: 'tool',  // or 'building', 'weapon', 'upgrade'
    cost: function() {
      return {
        'wood': 100,
        'new resource': 10
      };
    },
    build: function() {
      $SM.add('stores["new item"]', 1);
    }
  }
}
```

3. **Update UI** - Button appears automatically when available

### Adding a New Worker Type

In `outside.js:100-250`:

```javascript
Outside._INCOME = {
  // ... existing workers
  'new worker': {
    delay: 10,  // seconds per cycle
    stores: {
      'new resource': 1  // produces 1 per cycle
    }
  }
}
```

### Adding a New Event

In `script/events/outside.js` (or relevant event file):

```javascript
{
  title: _('my new event'),
  isAvailable: function() {
    return $SM.get('stores.wood') > 100;
  },
  scenes: {
    'start': {
      text: [
        _('you encounter something interesting.')
      ],
      notification: _('a stranger arrives'),
      buttons: {
        'greet': {
          text: _('greet them'),
          cost: { 'fur': 5 },
          reward: { 'wood': 50 },
          nextScene: 'end'
        },
        'ignore': {
          text: _('ignore them'),
          nextScene: 'end'
        }
      }
    },
    'end': {
      text: [_('the stranger leaves')],
      buttons: {
        'leave': {
          text: _('leave'),
          nextScene: 'end'
        }
      }
    }
  }
}
```

### Adding a New Weapon

In `world.js:1600-1800`:

```javascript
World.Weapons = {
  // ... existing weapons
  'new weapon': {
    verb: _('slash'),
    type: 'melee',  // or 'ranged'
    damage: 15,
    cooldown: 3,    // seconds
    cost: { 'bullets': 1 }  // optional, for ranged
  }
}
```

### Adding a New Landmark

In `world.js:100-300`:

```javascript
World.LANDMARKS = [
  // ... existing landmarks
  {
    scene: 'newLandmark',
    num: 1,
    minRadius: 15,
    maxRadius: 25,
    tile: 'N',  // single character for map
    label: _('new location')
  }
];
```

Then add event in `script/events/setpieces.js`:

```javascript
Events.Setpieces['newLandmark'] = {
  title: _('New Location'),
  scenes: {
    'start': {
      text: [_('you discover a new location')],
      // ... rest of event definition
    }
  }
}
```

### Adding a New Perk

In `world.js` combat system:

```javascript
// Add to character perks
$SM.setM('character.perks', {
  'new perk': true
});

// Check in combat calculations
var damage = baseDamage;
if($SM.hasPerk('new perk')) {
  damage *= 1.5;
}
```

---

## Common Patterns

### Feature Unlocking
```javascript
// Unlock a feature
$SM.set('features.location.newArea', true);

// Check if unlocked
if($SM.get('features.location.newArea')) {
  // Initialize new area
}
```

### Conditional UI Display
```javascript
// In module init
if($SM.get('stores.wood') > 100) {
  this.showAdvancedOptions();
}

// Subscribe to updates
handleStateUpdates: function(category) {
  if(category == 'stores.wood' &&
     $SM.get('stores.wood') > 100) {
    this.showAdvancedOptions();
  }
}
```

### Resource Costs
```javascript
// Check affordability
var cost = { wood: 50, fur: 10 };
var canAfford = true;

for(var resource in cost) {
  if($SM.get('stores["' + resource + '"]', true) < cost[resource]) {
    canAfford = false;
    break;
  }
}

// Deduct resources
if(canAfford) {
  for(var resource in cost) {
    $SM.add('stores["' + resource + '"]', -cost[resource]);
  }
}
```

### Notifications
```javascript
// Notify in current module
Notifications.notify(Room, _('something happened'));

// Will appear in scrolling message log
```

### Audio
```javascript
// Play sound effect
AudioEngine.playSound(AudioLibrary.EVENT_NOMADIC);

// Play music
AudioEngine.playBackgroundMusic(AudioLibrary.MUSIC_ROOM);
```

### Localization
```javascript
// Wrap all user-facing strings
var text = _('hello world');

// Add to lang/en/strings.js
'hello world': 'hello world',

// Translators override in their language files
```

---

## Key Files Reference

- **Core**: `engine.js:1-943`, `state_manager.js:1-440`
- **Events**: `events.js:1-1488`
- **Room Phase**: `room.js:1-1259`
- **Village Phase**: `outside.js:1-665`
- **World Exploration**: `world.js:1-1109`
- **Combat Encounters**: `events/encounters.js:1-437`
- **Story Events**: `events/setpieces.js:1-3587`
- **Endgame**: `events/executioner.js:1-2343`

---

## Debugging

Enable debug mode:
```javascript
Engine.options.debug = true;
Engine.options.log = true;
```

Inspect state:
```javascript
// In console
console.log(State);
console.log($SM.get('stores'));
```

View saved game:
```javascript
// In console
localStorage.gameState
```

---

## Architecture Principles

1. **Separation of Concerns**: Each module handles one game phase
2. **Event-Driven**: State changes trigger UI updates via pub/sub
3. **Data-Driven**: Events, craftables, and weapons defined as data
4. **Progressive Disclosure**: Features unlock based on state
5. **Auto-Save**: Every state change persists to localStorage

---

## Summary

To add new content:
- **Resources**: Add to `State.stores`
- **Buildings**: Add to `Room.Craftables` or module craftables
- **Workers**: Add to `Outside._INCOME`
- **Events**: Add to appropriate event file in `script/events/`
- **Weapons**: Add to `World.Weapons`
- **Landmarks**: Add to `World.LANDMARKS` + event in setpieces

The game's modular architecture makes it straightforward to extend. Follow existing patterns, use the State Manager for all data, and leverage the pub/sub system for UI reactivity.
