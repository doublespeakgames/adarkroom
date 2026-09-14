/**
 * Companion system for recruiting and managing party members
 */
var Companions = {
	MAX_COMPANIONS: 5,
	BASE_COMPANION_HEALTH: 15,
	BASE_COMPANION_DAMAGE: 1,
	COMPANION_CARRY_CAPACITY: 25,
	
	Archetypes: {
		'scout': {
			name: _('scout'),
			health: 12,
			damage: 2,
			carry: 20,
			desc: _('swift and deadly. carries less but deals more damage'),
			cost: function() {
				return {
					'fur': 100,
					'scales': 50,
					'teeth': 25
				};
			},
			audio: AudioLibrary.RECRUIT_SCOUT
		},
		'warrior': {
			name: _('warrior'),
			health: 25,
			damage: 3,
			carry: 15,
			desc: _('strong and resilient. excellent in a fight'),
			cost: function() {
				return {
					'fur': 150,
					'scales': 75,
					'teeth': 50
				};
			},
			audio: AudioLibrary.RECRUIT_WARRIOR
		},
		'porter': {
			name: _('porter'),
			health: 18,
			damage: 1,
			carry: 50,
			desc: _('sturdy pack animal. carries much but weak in combat'),
			cost: function() {
				return {
					'fur': 80,
					'scales': 30,
					'teeth': 15
				};
			},
			audio: AudioLibrary.RECRUIT_PORTER
		},
		'ranger': {
			name: _('ranger'),
			health: 20,
			damage: 2,
			carry: 30,
			desc: _('balanced warrior. good at everything'),
			cost: function() {
				return {
					'fur': 120,
					'scales': 60,
					'teeth': 40
				};
			},
			audio: AudioLibrary.RECRUIT_RANGER
		}
	},

	name: 'Companions',
	options: {},
	
	init: function(options) {
		this.options = $.extend(
			this.options,
			options
		);
		
		// Initialize companions data if not exists
		if(typeof $SM.get('game.companions') == 'undefined') {
			$SM.setM('game.companions', {
				list: [],
				activeParty: []
			});
		}
		
		// Subscribe to state updates
		$.Dispatch('stateUpdate').subscribe(Companions.handleStateUpdates);
	},
	
	getCompanions: function() {
		return $SM.get('game.companions.list', []);
	},
	
	getActiveParty: function() {
		return $SM.get('game.companions.activeParty', []);
	},
	
	getCompanionCount: function() {
		return Companions.getCompanions().length;
	},
	
	canRecruit: function() {
		return Companions.getCompanionCount() < Companions.MAX_COMPANIONS;
	},
	
	recruitCompanion: function(archetype) {
		if(!Companions.canRecruit()) {
			Notifications.notify(Room, _('no room for more companions'));
			return false;
		}
		
		if(!Companions.Archetypes[archetype]) {
			return false;
		}
		
		var archetypeData = Companions.Archetypes[archetype];
		var cost = archetypeData.cost();
		
		// Check resources
		for(var k in cost) {
			var have = $SM.get('stores["' + k + '"]', true);
			if(have < cost[k]) {
				Notifications.notify(Room, _('not enough ' + k));
				return false;
			}
		}
		
		// Deduct cost
		var storeMod = {};
		for(var k in cost) {
			var have = $SM.get('stores["' + k + '"]', true);
			storeMod[k] = have - cost[k];
		}
		$SM.setM('stores', storeMod);
		
		// Create companion
		var companions = Companions.getCompanions();
		var newCompanion = {
			id: Date.now() + Math.random(),
			archetype: archetype,
			name: Companions.generateName(archetype),
			health: archetypeData.health,
			maxHealth: archetypeData.health,
			damage: archetypeData.damage,
			carry: archetypeData.carry,
			experience: 0,
			level: 1,
			recruited: new Date().getTime()
		};
		
		companions.push(newCompanion);
		$SM.set('game.companions.list', companions);
		
		Notifications.notify(Room, _('a new {0} has joined the party', _(archetype)));
		AudioEngine.playSound(AudioLibrary.RECRUIT);
		
		return true;
	},
	
	generateName: function(archetype) {
		var names = {
			'scout': ['Swift', 'Shadow', 'Arrow', 'Wind', 'Fox'],
			'warrior': ['Stone', 'Iron', 'Bear', 'Bull', 'Oak'],
			'porter': ['Cart', 'Ox', 'Pack', 'Load', 'Haul'],
			'ranger': ['Path', 'Trail', 'Hunt', 'Track', 'Guide']
		};
		
		var nameList = names[archetype] || ['Companion'];
		return nameList[Math.floor(Math.random() * nameList.length)];
	},
	
	addToParty: function(companionId) {
		var companions = Companions.getCompanions();
		var companion = companions.find(c => c.id === companionId);
		
		if(!companion) return false;
		
		var activeParty = Companions.getActiveParty();
		if(activeParty.length >= 3) {
			Notifications.notify(World, _('party is full'));
			return false;
		}
		
		if(activeParty.find(c => c.id === companionId)) {
			return false; // Already in party
		}
		
		activeParty.push(companion);
		$SM.set('game.companions.activeParty', activeParty);
		
		return true;
	},
	
	removeFromParty: function(companionId) {
		var activeParty = Companions.getActiveParty();
		var filtered = activeParty.filter(c => c.id !== companionId);
		$SM.set('game.companions.activeParty', filtered);
	},
	
	getTotalCompanionCarry: function() {
		var party = Companions.getActiveParty();
		var total = 0;
		for(var i = 0; i < party.length; i++) {
			total += party[i].carry;
		}
		return total;
	},
	
	getTotalCompanionDamage: function() {
		var party = Companions.getActiveParty();
		var total = 0;
		for(var i = 0; i < party.length; i++) {
			total += party[i].damage;
		}
		return total;
	},
	
	healCompanions: function() {
		var party = Companions.getActiveParty();
		for(var i = 0; i < party.length; i++) {
			party[i].health = party[i].maxHealth;
		}
		$SM.set('game.companions.activeParty', party);
	},
	
	damageCompanion: function(companionId, damage) {
		var companions = Companions.getCompanions();
		var companion = companions.find(c => c.id === companionId);
		
		if(!companion) return false;
		
		companion.health = Math.max(0, companion.health - damage);
		$SM.set('game.companions.list', companions);
		
		// Also update in active party
		var activeParty = Companions.getActiveParty();
		var partyCompanion = activeParty.find(c => c.id === companionId);
		if(partyCompanion) {
			partyCompanion.health = companion.health;
			$SM.set('game.companions.activeParty', activeParty);
		}
		
		return true;
	},
	
	awardExperience: function(companionId, amount) {
		var companions = Companions.getCompanions();
		var companion = companions.find(c => c.id === companionId);
		
		if(!companion) return false;
		
		companion.experience += amount;
		
		// Level up at 100 exp
		var levelups = Math.floor(companion.experience / 100);
		if(levelups > 0) {
			companion.level += levelups;
			companion.experience = companion.experience % 100;
			companion.maxHealth += 5 * levelups;
			companion.health = companion.maxHealth;
			companion.damage += levelups;
			
			Notifications.notify(null, companion.name + _(' has leveled up to level {0}', companion.level));
		}
		
		$SM.set('game.companions.list', companions);
		return true;
	},
	
	handleStateUpdates: function(e) {
		// Handle any state update logic for companions
	}
};
