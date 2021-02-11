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
            nextEvent: 'executioner-engineering'
          },
          'medical': {
            text: _('medical'),
            nextEvent: 'executioner-medical'
          },
          'martial': {
            text: _('martial'),
            nextEvent: 'executioner-martial'
          },
          'command': {
            text: _('command deck'),
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