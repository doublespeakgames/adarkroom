/**
 * Events that can occur when the Outside module is active
 **/
Events.Outside = [
    { /* Ruined traps */
    	title: 'Зруйнована пастка',
		isAvailable: function() {
			return Engine.activeModule == Outside && Outside.numBuilding('пастки') > 0;
		},
		scenes: {
			'start': {
				text: [
					'Деякі з пасток були зруйновані вщент.',
					'Великі сліди ведуть у глибокий ліс.'
				],
				onLoad: function() {
					var numWrecked = Math.floor(Math.random() * Outside.numBuilding('пастки')) + 1;
					Outside.addBuilding('пастки', -numWrecked);
					Outside.updateVillage();
					Outside.updateTrapButton();
				},
				notification: 'Деякі пастки зруйновані',
				buttons: {
					'track': {
						text: 'простежити',
						nextScene: {0.5: 'nothing', 1: 'catch'}
					},
					'ignore': {
						text: 'не зважати',
						nextScene: 'end'
					}
				}
			},
			'nothing': {
				text: [
					'Сліди зникають через декілька хвилин.',
					'У лісі спокійно і тихо.'
				],
				buttons: {
					'end': {
						text: 'повернутися',
						nextScene: 'end'
					}
				}
			},
			'catch': {
				text: [
			       'Не так далеко від села, лежить велика тварюка. Її шерсть вкрита кров’ю.',
			       'Вона майже не чинила опору коли її зарізали.'
		        ],
				reward: {
					'шкури': 100,
					'м’ясо': 100,
					'клики': 10
				},
				buttons: {
					'end': {
						text: 'повернутися',
						nextScene: 'end'
					}
				}
			}
		}
    },
    
    { /* Beast attack */
    	title: 'Напад тварюк',
		isAvailable: function() {
			return Engine.activeModule == Outside && Outside.getPopulation() > 0;
		},
		scenes: {
			'start': {
				text: [
			       'Зграя тварюк з ричанням принеслася від лісу.',
			       'Бидва була короткою і кривавою, але тварюк відігнали.',
			       'Селяни відступили оплакувати померлих.'
		        ],
		        onLoad: function() {
					var numKilled = Math.floor(Math.random() * 10) + 1;
					Outside.killVillagers(numKilled);
				},
		        reward: {
		        	'шкури': 100,
		        	'м’ясо': 100,
		        	'клики': 10
		        },
		        buttons: {
					'end': {
						text: 'повернутися',
						nextScene: 'end'
					}
				}
			}
		}
    },
    
    { /* Soldier attack */
    	title: 'Напад військових',
		isAvailable: function() {
			return Engine.activeModule == Outside && Outside.getPopulation() > 0 && State.cityCleared;
		},
		scenes: {
			'start': {
				text: [
			       'Постріл почувся зза дерев.',
			       'Добре озброєні солдати біжать від лісу, стріляючи у натовп.',
			       'Після перестрілки, вони були відбиті, але не без втрат.'
		        ],
		        onLoad: function() {
					var numKilled = Math.floor(Math.random() * 40) + 1;
					Outside.killVillagers(numKilled);
				},
		        reward: {
		        	'набої': 10,
		        	'копченина': 50
		        },
		        buttons: {
					'end': {
						text: 'повернутися',
						nextScene: 'end'
					}
				}
			}
		}
    }
];
