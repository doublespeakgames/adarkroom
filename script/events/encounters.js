/**
 * Events that can occur when wandering around the world
 **/
Events.Encounters = [
	/* Tier 1 */
	{ /* Snarling Beast */
		title: 'A Snarling Beast',
 		isAvailable: function() {
 			return World.getDistance() <= 10 && World.getTerrain() == World.TILE.FOREST;
 		},
 		scenes: {
 			'start': {
 				combat: true,
 				enemy: 'snarling beast',
 				chara: 'B',
 				damage: 1,
 				hit: 0.8,
 				attackDelay: 1,
 				health: 5,
 				loot: {
 					'fur': {
 						min: 1,
 						max: 3,
 						chance: 1
 					},
 					'meat': {
 						min: 1,
 						max: 3,
 						chance: 1
 					},
 					'teeth': {
 						min: 1,
 						max: 3,
 						chance: 0.8
 					}
 				},
 				notification: 'a snarling beast leaps out of the underbrush'
 			}
 		}
	},
	{ /* Gaunt Man */
     	title: 'A Gaunt Man',
  		isAvailable: function() {
  			return World.getDistance() <= 10 && World.getTerrain() == World.TILE.BARRENS;
  		},
  		scenes: {
  			'start': {
  				combat: true,
  				enemy: 'gaunt man',
  				chara: 'G',
  				damage: 2,
  				hit: 0.8,
  				attackDelay: 2,
  				health: 6,
  				loot: {
  					'cloth': {
  						min: 1,
  						max: 3,
  						chance: 0.8
  					},
  					'teeth': {
  						min: 1,
  						max: 2,
  						chance: 0.8
  					},
  					'leather': {
  						min: 1,
  						max: 2,
  						chance: 0.5
  					}
  				},
  				notification: 'a gaunt man approaches, a crazed look in his eye'
  			}
		}
  	},
	{ /* Strange Bird */
     	title: 'A Strange Bird',
  		isAvailable: function() {
  			return World.getDistance() <= 10 && World.getTerrain() == World.TILE.FIELD;
  		},
  		scenes: {
  			'start': {
  				combat: true,
  				enemy: 'strange bird',
  				chara: 'B',
  				damage: 3,
  				hit: 0.8,
  				attackDelay: 2,
  				health: 4,
  				loot: {
  					'scales': {
  						min: 1,
  						max: 3,
  						chance: 0.8
  					},
  					'teeth': {
  						min: 1,
  						max: 2,
  						chance: 0.5
  					},
  					'meat': {
  						min: 1,
  						max: 3,
  						chance: 0.8
  					}
  				},
  				notification: 'a strange looking bird speeds across the plains'
  			}
		}
  	},
	/* Tier 2*/
	{ /* Shivering Man */
     	title: 'A Shivering Man',
  		isAvailable: function() {
  			return World.getDistance() > 10 && World.getDistance() <= 20 && World.getTerrain() == World.TILE.BARRENS;
  		},
  		scenes: {
  			'start': {
  				combat: true,
  				enemy: 'shivering man',
  				chara: 'S',
  				damage: 5,
  				hit: 0.5,
  				attackDelay: 1,
  				health: 20,
  				loot: {
  					'cloth': {
  						min: 1,
  						max: 1,
  						chance: 0.2
  					},
  					'teeth': {
  						min: 1,
  						max: 2,
  						chance: 0.8
  					},
  					'leather': {
  						min: 1,
  						max: 1,
  						chance: 0.2
  					},
  					'medicine': {
  					  min: 1,
  					  max: 3,
  					  chance: 0.7
  					}
  				},
  				notification: 'a shivering man approaches and attacks with surprising strength'
  			}
		}
  },
	{ /* Man-eater */
		title: 'A Man-Eater',
 		isAvailable: function() {
 			return World.getDistance() > 10 && World.getDistance() <= 20 && World.getTerrain() == World.TILE.FOREST;
 		},
 		scenes: {
 			'start': {
 				combat: true,
 				enemy: 'man-eater',
 				chara: 'E',
 				damage: 3,
 				hit: 0.8,
 				attackDelay: 1,
 				health: 25,
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
 				notification: 'a large creature attacks, claws freshly bloodied'
 			}
 		}
	},
	{ /* Scavenger */
     	title: 'A Scavenger',
  		isAvailable: function() {
  			return World.getDistance() > 10 && World.getDistance() <= 20 && World.getTerrain() == World.TILE.BARRENS;
  		},
  		scenes: {
  			'start': {
  				combat: true,
  				enemy: 'scavenger',
  				chara: 'S',
  				damage: 4,
  				hit: 0.8,
  				attackDelay: 2,
  				health: 30,
  				loot: {
  					'cloth': {
  						min: 5,
  						max: 10,
  						chance: 0.8
  					},
  					'leather': {
  						min: 5,
  						max: 10,
  						chance: 0.8
  					},
  					'iron': {
  						min: 1,
  						max: 5,
  						chance: 0.5
  					},
  					'medicine': {
  					  min: 1,
  					  max: 2,
  					  chance: 0.1
  					}
  				},
  				notification: 'a scavenger draws close, hoping for an easy score'
  			}
		}
  	},
	{ /* Huge Lizard */
     	title: 'A Huge Lizard',
  		isAvailable: function() {
  			return World.getDistance() > 10 && World.getDistance() <= 20 && World.getTerrain() == World.TILE.FIELD;
  		},
  		scenes: {
  			'start': {
  				combat: true,
  				enemy: 'lizard',
  				chara: 'L',
  				damage: 5,
  				hit: 0.8,
  				attackDelay: 2,
  				health: 20,
  				loot: {
  					'scales': {
  						min: 5,
  						max: 10,
  						chance: 0.8
  					},
  					'teeth': {
  						min: 5,
  						max: 10,
  						chance: 0.5
  					},
  					'meat': {
  						min: 5,
  						max: 10,
  						chance: 0.8
  					}
  				},
  				notification: 'the grass thrashes wildly as a huge lizard pushes through'
  			}
		}
  	},
	/* Tier 3*/
	{ /* Feral Terror */
		title: 'A Feral Terror',
 		isAvailable: function() {
 			return World.getDistance() > 20 && World.getTerrain() == World.TILE.FOREST;
 		},
 		scenes: {
 			'start': {
 				combat: true,
 				enemy: 'feral terror',
 				chara: 'F',
 				damage: 6,
 				hit: 0.8,
 				attackDelay: 1,
 				health: 45,
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
 				notification: 'a beast, wilder than imagining, erupts out of the foliage'
 			}
 		}
	},
	{ /* Soldier */
     	title: 'A Soldier',
  		isAvailable: function() {
  			return World.getDistance() > 20 && World.getTerrain() == World.TILE.BARRENS;
  		},
  		scenes: {
  			'start': {
  				combat: true,
  				enemy: 'soldier',
				ranged: true,
  				chara: 'D',
  				damage: 8,
  				hit: 0.8,
  				attackDelay: 2,
  				health: 50,
  				loot: {
  					'cloth': {
  						min: 5,
  						max: 10,
  						chance: 0.8
  					},
  					'bullets': {
  						min: 1,
  						max: 5,
  						chance: 0.5
  					},
  					'rifle': {
  						min: 1,
  						max: 1,
  						chance: 0.2
  					},
  					'medicine': {
  					  min: 1,
  					  max: 2,
  					  chance: 0.1
  					}
  				},
  				notification: 'a soldier opens fire from across the desert'
  			}
		}
  	},
	{ /* Sniper */
     	title: 'A Sniper',
  		isAvailable: function() {
  			return World.getDistance() > 20 && World.getTerrain() == World.TILE.FIELD;
  		},
  		scenes: {
  			'start': {
  				combat: true,
  				enemy: 'sniper',
  				chara: 'S',
  				damage: 15,
  				hit: 0.8,
  				attackDelay: 4,
  				health: 30,
				ranged: true,
  				loot: {
  					'cloth': {
  						min: 5,
  						max: 10,
  						chance: 0.8
  					},
  					'bullets': {
  						min: 1,
  						max: 5,
  						chance: 0.5
  					},
  					'rifle': {
  						min: 1,
  						max: 1,
  						chance: 0.2
  					},
  					'medicine': {
  					  min: 1,
  					  max: 2,
  					  chance: 0.1
  					}
  				},
  				notification: 'a shot rings out, from somewhere in the long grass'
  			}
		}
  	}
];
