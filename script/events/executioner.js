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
        notification: _('as the lights come online, so too do the defence systems.'),
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
          _('elevator doors open to a blasted corridor. debris covers the floor, piled into makeshift defences.'),
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
        notification: _('one of the defence turrets still works.'),
        enemy: 'defence turret',
        enemyName: _('defence turret'),
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
            nextScene: { 1: '4-heal' }
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
      '4-heal': {
        text: [
          _('step inside, and the machine whirs. muscle and bone reknit. good as new.')
        ],
        buttons: {
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
        notification: _('one of the defence turrets still works.'),
        enemy: 'defence turret',
        enemyName: _('defence turret'),
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
          'hypo blueprint': {
            min: 1,
            max: 1,
            chance: 1
          }
        },
        buttons: {
          'continue': {
            text: _('continue'),
            nextScene: { 1: '7-intro' }
          },
          'leave': {
            text: _('leave'),
            nextScene: 'end'
          }
        }
      },
      '7-intro': {
        text: [
          _('clattering metal and old servos. something is coming...')
        ],
        buttons: {
          'fight': {
            text: _('fight'),
            nextScene: { 1: '7' }
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
        damage: 3,
				hit: 0.8,
				attackDelay: 2,
				health: 200,
        specials:[{
          delay: 3,
          action: (fighter) => {
            fighter.data('status', 'shield');
            return 'shield';
          }
        }],
        loot: {
          'alien alloy': {
            min: 1,
            max: 3,
            chance: 1
          },
          'kinetic armour blueprint': {
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

  "executioner-martial": { /* Martial wing */
    title: _('Martial Wing'),
    audio: AudioLibrary.LANDMARK_CRASHED_SHIP,
    scenes: {
      'start': {
        text: [
          _('metal grinds, and the elevator doors open halfway. beyond is a brightly lit battlefield. remains litter the corridor, undisturbed by scavengers.'),
          _('looks like they tried to barricade the elevators.')
        ],
        buttons: {
          'continue': {
            text: _('continue'),
            nextScene: { 1: '1' }
          },
          'leave': {
            text: _('leave'),
            nextScene: 'end'
          }
        }
      },
      '1': {
        text: [
          _('further along, the corridor branches.'),
          _('the door to the left is sealed and refuses to open.')
        ],
        buttons: {
          'explode': {
            text: _('blow it down'),
            cost: { grenade: 1 },
            nextScene: { 1: '2-1' }
          },
          'right': {
            text: _('continue right'),
            nextScene: { 0.5: '2-2', 1: '2-3' }
          },
          'leave': {
            text: _('leave'),
            nextScene: 'end'
          }
        }
      },

      '2-1': {
        text: [
          _('the blast throws the door inwards.'),
          _('through the bulkhead is a large room, walls lined with weapon racks. fighting seems to have passed it by.')
        ],
        loot: {
          'energy blade': {
            min: 2,
            max: 5,
            chance: 1
          },
          'laser rifle': {
            min: 2,
            max: 5,
            chance: 1
          },
          'energy cell': {
            min: 5,
            max: 20,
            chance: 1
          },
          'grenade': {
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
        notification: _('defence systems are still active.'),
        enemy: 'defence turret',
        enemyName: _('defence turret'),
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
        text: [
          _('another door at the end of the hall, sealed from this side.'),
          _('should be able to open it.')
        ],
        buttons: {
          'continue': {
            text: _('continue'),
            nextScene: { 1: '5' }
          },
          'leave': {
            text: _('leave'),
            nextScene: 'end'
          }
        }
      },

      '2-2': {
        combat: true,
        notification: _('defence systems are still active.'),
        enemy: 'defence turret',
        enemyName: _('defence turret'),
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
            nextScene: { 0.5: '3-2a', 1: '3-2b' }
          },
          'leave': {
            text: _('leave'),
            cooldown: Events._LEAVE_COOLDOWN,
            nextScene: 'end'
          }
        }
      },
      '3-2a': {
        combat: true,
        notification: _('a mobile defence platform trundles around the corner.'),
        enemy: 'mechanical quadruped',
        enemyName: _('mechanical quadruped'),
        ranged: true,
        chara: 'Q',
        damage: 8,
        hit: 0.8,
        attackDelay: 1,
        health: 70,
        loot: {
          'alien alloy': {
            min: 1,
            max: 1,
            chance: 1
          },
          'alien alloy': {
            min: 2,
            max: 4,
            chance: 0.2
          }
        },
        buttons: {
          'continue': {
            text: _('continue'),
            cooldown: Events._LEAVE_COOLDOWN,
            nextScene: { 1: '4-2' }
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
          _('the corridor is eerily silent.')
        ],
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
        text: [
          _('crew cabins flank the hall, devoid of life.'),
          _('a few useful items can be scavenged.')
        ],
        loot: {
          'energy cells': {
            min: 1,
            max: 5,
            chance: 1
          },
          'energy blade': {
            min: 1,
            max: 1,
            chance: 0.2
          }
        },
        buttons: {
          'continue': {
            text: _('continue'),
            nextScene: { 1: '5' }
          },
          'leave': {
            text: _('leave'),
            nextScene: 'end'
          }
        }
      },

      '2-3': {
        text: [
          _('ruined defence turrets flank the corridor.'),
          _('could put the scrap to good use.')
        ],
        loot: {
          'alien alloy': {
            min: 1,
            max: 3,
            chance: 1
          }
        },
        buttons: {
          'continue': {
            text: _('continue'),
            nextScene: { 0.5: '3-3a', 1: '3-3b' }
          },
          'leave': {
            text: _('leave'),
            nextScene: 'end'
          }
        }
      },
      '3-3a': {
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
      '3-3b': {
        text: [
          _('small sensors in the walls still look to be operational.'),
          _('easily avoided.')
        ],
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
        notification: _('a mobile defence platform trundles around the corner.'),
        enemy: 'mechanical quadruped',
        enemyName: _('mechanical quadruped'),
        ranged: true,
        chara: 'Q',
        damage: 8,
        hit: 0.8,
        attackDelay: 1,
        health: 70,
        loot: {
          'alien alloy': {
            min: 1,
            max: 1,
            chance: 1
          },
          'alien alloy': {
            min: 2,
            max: 4,
            chance: 0.2
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

      '5': {
        text: [
          _('large barricades bisect the corridor, scorched by weapons fire.'),
          _('bodies litter the ground on either side.')
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
          _('documents are scattered down the hall, most charred and curled.'),
          _('this one looks interesting.')
        ],
        loot: {
          'plasma rifle blueprint': {
            min: 1,
            max: 1,
            chance: 1
          }
        },
        buttons: {
          'continue': {
            text: _('continue'),
            nextScene: { 0.5: '7-1', 1: '7-2' }
          },
          'leave': {
            text: _('leave'),
            nextScene: 'end'
          }
        }
      },

      '7-1': {
        text: [
          _('the next door leads to a ransacked planning room.'),
          _('maps of the surface can still be found amongst the debris.')
        ],
        buttons: {
          'scavenge': {
            text: _('scavenge maps'),
            onChoose: () => {
              for (let i = 0; i < 3; i++) {
                World.applyMap();
              }
            },
            nextScene: { 1: '8-1a' }
          },
          'continue': {
            text: _('continue'),
            nextScene: { 1: '8-1b' }
          },
          'leave': {
            text: _('leave'),
            nextScene: 'end'
          }
        }
      },
      '8-1a': {
        combat: true,
        notification: _('drew some attention with all that noise.'),
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
            nextScene: { 1: '9-1' }
          },
          'leave': {
            text: _('leave'),
            cooldown: Events._LEAVE_COOLDOWN,
            nextScene: 'end'
          }
        }
      },
      '8-1b': {
        text: [
          _('slipped past an automated sentry.'),
          _('if only they\'d been destroyed along with everything else.')
        ],
        buttons: {
          'continue': {
            text: _('continue'),
            nextScene: { 1: '9-1' }
          },
          'leave': {
            text: _('leave'),
            nextScene: 'end'
          }
        }
      },
      '9-1': {
        combat: true,
        notification: _('ran straight into another one.'),
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
            nextScene: { 1: '10' }
          },
          'leave': {
            text: _('leave'),
            cooldown: Events._LEAVE_COOLDOWN,
            nextScene: 'end'
          }
        }
      },

      '7-2': {
        text: [
          _('the corridor passes through a security checkpoint. the defences are blown apart, ragged edges scorched by laser fire.'),
          _('past the checkpoint, banks of containment cells can be seen.')
        ],
        buttons: {
          'continue': {
            text: _('continue'),
            nextScene: { 0.5: '8-2a', 1: '8-2b' }
          },
          'leave': {
            text: _('leave'),
            nextScene: 'end'
          }
        }
      },
      '8-2a': {
        text: [
          _('the cells are all empty.'),
          _('power cables running across the ceiling are split in several places, sparking occasionally.')
        ],
        buttons: {
          'continue': {
            text: _('continue'),
            nextScene: { 1: '9-2' }
          },
          'leave': {
            text: _('leave'),
            nextScene: 'end'
          }
        }
      },
      '8-2b': {
        text: [
          _('the guards died at their posts, shot through with superheated plasma.'),
          _('their weapons lie on the floor beside them.')
        ],
        loot: {
          'laser rifle': {
            min: 2,
            max: 2,
            chance: 1
          },
          'energy cell': {
            min: 5,
            max: 10,
            chance: 1
          }
        },
        buttons: {
          'continue': {
            text: _('continue'),
            nextScene: { 1: '9-2' }
          },
          'leave': {
            text: _('leave'),
            nextScene: 'end'
          }
        }
      },
      '9-2': {
        combat: true,
        notification: _('a mobile defence platform trundles around the corner.'),
        enemy: 'mechanical quadruped',
        enemyName: _('mechanical quadruped'),
        ranged: true,
        chara: 'Q',
        damage: 8,
        hit: 0.8,
        attackDelay: 1,
        health: 70,
        loot: {
          'alien alloy': {
            min: 1,
            max: 1,
            chance: 1
          },
          'alien alloy': {
            min: 2,
            max: 4,
            chance: 0.2
          }
        },
        buttons: {
          'continue': {
            text: _('continue'),
            cooldown: Events._LEAVE_COOLDOWN,
            nextScene: { 1: '10' }
          },
          'leave': {
            text: _('leave'),
            cooldown: Events._LEAVE_COOLDOWN,
            nextScene: 'end'
          }
        }
      },

      '10': {
        'text': [
          _('the corridor opens onto a vast training complex, obstacles and features blackened by real combat.'),
          _('a regenerative machine hums uncannily by one of the courses.')
        ],
        buttons: {
          'use': {
            text: _('use machine'),
            cost: { 'alien alloy': 1 },
            onChoose: function() {
              World.setHp(World.getMaxHealth());
            },
            nextScene: { 1: '11' }
          },
          'continue': {
            text: _('continue'),
            nextScene: { 1: '11' }
          },
          'leave': {
            text: _('leave'),
            nextScene: 'end'
          }
        }
      },
      '11': {
        'text': [
          _('motion from the centre of the yard.'),
          _('a sparring automaton, still fully function and crusted with timeworn blood, lunges forward.')
        ],
        buttons: {
          'engage': {
            text: _('engage'),
            nextScene: { 1: '12' }
          }
        }
      },
      '12': {
        combat: true,
        notification: _('the machine attacks, blades whirling.'),
        enemy: 'murderous robot',
        enemyName: _('murderous robot'),
        ranged: false,
        chara: 'M',
        damage: 10,
				hit: 0.8,
				attackDelay: 3,
				health: 250,
        specials:[{
          delay: 13,
          action: (fighter) => {
            fighter.data('status', 'energised');
            return 'energise';
          }
        }],
        loot: {
          'alien alloy': {
            min: 1,
            max: 3,
            chance: 1
          },
          'dispruptor blueprint': {
            min: 1,
            max: 1,
            chance: 1
          }
        },
        buttons: {
          'continue': {
            text: _('continue'),
            cooldown: Events._LEAVE_COOLDOWN,
            nextScene: { 1: '13' }
          }
        }
      },
      '13': {
        'text': [
          _('the ruins of the sparring machine clatter to the ground.'),
          _('picked this deck clean.')
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
      },

      '1': {

      },
      '2': {

      },
      '3a': {

      },
      '3b': {

      },
      '4': {

      },

      '5-1': {

      },
      '6-1a': {

      },
      '6-1b': {

      },
      '7-1': {

      },

      '5-2': {

      },
      '6-2a': {

      },
      '6-2b': {

      },
      '7-2': {

      },

      '8': {

      },
      '9': {

      },
      '10a': {

      },
      '10b': {

      },
      '11': {

      },

      '12-1': {

      },
      '13-1a': {

      },
      '13-1b': {

      },
      '14-1': {

      },

      '12-2': {

      },
      '13-2a': {

      },
      '13-2b': {

      },
      '14-2': {

      },

      '15': {

      },
      '16': {
        
      },
      '17': {
        
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
      },

      '1': {

      },
      '2': {

      },
      '3a': {

      },
      '3b': {

      },
      '4': {

      },
      '5': {

      },
      '6': {

      },
      '7': {

      }
    }
  }

};