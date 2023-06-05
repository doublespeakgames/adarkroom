Events.Executioner = {
  "executioner-intro": { /* Exploring a ravaged battleship */
    title: _('A Ravaged Battleship'),
    audio: AudioLibrary.LANDMARK_CRASHED_SHIP,
    scenes: {
      'start': {
        notification: _('the remains of a huge ship are embedded in the earth.'),
        text: [
          _('the remains of a massive battleship lie here, like a silent sealed city.'),
          _('it lists to the side in a deep crevasse, cut when it fell from the sky.'), 
          _('the hatches are all sealed, but the hull is blown out just above the dirt, providing an entrance.')
        ],
        buttons: {
          'enter': {
            text: _('enter'),
            cost: { torch: 1 },
            nextScene: {1: '1'}
          },
          'leave': {
            text: _('leave'),
            nextScene: 'end'
          }
        }
      },
      '1': {
        text: [
          _('the interior of the ship is cold and dark. what little light there is only accentuates its harsh angles.'),
          _('the walls hum faintly.')
        ],
        buttons: {
          'continue': {
            text: _('continue'),
            nextScene: { 0.4: '2-1', 0.8: '2-2', 1: '2-3' }
          },
          'leave': {
            text: _('leave'),
            nextScene: 'end'
          }
        }
      },
      '2-1': {
        'text': [
          _('thick, sticky webbing covers the walls of the corridor.'), 
          _('deeper into the ship, the darkness seems almost to writhe.'), 
          _('a small knapsack hangs from a cluster of webs, a few feet from the floor.')
        ],
        loot: {
          'cured meat': {
            min: 1,
            max: 5,
            chance: 0.8
          },
          'bullets': {
            min: 1,
            max: 5,
            chance: 0.5
          },
          'energy cell': {
            min: 1,
            max: 5,
            chance: 0.2
          }
        },
        buttons: {
          'continue': {
            text: _('continue'),
            nextScene: { 1: '3-1' }
          },
          'leave': {
            text: _('leave'),
            nextScene: 'end'
          }
        }
      },
      '3-1': {
        notification: _('a huge arthropod lunges from the shadows, its mandibles thrashing.'),
        combat: true,
        enemy: 'chitinous horror',
        chara: 'H',
        damage: 1,
        hit: 0.8,
        attackDelay: 0.25,
        health: 70,
        loot: {
          'meat': {
            min: 5,
            max: 10,
            chance: 0.8
          },
          'scales': {
            min: 5,
            max: 10,
            chance: 0.5
          }
        },
        buttons: {
          'continue': {
            text: _('continue'),
            cooldown: Events._LEAVE_COOLDOWN,
            nextScene: { 1: '4-1' }
          },
          'leave': {
            text: _('leave'),
            cooldown: Events._LEAVE_COOLDOWN,
            nextScene: 'end'
          }
        }
      },
      '4-1': {
        notification: _('the webs part, and a grotesque insect lurches forward.'),
        combat: true,
        enemy: 'chitinous queen',
        chara: 'Q',
        damage: 1,
        hit: 0.8,
        attackDelay: 0.25,
        health: 80,
        loot: {
          'meat': {
            min: 8,
            max: 12,
            chance: 0.8
          },
          'scales': {
            min: 8,
            max: 12,
            chance: 0.5
          }
        },
        buttons: {
          'continue': {
            text: _('continue'),
            cooldown: Events._LEAVE_COOLDOWN,
            nextScene: { 1: '5' }
          },
          'leave': {
            text: _('leave'),
            cooldown: Events._LEAVE_COOLDOWN,
            nextScene: 'end'
          }
        }
      },
      '2-2': {
        notification: _('an operative waits in ambush around the corner.'),
        combat: true,
        enemy: 'operative',
        chara: 'O',
        damage: 6,
        hit: 0.8,
        attackDelay: 2,
        health: 50,
        loot: {
          'bayonet': {
            min: 1,
            max: 1,
            chance: 0.5
          },
          'bullets': {
            min: 1,
            max: 5,
            chance: 0.8
          },
          'cured meat': {
            min: 1,
            max: 5,
            chance: 0.8
          }
        },
        buttons: {
          'continue': {
            text: _('continue'),
            cooldown: Events._LEAVE_COOLDOWN,
            nextScene: { 1: '3-2' }
          },
          'leave': {
            text: _('leave'),
            cooldown: Events._LEAVE_COOLDOWN,
            nextScene: 'end'
          }
        }
      },
      '3-2': {
        'text': [
          _('the military has set up a small camp just inside the ship.'), 
          _('crude attempts have been made to cut into the walls.'), 
          _('scraps of copper wire litter the floor.'),
          _('two bedrolls are wedged into a corner.')
        ],
        loot: {
          'cured meat': {
            min: 1,
            max: 5,
            chance: 1
          },
          'torch': {
            min: 1,
            max: 3,
            chance: 0.8
          },
          'bullets': {
            min: 1,
            max: 5,
            chance: 0.5
          },
          'alien alloy': {
            min: 1,
            max: 2,
            chance: 0.2
          }
        },
        buttons: {
          'continue': {
            text: _('continue'),
            nextScene: { 1: '4-2' }
          },
          'leave': {
            text: _('leave'),
            nextScene: 'end'
          }
        }
      },
      '4-2': {
        notification: _('a dusty researcher clumsily hides in the shadows.'),
        combat: true,
        enemy: 'researcher',
        chara: 'R',
        damage: 1,
        hit: 0.8,
        attackDelay: 2,
        health: 20,
        loot: {
          'torch': {
            min: 1,
            max: 3,
            chance: 0.8
          },
          'cloth': {
            min: 1,
            max: 5,
            chance: 0.8
          },
          'cured meat': {
            min: 1,
            max: 5,
            chance: 0.8
          }
        },
        buttons: {
          'continue': {
            text: _('continue'),
            cooldown: Events._LEAVE_COOLDOWN,
            nextScene: { 1: '5' }
          },
          'leave': {
            text: _('leave'),
            cooldown: Events._LEAVE_COOLDOWN,
            nextScene: 'end'
          }
        }
      },
      '2-3': {
        'text': [
          _('debris is stacked in the corridor, forming a low barricade.'), 
          _('the walls are scorched and melted.'), 
          _('behind the barricade, a few weapons lay abandoned.')
        ],
        loot: {
          'laser rifle': {
            min: 1,
            max: 3,
            chance: 1
          },
          'energy cells': {
            min: 1,
            max: 5,
            chance: 0.8
          },
          'plasma rifle': {
            min: 1,
            max: 1,
            chance: 0.2
          }
        },
        buttons: {
          'continue': {
            text: _('continue'),
            nextScene: { 1: '3-3' }
          },
          'leave': {
            text: _('leave'),
            nextScene: 'end'
          }
        }
      },
      '3-3': {
        'text': [
          _('the partially devoured remains of several wanderers are piled before a dark corridor.'), 
          _('shuffling noises can be heard from within.')
        ],
        loot: {
          'energy cells': {
            min: 1,
            max: 5,
            chance: 0.5
          },
          'cloth': {
            min: 1,
            max: 5,
            chance: 0.8
          }
        },
        buttons: {
          'continue': {
            text: _('continue'),
            nextScene: { 1: '4-3' }
          },
          'leave': {
            text: _('leave'),
            nextScene: 'end'
          }
        }
      },
      '4-3': {
        combat: true,
        enemy: 'ancient beast',
        enemyName: _('ancient beast'),
        chara: 'A',
        damage: 6,
        hit: 0.8,
        attackDelay: 1,
        health: 60,
        loot: {
          'fur': {
            min: 5,
            max: 10,
            chance: 1
          },
          'meat': {
            min: 5,
            max: 10,
            chance: 1
          },
          'teeth': {
            min: 5,
            max: 10,
            chance: 0.8
          }
        },
        notification: _('an ancient beast has made these ruins its home.'),
        buttons: {
          'continue': {
            text: _('continue'),
            cooldown: Events._LEAVE_COOLDOWN,
            nextScene: { 1: '5' }
          },
          'leave': {
            text: _('leave'),
            cooldown: Events._LEAVE_COOLDOWN,
            nextScene: 'end'
          }
        }
      },
      '5': {
        'text': [
          _('a maintenance panel is embedded in the wall next to a large sealed door.'), 
          _('perhaps the ship’s systems are still operational.')
        ],
        buttons: {
          'power': {
            text: _('power cycle'),
            nextScene: { 1: '6' }
          },
          'leave': {
            text: _('leave'),
            nextScene: 'end'
          }
        }
      },
      '6': {
        combat: true,
        notification: _('as the lights come online, so too do the defense systems.'),
        enemy: 'automated turret',
        enemyName: _('automated turret'),
        ranged: true,
        chara: 'T',
        damage: 8,
        hit: 0.8,
        attackDelay: 2,
        health: 60,
        loot: {
          'energy cells': {
            min: 1,
            max: 5,
            chance: 0.8
          },
          'laser rifle': {
            min: 1,
            max: 1,
            chance: 0.2
          }
        },
        buttons: {
          'continue': {
            text: _('continue'),
            cooldown: Events._LEAVE_COOLDOWN,
            nextScene: { 1: '7' }
          },
          'leave': {
            text: _('leave'),
            cooldown: Events._LEAVE_COOLDOWN,
            nextScene: 'end'
          }
        }
      },
      '7': {
        'text': [
          _('beyond the bulkhead is a small antechamber, seemingly untouched by scavengers.'), 
          _('a large hatch grinds open, and the wind rushes in.'),
          _('a strange device sits on the floor. looks important.')
        ],
        onLoad: () => {
          World.drawRoad();
          World.state.executioner = true;
        },
        buttons: {
          'leave': {
            text: _('take device and leave'),
            nextScene: 'end'
          }
        }
      }
    }
  },

  "executioner-antechamber": { /* Deeper into a ravaged battleship */
    title: _('A Ravaged Battleship'),
    audio: AudioLibrary.LANDMARK_CRASHED_SHIP,
    scenes: {
      'start': {
        'text': [
          _('a large hatch opens into a wide corridor.'),
          _('the corridor leads to a bank of elevators, which appear to be functional.')
        ],
        buttons: {
          'engineering': {
            text: _('engineering'),
            available: function() {
              return !World.engineering;
            },
            nextEvent: 'executioner-engineering'
          },
          'medical': {
            text: _('medical'),
            available: function() {
              return !World.medical;
            },
            nextEvent: 'executioner-medical'
          },
          'martial': {
            text: _('martial'),
            available: function() {
              return !World.martial;
            },
            nextEvent: 'executioner-martial'
          },
          'command': {
            text: _('command deck'),
            available: function() {
              return World.engineering && World.medical && World.martial;
            },
            nextEvent: 'executioner-command'
          },
          'leave': {
            text: _('leave'),
            nextScene: 'end'
          }
        }
      }
    }
  },

  "executioner-engineering": { /* Engineering wing */
    title: _('Engineering Wing'),
    audio: AudioLibrary.LANDMARK_CRASHED_SHIP,
    scenes: {
      'start': {
        'text': [
          _('elevator doors open to a blasted corridor. debris covers the floor, piled into makeshift defenses.'),
          _('emergency lighting flickers.')
        ],
        buttons: {
          'continue': {
            text: _('continue'),
            nextScene: { 0.3: '1-1', 0.7: '1-2', 1: '1-3' }
          },
          'leave': {
            text: _('leave'),
            nextScene: 'end'
          }
        }
      },

      '1-1': {
        text: [
          _('an automated assembly line performs its empty routines, long since deprived of materials.'),
          _('its final works lie forgotten, covered by a thin layer of dust.')
        ],
        loot: {
          'energy cells': {
            min: 1,
            max: 5,
            chance: 0.8
          },
          'laser rifle': {
            min: 1,
            max: 1,
            chance: 0.2
          }
        },
        buttons: {
          'continue': {
            text: _('continue'),
            nextScene: { 0.5: '2-1a', 1: '2-1b' }
          },
          'leave': {
            text: _('leave'),
            nextScene: 'end'
          }
        }
      },
      '2-1a': {
        combat: true,
        notification: _('assembly arms spin wildly out of control.'),
        enemy: 'unruly welder',
        enemyName: _('unruly welder'),
        ranged: false,
        chara: 'W',
        damage: 8,
				hit: 0.8,
				attackDelay: 2,
				health: 50,
        loot: {
          'energy cells': {
            min: 1,
            max: 5,
            chance: 0.8
          },
          'alien alloy': {
            min: 1,
            max: 1,
            chance: 0.2
          }
        },
        buttons: {
          'continue': {
            text: _('continue'),
            cooldown: Events._LEAVE_COOLDOWN,
            nextScene: { 1: '3-1' }
          },
          'leave': {
            text: _('leave'),
            cooldown: Events._LEAVE_COOLDOWN,
            nextScene: 'end'
          }
        }
      },
      '2-1b': {
        text: [
          _('assembly arms spark and jitter.'),
          _('a cacophony of decrepit machinery fills the room.')
        ],
        buttons: {
          'continue': {
            text: _('continue'),
            nextScene: { 1: '3-1' }
          },
          'leave': {
            text: _('leave'),
            nextScene: 'end'
          }
        }
      },
      '3-1': {
        combat: true,
        notification: _('tripped a motion sensor.'),
        enemy: 'mechanical guard',
        enemyName: _('mechanical guard'),
        ranged: true,
        chara: 'G',
        damage: 8,
				hit: 0.8,
				attackDelay: 2,
				health: 60,
        loot: {
          'energy cells': {
            min: 1,
            max: 5,
            chance: 0.8
          },
          'laser rifle': {
            min: 1,
            max: 1,
            chance: 0.8
          },
          'alien alloy': {
            min: 1,
            max: 1,
            chance: 0.2
          }
        },
        buttons: {
          'continue': {
            text: _('continue'),
            cooldown: Events._LEAVE_COOLDOWN,
            nextScene: { 1: '4' }
          },
          'leave': {
            text: _('leave'),
            cooldown: Events._LEAVE_COOLDOWN,
            nextScene: 'end'
          }
        }
      },

      '1-2': {
        combat: true,
        notification: _('one of the defense turrets still works.'),
        enemy: 'defense turret',
        enemyName: _('defense turret'),
        ranged: true,
        chara: 'T',
        damage: 15,
				hit: 0.8,
				attackDelay: 4,
				health: 40,
        loot: {
          'energy cells': {
            min: 1,
            max: 5,
            chance: 0.8
          },
          'alien alloy': {
            min: 1,
            max: 1,
            chance: 0.8
          },
          'laser rifle': {
            min: 1,
            max: 1,
            chance: 0.2
          }
        },
        buttons: {
          'continue': {
            text: _('continue'),
            cooldown: Events._LEAVE_COOLDOWN,
            nextScene: { 1: '2-2' }
          },
          'leave': {
            text: _('leave'),
            cooldown: Events._LEAVE_COOLDOWN,
            nextScene: 'end'
          }
        }
      },
      '2-2': {
        text: [
          _('must have been the engine room, once. the massive machines now stand inert, twisted and scorched by explosions.'),
          _('the destruction is uniform and precise.'),
          _('bits of them can be scavenged.')
        ],
        loot: {
          'alien alloy': {
            min: 2,
            max: 5,
            chance: 1
          }
        },
        buttons: {
          'continue': {
            text: _('continue'),
            nextScene: { 0.5: '3-2a', 1: '3-2b' }
          },
          'leave': {
            text: _('leave'),
            nextScene: 'end'
          }
        }
      },
      '3-2a': {
        combat: true,
        notification: _('tripped a motion sensor.'),
        enemy: 'mechanical guard',
        enemyName: _('mechanical guard'),
        ranged: true,
        chara: 'G',
        damage: 8,
				hit: 0.8,
				attackDelay: 2,
				health: 60,
        loot: {
          'energy cells': {
            min: 1,
            max: 5,
            chance: 0.8
          },
          'laser rifle': {
            min: 1,
            max: 1,
            chance: 0.8
          },
          'alien alloy': {
            min: 1,
            max: 1,
            chance: 0.2
          }
        },
        buttons: {
          'continue': {
            text: _('continue'),
            cooldown: Events._LEAVE_COOLDOWN,
            nextScene: { 1: '4' }
          },
          'leave': {
            text: _('leave'),
            cooldown: Events._LEAVE_COOLDOWN,
            nextScene: 'end'
          }
        }
      },
      '3-2b': {
        text: [
          _('none of the ship\'s engines escaped the destruction.'),
          _('it\'s no mystery why she no longer flies.')
        ],
        buttons: {
          'continue': {
            text: _('continue'),
            nextScene: { 1: '4' }
          },
          'leave': {
            text: _('leave'),
            nextScene: 'end'
          }
        }
      },

      '1-3': {
        text: [
          _('sparks cascade from a reactivated power junction, and catch.'),
          _('the flames fill the corridor.')
        ],
        buttons: {
          'water': {
            text: _('extinguish'),
            cost: { 'water': 5 }, 
            nextScene: { 0.5: '2-3a', 1: '2-3b' }
          },
          'run': {
            text: _('rush through'),
            cost: { 'hp': 10 },
            nextScene: { 0.5: '2-3a', 1: '2-3b' }
          }
        }
      },
      '2-3a': {
        combat: true,
        notification: _('tripped a motion sensor.'),
        enemy: 'mechanical guard',
        enemyName: _('mechanical guard'),
        ranged: true,
        chara: 'G',
        damage: 8,
				hit: 0.8,
				attackDelay: 2,
				health: 60,
        loot: {
          'energy cells': {
            min: 1,
            max: 5,
            chance: 0.8
          },
          'laser rifle': {
            min: 1,
            max: 1,
            chance: 0.8
          },
          'alien alloy': {
            min: 1,
            max: 1,
            chance: 0.2
          }
        },
        buttons: {
          'continue': {
            text: _('continue'),
            cooldown: Events._LEAVE_COOLDOWN,
            nextScene: { 1: '3-3' }
          },
          'leave': {
            text: _('leave'),
            cooldown: Events._LEAVE_COOLDOWN,
            nextScene: 'end'
          }
        }
      },
      '2-3b': {
        text: [
          _('rows of inert security robots hang suspended from the ceiling.'),
          _('wires run overhead, corroded and useless.')
        ],
        buttons: {
          'continue': {
            text: _('continue'),
            nextScene: { 1: '3-3' }
          },
          'leave': {
            text: _('leave'),
            nextScene: 'end'
          }
        }
      },
      '3-3': {
        text: [
          _('more signs of past combat down the hall. guard post is ransacked.'),
          _('still, some things can be found.')
        ],
        loot: {
          'energy cells': {
            min: 1,
            max: 5,
            chance: 0.8
          },
          'laser rifle': {
            min: 1,
            max: 1,
            chance: 0.7
          },
          'grenade': {
            min: 1,
            max: 3,
            chance: 0.6
          },
          'plasma rifle': {
            min: 1,
            max: 1,
            chance: 0.2
          }
        },
        buttons: {
          'continue': {
            text: _('continue'),
            nextScene: { 1: '4' }
          },
          'leave': {
            text: _('leave'),
            nextScene: 'end'
          }
        }
      },

      '4': {
        text: [
          _('marks on the door read \'research and development.\' everything seems mostly untouched, but dead.'),
          _('one machine thrums with power, and might still work.')
        ],
        buttons: {
          'use': {
            text: _('use machine'),
            cost: { 'alien alloy': 1 },
            onChoose: function() {
              World.setHp(World.getMaxHealth());
            },
            nextScene: { 0.5: '5-1', 1: '5-2' }
          },
          'continue': {
            text: _('continue'),
            nextScene: { 0.5: '5-1', 1: '5-2' }
          },
          'leave': {
            text: _('leave'),
            nextScene: 'end'
          }
        }
      },
      '5-1': {
        combat: true,
        notification: _('one of the defense turrets still works.'),
        enemy: 'defense turret',
        enemyName: _('defense turret'),
        ranged: true,
        chara: 'T',
        damage: 15,
				hit: 0.8,
				attackDelay: 4,
				health: 40,
        loot: {
          'energy cells': {
            min: 1,
            max: 5,
            chance: 0.8
          },
          'alien alloy': {
            min: 1,
            max: 1,
            chance: 0.8
          },
          'plasma rifle': {
            min: 1,
            max: 1,
            chance: 0.2
          }
        },
        buttons: {
          'continue': {
            text: _('continue'),
            cooldown: Events._LEAVE_COOLDOWN,
            nextScene: { 1: '6' }
          },
          'leave': {
            text: _('leave'),
            cooldown: Events._LEAVE_COOLDOWN,
            nextScene: 'end'
          }
        }
      },
      '5-2': {
        text: [
          _('the machines here look unfinished, abandoned by their creator. wires and other scrap are scattered about the work benches.')
        ],
        buttons: {
          'continue': {
            text: _('continue'),
            nextScene: { 1: '6' }
          },
          'leave': {
            text: _('leave'),
            nextScene: 'end'
          }
        }
      },
      '6': {
        text: [
          _('experimental plans cover one wall, held by an unseen force.'),
          _('this one looks useful.')
        ],
        loot: {
          'hypo blueprints': {
            min: 1,
            max: 1,
            chance: 1
          }
        },
        buttons: {
          'continue': {
            text: _('continue'),
            nextScene: { 1: '7' }
          },
          'leave': {
            text: _('leave'),
            nextScene: 'end'
          }
        }
      },
      '7': {
        combat: true,
        notification: _('an unfinished automaton whirs to life.'),
        enemy: 'unstable prototype',
        enemyName: _('unstable prototype'),
        ranged: false,
        chara: 'P',
        damage: 5,
				hit: 0.8,
				attackDelay: 2,
				health: 100,

        // TODO: Special power: SHIELD

        loot: {
          'alien alloy': {
            min: 1,
            max: 3,
            chance: 1
          },
          'kinetic armour blueprints': {
            min: 1,
            max: 1,
            chance: 1
          }
        },
        buttons: {
          'continue': {
            text: _('continue'),
            cooldown: Events._LEAVE_COOLDOWN,
            nextScene: { 1: '8' }
          },
          'leave': {
            text: _('leave'),
            cooldown: Events._LEAVE_COOLDOWN,
            nextScene: 'end'
          }
        }
      },
      '8': {
        text: [
          _('at the back of the workshop, elevator doors twitch and buzz.'),
          _('looks like a way out of here.')
        ],
        onLoad: () => {
          World.state.engineering = true;
        },
        buttons: {
          'leave': {
            text: _('leave'),
            nextScene: 'end'
          }
        }
      }
    }
  },

  "executioner-medical": { /* Medical wing */
    title: _('Medical Wing'),
    audio: AudioLibrary.LANDMARK_CRASHED_SHIP,
    scenes: {
      'start': {
        'text': [
          _('TODO')
        ],
        buttons: {
          'leave': {
            text: _('leave'),
            nextScene: 'end'
          }
        }
      }
    }
  },

  "executioner-martial": { /* Martial wing */
    title: _('Martial Wing'),
    audio: AudioLibrary.LANDMARK_CRASHED_SHIP,
    scenes: {
      'start': {
        'text': [
          _('TODO')
        ],
        buttons: {
          'leave': {
            text: _('leave'),
            nextScene: 'end'
          }
        }
      }
    }
  },

  "executioner-command": { /* Command deck */
    title: _('Command Deck'),
    audio: AudioLibrary.LANDMARK_CRASHED_SHIP,
    scenes: {
      'start': {
        'text': [
          _('TODO')
        ],
        buttons: {
          'leave': {
            text: _('leave'),
            nextScene: 'end'
          }
        }
      }
    }
  }

};