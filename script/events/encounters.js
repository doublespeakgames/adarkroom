/**
 * Events that can occur when wandering around the world
 **/
Events.Encounters = [
	/* Tier 1 */
	{ /* Snarling Beast */
		title: 'Зубаста тварюка',
		isAvailable: function() {
			return World.getDistance() <= 10 && World.getTerrain() == World.TILE.FOREST;
		},
		scenes: {
			'start': {
				combat: true,
				enemy: 'зубаста тварюка',
				char: 'B',
				damage: 1,
				hit: 0.8,
				attackDelay: 1,
				health: 5,
				loot: {
					'шкури': {
						min: 1,
						max: 3,
						chance: 1
					},
					'м’ясо': {
						min: 1,
						max: 3,
						chance: 1
					},
					'клики': {
						min: 1,
						max: 3,
						chance: 0.8
					}
				},
				notification: 'Зубаста тварюка вискочила з під кущів.'
			}
		}
	},
	{ /* Gaunt Man */
		title: 'Худий чоловік',
		isAvailable: function() {
			return World.getDistance() <= 10 && World.getTerrain() == World.TILE.BARRENS;
		},
		scenes: {
			'start': {
				combat: true,
				enemy: 'худий чоловік',
				char: 'G',
				damage: 2,
				hit: 0.8,
				attackDelay: 2,
				health: 6,
				loot: {
					'шмаття': {
						min: 1,
						max: 3,
						chance: 0.8
					},
					'клики': {
						min: 1,
						max: 2,
						chance: 0.8
					},
					'шкіра': {
						min: 1,
						max: 2,
						chance: 0.5
					}
				},
				notification: 'Худий чоловік прямує до нас з дурнуватим виглядом.'
			}
		}
	},
	{ /* Strange Bird */
		title: 'Дивний птах',
		isAvailable: function() {
			return World.getDistance() <= 10 && World.getTerrain() == World.TILE.FIELD;
		},
		scenes: {
			'start': {
				combat: true,
				enemy: 'дивний птах',
				char: 'B',
				damage: 3,
				hit: 0.8,
				attackDelay: 2,
				health: 4,
				loot: {
					'луска': {
						min: 1,
						max: 3,
						chance: 0.8
					},
					'клики': {
						min: 1,
						max: 2,
						chance: 0.5
					},
					'м’ясо': {
						min: 1,
						max: 3,
						chance: 0.8
					}
				},
				notification: 'Дивний птах летить до нас через рівнину.'
			}
		}
	},
	/* Tier 2*/
	{ /* Man-eater */
		title: 'Людожер',
		isAvailable: function() {
			return World.getDistance() > 10 && World.getDistance() <= 20 && World.getTerrain() == World.TILE.FOREST;
		},
		scenes: {
			'start': {
				combat: true,
				enemy: 'людожер',
				char: 'E',
				damage: 3,
				hit: 0.8,
				attackDelay: 1,
				health: 25,
				loot: {
					'шкури': {
						min: 5,
						max: 10,
						chance: 1
					},
					'м’ясо': {
						min: 5,
						max: 10,
						chance: 1
					},
					'клики': {
						min: 5,
						max: 10,
						chance: 0.8
					}
				},
				notification: 'Велика тварюка намагається вхопити закривавленими кігтями.'
			}
		}
	},
	{ /* Scavenger */
		title: 'Падальщик',
		isAvailable: function() {
			return World.getDistance() > 10 && World.getDistance() <= 20 && World.getTerrain() == World.TILE.BARRENS;
		},
		scenes: {
			'start': {
				combat: true,
				enemy: 'падальщик',
				char: 'S',
				damage: 4,
				hit: 0.8,
				attackDelay: 2,
				health: 30,
				loot: {
					'шмаття': {
						min: 5,
						max: 10,
						chance: 0.8
					},
					'шкіра': {
						min: 5,
						max: 10,
						chance: 0.8
					},
					'залізо': {
						min: 1,
						max: 5,
						chance: 0.5
					}
				},
				notification: 'Падальщик підібрався поближче, сподівається на легку здобич.'
			}
		}
	},
	{ /* Huge Lizard */
		title: 'Гігантська ящірка',
		isAvailable: function() {
			return World.getDistance() > 10 && World.getDistance() <= 20 && World.getTerrain() == World.TILE.FIELD;
		},
		scenes: {
			'start': {
				combat: true,
				enemy: 'ящірка',
				char: 'L',
				damage: 5,
				hit: 0.8,
				attackDelay: 2,
				health: 20,
				loot: {
					'луска': {
						min: 5,
						max: 10,
						chance: 0.8
					},
					'клики': {
						min: 5,
						max: 10,
						chance: 0.5
					},
					'м’ясо': {
						min: 5,
						max: 10,
						chance: 0.8
					}
				},
				notification: 'Трава голосно затріщала коли велика ящірка проповзала через неї.'
			}
		}
	},
	/* Tier 3*/
	{ /* Feral Terror */
		title: 'Дика тварюка',
		isAvailable: function() {
			return World.getDistance() > 20 && World.getTerrain() == World.TILE.FOREST;
		},
		scenes: {
			'start': {
				combat: true,
				enemy: 'Дика тварюка',
				char: 'F',
				damage: 6,
				hit: 0.8,
				attackDelay: 1,
				health: 45,
				loot: {
					'шкури': {
						min: 5,
						max: 10,
						chance: 1
					},
					'м’ясо': {
						min: 5,
						max: 10,
						chance: 1
					},
					'клики': {
						min: 5,
						max: 10,
						chance: 0.8
					}
				},
				notification: 'Тварюка, з диким блиском у очах, проривається через листя.'
			}
		}
	},
	{ /* Soldier */
		title: 'Солдат',
		isAvailable: function() {
			return World.getDistance() > 20 && World.getTerrain() == World.TILE.BARRENS;
		},
		scenes: {
			'start': {
				combat: true,
				enemy: 'солдат',
				ranged: true,
				char: 'D',
				damage: 8,
				hit: 0.8,
				attackDelay: 2,
				health: 50,
				loot: {
					'шмаття': {
						min: 5,
						max: 10,
						chance: 0.8
					},
					'набої': {
						min: 1,
						max: 5,
						chance: 0.5
					},
					'рушниця': {
						min: 1,
						max: 1,
						chance: 0.2
					}
				},
				notification: 'Солдат почав стрільбу через пустелю.'
			}
		}
	},
	{ /* Sniper */
		title: 'Снайпер',
		isAvailable: function() {
			return World.getDistance() > 20 && World.getTerrain() == World.TILE.FIELD;
		},
		scenes: {
			'start': {
				combat: true,
				enemy: 'снайпер',
				char: 'S',
				damage: 15,
				hit: 0.8,
				attackDelay: 4,
				health: 30,
				ranged: true,
				loot: {
					'шмаття': {
						min: 5,
						max: 10,
						chance: 0.8
					},
					'набої': {
						min: 1,
						max: 5,
						chance: 0.5
					},
					'рушниця': {
						min: 1,
						max: 1,
						chance: 0.2
					}
				},
				notification: 'Постріл почувся звідкись із трави.'
			}
		}
	},
];