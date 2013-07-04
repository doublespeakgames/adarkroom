/**
 * Events that only occur at specific times. Launched manually.
 **/
Events.Setpieces = {
	"outpost": { /* Friendly Outpost */
		title: 'Стоянка',
		scenes: {
			'start': {
				text: [
					'Безпечне місце для відпочинку.'
				],
				notification: 'Безпечне місце для відпочинку.',
				loot: {
					'копченина': {
						min: 5,
						max: 10,
						chance: 1
					}
				},
				onLoad: function() {
					World.useOutpost();
				},
				buttons: {
					'leave': {
						text: 'полишити',
						nextScene: 'end'
					}
				}
			}
		}
	},
	"swamp": { /* Swamp */
		title: 'Темне болото',
		scenes: {
			'start': {
				text: [
					'rotting reeds rise out of the swampy earth.',
					'a lone frog sits in the muck, silently.'
				],
				notification: 'a swamp festers in the stagnant air.',
				buttons: {
					'enter': {
						text: 'увійти',
						nextScene: {1: 'cabin'}
					},
					'leave': {
						text: 'полишити',
						nextScene: 'end'
					}
				}
			},
			'cabin': {
				text: [
					'Глибоко у болоті стоїть вкрита мохом кабіна.',
					'Старий космонавт сидить усередині.'
				],
				buttons: {
					'talk': {
						cost: {'буси': 1},
						text: 'побалакати',
						nextScene: {1: 'talk'}
					},
					'leave': {
						text: 'полишити',
						nextScene: 'end'
					}
				}
			},
			'talk': {
				text: [
					'the wanderer takes the charm and nods slowly.',
					'he speaks of once leading the great fleets to fresh worlds.',
					'unfathomable destruction to fuel wanderer hungers.',
					'his time here, now, is his penance.'
				],
				onLoad: function() {
					Engine.addPerk('кухар');
					World.markVisited(World.curPos[0], World.curPos[1]);
				},
				buttons: {
					'leave': {
						text: 'полишити',
						nextScene: 'end'
					}
				}
			}
		}
	},
	"cave": { /* Cave */
		title: 'Волога печера',
		scenes: {
			'start': {
				text: [
					'the mouth of the cave is wide and dark.',
					"can't see what's inside."
				],
				notification: 'the earth here is split, as if bearing an ancient wound',
				buttons: {
					'enter': {
						text: 'зайти',
						cost: { 'смолоскип': 1 },
						nextScene: {0.3: 'a1', 0.6: 'a2', 1: 'a3'}
					},
					'leave': {
						text: 'полишити',
						nextScene: 'end'
					}
				}
			},
			
			'a1': {
				combat: true,
				enemy: 'beast',
				char: 'B',
				damage: 1,
				hit: 0.8,
				attackDelay: 1,
				health: 5,
				notification: 'a startled beast defends its home',
				loot: {
					'шкури': {
						min: 1,
						max: 10,
						chance: 1
					},
					'клики': {
						min: 1,
						max: 5,
						chance: 0.8
					}
				},
				buttons: {
					'continue': {
						text: 'продовжити',
						nextScene: {0.5: 'b1', 1: 'b2'}
					},
					'leave': {
						text: 'вибратися',
						nextScene: 'end'
					}
				}
			},
			'a2': {
				text: [
					'the cave narrows a few feet in.',
					"the walls are moist and moss-covered"
				],
				buttons: {
					'continue': {	
						text: 'протиснутися',
						nextScene: {0.5: 'b2', 1: 'b3'}
					},
					'leave': {
						text: 'вибратися',
						nextScene: 'end'
					}
				}
			},
			'a3': {
				text: [
				   'the remains of an old camp sits just inside the cave.',
				   'bedrolls, torn and blackened, lay beneath a thin layer of dust.'
				],
				loot: {
					'копченина': {
						min: 1,
						max: 5,
						chance: 1
					},
					'смолоскип': {
						min: 1,
						max: 5,
						chance: 0.5
					},
					'шкіра': {
						min: 1,
						max: 5,
						chance: 0.3
					}
				},
				buttons: {
					'continue': {	
						text: 'продовжити',
						nextScene: {0.5: 'b3', 1: 'b4'}
					},
					'leave': {
						text: 'вибратися',
						nextScene: 'end'
					}
				}
			},
			'b1': {
				text: [
				   'the body of a wanderer lies in a small cavern.',
				   "rot's been to work on it, and some of the pieces are missing.",
				   "can't tell what left it here."
				],
				loot: {
					'меч': {
						min: 1,
						max: 1,
						chance: 1
					},
					'копченина': {
						min: 1,
						max: 5,
						chance: 0.8
					},
					'смолоскип': {
						min: 1,
						max: 3,
						chance: 0.5
					}
				},
				buttons: {
					'continue': {	
						text: 'продовжити',
						nextScene: { 1: 'c1' }
					},
					'leave': {
						text: 'вибратися',
						nextScene: 'end'
					}
				}
			},
			'b2': {
				text: [
				   'the смолоскип sputters and dies in the damp air',
				   'the darkness is absolute'
				],
				notification: 'the смолоскип goes out',
				buttons: {
					'continue': {	
						text: 'продовжити',
						cost: {'смолоскип': 1},
						nextScene: { 1: 'c1' }
					},
					'leave': {
						text: 'вибратися',
						nextScene: 'end'
					}
				}
			},
			'b3': {
				combat: true,
				enemy: 'beast',
				char: 'B',
				damage: 1,
				hit: 0.8,
				attackDelay: 1,
				health: 5,
				notification: 'a startled beast defends its home',
				loot: {
					'шкури': {
						min: 1,
						max: 3,
						chance: 1
					},
					'клики': {
						min: 1,
						max: 2,
						chance: 0.8
					}
				},
				buttons: {
					'continue': {
						text: 'продовжити',
						nextScene: {1: 'c2'}
					},
					'leave': {
						text: 'вибратися',
						nextScene: 'end'
					}
				}
			},
			'b4': {
				combat: true,
				enemy: 'cave lizard',
				char: 'L',
				damage: 3,
				hit: 0.8,
				attackDelay: 2,
				health: 6,
				notification: 'a cave lizard attacks',
				loot: {
					'луска': {
						min: 1,
						max: 3,
						chance: 1
					},
					'клики': {
						min: 1,
						max: 2,
						chance: 0.8
					}
				},
				buttons: {
					'continue': {
						text: 'продовжити',
						nextScene: {1: 'c2'}
					},
					'leave': {
						text: 'вибратися',
						nextScene: 'end'
					}
				}
			},
			'c1': {
				combat: true,
				enemy: 'beast',
				char: 'B',
				damage: 3,
				hit: 0.8,
				attackDelay: 2,
				health: 10,
				notification: 'a large beast charges out of the dark',
				loot: {
					'шкури': {
						min: 1,
						max: 3,
						chance: 1
					},
					'клики': {
						min: 1,
						max: 3,
						chance: 1
					}
				},
				buttons: {
					'continue': {
						text: 'продовжити',
						nextScene: {0.5: 'end1', 1: 'end2'}
					},
					'leave': {
						text: 'вибратися',
						nextScene: 'end'
					}
				}
			},
			'c2': {
				combat: true,
				enemy: 'lizard',
				char: 'L',
				damage: 4,
				hit: 0.8,
				attackDelay: 2,
				health: 10,
				notification: 'a giant lizard shambles forward',
				loot: {
					'луска': {
						min: 1,
						max: 3,
						chance: 1
					},
					'клики': {
						min: 1,
						max: 3,
						chance: 1
					}
				},
				buttons: {
					'continue': {
						text: 'продовжити',
						nextScene: {0.7: 'end2', 1: 'end3'}
					},
					'leave': {
						text: 'вибратися',
						nextScene: 'end'
					}
				}
			},
			'end1': {
				text: [
				   'the nest of a large animal lies at the back of the cave.'
				],
				onLoad: function() {
					World.clearDungeon();
				},
				loot: {
					'м’ясо': {
						min: 5,
						max: 10,
						chance: 1
					},
					'шкури': {
						min: 5,
						max: 10,
						chance: 1
					},
					'луска': {
						min: 5,
						max: 10,
						chance: 1
					},
					'клики': {
						min: 5,
						max: 10,
						chance: 1
					},
					'шмаття': {
						min: 5,
						max: 10,
						chance: 0.5
					}
				},
				buttons: {
					'leave': {
						text: 'вибратися',
						nextScene: 'end'
					}
				}
			},
			'end2': {
				text: [
				   'a small supply cache is hidden at the back of the cave.'
				],
				loot: {
					'шмаття': {
						min: 5,
						max: 10,
						chance: 1
					},
					'шкіра': {
						min: 5,
						max: 10,
						chance: 1
					},
					'залізо': {
						min: 5,
						max: 10,
						chance: 1
					},
					'копченина': {
						min: 5,
						max: 10,
						chance: 1
					},
					'сталь': {
						min: 5,
						max: 10,
						chance: 0.5
					},
					'болас': {
						min: 1,
						max: 3,
						chance: 0.3
					}
				},
				onLoad: function() {
					World.clearDungeon();
				},
				buttons: {
					'leave': {
						text: 'вибратися',
						nextScene: 'end'
					}
				}
			},
			'end3': {
				text: [
				   'an old case is wedged behind a rock, covered in a thick layer of dust.'
				],
				loot: {
					'шабля': {
						min: 1,
						max: 1,
						chance: 1
					},
					'болас': {
						min: 1,
						max: 3,
						chance: 0.5
					}
				},
				onLoad: function() {
					World.clearDungeon();
				},
				buttons: {
					'leave': {
						text: 'вибратися',
						nextScene: 'end'
					}
				}
			}
		}
	},
	"town": { /* Town */
		title: 'Пустельне містечко',
		scenes: {
			'start': {
				text: [
					'a small suburb lays ahead, empty houses scorched and peeling.',
					"broken streetlights stand, rusting. light hasn't graced this place in a long time."
				],
				notification: "the town lies abandoned, its citizens long dead",
				buttons: {
					'enter': {
						text: 'розвідати',
						nextScene: {0.5: 'a1', 1: 'a2'}
					},
					'leave': {
						text: 'полишити',
						nextScene: 'end'
					}
				}
			},
			
			'a1': {
				text: [
					"where the windows of the schoolhouse aren't shattered, they're blackened with soot.",
					'the double doors creak endlessly in the wind.'
				],
				buttons: {
					'enter': {
						text: 'увійти',
						nextScene: {0.5: 'b1', 1: 'b2'},
						cost: {'смолоскип': 1}
					},
					'leave': {
						text: 'піти з містечка',
						nextScene: 'end'
					}
				}
			},
			'a2': {
				combat: true,
				enemy: 'thug',
				char: 'T',
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
					'копченина': {
						min: 1,
						max: 5,
						chance: 0.5
					}
				},
				notification: 'ambushed on the street.',
				buttons: {
					'continue': {
						text: 'продовжити',
						nextScene: {0.5: 'b3', 1: 'b4'}
					},
					'leave': {
						text: 'піти з містечка',
						nextScene: 'end'
					}
				}
			},
			'b1': {
				text: [
				   'a small cache of supplies is tucked inside a rusting locker.'
				],
				loot: {
					'копченина': {
						min: 1,
						max: 5,
						chance: 1
					},
					'смолоскип': {
						min: 1,
						max: 3,
						chance: 0.8
					},
					'набої': {
						min: 1,
						max: 5,
						chance: 0.3
					}
				},
				buttons: {
					'continue': {
						text: 'продовжити',
						nextScene: {0.5: 'c1', 1: 'c2'}
					},
					'leave': {
						text: 'піти з містечка',
						nextScene: 'end'
					}
				}
			},
			'b2': {
				combat: true,
				enemy: 'scavenger',
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
					'копченина': {
						min: 1,
						max: 5,
						chance: 0.5
					}
				},
				notification: 'a scavenger waits just inside the door.',
				buttons: {
					'continue': {
						text: 'продовжити',
						nextScene: {0.5: 'c2', 1: 'c3'}
					},
					'leave': {
						text: 'піти з містечка',
						nextScene: 'end'
					}
				}
			},
			'b3': {
				combat: true,
				enemy: 'beast',
				char: 'B',
				damage: 3,
				hit: 0.8,
				attackDelay: 1,
				health: 25,
				loot: {
					'клики': {
						min: 1,
						max: 5,
						chance: 1
					},
					'шкури': {
						min: 5,
						max: 10,
						chance: 1
					}
				},
				notification: 'a beast stands alone in an overgrown park.',
				buttons: {
					'continue': {
						text: 'продовжити',
						nextScene: {0.5: 'c4', 1: 'c5'}
					},
					'leave': {
						text: 'піти з містечка',
						nextScene: 'end'
					}
				}
			},
			'b4': {
				text: [
				   'an overturned caravan is spread across the pockmarked street.',
				   "it's been picked over by scavengers, but there's still some things worth taking."
				],
				loot: {
					'копченина': {
						min: 1,
						max: 5,
						chance: 0.8
					},
					'смолоскип': {
						min: 1,
						max: 3,
						chance: 0.5
					},
					'набої': {
						min: 1,
						max: 5,
						chance: 0.3
					}
				},
				buttons: {
					'continue': {	
						text: 'продовжити',
						nextScene: {0.5: 'c5', 1: 'c6' }
					},
					'leave': {
						text: 'піти з містечка',
						nextScene: 'end'
					}
				}
			},
			'c1': {
				combat: true,
				enemy: 'thug',
				char: 'T',
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
					'копченина': {
						min: 1,
						max: 5,
						chance: 0.5
					}
				},
				notification: 'a thug moves out of the shadows.',
				buttons: {
					'continue': {
						text: 'продовжити',
						nextScene: {1: 'd1'}
					},
					'leave': {
						text: 'піти з містечка',
						nextScene: 'end'
					}
				}
			},
			'c2': {
				combat: true,
				enemy: 'beast',
				char: 'B',
				damage: 3,
				hit: 0.8,
				attackDelay: 1,
				health: 25,
				loot: {
					'клики': {
						min: 1,
						max: 5,
						chance: 1
					},
					'шкури': {
						min: 5,
						max: 10,
						chance: 1
					}
				},
				notification: 'a beast charges out of a ransacked classroom.',
				buttons: {
					'continue': {
						text: 'продовжити',
						nextScene: {1: 'd1'}
					},
					'leave': {
						text: 'піти з містечка',
						nextScene: 'end'
					}
				}
			},
			'c3': {
				text: [
				   'through the large gymnasium doors, footsteps can be heard.',
				   'the смолоскипlight casts a flickering glow down the hallway.',
				   'the footsteps stop.'
				],
				buttons: {
					'continue': {
						text: 'увійти',
						nextScene: {1: 'd1'}
					},
					'leave': {
						text: 'піти з містечка',
						nextScene: 'end'
					}
				}
			},
			'c4': {
				combat: true,
				enemy: 'beast',
				char: 'B',
				damage: 4,
				hit: 0.8,
				attackDelay: 1,
				health: 25,
				loot: {
					'клики': {
						min: 1,
						max: 5,
						chance: 1
					},
					'шкури': {
						min: 5,
						max: 10,
						chance: 1
					}
				},
				notification: 'another beast, draw by the noise, leaps out of a copse of trees.',
				buttons: {
					'continue': {
						text: 'продовжити',
						nextScene: {1: 'd2'}
					},
					'leave': {
						text: 'піти з містечка',
						nextScene: 'end'
					}
				}
			},
			'c5': {
				text: [
				   "something's causing a commotion a ways down the road.",
				   "a fight, maybe."
				],
				buttons: {
					'continue': {
						text: 'продовжити',
						nextScene: {1: 'd2'}
					},
					'leave': {
						text: 'піти з містечка',
						nextScene: 'end'
					}
				}
			},
			'c6': {
				text: [
				   'a small basket of food is hidden under a park bench, with a note attached.',
				   "can't read the words."
				],
				loot: {
					'копченина': {
						min: 1,
						max: 5,
						chance: 1
					}
				},
				buttons: {
					'continue': {
						text: 'продовжити',
						nextScene: {1: 'd2'}
					},
					'leave': {
						text: 'піти з містечка',
						nextScene: 'end'
					}
				}
			},
			'd1': {
				combat: true,
				enemy: 'scavenger',
				char: 'S',
				damage: 5,
				hit: 0.8,
				attackDelay: 2,
				health: 30,
				loot: {
					'копченина': {
						min: 1,
						max: 5,
						chance: 1
					},
					'шкіра': {
						min: 5,
						max: 10,
						chance: 0.8
					},
					'шабля': {
						min: 1,
						max: 1,
						chance: 0.5
					}
				},
				notification: 'a panicked scavenger bursts through the door, screaming.',
				buttons: {
					'continue': {
						text: 'продовжити',
						nextScene: {0.5: 'end1', 1: 'end2'}
					},
					'leave': {
						text: 'піти з містечка',
						nextScene: 'end'
					}
				}
			},
			'd2': {
				combat: true,
				enemy: 'vigilante',
				char: 'V',
				damage: 6,
				hit: 0.8,
				attackDelay: 2,
				health: 30,
				loot: {
					'копченина': {
						min: 1,
						max: 5,
						chance: 1
					},
					'шкіра': {
						min: 5,
						max: 10,
						chance: 0.8
					},
					'шабля': {
						min: 1,
						max: 1,
						chance: 0.5
					}
				},
				notification: "a man stands over a dead wanderer. notices he's not alone.",
				buttons: {
					'continue': {
						text: 'продовжити',
						nextScene: {0.5: 'end3', 1: 'end4'}
					},
					'leave': {
						text: 'піти з містечка',
						nextScene: 'end'
					}
				}
			},
			'end1': {
				text: [
				   'scavenger had a small camp in the school.',
				   'collected scraps spread across the floor like they fell from heaven.'
				],
				onLoad: function() {
					World.clearDungeon();
				},
				loot: {
					'шабля': {
						min: 1,
						max: 1,
						chance: 1
					},
					'сталь': {
						min: 5,
						max: 10,
						chance: 1
					},
					'копченина': {
						min: 5,
						max: 10,
						chance: 1
					},
					'болас': {
						min: 1,
						max: 5,
						chance: 0.5
					}
				},
				buttons: {
					'leave': {
						text: 'піти з містечка',
						nextScene: 'end'
					}
				}
			},
			'end2': {
				text: [
				   "scavenger'd been looking for supplies in here, it seems.",
				   "a shame to let what he'd found go to waste."
				],
				onLoad: function() {
					World.clearDungeon();
				},
				loot: {
					'вугілля': {
						min: 5,
						max: 10,
						chance: 1
					},
					'копченина': {
						min: 5,
						max: 10,
						chance: 1
					},
					'шкіра': {
						min: 5,
						max: 10,
						chance: 1
					}
				},
				buttons: {
					'leave': {
						text: 'піти з містечка',
						nextScene: 'end'
					}
				}
			},
			'end3': {
				text: [
				   "beneath the wanderer's rags, clutched in one of its many hands, a glint of steel.",
				   "worth killing for, it seems."
				],
				onLoad: function() {
					World.clearDungeon();
				},
				loot: {
					'рушниця': {
						min: 1,
						max: 1,
						chance: 1
					},
					'набої': {
						min: 1,
						max: 5,
						chance: 1
					}
				},
				buttons: {
					'leave': {
						text: 'піти з містечка',
						nextScene: 'end'
					}
				}
			},
			'end4': {
				text: [
				   "eye for an eye seems fair.",
				   "always worked before, at least.",
				   "picking the bones finds some useful trinkets."
				],
				onLoad: function() {
					World.clearDungeon();
				},
				loot: {
					'копченина': {
						min: 5,
						max: 10,
						chance: 1
					},
					'залізо': {
						min: 5,
						max: 10,
						chance: 1
					},
					'смолоскип': {
						min: 1,
						max: 5,
						chance: 1
					},
					'болас': {
						min: 1,
						max: 5,
						chance: 0.5
					}
				},
				buttons: {
					'leave': {
						text: 'піти з містечка',
						nextScene: 'end'
					}
				}
			}
		}
	},
	"city": { /* City */
		title: 'Зруйноване місто',
		scenes: {
			'start': {
				text: [
					'a battered highway sign stands guard at the entrance to this once-great city.',
					"the towers that haven't crumbled jut from the landscape like the ribcage of some ancient beast.",
					'might be things worth having still inside.'
				],
				notification: "the towers of a decaying city dominate the skyline",
				buttons: {
					'enter': {
						text: 'розвідати',
						nextScene: {0.4: 'a1', 0.8: 'a2', 1: 'a3'}
					},
					'leave': {
						text: 'полишити',
						nextScene: 'end'
					}
				}
			},
			'a1': {
				text:[
					'the streets are empty.',
					'the air is filled with dust, driven relentlessly by the hard winds.'
				],
				buttons: {
					'continue': {
						text: 'продовжити',
						nextScene: {0.5: 'b1', 1: 'b2'}
					},
					'leave': {
						text: 'піти з міста',
						nextScene: 'end'
					}
				}
			},
			'a2': {
				text:[
					'orange traffic cones are set across the street, faded and cracked.',
					'lights flash through the alleys between buildings.'
				],
				buttons: {
					'continue': {
						text: 'продовжити',
						nextScene: {0.5: 'b3', 1: 'b4'}
					},
					'leave': {
						text: 'піти з міста',
						nextScene: 'end'
					}
				}
			},
			'a3': {
				text: [
				   'a large shanty town sprawls across the streets.',
				   'faces, darkened by soot and blood, stare out from crooked huts.',
				],
				buttons: {
					'continue': {	
						text: 'продовжити',
						nextScene: {0.5: 'b5', 1: 'b6'}
					},
					'leave': {
						text: 'піти з міста',
						nextScene: 'end'
					}
				}
			},
			'b1': {
				text: [
				   'the old tower seems mostly intact.',
				   'the shell of a burned out car blocks the entrance.',
				   'most of the windows at ground level are busted anyway.'
				],
				buttons: {
					'enter': {	
						text: 'увійти',
						nextScene: {0.5: 'c1', 1: 'c2'}
					},
					'leave': {
						text: 'піти з міста',
						nextScene: 'end'
					}
				}
			},
			'b2': {
				combat: true,
				notification: 'a huge lizard scrambles up out of the darkness of an old metro station.',
				enemy: 'lizard',
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
				buttons: {
					'descend': {	
						text: 'спуститися',
						nextScene: {0.5: 'c2', 1: 'c3'}
					},
					'leave': {
						text: 'піти з міста',
						nextScene: 'end'
					}
				}
			},
			'b3': {
				notification: 'the shot echoes in the empty street.',
				combat: true,
				enemy: 'sniper',
				char: 'S',
				damage: 15,
				hit: 0.8,
				attackDelay: 4,
				health: 30,
				ranged: true,
				loot: {
					'копченина': {
						min: 1,
						max: 5,
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
				buttons: {
					'continue': {	
						text: 'продовжити',
						nextScene: {0.5: 'c4', 1: 'c5'}
					},
					'leave': {
						text: 'піти з міста',
						nextScene: 'end'
					}
				}
			},
			'b4': {
				notification: 'the soldier steps out from between the buildings, rifle raised.',
				combat: true,
				enemy: 'soldier',
				ranged: true,
				char: 'D',
				damage: 8,
				hit: 0.8,
				attackDelay: 2,
				health: 50,
				loot: {
					'копченина': {
						min: 1,
						max: 5,
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
				buttons: {
					'continue': {	
						text: 'продовжити',
						nextScene: {0.5: 'c5', 1: 'c6'}
					},
					'leave': {
						text: 'піти з міста',
						nextScene: 'end'
					}
				}
			},
			'b5': {
				notification: 'a frail man stands defiantly, blocking the path.',
				combat: true,
				enemy: 'frail man',
				char: 'M',
				damage: 1,
				hit: 0.8,
				attackDelay: 2,
				health: 10,
				loot: {
					'копченина': {
						min: 1,
						max: 5,
						chance: 0.8
					},
					'шмаття': {
						min: 1,
						max: 5,
						chance: 0.5
					},
					'шкіра': {
						min: 1,
						max: 1,
						chance: 0.2
					}
				},
				buttons: {
					'continue': {
						text: 'продовжити',
						nextScene: {0.5: 'c7', 1: 'c8'}
					},
					'leave': {
						text: 'піти з міста',
						nextScene: 'end'
					}
				}
			},
			'b6': {
				text: [
				   'nothing but downcast eyes.',
				   'the people here were broken a long time ago.'
				],
				buttons: {
					'continue': {
						text: 'продовжити',
						nextScene: {0.5: 'c8', 1: 'c9'}
					},
					'leave': {
						text: 'піти з міста',
						nextScene: 'end'
					}
				}
			},
			'c1': {
				notification: 'a thug is waiting on the other side of the wall.',
				combat: true,
				enemy: 'thug',
				char: 'T',
				damage: 3,
				hit: 0.8,
				attackDelay: 2,
				health: 30,
				loot: {
					'шабля': {
						min: 1,
						max: 1,
						chance: 0.5
					},
					'копченина': {
						min: 1,
						max: 3,
						chance: 0.5
					},
					'шмаття': {
						min: 1,
						max: 5,
						chance: 0.8
					}
				},
				buttons: {
					'continue': {	
						text: 'продовжити',
						nextScene: {0.5: 'd1', 1: 'd2'}
					},
					'leave': {
						text: 'піти з міста',
						nextScene: 'end'
					}
				}
			},
			
			'c2': {
				notification: 'a snarling beast jumps out from behind a car.',
				combat: true,
				enemy: 'beast',
				char: 'B',
				damage: 2,
				hit: 0.8,
				attackDelay: 1,
				health: 30,
				loot: {
					'м’ясо': {
						min: 1,
						max: 5,
						chance: 0.8
					},
					'шкури': {
						min: 1,
						max: 5,
						chance: 0.8
					},
					'клики': {
						min: 1,
						max: 5,
						chance: 0.5
					}
				},
				buttons: {
					'continue': {
						text: 'продовжити',
						nextScene: {1: 'd2'}
					},
					'leave': {
						text: 'піти з міста',
						nextScene: 'end'
					}
				}
			},
			
			'c3': {
				text: [
				   'street above the subway platform is blown away.',
				   'lets some light down into the dusty haze.',
				   'a sound comes from the tunnel, just ahead.'
				],
				buttons: {
					'enter': {
						text: 'дослідити',
						cost: { 'смолоскип': 1 },
						nextScene: {0.5: 'd2', 1: 'd3'}
					},
					'leave': {
						text: 'піти з міста',
						nextScene: 'end'
					}
				}
			},
			
			'c4': {
				text: [
				   'looks like a camp of sorts up ahead.',
				   'rusted chainlink is pulled across an alleyway.',
				   'fires burn in the courtyard beyond.'
				],
				buttons: {
					'enter': {
						text: 'продовжити',
						nextScene: {0.5: 'd4', 1: 'd5'}
					},
					'leave': {
						text: 'піти з міста',
						nextScene: 'end'
					}
				}
			},
			
			'c5': {
				text: [
				   'more voices can be heard ahead.',
				   'they must be here for a reason.'
				],
				buttons: {
					'enter': {
						text: 'продовжити',
						nextScene: {1: 'd5'}
					},
					'leave': {
						text: 'піти з міста',
						nextScene: 'end'
					}
				}
			},
			
			'c6': {
				text: [
				   'the sound of gunfire carries on the wind.',
				   'the street ahead glows with firelight.'
				],
				buttons: {
					'enter': {
						text: 'продовжити',
						nextScene: {0.5: 'd5', 1: 'd6'}
					},
					'leave': {
						text: 'піти з міста',
						nextScene: 'end'
					}
				}
			},
			
			'c7': {
				text: [
				   'more squatters are crowding around now.',
				   'someone throws a stone.'
				],
				buttons: {
					'enter': {
						text: 'продовжити',
						nextScene: {0.5: 'd7', 1: 'd8'}
					},
					'leave': {
						text: 'піти з міста',
						nextScene: 'end'
					}
				}
			},
			
			'c8': {
				text: [
					'an improvised shop is set up on the sidewalk.',
					'the owner stands by, stoic.'
				],
				loot: {
					'шабля': {
						min: 1,
						max: 1,
						chance: 0.8
					},
					'рушниця': {
						min: 1,
						max: 1,
						chance: 0.5
					},
					'набої': {
						min: 1,
						max: 8,
						chance: 0.25
					},
					'космічний сплав': {
						min: 1,
						max: 1,
						chance: 0.01
					}
				},
				buttons: {
					'enter': {
						text: 'продовжити',
						nextScene: {1: 'd8'}
					},
					'leave': {
						text: 'піти з міста',
						nextScene: 'end'
					}
				}
			},
			
			'c9': {
				text: [
				   'strips of meat hang drying by the side of the street.',
				   'the people back away, avoiding eye contact.'
				],
				loot: {
					'копченина': {
						min: 5,
						max: 10,
						chance: 1
					}
				},
				buttons: {
					'enter': {
						text: 'продовжити',
						nextScene: {0.5: 'd8', 1: 'd9'}
					},
					'leave': {
						text: 'піти з міста',
						nextScene: 'end'
					}
				}
			},
			
			'd1': {
				notification: 'a large bird nests at the top of the stairs.',
				combat: true,
				enemy: 'bird',
				char: 'B',
				damage: 5,
				hit: 0.7,
				attackDelay: 1,
				health: 45,
				loot: {
					'м’ясо': {
						min: 5,
						max: 10,
						chance: 0.8
					}
				},
				buttons: {
					'continue': {
						text: 'продовжити',
						nextScene: {0.5: 'end1', 1: 'end2'}
					},
					'leave': {
						text: 'піти з міста',
						nextScene: 'end'
					}
				}
			},
			
			'd2': {
				text: [
				   "the debris is denser here.",
				   "maybe some useful stuff in the rubble."
				],
				loot: {
					'набої': {
						min: 1,
						max: 5,
						chance: 0.5
					},
					'сталь': {
						min: 1,
						max: 10,
						chance: 0.8
					},
					'космічний сплав': {
						min: 1,
						max: 1,
						chance: 0.01
					},
					'шмаття': {
						min: 1,
						max: 10,
						chance: 1
					}
				},
				buttons: {
					'continue': {	
						text: 'продовжити',
						nextScene: {1: 'end2'}
					},
					'leave': {
						text: 'піти з міста',
						nextScene: 'end'
					}
				}
			},
			
			'd3': {
				notification: 'a swarm of rats rushes up the tunnel.',
				combat: true,
				enemy: 'rats',
				plural: true,
				char: 'RRR',
				damage: 1,
				hit: 0.8,
				attackDelay: 0.25,
				health: 60,
				loot: {
					'шкури': {
						min: 5,
						max: 10,
						chance: 0.8
					},
					'клики': {
						min: 5,
						max: 10,
						chance: 0.5
					}
				},
				buttons: {
					'continue': {	
						text: 'продовжити',
						nextScene: {0.5: 'end2', 1: 'end3'}
					},
					'leave': {
						text: 'піти з міста',
						nextScene: 'end'
					}
				}
			},
			
			'd4': {
				notification: 'a large man attacks, waving a bayonet.',
				combat: true,
				enemy: 'veteran',
				char: 'V',
				damage: 3,
				hit: 0.8,
				attackDelay: 2,
				health: 45,
				loot: {
					'штик': {
						min: 1,
						max: 1,
						chance: 0.5
					},
					'копченина': {
						min: 1,
						max: 5,
						chance: 0.8
					}
				},
				buttons: {
					'continue': {
						text: 'продовжити',
						nextScene: {0.5: 'end4', 1: 'end5'}
					},
					'leave': {
						text: 'піти з міста',
						nextScene: 'end'
					}
				}
			},
			
			'd5': {
				notification: 'a second soldier opens fire.',
				combat: true,
				enemy: 'soldier',
				ranged: true,
				char: 'D',
				damage: 8,
				hit: 0.8,
				attackDelay: 2,
				health: 50,
				loot: {
					'копченина': {
						min: 1,
						max: 5,
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
				buttons: {
				'continue': {	
						text: 'продовжити',
						nextScene: {1: 'end5'}
					},
					'leave': {
						text: 'піти з міста',
						nextScene: 'end'
					}
				}
			},
			
			'd6': {
				notification: 'a masked soldier rounds the corner, gun drawn',
				combat: true,
				enemy: 'commando',
				char: 'C',
				ranged: true,
				damage: 3,
				hit: 0.9,
				attackDelay: 2,
				health: 55,
				loot: {
					'рушниця': {
						min: 1,
						max: 1,
						chance: 0.5
					},
					'набої': {
						min: 1,
						max: 5,
						chance: 0.8
					},
					'копченина': {
						min: 1,
						max: 5,
						chance: 0.8
					}
				},
				buttons: {
					'continue': {
						text: 'продовжити',
						nextScene: {0.5: 'end5', 1: 'end6'}
					},
					'leave': {
						text: 'піти з міста',
						nextScene: 'end'
					}
				}
			},
			
			'd7': {
				notification: 'the crowd surges forward.',
				combat: true,
				enemy: 'squatters',
				plural: true,
				char: 'SSS',
				damage: 2,
				hit: 0.7,
				attackDelay: 0.5,
				health: 40,
				loot: {
					'шмаття': {
						min: 1,
						max: 5,
						chance: 0.8
					},
					'клики': {
						min: 1,
						max: 5,
						chance: 0.5
					}
				},
				buttons: {
					'continue': {
						text: 'продовжити',
						nextScene: {0.5: 'end7', 1: 'end8'}
					},
					'leave': {
						text: 'піти з міста',
						nextScene: 'end'
					}
				}
			},
			
			'd8': {
				notification: 'a youth lashes out with a tree branch.',
				combat: true,
				enemy: 'youth',
				char: 'Y',
				damage: 2,
				hit: 0.7,
				attackDelay: 1,
				health: 45,
				loot: {
					'шмаття': {
						min: 1,
						max: 5,
						chance: 0.8
					},
					'клики': {
						min: 1,
						max: 5,
						chance: 0.5
					}
				},
				buttons: {
					'continue': {
						text: 'продовжити',
						nextScene: {1: 'end8'}
					},
					'leave': {
						text: 'піти з міста',
						nextScene: 'end'
					}
				}
			},
			
			'd9': {
				notification: 'a squatter stands firmly in the doorway of a small hut.',
				combat: true,
				enemy: 'squatter',
				char: 'S',
				damage: 3,
				hit: 0.8,
				attackDelay: 2,
				health: 20,
				loot: {
					'шмаття': {
						min: 1,
						max: 5,
						chance: 0.8
					},
					'клики': {
						min: 1,
						max: 5,
						chance: 0.5
					}
				},
				buttons: {
					'continue': {
						text: 'продовжити',
						nextScene: {0.5: 'end8', 1: 'end9'}
					},
					'leave': {
						text: 'піти з міста',
						nextScene: 'end'
					}
				}
			},
		
			'end1': {
				text: [
				   'bird must have liked shiney things.',
				   'some good stuff woven into its nest.'
				],
				onLoad: function() {
					World.clearDungeon();
					State.cityCleared = true;
				},
				loot: {
					'набої': {
						min: 5,
						max: 10,
						chance: 0.8
					},
					'болас': {
						min: 1,
						max: 5,
						chance: 0.5
					},
					'космічний сплав': {
						min: 1,
						max: 1,
						chance: 0.5
					}
				},
				buttons: {
					'leave': {
						text: 'піти з міста',
						nextScene: 'end'
					}
				}
			},
			
			'end2': {
				text: [
				   'not much here.',
				   'scavengers much have gotten to this place already.'
				],
				onLoad: function() {
					World.clearDungeon();
					State.cityCleared = true;
				},
				loot: {
					'смолоскип': {
						min: 1,
						max: 5,
						chance: 0.8
					},
					'копченина': {
						min: 1,
						max: 5,
						chance: 0.5
					}
				},
				buttons: {
					'leave': {
						text: 'піти з міста',
						nextScene: 'end'
					}
				}
			},
			
			'end3': {
				text: [
				   'the tunnel opens up at another platform.',
				   'the walls are scorched from an old battle.',
				   'bodies and supplies from both sides litter the ground.'
				],
				onLoad: function() {
					World.clearDungeon();
					State.cityCleared = true;
				},
				loot: {
					'рушниця': {
						min: 1,
						max: 1,
						chance: 0.8
					},
					'набої': {
						min: 1,
						max: 5,
						chance: 0.8
					},
					'лазерна гвинтівка': {
						min: 1,
						max: 1,
						chance: 0.3
					},
					'батарейки': {
						min: 1,
						max: 5,
						chance: 0.3
					},
					'космічний сплав': {
						min: 1,
						max: 1,
						chance: 0.3
					}
				},
				buttons: {
					'leave': {
						text: 'піти з міста',
						nextScene: 'end'
					}
				}
			},
			
			
			'end4': {
				text: [
				   'the small military outpost is well supplied.',
				   'arms and munitions, relics from the war, are neatly arranged on the store-room floor.',
				   'just as deadly now as they were then.'
				],
				onLoad: function() {
					World.clearDungeon();
					State.cityCleared = true;
				},
				loot: {
					'рушниця': {
						min: 1,
						max: 1,
						chance: 1
					},
					'набої': {
						min: 1,
						max: 10,
						chance: 1
					},
					'граната': {
						min: 1,
						max: 5,
						chance: 0.8
					}
				},
				buttons: {
					'leave': {
						text: 'піти з міста',
						nextScene: 'end'
					}
				}
			},
			
			'end5': {
				text: [
				   'searching the bodies yields a few supplies.',
				   'more soldiers will be on their way.',
				   'time to move on.'
				],
				onLoad: function() {
					World.clearDungeon();
					State.cityCleared = true;
				},
				loot: {
					'рушниця': {
						min: 1,
						max: 1,
						chance: 1
					},
					'набої': {
						min: 1,
						max: 10,
						chance: 1
					},
					'копченина': {
						min: 1,
						max: 5,
						chance: 0.8
					}
				},
				buttons: {
					'leave': {
						text: 'піти з міста',
						nextScene: 'end'
					}
				}
			},
			
			'end6': {
				text: [
				   'the small settlement has clearly been burning a while.',
				   'the bodies of the wanderers that lived here are still visible in the flames.',
				   "still time to rescue a few supplies."
				],
				onLoad: function() {
					World.clearDungeon();
					State.cityCleared = true;
				},
				loot: {
					'лазерна гвинтівка': {
						min: 1,
						max: 1,
						chance: 0.5
					},
					'батарейки': {
						min: 1,
						max: 5,
						chance: 0.5
					},
					'копченина': {
						min: 1,
						max: 10,
						chance: 1
					}
				},
				buttons: {
					'leave': {
						text: 'піти з міста',
						nextScene: 'end'
					}
				}
			},
			
			
			'end7': {
				text: [
				   'the remaining settlers flee from the violence, their belongings forgotten.',
				   "there's not much, but some useful things can still be found."
				],
				onLoad: function() {
					World.clearDungeon();
					State.cityCleared = true;
				},
				loot: {
					'шабля': {
						min: 1,
						max: 1,
						chance: 0.8
					},
					'батарейки': {
						min: 1,
						max: 5,
						chance: 0.5
					},
					'копченина': {
						min: 1,
						max: 10,
						chance: 1
					}
				},
				buttons: {
					'leave': {
						text: 'піти з міста',
						nextScene: 'end'
					}
				}
			},
			
			'end8': {
				text: [
				   'the young settler was carrying a canvas sack.',
				   "it contains travelling gear, and a few trinkets.",
				   "there's nothing else here."
				],
				onLoad: function() {
					World.clearDungeon();
					State.cityCleared = true;
				},
				loot: {
					'шабля': {
						min: 1,
						max: 1,
						chance: 0.8
					},
					'болас': {
						min: 1,
						max: 5,
						chance: 0.5
					},
					'копченина': {
						min: 1,
						max: 10,
						chance: 1
					}
				},
				buttons: {
					'leave': {
						text: 'піти з міста',
						nextScene: 'end'
					}
				}
			},
			
			'end9': {
				text: [
				   'inside the hut, a child cries.',
				   "a few belongings rest against the walls.",
				   "there's nothing else here."
				],
				onLoad: function() {
					World.clearDungeon();
					State.cityCleared = true;
				},
				loot: {
					'рушниця': {
						min: 1,
						max: 1,
						chance: 0.8
					},
					'набої': {
						min: 1,
						max: 5,
						chance: 0.8
					},
					'болас': {
						min: 1,
						max: 5,
						chance: 0.5
					},
					'космічний сплав': {
						min: 1,
						max: 1,
						chance: 0.2
					}
				},
				buttons: {
					'leave': {
						text: 'піти з міста',
						nextScene: 'end'
					}
				}
			}
		}	
	},
	"house": { /* Abandoned House */
		title: 'Покинутий будинок',
		scenes: {
			'start': {
				text: [
					'an old house remains here, once white siding yellowed and peeling.',
					'the door hangs open.'
				],
				notification: 'the remains of an old house stand as a monument to simpler times',
				buttons: {
					'enter': {
						text: 'зайти',
						nextScene: { 0.5: 'supplies', 1: 'occupied' }
					},
					'leave': {
						text: 'полишити',
						nextScene: 'end'
					}
				},
			},
			'supplies': {
				text: [
					'the house is abandoned, but not yet picked over.',
					'still a few drops of water in the old well.'
				],
				onLoad: function() {
					World.markVisited(World.curPos[0], World.curPos[1]);
					World.setWater(World.getMaxWater());
					Notifications.notify(null, 'Набрали води.');
				},
				loot: {
					'копченина': {
						min: 1,
						max: 10,
						chance: 0.8
					},
					'шкіра': {
						min: 1,
						max: 10,
						chance: 0.2
					},
					'шмаття': {
						min: 1,
						max: 10,
						chance: 0.5
					}
				},
				buttons: {
					'leave': {
						text: 'полишити',
						nextScene: 'end'
					}
				}
			},
			'occupied': {
				combat: true,
				enemy: 'squatter',
				char: 'S',
				damage: 3,
				hit: 0.8,
				attackDelay: 2,
				health: 10,
				notification: 'a man charges down the hall, a rusty blade in his hand',
				onLoad: function() {
					World.markVisited(World.curPos[0], World.curPos[1]);
				},
				loot: {
					'копченина': {
						min: 1,
						max: 10,
						chance: 0.8
					},
					'шкіра': {
						min: 1,
						max: 10,
						chance: 0.2
					},
					'шмаття': {
						min: 1,
						max: 10,
						chance: 0.5
					}
				},
				buttons: {
					'leave': {
						text: 'полишити',
						nextScene: 'end'
					}
				}
			}
		}
	},
	"battlefield": { /* Discovering an old battlefield */
		title: 'Забуте поле бою',
		scenes: {
			'start': {
				text: [
				   'a battle was fought here, long ago.',
				   'battered technology from both sides lays dormant on the blasted landscape.'
				],
				onLoad: function() {
					World.markVisited(World.curPos[0], World.curPos[1]);
				},
				loot: {
					'рушниця': {
						min: 1,
						max: 3,
						chance: 0.5
					},
					'набої': {
						min: 5,
						max: 20,
						chance: 0.8
					},
					'лазерна гвинтівка': {
						min: 1,
						max: 3,
						chance: 0.3
					},
					'батарейки': {
						min: 5,
						max: 10,
						chance: 0.5
					},
					'гранати': {
						min: 1,
						max: 5,
						chance: 0.5
					},
					'космічний сплав': {
						min: 1,
						max: 1,
						chance: 0.3
					}
				},
				buttons: {
					'leave': {
						text: 'полишити',
						nextScene: 'end'
					}
				}
			}
		}
	},
	"borehole": { /* Admiring a huge borehole */
		title: 'Величезна воронка',
		scenes: {
			'start': {
				text: [
				   'a huge hole is cut deep into the earth, evidence of the past harvest.',
				   'they took what they came for, and left.',
				   'castoff from the mammoth drills can still be found by the edges of the precipice.'
				],
				onLoad: function() {
					World.markVisited(World.curPos[0], World.curPos[1]);
				},
				loot: {
					'космічний сплав': {
						min: 1,
						max: 3,
						chance: 1
					}
				},
				buttons: {
					'leave': {
						text: 'полишити',
						nextScene: 'end'
					}
				}
			}
		}
	},
	"ship": { /* Finding a way off this rock */
		title: 'Підбитий зореліт',
		scenes: {
			'start': {
				onLoad: function() {
					World.markVisited(World.curPos[0], World.curPos[1]);
					World.drawRoad();
					World.state.ship = true;
				},
				text: [
				   'the familiar curves of a wanderer vessel rise up out of the dust and ash. ',
				   "lucky that the natives can't work the mechanisms.",
				   'with a little effort, it might fly again.'
				],
				buttons: {
					'leavel': {
						text: 'врятувати',
						nextScene: 'end'
					}
				}
			}
		}
	},
	"sulphurmine": { /* Clearing the Sulphur Mine */
		title: 'Родовище сірки',
		scenes: {
			'start': {
				text: [
					"the military is already set up at the mine's entrance.",
					'soldiers patrol the permitter, rifles slung over their shoulders.'
				],
				notification: 'a military perimeter is set up around the mine.',
				buttons: {
					'attack': {
						text: 'атакувати',
						nextScene: {1: 'a1'}
					},
					'leave': {
						text: 'полишити',
						nextScene: 'end'
					}
				}
			},
			'a1': {
				combat: true,
				enemy: 'soldier',
				ranged: true,
				char: 'D',
				damage: 8,
				hit: 0.8,
				attackDelay: 2,
				health: 50,
				loot: {
					'копченина': {
						min: 1,
						max: 5,
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
				notification: 'a soldier, alerted, opens fire.',
				buttons: {
					'continue': {
						text: 'продовжити',
						nextScene: { 1: 'a2' }
					},
					'run': {
						text: 'втекти',
						nextScene: 'end'
					}
				}
			},
			'a2': {
				combat: true,
				enemy: 'soldier',
				ranged: true,
				char: 'D',
				damage: 8,
				hit: 0.8,
				attackDelay: 2,
				health: 50,
				loot: {
					'копченина': {
						min: 1,
						max: 5,
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
				notification: 'a second soldier joins the fight.',
				buttons: {
					'continue': {
						text: 'продовжити',
						nextScene: { 1: 'a3' }
					},
					'run': {
						text: 'втекти',
						nextScene: 'end'
					}
				}
			},
			'a3': {
				combat: true,
				enemy: 'veteran',
				char: 'V',
				damage: 10,
				hit: 0.8,
				attackDelay: 2,
				health: 65,
				loot: {
					'штик': {
						min: 1,
						max: 1,
						chance: 0.5
					},
					'копченина': {
						min: 1,
						max: 5,
						chance: 0.8
					}
				},
				notification: 'a grizzled soldier attacks, waving a bayonet.',
				buttons: {
					'continue': {
						text: 'продовжити',
						nextScene: { 1: 'cleared' }
					}
				}
			},
			'cleared': {
				text: [
					'the military presence has been cleared.',
					'the mine is now safe for workers.'
				],
				notification: 'the sulphur mine is clear of dangers',
				onLoad: function() {
					World.drawRoad();
					World.state.sulphurmine = true;
					World.markVisited(World.curPos[0], World.curPos[1]);
				},
				buttons: {
					'leave': {
						text: 'полишити',
						nextScene: 'end'
					}
				}
			}
		}
	},
	"coalmine": { /* Clearing the Coal Mine */
		title: 'Вугільна копальня',
		scenes: {
			'start': {
				text: [
					'camp fires burn by the entrance to the mine.',
					'men mill about, weapons at the ready.'
				],
				notification: 'this old mine is not abandoned',
				buttons: {
					'attack': {
						text: 'атакувати',
						nextScene: {1: 'a1'}
					},
					'leave': {
						text: 'полишити',
						nextScene: 'end'
					}
				}
			},
			'a1': {
				combat: true,
				enemy: 'man',
				char: 'M',
				damage: 3,
				hit: 0.8,
				attackDelay: 2,
				health: 10,
				loot: {
					'копченина': {
						min: 1,
						max: 5,
						chance: 0.8
					},
					'шмаття': {
						min: 1,
						max: 5,
						chance: 0.8
					}
				},
				notification: 'a man joins the fight',
				buttons: {
					'continue': {
						text: 'продовжити',
						nextScene: { 1: 'a2' }
					},
					'run': {
						text: 'втекти',
						nextScene: 'end'
					}
				}
			},
			'a2': {
				combat: true,
				enemy: 'man',
				char: 'M',
				damage: 3,
				hit: 0.8,
				attackDelay: 2,
				health: 10,
				loot: {
					'копченина': {
						min: 1,
						max: 5,
						chance: 0.8
					},
					'шмаття': {
						min: 1,
						max: 5,
						chance: 0.8
					}
				},
				notification: 'a man joins the fight',
				buttons: {
					'continue': {
						text: 'продовжити',
						nextScene: { 1: 'a3' }
					},
					'run': {
						text: 'втекти',
						nextScene: 'end'
					}
				}
			},
			'a3': {
				combat: true,
				enemy: 'chief',
				char: 'C',
				damage: 5,
				hit: 0.8,
				attackDelay: 2,
				health: 20,
				loot: {
					'копченина': {
						min: 5,
						max: 10,
						chance: 1
					},
					'шмаття': {
						min: 5,
						max: 10,
						chance: 0.8
					},
					'залізо': {
						min: 1,
						max: 5,
						chance: 0.8
					}
				},
				notification: 'only the chief remains.',
				buttons: {
					'continue': {
						text: 'продовжити',
						nextScene: { 1: 'cleared' }
					}
				}
			},
			'cleared': {
				text: [
					'the camp is still, save for the crackling of the fires.',
					'the mine is now safe for workers.'
				],
				notification: 'the coal mine is clear of dangers',
				onLoad: function() {
					World.drawRoad();
					World.state.coalmine = true;
					World.markVisited(World.curPos[0], World.curPos[1]);
				},
				buttons: {
					'leave': {
						text: 'полишити',
						nextScene: 'end'
					}
				}
			}
		}
	},
	"ironmine": { /* Clearing the Iron Mine */
		title: 'Залізнорудна шахта',
		scenes: {
			'start': {
				text: [
					'an old iron mine sits here, tools abandoned and left to rust.',
					'bleached bones are strewn about the entrance. many, deeply scored with jagged grooves.',
					'feral howls echo out of the darkness.'
				],
				notification: 'the path leads to an abandoned mine',
				buttons: {
					'enter': {
						text: 'зайти',
						nextScene: { 1: 'enter' },
						cost: { 'смолоскип': 1 }
					},
					'leave': {
						text: 'полишити',
						nextScene: 'end'
					}
				}
			},
			'enter': {
				combat: true,
				enemy: 'beastly matriarch',
				char: 'M',
				damage: 4,
				hit: 0.8,
				attackDelay: 2,
				health: 10,
				loot: {
					'клики': {
						min: 5,
						max: 10,
						chance: 1
					},
					'луска': {
						min: 5,
						max: 10,
						chance: 0.8
					},
					'шмаття': {
						min: 5,
						max: 10,
						chance: 0.5
					}
				},
				notification: 'a large creature lunges, muscles rippling in the смолоскип light',
				buttons: {
					'leave': {
						text: 'полишити',
						nextScene: { 1: 'cleared' }
					}
				}
			},
			'cleared': {
				text: [
					'the beast is dead.',
					'the mine is now safe for workers.'
				],
				notification: 'the iron mine is clear of dangers',
				onLoad: function() {
					World.drawRoad();
					World.state.ironmine = true;
					World.markVisited(World.curPos[0], World.curPos[1]);
				},
				buttons: {
					'leave': {
						text: 'полишити',
						nextScene: 'end'
					}
				}
			}
		}
	}
};