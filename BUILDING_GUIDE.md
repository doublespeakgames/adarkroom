# How to Build on A Dark Room

This guide provides practical examples and patterns for extending A Dark Room.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Simple Extensions](#simple-extensions)
3. [Intermediate Extensions](#intermediate-extensions)
4. [Advanced Extensions](#advanced-extensions)
5. [Best Practices](#best-practices)
6. [Testing Your Changes](#testing-your-changes)

---

## Getting Started

### Development Setup

1. **Clone the repository**
2. **Open `index.html` in a browser** - No build process needed!
3. **Enable debug mode** in browser console:
   ```javascript
   Engine.options.debug = true;
   Engine.options.log = true;
   ```
4. **Open DevTools** to see logs and inspect state

### Understanding the Flow

Every feature follows this pattern:
1. **Data** → Add to State Manager
2. **Logic** → Add to module (room.js, outside.js, etc.)
3. **UI** → Create buttons/display with Button.js
4. **Events** → Optional narrative content

---

## Simple Extensions

### Example 1: Add a New Resource and Craftable

Let's add a "rope" resource and a "fishing rod" tool.

**Step 1: Add resource to State** (`state_manager.js`)

```javascript
// Around line 20, in the stores object:
stores: {
  wood: 0,
  fur: 0,
  meat: 0,
  // ... existing resources
  rope: 0,  // ADD THIS
  'fishing rod': 0  // ADD THIS
}
```

**Step 2: Add craftable to Room** (`room.js`)

Find `Room.Craftables` (around line 600) and add:

```javascript
Room.Craftables = {
  // ... existing craftables

  'rope': {
    button: null,
    maximum: 0,
    availableMsg: _('the rope is strong and useful'),
    buildMsg: _('rope threaded'),
    maxMsg: _('can\'t make any more rope'),
    type: 'tool',
    cost: function() {
      return {
        'fur': 2  // 2 fur to make 1 rope
      };
    },
    build: function() {
      $SM.add('stores.rope', 1);
    }
  },

  'fishing rod': {
    button: null,
    maximum: 1,  // Can only build 1
    availableMsg: _('the fishing rod will help catch food'),
    buildMsg: _('fishing rod crafted'),
    maxMsg: _('fishing rod already built'),
    type: 'tool',
    cost: function() {
      return {
        'wood': 50,
        'rope': 1
      };
    },
    build: function() {
      $SM.add('stores["fishing rod"]', 1);
      // Unlock fishing button
      $SM.set('features.fishing', true);
    }
  }
}
```

**Step 3: Add fishing button** (`outside.js`)

In `Outside.init()`, after other buttons:

```javascript
// Around line 150, after the gather button
if($SM.get('features.fishing')) {
  Outside.createFishingButton();
}

// Subscribe to state updates to show button when fishing rod built
$.Dispatch('stateUpdate').subscribe(function(category) {
  if(category === 'features.fishing' && $SM.get('features.fishing')) {
    Outside.createFishingButton();
  }
});
```

Add the button creator:

```javascript
// Around line 300, add new function
createFishingButton: function() {
  if($('#fishingButton').length === 0) {
    new Button.Button({
      id: 'fishingButton',
      text: _('go fishing'),
      click: Outside.goFishing,
      cooldown: 30,  // 30 second cooldown
      width: '80px'
    }).appendTo('#outsideButtons');
  }
},

goFishing: function() {
  // Random catch amount
  var fish = Math.floor(Math.random() * 10) + 5;
  $SM.add('stores.meat', fish);
  Notifications.notify(Outside, _('caught ' + fish + ' fish'));
}
```

**Done!** Players can now:
1. Craft rope from fur
2. Craft fishing rod from wood + rope
3. Go fishing to get meat

---

### Example 2: Add a New Event

Let's add a random event where a merchant visits.

**In `script/events/outside.js`**, add to the `Events.Outside` array:

```javascript
{
  title: _('The Merchant'),
  isAvailable: function() {
    // Only available after trading post exists
    return $SM.get('game.buildings["trading post"]', true) > 0;
  },
  scenes: {
    'start': {
      text: [
        _('a weathered merchant arrives, cart loaded with goods.'),
        _('she offers to trade.')
      ],
      notification: _('a merchant arrives'),
      buttons: {
        'buyWood': {
          text: _('buy wood'),
          cost: { 'fur': 100 },
          reward: { 'wood': 500 },
          notification: _('wood purchased'),
          onChoose: function() {
            Notifications.notify(Outside, _('the wood is heavy but good quality'));
          },
          nextScene: 'end'
        },
        'buyLeather': {
          text: _('buy leather'),
          cost: { 'fur': 50 },
          reward: { 'leather': 100 },
          notification: _('leather purchased'),
          nextScene: 'end'
        },
        'decline': {
          text: _('decline'),
          nextScene: 'end'
        }
      }
    },
    'end': {
      text: [_('the merchant packs up and leaves.')],
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

**Done!** This event will randomly trigger when the player has a trading post.

---

### Example 3: Add a New Worker Type

Let's add a "fisherman" worker who generates fish.

**Step 1: Define income** (`outside.js`)

Find `Outside._INCOME` (around line 100):

```javascript
Outside._INCOME = {
  gatherer: { /* ... */ },
  hunter: { /* ... */ },
  // ... existing workers

  // ADD THIS
  'fisherman': {
    delay: 15,  // 15 seconds per fish batch
    stores: {
      meat: 5  // Produces 5 meat (fish) per cycle
    }
  }
}
```

**Step 2: Add worker button** (`outside.js`)

In `Outside.updateVillage()`, after existing worker buttons:

```javascript
// Around line 400
if($SM.get('features.fishing')) {
  new Button.Button({
    id: 'fishermanButton',
    text: _('fisherman'),
    click: Outside.addWorker,
    width: '80px',
    cooldown: Outside._WORKER_COOLDOWN
  }).appendTo('#workers');
}
```

**Done!** Players can now assign villagers to fish automatically.

---

## Intermediate Extensions

### Example 4: Add a New Perk

Let's add an "angler" perk that improves fishing.

**Step 1: Define unlock condition** (`world.js` or `outside.js`)

```javascript
// In Outside.goFishing(), track fishing count
goFishing: function() {
  // Increment fishing counter
  var fishingCount = $SM.get('character.fishingCount', true);
  $SM.set('character.fishingCount', fishingCount + 1);

  // Unlock perk after 50 fishing trips
  if(fishingCount >= 50 && !$SM.hasPerk('angler')) {
    $SM.setM('character.perks', { angler: true });
    Notifications.notify(Outside, _('learned to be a better angler'));
  }

  // Calculate fish caught
  var baseFish = Math.floor(Math.random() * 10) + 5;

  // Angler perk: +50% fish
  if($SM.hasPerk('angler')) {
    baseFish = Math.floor(baseFish * 1.5);
  }

  $SM.add('stores.meat', baseFish);
  Notifications.notify(Outside, _('caught ' + baseFish + ' fish'));
}
```

**Step 2: Display perk** (`path.js`)

In `Path.updateOutfitting()`, the perks are automatically displayed from `$SM.get('character.perks')`, so no changes needed!

**Done!** Players unlock "angler" after 50 fishing trips, increasing fish yield.

---

### Example 5: Add a New Landmark

Let's add a "fishing village" landmark to the world map.

**Step 1: Define landmark** (`world.js`)

Find `World.LANDMARKS` (around line 100):

```javascript
World.LANDMARKS = [
  // ... existing landmarks

  // ADD THIS
  {
    scene: 'fishingVillage',
    num: 1,  // Number of these on map
    minRadius: 10,
    maxRadius: 20,
    tile: 'V',  // Character shown on map
    label: _('fishing village')
  }
]
```

**Step 2: Add event** (`script/events/setpieces.js`)

```javascript
Events.Setpieces['fishingVillage'] = {
  title: _('Fishing Village'),
  scenes: {
    'start': {
      text: [
        _('a small village sits by a river.'),
        _('fishermen mend their nets.')
      ],
      notification: _('a fishing village lies ahead'),
      buttons: {
        'trade': {
          text: _('trade'),
          cost: {
            'fur': 50
          },
          reward: {
            'meat': 200,
            'scales': 10
          },
          nextScene: 'traded'
        },
        'learn': {
          text: _('learn fishing'),
          onChoose: function() {
            $SM.setM('character.perks', { angler: true });
          },
          nextScene: 'learned'
        },
        'leave': {
          text: _('leave'),
          nextScene: 'end'
        }
      }
    },
    'traded': {
      text: [_('the villagers are grateful for the trade.')],
      buttons: {
        'leave': { text: _('leave'), nextScene: 'end' }
      }
    },
    'learned': {
      text: [_('the fishermen teach you their techniques.')],
      notification: _('learned fishing techniques'),
      buttons: {
        'leave': { text: _('leave'), nextScene: 'end' }
      }
    },
    'end': {
      text: [_('the village fades into the distance.')],
      buttons: {
        'leave': { text: _('leave'), nextScene: 'end' }
      }
    }
  }
}
```

**Done!** A fishing village now appears on the map.

---

### Example 6: Add a Combat Encounter

Let's add a "river serpent" enemy.

**In `script/events/encounters.js`**, add to array:

```javascript
{
  title: _('river serpent'),
  isAvailable: function() {
    // Only near water (in specific biomes)
    var pos = $SM.get('game.world.x') + ',' + $SM.get('game.world.y');
    // You could check nearby tiles for water
    return true;  // For simplicity, always available
  },
  scenes: {
    'start': {
      combat: true,
      enemy: 'river serpent',
      enemyName: _('slithering serpent'),
      deathMessage: _('the river serpent drowns'),
      chara: 'S',  // Character shown in combat
      damage: 5,   // Damage per attack
      hit: 0.7,    // 70% hit chance
      attackDelay: 2,  // Attacks every 2 seconds
      health: 25,  // Total health
      loot: {
        'meat': { min: 10, max: 20, chance: 1.0 },
        'scales': { min: 5, max: 10, chance: 0.8 },
        'teeth': { min: 1, max: 3, chance: 0.3 }
      },
      notification: _('a serpent emerges from the water')
    }
  }
}
```

**Done!** Players will encounter river serpents while exploring.

---

## Advanced Extensions

### Example 7: Add a New Game Module

Let's add a "harbor" module where players can build boats.

**Step 1: Create `script/harbor.js`**

```javascript
var Harbor = {
  name: _('Harbor'),

  init: function(options) {
    this.options = $.extend(
      this.options,
      options
    );

    // Create the harbor tab
    if($SM.get('features.location.harbor')) {
      Header.addLocation(_('Harbor'), 'harbor', Harbor);
    }

    // Subscribe to state updates
    $.Dispatch('stateUpdate').subscribe(Harbor.handleStateUpdates);
  },

  options: {},

  getState: function() {
    return {
      name: _('Harbor')
    };
  },

  onArrival: function(transition) {
    Harbor.setTitle();
    if(!Harbor.initialized) {
      Harbor.buildPanel();
      Harbor.initialized = true;
    }
  },

  setTitle: function() {
    $('#locationSlider .headerButton').text(_('Harbor'));
  },

  buildPanel: function() {
    var panel = $('<div>').attr('id', 'harborPanel')
      .addClass('location')
      .appendTo('#locationSlider');

    // Add description
    $('<div>').addClass('description')
      .text(_('the harbor is calm. boats rest at the dock.'))
      .appendTo(panel);

    // Add build section
    var buildSection = $('<div>').attr('id', 'harborBuildings')
      .appendTo(panel);

    Harbor.updateBuildings();
  },

  updateBuildings: function() {
    var buildings = $('#harborBuildings');

    if(!$SM.get('game.harbor.dock')) {
      new Button.Button({
        id: 'buildDock',
        text: _('build dock'),
        click: Harbor.buildDock,
        cost: { wood: 500, 'cured meat': 100 }
      }).appendTo(buildings);
    }

    if($SM.get('game.harbor.dock') && !$SM.get('game.harbor.boat')) {
      new Button.Button({
        id: 'buildBoat',
        text: _('build boat'),
        click: Harbor.buildBoat,
        cost: { wood: 1000, rope: 50 }
      }).appendTo(buildings);
    }
  },

  buildDock: function() {
    $('#buildDock').remove();
    $SM.set('game.harbor.dock', true);
    Notifications.notify(Harbor, _('dock constructed'));
    Harbor.updateBuildings();
  },

  buildBoat: function() {
    $('#buildBoat').remove();
    $SM.set('game.harbor.boat', true);
    Notifications.notify(Harbor, _('boat seaworthy'));

    // Add sail button
    new Button.Button({
      id: 'sailButton',
      text: _('set sail'),
      click: Harbor.setSail,
      cooldown: 300  // 5 minute cooldown
    }).appendTo('#harborBuildings');
  },

  setSail: function() {
    // Random event - find fish or treasure
    var rand = Math.random();
    if(rand > 0.5) {
      var meat = Math.floor(Math.random() * 100) + 50;
      $SM.add('stores.meat', meat);
      Notifications.notify(Harbor, _('caught ' + meat + ' fish'));
    } else {
      var scales = Math.floor(Math.random() * 20) + 10;
      $SM.add('stores.scales', scales);
      Notifications.notify(Harbor, _('found ' + scales + ' scales'));
    }
  },

  handleStateUpdates: function(category) {
    // React to state changes if needed
  }
};
```

**Step 2: Add to `index.html`**

Add after other module scripts:
```html
<script type="text/javascript" src="script/harbor.js"></script>
```

**Step 3: Unlock in game** (`outside.js` or event)

```javascript
// In an event or when condition met:
$SM.set('features.location.harbor', true);
Harbor.init();
```

**Done!** A new harbor module with boats and sailing.

---

### Example 8: Add a Prestige Bonus

Let's make rope available as a prestige reward.

**In `prestige.js`**, find the prestige generation (around line 50):

```javascript
Prestige.get = function() {
  var prestige = {
    stores: {}
  };

  // ... existing prestige logic

  // ADD THIS
  if($SM.get('stores.rope', true) > 0) {
    var rope = Math.floor($SM.get('stores.rope') / 10);
    if(rope > 0) {
      prestige.stores.rope = rope;
    }
  }

  return prestige;
};
```

**Done!** Players keep 10% of rope when prestiging.

---

## Best Practices

### 1. Always Use State Manager
```javascript
// GOOD
$SM.set('stores.wood', 100);

// BAD
State.stores.wood = 100;  // Won't trigger updates!
```

### 2. Localize All Strings
```javascript
// GOOD
text: _('hello world')

// BAD
text: 'hello world'  // Won't translate!
```

### 3. Check Feature Flags
```javascript
// GOOD
if($SM.get('features.fishing')) {
  // Show fishing UI
}

// BAD - Assuming feature exists
// Show fishing UI
```

### 4. Handle Missing Resources
```javascript
// GOOD
var wood = $SM.get('stores.wood', true);  // Returns 0 if undefined

// BAD
var wood = $SM.get('stores.wood');  // Might be undefined
```

### 5. Use Cooldowns for Buttons
```javascript
// GOOD - Prevents spam
new Button.Button({
  click: myFunction,
  cooldown: 10  // 10 second cooldown
});

// Avoid instant repeatable actions
```

### 6. Subscribe to State Updates
```javascript
// GOOD - UI updates automatically
$.Dispatch('stateUpdate').subscribe(MyModule.handleStateUpdates);

handleStateUpdates: function(category) {
  if(category == 'stores.wood') {
    // Update wood display
  }
}

// BAD - Manual polling
setInterval(function() {
  // Check state repeatedly
}, 1000);
```

### 7. Balance Resource Costs
```javascript
// Follow existing patterns:
// - Early game: wood, fur, meat (cheap)
// - Mid game: leather, iron, steel (moderate)
// - Late game: alien alloy, scales (expensive)

// Example progression:
'rope': { wood: 5, fur: 2 },           // Early
'strong rope': { wood: 50, leather: 10 }, // Mid
'alien cord': { 'alien alloy': 1 }        // Late
```

### 8. Test State Persistence
```javascript
// After making changes:
// 1. Make changes in game
// 2. Refresh browser
// 3. Verify changes persisted
// 4. Check localStorage.gameState in console
```

---

## Testing Your Changes

### Manual Testing Checklist

1. **Test in fresh game**
   - Clear localStorage
   - Play from beginning
   - Verify feature unlocks at right time

2. **Test in saved game**
   - Load existing save
   - Verify new features appear
   - Check backward compatibility

3. **Test edge cases**
   - What if player has 0 resources?
   - What if player has maximum resources?
   - What if button clicked rapidly?

4. **Test state persistence**
   - Make changes
   - Refresh browser
   - Verify state preserved

5. **Test across modules**
   - Does feature work in Room?
   - Does it work in Outside?
   - Does it work in World?

### Debug Commands

Open browser console and try:

```javascript
// View all state
console.log(State);

// Give yourself resources
$SM.set('stores.wood', 99999);
$SM.set('stores.fur', 99999);

// Unlock all locations
$SM.set('features.location.outside', true);
$SM.set('features.location.world', true);
$SM.set('features.location.spaceShip', true);

// Reset game
localStorage.clear();
location.reload();

// Enable debug mode
Engine.options.debug = true;

// View specific state
$SM.get('stores');
$SM.get('game.buildings');
$SM.get('character.perks');
```

### Common Issues

**Button doesn't appear:**
- Check feature flag is set
- Verify button ID is unique
- Check isAvailable() condition

**State doesn't persist:**
- Ensure using $SM.set(), not direct assignment
- Check localStorage isn't full
- Verify no console errors

**Event doesn't trigger:**
- Check isAvailable() returns true
- Verify event added to correct pool
- Check Events.init() ran

**UI doesn't update:**
- Subscribe to 'stateUpdate'
- Fire update with $SM.fireUpdate()
- Check jQuery selectors are correct

---

## Next Steps

1. **Read existing code** - Best way to learn the patterns
2. **Start small** - Add one resource, one button
3. **Test frequently** - Refresh browser often
4. **Build incrementally** - Don't try to add everything at once
5. **Share your work** - Submit pull requests!

---

## Additional Resources

- **DEVELOPER_INDEX.md** - Complete codebase reference
- **script/events/setpieces.js** - Examples of complex events
- **script/room.js** - Examples of craftables
- **script/outside.js** - Examples of workers/income
- **script/world.js** - Examples of combat/exploration

Happy building!
