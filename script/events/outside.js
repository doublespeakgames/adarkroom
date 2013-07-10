/**
 * Events that can occur when the Outside module is active
 **/
Events.Outside = [
    { /* Ruined traps */
    	title: 'A Ruined Trap',
		isAvailable: function() {
			return Engine.activeModule == Outside && Outside.numBuilding('trap') > 0;
		},
		scenes: {
			'start': {
				text: [
					'some of the traps have been torn apart.',
					'large prints lead away, into the forest.'
				],
				onLoad: function() {
					var numWrecked = Math.floor(Math.random() * Outside.numBuilding('trap')) + 1;
					Outside.addBuilding('trap', -numWrecked);
					Outside.updateVillage();
					Outside.updateTrapButton();
				},
				notification: 'some traps have been destroyed',
				buttons: {
					'track': {
						text: 'track them',
						nextScene: {0.5: 'nothing', 1: 'catch'}
					},
					'ignore': {
						text: 'ignore them',
						nextScene: 'end'
					}
				}
			},
			'nothing': {
				text: [
					'the tracks disappear after just a few minutes.',
					'the forest is silent.'
				],
				buttons: {
					'end': {
						text: 'go home',
						nextScene: 'end'
					}
				}
			},
			'catch': {
				text: [
			       'not far from the village lies a large beast, its fur matted with blood.',
			       'it puts up little resistance before the knife.'
		        ],
				reward: {
					fur: 100,
					meat: 100,
					teeth: 10
				},
				buttons: {
					'end': {
						text: 'go home',
						nextScene: 'end'
					}
				}
			}
		}
    },
    
    { /* Sickness */
    	title: 'Sickness',
  		isAvailable: function() {
  			return Engine.activeModule == Outside && Outside.getPopulation() > 10 && Outside.getPopulation() < 50;
  		},
  		scenes: {
  			'start': {
  				text: [
  			    'a sickness is spreading through the village.',
  			    'medicine is needed immediately.'
  		    ],
  		    buttons: {
  		      'heal': {
  		        text: '1 medicine',
  		        cost: { 'medicine' : 1 },
  		        nextScene: {1: 'healed'}
  		      },
  					'ignore': {
  						text: 'ignore it',
  						nextScene: {1: 'death'}
  					}
  				}
  			},
  			'healed': {
  				text: [
  			    'the sickness is cured in time.'
  		    ],
  		    buttons: {
  					'end': {
  						text: 'go home',
  						nextScene: 'end'
  					}
  				}
  			},
  			'death': {
  				text: [
  			    'the sickness spreads through the village.',
  			    'the days are spent with burials.',
  			    'the nights are rent with screams.'
  		    ],
  		    onLoad: function() {
				    var numKilled = Math.floor(Math.random() * 20) + 1;
    				Outside.killVillagers(numKilled);
    			},
  		    buttons: {
  					'end': {
  						text: 'go home',
  						nextScene: 'end'
  					}
  				}
  			}
  		}
    },
    
    { /* Plague */
    	title: 'Plague',
  		isAvailable: function() {
  			return Engine.activeModule == Outside && Outside.getPopulation() > 50;
  		},
  		scenes: {
  			'start': {
  				text: [
  			    'a terrible plague is fast spreading through the village.',
  			    'medicine is needed immediately.'
  		    ],
  		    buttons: {
  		      'heal': {
  		        text: '5 medicine',
  		        cost: { 'medicine' : 5 },
  		        nextScene: {1: 'healed'}
  		      },
  					'ignore': {
  						text: 'do nothing',
  						nextScene: {1: 'death'}
  					}
  				}
  			},
  			'healed': {
  				text: [
  			    'the plague is kept from spreading.',
  			    'only a few die.',
  			    'the rest bury them.'
  		    ],
  		    onLoad: function() {
				    var numKilled = Math.floor(Math.random() * 5) + 2;
    				Outside.killVillagers(numKilled);
    			},
  		    buttons: {
  					'end': {
  						text: 'go home',
  						nextScene: 'end'
  					}
  				}
  			},
  			'death': {
  				text: [
  			    'the plague rips through the village.',
  			    'the nights are rent with screams.',
  			    'the only hope is a quick death.'
  		    ],
  		    onLoad: function() {
				    var numKilled = Math.floor(Math.random() * 80) + 10;
    				Outside.killVillagers(numKilled);
    			},
  		    buttons: {
  					'end': {
  						text: 'go home',
  						nextScene: 'end'
  					}
  				}
  			}
  		}
    },
    
    { /* Beast attack */
    	title: 'A Beast Attack',
		isAvailable: function() {
			return Engine.activeModule == Outside && Outside.getPopulation() > 0;
		},
		scenes: {
			'start': {
				text: [
			       'a pack of snarling beasts pours out of the trees.',
			       'the fight is short and bloody, but the beasts are repelled.',
			       'the villagers retreat to mourn the dead.'
		        ],
		        onLoad: function() {
					var numKilled = Math.floor(Math.random() * 10) + 1;
					Outside.killVillagers(numKilled);
				},
		        reward: {
		        	fur: 100,
		        	meat: 100,
		        	teeth: 10
		        },
		        buttons: {
					'end': {
						text: 'go home',
						nextScene: 'end'
					}
				}
			}
		}
    },
    
    { /* Soldier attack */
    	title: 'A Military Raid',
		isAvailable: function() {
			return Engine.activeModule == Outside && Outside.getPopulation() > 0 && State.cityCleared;
		},
		scenes: {
			'start': {
				text: [
			       'a gunshot rings through the trees.',
			       'well armed men charge out of the forest, firing into the crowd.',
			       'after a skirmish they are driven away, but not without losses.'
		        ],
		        onLoad: function() {
					var numKilled = Math.floor(Math.random() * 40) + 1;
					Outside.killVillagers(numKilled);
				},
		        reward: {
		        	bullets: 10,
		        	'cured meat': 50
		        },
		        buttons: {
					'end': {
						text: 'go home',
						nextScene: 'end'
					}
				}
			}
		}
    }
];
	