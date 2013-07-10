/**
 * Events that can occur when the Room module is active
 **/
Events.Room = [
	{ /* The Nomad  --  Merchant */
		title: 'The Nomad',
		isAvailable: function() {
			return Engine.activeModule == Room && Engine.getStore('fur') > 0;
		},
		scenes: {
			'start': {
				text: [
					'a nomad shuffles into view, laden with makeshift bags bound with rough twine.',
					"won't say from where he came, but it's clear that he's not staying."
				],
				notification: 'a nomad arrives, looking to trade',
				buttons: {
					'buyScales': {
						text: 'buy scales',
						cost: { 'fur': 100 },
						reward: { 'scales': 1 }
					},
					'buyTeeth': {
						text: 'buy teeth',
						cost: { 'fur': 200 },
						reward: { 'teeth': 1 }
					},
					'buyBait': {
						text: 'buy bait',
						cost: { 'fur': 5 },
						reward: { 'bait': 1 },
						notification: 'traps are more effective with bait.'
					},
					'buyCompass': {
						available: function() {
							return Engine.getStore('compass') < 1;
						},
						text: 'buy compass',
						cost: { fur: 300, scales: 15, teeth: 5 },
						reward: { 'compass': 1 },
						notification: 'the old compass is dented and dusty, but it looks to work.',
						onChoose: Engine.openPath
					}, 
					'goodbye': {
						text: 'say goodbye',
						nextScene: 'end'
					}
				}
			}
		}
	}, { /* Noises Outside  --  gain wood/fur */
		title: 'Noises',
		isAvailable: function() {
			return Engine.activeModule == Room && Engine.storeAvailable('wood');
		},
		scenes: {
			'start': {
				text: [
					'through the walls, shuffling noises can be heard.',
					"can't tell what they're up to."
				],
				notification: 'strange noises can be heard through the walls',
				buttons: {
					'investigate': {
						text: 'investigate',
						nextScene: { 0.3: 'stuff', 1: 'nothing' }
					},
					'ignore': {
						text: 'ignore them',
						nextScene: 'end'
					}
				}
			},
			'nothing': {
				text: [
					'vague shapes move, just out of sight.',
					'the sounds stop.'
				],
				buttons: {
					'backinside': {
						text: 'go back inside',
						nextScene: 'end'
					}
				}
			},
			'stuff': {
				reward: { wood: 100, fur: 10 },
				text: [
					'a bundle of sticks lies just beyond the threshold, wrapped in coarse furs.',
					'the night is silent.'
				],
				buttons: {
					'backinside': {
						text: 'go back inside',
						nextScene: 'end'
					}
				}
			}
		}
	},
	{ /* Noises Inside  --  trade wood for better good */
		title: 'Noises',
		isAvailable: function() {
			return Engine.activeModule == Room && Engine.storeAvailable('wood');
		},
		scenes: {
			start: {
				text: [
			       'scratching noises can be heard from the store room.',
			       'something\'s in there.'
				],
				notification: 'something\'s in the store room',
				buttons: {
					'investigate': {
						text: 'investigate',
						nextScene: { 0.5: 'scales', 0.8: 'teeth', 1: 'cloth' }
					},
					'ignore': {
						text: 'ignore them',
						nextScene: 'end'
					}
				}
			},
			scales: {
				text: [
			       'some wood is missing.',
			       'the ground is littered with small scales'
			    ],
			    onLoad: function() {
			    	var numWood = Engine.getStore('wood');
			    	numWood = Math.floor(numWood * 0.1);
			    	if(numWood == 0) numWood = 1;
			    	var numScales = Math.floor(numWood / 5);
			    	if(numScales == 0) numScales = 1;
			    	Engine.addStores({wood: -numWood, scales: numScales});
			    },
			    buttons: {
			    	'leave': {
			    		text: 'leave',
			    		nextScene: 'end'
			    	}
			    }
			},
			teeth: {
				text: [
			       'some wood is missing.',
			       'the ground is littered with small teeth'
			    ],
			    onLoad: function() {
			    	var numWood = Engine.getStore('wood');
			    	numWood = Math.floor(numWood * 0.1);
			    	if(numWood == 0) numWood = 1;
			    	var numTeeth = Math.floor(numWood / 5);
			    	if(numTeeth == 0) numTeeth = 1;
			    	Engine.addStores({wood: -numWood, teeth: numTeeth});
			    },
			    buttons: {
			    	'leave': {
			    		text: 'leave',
			    		nextScene: 'end'
			    	}
			    }
			},
			cloth: {
				text: [
			       'some wood is missing.',
			       'the ground is littered with scraps of cloth'
			    ],
			    onLoad: function() {
			    	var numWood = Engine.getStore('wood');
			    	numWood = Math.floor(numWood * 0.1);
			    	if(numWood == 0) numWood = 1;
			    	var numCloth = Math.floor(numWood / 5);
			    	if(numCloth == 0) numCloth = 1;
			    	Engine.addStores({wood: -numWood, cloth: numCloth});
			    },
			    buttons: {
			    	'leave': {
			    		text: 'leave',
			    		nextScene: 'end'
			    	}
			    }
			}
		}
	},
	{ /* The Beggar  --  trade fur for better good */
		title: 'The Beggar',
		isAvailable: function() {
			return Engine.activeModule == Room && Engine.storeAvailable('fur');
		},
		scenes: {
			start: {
				text: [
			       'a beggar arrives.',
			       'asks for any spare furs to keep him warm at night.'
				],
				notification: 'a beggar arrives',
				buttons: {
					'50furs': {
						text: 'give 50',
						cost: {fur: 50},
						nextScene: { 0.5: 'scales', 0.8: 'teeth', 1: 'cloth' }
					},
					'100furs': {
						text: 'give 100',
						cost: {fur: 100},
						nextScene: { 0.5: 'teeth', 0.8: 'scales', 1: 'cloth' }
					},
					'deny': {
						text: 'turn him away',
						nextScene: 'end'
					}
				}
			},
			scales: {
				reward: { scales: 20 },
				text: [
			       'the beggar expresses his thanks.',
			       'leaves a pile of small scales behind.'
			    ],
			    buttons: {
			    	'leave': {
			    		text: 'say goodbye',
			    		nextScene: 'end'
			    	}
			    }
			},
			teeth: {
				reward: { teeth: 20 },
				text: [
			       'the beggar expresses his thanks.',
			       'leaves a pile of small teeth behind.'
			    ],
			    buttons: {
			    	'leave': {
			    		text: 'say goodbye',
			    		nextScene: 'end'
			    	}
			    }
			},
			cloth: {
				reward: { cloth: 20 },
				text: [
			       'the beggar expresses his thanks.',
			       'leaves some scraps of cloth behind.'
			    ],
			    buttons: {
			    	'leave': {
			    		text: 'say goodbye',
			    		nextScene: 'end'
			    	}
			    }
			}
		}
	},
	
	{ /* Mysterious Wanderer  --  wood gambling */
		title: 'The Mysterious Wanderer',
		isAvailable: function() {
			return Engine.activeModule == Room && Engine.storeAvailable('wood');
		},
		scenes: {
			start: {
				text: [
			       'a wanderer arrives with an empty cart. says if he leaves with wood, he\'ll be back with more.',
			       "builder's not sure he's to be trusted."
				],
				notification: 'a mysterious wanderer arrives',
				buttons: {
					'100wood': {
						text: 'give 100',
						cost: {wood: 100},
						nextScene: { 1: '100wood'}
					},
					'500wood': {
						text: 'give 500',
						cost: {wood: 500},
						nextScene: { 1: '500wood' }
					},
					'deny': {
						text: 'turn him away',
						nextScene: 'end'
					}
				}
			},
			'100wood': {
				text: [
			       'the wanderer leaves, cart loaded with wood',
			    ],
			    onLoad: function() {
			    	if(Math.random() < 0.5) {
			    		setTimeout(function() {
			    			Engine.addStore('wood', 300);
			    			Notifications.notify(Room, 'the mysterious wanderer returns, cart piled high with wood.');
			    		}, 60 * 1000);
			    	}
			    },
			    buttons: {
			    	'leave': {
			    		text: 'say goodbye',
			    		nextScene: 'end'
			    	}
			    }
			},
			'500wood': {
				text: [
				       'the wanderer leaves, cart loaded with wood',
			    ],
			    onLoad: function() {
			    	if(Math.random() < 0.3) {
			    		setTimeout(function() {
			    			Engine.addStore('wood', 1500);
			    			Notifications.notify(Room, 'the mysterious wanderer returns, cart piled high with wood.');
			    		}, 60 * 1000);
			    	}
			    },
			    buttons: {
			    	'leave': {
			    		text: 'say goodbye',
			    		nextScene: 'end'
			    	}
			    }
			}
		}
	},
	
	{ /* Mysterious Wanderer  --  fur gambling */
		title: 'The Mysterious Wanderer',
		isAvailable: function() {
			return Engine.activeModule == Room && Engine.storeAvailable('fur');
		},
		scenes: {
			start: {
				text: [
			       'a wanderer arrives with an empty cart. says if she leaves with furs, she\'ll be back with more.',
			       "builder's not sure she's to be trusted."
				],
				notification: 'a mysterious wanderer arrives',
				buttons: {
					'100fur': {
						text: 'give 100',
						cost: {fur: 100},
						nextScene: { 1: '100fur'}
					},
					'500fur': {
						text: 'give 500',
						cost: {fur: 500},
						nextScene: { 1: '500fur' }
					},
					'deny': {
						text: 'turn her away',
						nextScene: 'end'
					}
				}
			},
			'100fur': {
				text: [
			       'the wanderer leaves, cart loaded with furs',
			    ],
			    onLoad: function() {
			    	if(Math.random() < 0.5) {
			    		setTimeout(function() {
			    			Engine.addStore('fur', 300);
			    			Notifications.notify(Room, 'the mysterious wanderer returns, cart piled high with furs.');
			    		}, 60 * 1000);
			    	}
			    },
			    buttons: {
			    	'leave': {
			    		text: 'say goodbye',
			    		nextScene: 'end'
			    	}
			    }
			},
			'500fur': {
				text: [
				       'the wanderer leaves, cart loaded with furs',
			    ],
			    onLoad: function() {
			    	if(Math.random() < 0.3) {
			    		setTimeout(function() {
			    			Engine.addStore('fur', 1500);
			    			Notifications.notify(Room, 'the mysterious wanderer returns, cart piled high with furs.');
			    		}, 60 * 1000);
			    	}
			    },
			    buttons: {
			    	'leave': {
			    		text: 'say goodbye',
			    		nextScene: 'end'
			    	}
			    }
			}
		}
	},
	
	{ /* The Scout  --  Map Merchant */
		title: 'The Scout',
		isAvailable: function() {
			return Engine.activeModule == Room && typeof State.world == 'object';
		},
		scenes: {
			'start': {
				text: [
					"the scout says she's been all over.",
					"willing to talk about it, for a price."
				],
				notification: 'a scout stops for the night',
				buttons: {
					'buyMap': {
						text: 'buy map',
						cost: { 'fur': 200, 'scales': 10 },
						notification: 'the map uncovers a bit of the world',
						onChoose: World.applyMap
					},
					'learn': {
						text: 'learn scouting',
						cost: { 'fur': 1000, 'scales': 50, 'teeth': 20 },
						available: function() {
							return !Engine.hasPerk('scout');
						},
						onChoose: function() {
							Engine.addPerk('scout');
						}
					},
					'leave': {
			    		text: 'say goodbye',
			    		nextScene: 'end'
			    	}
				}
			}
		}
	},
	
	{ /* The Wandering Master */
		title: 'The Master',
		isAvailable: function() {
			return Engine.activeModule == Room && typeof State.world == 'object';
		},
		scenes: {
			'start': {
				text: [
					'an old wanderer arrives.',
					'he smiles warmly and asks for lodgings for the night.'
				],
				notification: 'an old wanderer arrives',
				buttons: {
					'agree': {
						text: 'agree',
						cost: {
							'cured meat': 100,
							'fur': 100,
							'torch': 1
						},
						nextScene: {1: 'agree'}
					},
					'deny': {
						text: 'turn him away',
						nextScene: 'end'
					}
				}
			},
			'agree': {
				text: [
			       'in exchange, the wanderer offers his wisdom.'
		        ],
		        buttons: {
		        	'evasion': {
		        		text: 'evasion',
		        		available: function() {
		        			return !Engine.hasPerk('evasive');
		        		},
		        		onChoose: function() {
		        			Engine.addPerk('evasive');
		        		},
		        		nextScene: 'end'
		        	},
		        	'precision': {
		        		text: 'precision',
		        		available: function() {
		        			return !Engine.hasPerk('precise');
		        		},
		        		onChoose: function() {
		        			Engine.addPerk('precise');
		        		},
		        		nextScene: 'end'
		        	},
		        	'force': {
		        		text: 'force',
		        		available: function() {
		        			return !Engine.hasPerk('barbarian');
		        		},
		        		onChoose: function() {
		        			Engine.addPerk('barbarian');
		        		},
		        		nextScene: 'end'
		        	},
		        	'nothing': {
		        		text: 'nothing',
		        		nextScene: 'end'
		        	}
		        }
			}
		}
	},
		
	{ /* The Sick Man */
  		title: 'The Sick Man',
  		isAvailable: function() {
  			return Engine.activeModule == Room && typeof State.world == 'object';
  		},
  		scenes: {
  			'start': {
  				text: [
  					"a man hobbles up, coughing.",
  					"he begs for medicine."
  				],
  				notification: 'a sick man hobbles up',
  				buttons: {
  					'help': {
  						text: 'give 1 medicine',
  						cost: { 'medicine': 1 },
  						notification: 'the man swallows the medicine eagerly',
  						nextScene: { 0.1: 'alloy', 0.3: 'cells', 0.5: 'scales', 1.0: 'nothing' }
  					},
  					'ignore': {
  						text: 'tell him to leave',
  						nextScene: 'end'
  					}
  				}
  			},
  			'alloy': {
  				text: [
  					"the man is thankful.",
  					'he leaves a reward.',
  					'some weird metal he picked up on his travels.'
  				],
  				onLoad: function() {
			    	Engine.addStore('alien alloy', 1);
			    },
  				buttons: {
  					'bye': {
  						text: 'say goodbye',
  						nextScene: 'end'
  					}
  				}
  			},
  			'cells': {
  				text: [
  					"the man is thankful.",
  					'he leaves a reward.',
  					'some weird glowing boxes he picked up on his travels.'
  				],
  				onLoad: function() {
			    	Engine.addStore('energy cell', 3);
			    },
  				buttons: {
  					'bye': {
  						text: 'say goodbye',
  						nextScene: 'end'
  					}
  				}
  			},
  			'scales': {
  				text: [
  					"the man is thankful.",
  					'he leaves a reward.',
  					'all he has are some scales.'
  				],
  				onLoad: function() {
			    	Engine.addStore('scales', 5);
			    },
  				buttons: {
  					'bye': {
  						text: 'say goodbye',
  						nextScene: 'end'
  					}
  				}
  			},
  			'nothing': {
  				text: [
  					"the man expresses his thanks and hobbles off."
  				],
  				buttons: {
  					'bye': {
  						text: 'say goodbye',
  						nextScene: 'end'
  					}
  				}
  		  }
  	}
	}
];