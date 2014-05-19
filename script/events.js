/**
 * Module that handles the random event system
 */
var Events = {
		
	_EVENT_TIME_RANGE: [3, 6], // range, in minutes
	_PANEL_FADE: 200,
	_FIGHT_SPEED: 100,
	_EAT_COOLDOWN: 5,
	_MEDS_COOLDOWN: 7,
	STUN_DURATION: 4000,
	
	init: function(options) {
		this.options = $.extend(
			this.options,
			options
		);
		
		// Build the Event Pool
		Events.EventPool = new Array().concat(
			Events.Global,
			Events.Room,
			Events.Outside
		);
		
		Events.eventStack = [];
		
		Events.scheduleNextEvent();
		
		//subscribe to stateUpdates
		$.Dispatch('stateUpdate').subscribe(Events.handleStateUpdates);
	},
	
	options: {}, // Nothing for now
    
	activeEvent: null,
	activeScene: null,
	eventPanel: null,
    
	loadScene: function(name) {
		Engine.log('loading scene: ' + name);
		Events.activeScene = name;
		var scene = Events.activeEvent().scenes[name];
		
		// Scene reward
		if(scene.reward) {
			$SM.addM('stores', scene.reward);
		}
		
		// onLoad
		if(scene.onLoad) {
			scene.onLoad();
		}
		
		// Notify the scene change
		if(scene.notification) {
			Notifications.notify(null, scene.notification);
		}
		
		$('#description', Events.eventPanel()).empty();
		$('#buttons', Events.eventPanel()).empty();
		if(scene.combat) {
			Events.startCombat(scene);
		} else {
			Events.startStory(scene);
		}
	},
	
	startCombat: function(scene) {
		Engine.event('game event', 'combat');
		Events.won = false;
		var desc = $('#description', Events.eventPanel());
		
		$('<div>').text(scene.notification).appendTo(desc);
		
		// Draw the wanderer
		Events.createFighterDiv('@', World.health, World.getMaxHealth()).attr('id', 'wanderer').appendTo(desc);
		
		// Draw the enemy
		Events.createFighterDiv(scene.chara, scene.health, scene.health).attr('id', 'enemy').appendTo(desc);
		
		// Draw the action buttons
		var btns = $('#buttons', Events.eventPanel());
		
		var numWeapons = 0;
		for(var k in World.Weapons) {
			var weapon = World.Weapons[k];
			if(typeof Path.outfit[k] == 'number' && Path.outfit[k] > 0) {
				if(typeof weapon.damage != 'number' || weapon.damage == 0) {
					// Weapons that deal no damage don't count
					numWeapons--;
				} else if(weapon.cost){
					for(var c in weapon.cost) {
						var num = weapon.cost[c];
						if(typeof Path.outfit[c] != 'number' || Path.outfit[c] < num) {
							// Can't use this weapon, so don't count it
							numWeapons--;
						}
					}
				}
				numWeapons++;
				Events.createAttackButton(k).appendTo(btns);
			}
		}
		if(numWeapons == 0) {
			// No weapons? You can punch stuff!
			Events.createAttackButton('fists').prependTo(btns);
		}
		
		Events.createEatMeatButton().appendTo(btns);
		if((Path.outfit['medicine'] || 0) != 0) {
		  Events.createUseMedsButton().appendTo(btns);
	  }
		
		// Set up the enemy attack timer
		Events._enemyAttackTimer = setTimeout(Events.enemyAttack, scene.attackDelay * 1000);
	},
	
	createEatMeatButton: function(cooldown) {
		if (cooldown == null) {
			cooldown = Events._EAT_COOLDOWN;
		}
		
		var btn = new Button.Button({
			id: 'eat',
			text: _('eat meat'),
			cooldown: cooldown,
			click: Events.eatMeat,
			cost: { 'cured meat': 1 }
		});
		
		if(Path.outfit['cured meat'] == 0) {
			Button.setDisabled(btn, true);
		}
		
		return btn;
	},
	
	createUseMedsButton: function(cooldown) {
		if (cooldown == null) {
			cooldown = Events._MEDS_COOLDOWN;
		}
		
		var btn = new Button.Button({
			id: 'meds',
			text: _('use meds'),
			cooldown: cooldown,
			click: Events.useMeds,
			cost: { 'medicine': 1 }
		});
		
		if((Path.outfit['medicine'] || 0) == 0) {
			Button.setDisabled(btn, true);
		}
		
		return btn;
	},
	
	createAttackButton: function(weaponName) {
		var weapon = World.Weapons[weaponName];
		var cd = weapon.cooldown;
		if(weapon.type == 'unarmed') {
			if($SM.hasPerk('unarmed master')) {
				cd /= 2;
			}
		}
		var btn = new Button.Button({
			id: 'attack_' + weaponName.replace(' ', '-'),
			text: weapon.verb,
			cooldown: cd,
			click: Events.useWeapon,
			cost: weapon.cost
		});
		if(typeof weapon.damage == 'number' && weapon.damage > 0) {
			btn.addClass('weaponButton');
		}
		
		for(var k in weapon.cost) {
			if(typeof Path.outfit[k] != 'number' || Path.outfit[k] < weapon.cost[k]) {
				Button.setDisabled(btn, true);
				break;
			}
		}
		
		return btn;
	},
	
	drawFloatText: function(text, parent) {
		$('<div>').text(text).addClass('damageText').appendTo(parent).animate({
			'bottom': '50px',
			'opacity': '0'
		},
		300,
		'linear',
		function() {
			$(this).remove();
		});
	},
	
	eatMeat: function() {
		if(Path.outfit['cured meat'] > 0) {
			Path.outfit['cured meat']--;
			World.updateSupplies();
			if(Path.outfit['cured meat'] == 0) {
				Button.setDisabled($('#eat'), true);
			}
			
			var hp = World.health;
			hp += World.meatHeal();
			hp = hp > World.getMaxHealth() ? World.getMaxHealth() : hp;
			World.setHp(hp);
			
			if(Events.activeEvent()) {
				var w = $('#wanderer');
				w.data('hp', hp);
				Events.updateFighterDiv(w);
				Events.drawFloatText('+' + World.meatHeal(), '#wanderer .hp');
			}
		}
	},
	
	useMeds: function() {
		if(Path.outfit['medicine'] > 0) {
			Path.outfit['medicine']--;
			World.updateSupplies();
			if(Path.outfit['medicine'] == 0) {
				Button.setDisabled($('#meds'), true);
			}
			
			var hp = World.health;
			hp += World.medsHeal();
			hp = hp > World.getMaxHealth() ? World.getMaxHealth() : hp;
			World.setHp(hp);
			
			if(Events.activeEvent()) {
				var w = $('#wanderer');
				w.data('hp', hp);
				Events.updateFighterDiv(w);
				Events.drawFloatText('+' + World.medsHeal(), '#wanderer .hp');
			}
		}
	},
	
	useWeapon: function(btn) {
		if(Events.activeEvent()) {
			var weaponName = btn.attr('id').substring(7).replace('-', ' ');
			var weapon = World.Weapons[weaponName];
			if(weapon.type == 'unarmed') {
				if(!$SM.get('character.punches')) $SM.set('character.punches', 0);
				$SM.add('character.punches', 1);
				if($SM.get('character.punches') == 50 && !$SM.hasPerk('boxer')) {
					$SM.addPerk('boxer');
				} else if($SM.get('character.punches') == 150 && !$SM.hasPerk('martial artist')) {
					$SM.addPerk('martial artist');
				} else if($SM.get('character.punches') == 300 && !$SM.hasPerk('unarmed master')) {
					$SM.addPerk('unarmed master');
				}
				
			}
			if(weapon.cost) {
				var mod = {};
				var out = false;
				for(var k in weapon.cost) {
					if(typeof Path.outfit[k] != 'number' || Path.outfit[k] < weapon.cost[k]) {
						return;
					}
					mod[k] = -weapon.cost[k];
					if(Path.outfit[k] - weapon.cost[k] < weapon.cost[k]) {
						out = true;
					}
				}
				for(var k in mod) {
					Path.outfit[k] += mod[k];
				}
				if(out) {
					Button.setDisabled(btn, true);
					var validWeapons = false;
					$('.weaponButton').each(function(){
						if(!Button.isDisabled($(this)) && $(this).attr('id') != 'attack_fists') {
							validWeapons = true;
							return false;
						}
					});
					if(!validWeapons) {
						// enable or create the punch button
						var fists = $('#attack_fists');
						if(fists.length == 0) {
							Events.createAttackButton('fists').prependTo('#buttons', Events.eventPanel());
						} else {
							Button.setDisabled(fists, false);
						}
					}
				}
				World.updateSupplies();
			}
			var dmg = -1;
			if(Math.random() <= World.getHitChance()) {
				dmg = weapon.damage;
				if(typeof dmg == 'number') {
					if(weapon.type == 'unarmed' && $SM.hasPerk('boxer')) {
						dmg *= 2;
					}
					if(weapon.type == 'unarmed' && $SM.hasPerk('martial artist')) {
						dmg *= 3;
					}
					if(weapon.type == 'unarmed' && $SM.hasPerk('unarmed master')) {
						dmg *= 2;
					}
					if(weapon.type == 'melee' && $SM.hasPerk('barbarian')) {
						dmg = Math.floor(dmg * 1.5);
					}
				}
			}
			
			var attackFn = weapon.type == 'ranged' ? Events.animateRanged : Events.animateMelee;
			attackFn($('#wanderer'), dmg, function() {
				if($('#enemy').data('hp') <= 0 && !Events.won) {
					// Success!
					Events.winFight();
				}
			});
		}
	},
	
	animateMelee: function(fighter, dmg, callback) {
		var start, end, enemy;
		if(fighter.attr('id') == 'wanderer') {
			start = {'left': '50%'};
			end = {'left': '25%'};
			enemy = $('#enemy');
		} else {
			start = {'right': '50%'};
			end = {'right': '25%'};
			enemy = $('#wanderer');
		}
		
		fighter.stop(true, true).animate(start, Events._FIGHT_SPEED, function() {
			var enemyHp = enemy.data('hp');
			var msg = "";
			if(typeof dmg == 'number') {
				if(dmg < 0) {
					msg = 'miss';
					dmg = 0;
				} else {
					msg = '-' + dmg;
					enemyHp -= dmg;
					enemy.data('hp', enemyHp);
					if(fighter.attr('id') == 'enemy') {
						World.setHp(enemyHp);
					}
					Events.updateFighterDiv(enemy);
				}
			} else {
				if(dmg == 'stun') {
					msg = 'stunned';
					enemy.data('stunned', true);
					setTimeout(function() {
						enemy.data('stunned', false);
					}, Events.STUN_DURATION);
				}
			}
			
			Events.drawFloatText(msg, $('.hp', enemy));
			
			$(this).animate(end, Events._FIGHT_SPEED, callback);
		});
	},
	
	animateRanged: function(fighter, dmg, callback) {
		var start, end, enemy;
		if(fighter.attr('id') == 'wanderer') {
			start = {'left': '25%'};
			end = {'left': '50%'};
			enemy = $('#enemy');
		} else {
			start = {'right': '25%'};
			end = {'right': '50%'};
			enemy = $('#wanderer');
		}
		
		$('<div>').css(start).addClass('bullet').text('o').appendTo('#description')
				.animate(end, Events._FIGHT_SPEED * 2, 'linear', function() {
			var enemyHp = enemy.data('hp');
			var msg = "";
			if(typeof dmg == 'number') {
				if(dmg < 0) {
					msg = 'miss';
					dmg = 0;
				} else {
					msg = '-' + dmg;
					enemyHp -= dmg;
					enemy.data('hp', enemyHp);
					if(fighter.attr('id') == 'enemy') {
						World.setHp(enemyHp);
					}
					Events.updateFighterDiv(enemy);
				}
			} else {
				if(dmg == 'stun') {
					msg = 'stunned';
					enemy.data('stunned', true);
					setTimeout(function() {
						enemy.data('stunned', false);
					}, Events.STUN_DURATION);
				}
			}
			
			Events.drawFloatText(msg, $('.hp', enemy));
			
			$(this).remove();
			if(typeof callback == 'function') {
				callback();
			}
		});
	},
	
	enemyAttack: function() {
		
		var scene = Events.activeEvent().scenes[Events.activeScene];
		
		if(!$('#enemy').data('stunned')) {
			var toHit = scene.hit;
			toHit *= $SM.hasPerk('evasive') ? 0.8 : 1;
			var dmg = -1;
			if(Math.random() <= toHit) {
				dmg = scene.damage;
			}
			
			var attackFn = scene.ranged ? Events.animateRanged : Events.animateMelee;
			
			attackFn($('#enemy'), dmg, function() {
					if($('#wanderer').data('hp') <= 0) {
						// Failure!
						clearTimeout(Events._enemyAttackTimer);
						Events.endEvent();
						World.die();
					}
			});
		}
		
		Events._enemyAttackTimer = 
			setTimeout(Events.enemyAttack, scene.attackDelay * 1000);
	},
	
	winFight: function() {
		Events.won = true;
		clearTimeout(Events._enemyAttackTimer);
		$('#enemy').animate({opacity: 0}, 300, 'linear', function() {
			setTimeout(function() {
				try {
					var scene = Events.activeEvent().scenes[Events.activeScene];
					var desc = $('#description', Events.eventPanel());
					var btns = $('#buttons', Events.eventPanel());
					desc.empty();
					btns.empty();
					$('<div>').text(scene.deathMessage).appendTo(desc);
					
					Events.drawLoot(scene.loot);
					
					if(scene.buttons) {
						// Draw the buttons
						Events.drawButtons(scene);
					} else {
						new Button.Button({
							id: 'leaveBtn',
							click: function() {
								var scene = Events.activeEvent().scenes[Events.activeScene];
								if(scene.nextScene && scene.nextScene != 'end') {
									Events.loadScene(scene.nextScene);
								} else {
									Events.endEvent(); 
								}
							},
							text: _('leave')
						}).appendTo(btns);
						
						Events.createEatMeatButton(0).appendTo(btns);
						if((Path.outfit['medicine'] || 0) != 0) {
						  Events.createUseMedsButton(0).appendTo(btns);
					  }
					}
				} catch(e) {
					// It is possible to die and win if the timing is perfect. Just let it fail.
				}
			}, 1000);
		});
	},
	
	drawLoot: function(lootList) {
		var desc = $('#description', Events.eventPanel());
		var lootButtons = $('<div>').attr('id', 'lootButtons');
		for(var k in lootList) {
			var loot = lootList[k];
			if(Math.random() < loot.chance) {
				var num = Math.floor(Math.random() * (loot.max - loot.min)) + loot.min;
				new Button.Button({
					id: 'loot_' + k.replace(' ', '-'),
					text: _(k) + ' [' + num + ']',
					click: Events.getLoot
				}).data('numLeft', num).appendTo(lootButtons);
			}
		}
		$('<div>').addClass('clear').appendTo(lootButtons);
		if(lootButtons.children().length > 1) {
			lootButtons.appendTo(desc);
		}
	},
	
	dropStuff: function(e) {
		e.stopPropagation();
		var btn = $(this);
		var thing = btn.data('thing');
		var num = btn.data('num');
		var lootButtons = $('#lootButtons');
		Engine.log('dropping ' + num + ' ' + thing);
		
		var lootBtn = $('#loot_' + thing.replace(' ', '-'), lootButtons);
		if(lootBtn.length > 0) {
			var curNum = lootBtn.data('numLeft');
			curNum += num;
			lootBtn.text(_(thing) + ' [' + curNum + ']').data('numLeft', curNum);
		} else {
			new Button.Button({
				id: 'loot_' + thing.replace(' ', '-'),
				text: _(thing) + ' [' + num + ']',
				click: Events.getLoot
			}).data('numLeft', num).insertBefore($('.clear', lootButtons));
		}
		Path.outfit[thing] -= num;
		Events.getLoot(btn.closest('.button'));
		World.updateSupplies();
	},
	
	getLoot: function(btn) {
		var name = btn.attr('id').substring(5).replace('-', ' ');
		if(btn.data('numLeft') > 0) {
			var weight = Path.getWeight(name);
			var freeSpace = Path.getFreeSpace();
			if(weight <= freeSpace) {
				var num = btn.data('numLeft');
				num--;
				btn.data('numLeft', num);
				if(num == 0) {
					Button.setDisabled(btn);
					btn.animate({'opacity':0}, 300, 'linear', function() {
						$(this).remove();
						if($('#lootButtons').children().length == 1) {
							$('#lootButtons').remove();
						}
					});
				} else {
					// #dropMenu gets removed by this.
					btn.text(_(name) + ' [' + num + ']');
				}
				var curNum = Path.outfit[name];
				curNum = typeof curNum == 'number' ? curNum : 0;
				curNum++;
				Path.outfit[name] = curNum;
				World.updateSupplies();

				// Update weight and free space variables so we can decide
				// whether or not to bring up/update the drop menu.
				weight = Path.getWeight(name);
				freeSpace = Path.getFreeSpace();
			}

			if(weight > freeSpace && btn.data('numLeft') > 0) {
				// Draw the drop menu
				Engine.log('drop menu');
				$('#dropMenu').remove();
				var dropMenu = $('<div>').attr('id', 'dropMenu');
				for(var k in Path.outfit) {
					var itemWeight = Path.getWeight(k);
					if(itemWeight > 0) {
						var numToDrop = Math.ceil((weight - freeSpace) / itemWeight);
						if(numToDrop > Path.outfit[k]) {
							numToDrop = Path.outfit[k];
						}
						if(numToDrop > 0) {
							var dropRow = $('<div>').attr('id', 'drop_' + k.replace(' ', '-'))
								.text(_(k) + ' x' + numToDrop)
								.data('thing', k)
								.data('num', numToDrop)
								.click(Events.dropStuff);
							dropRow.appendTo(dropMenu);
						}
					}
				}
				dropMenu.appendTo(btn);
				btn.one("mouseleave", function() {
					$('#dropMenu').remove();
				});
			}
		} 
	},
	
	createFighterDiv: function(chara, hp, maxhp) {
		var fighter = $('<div>').addClass('fighter').text(_(chara)).data('hp', hp).data('maxHp', maxhp).data('refname',chara);
		$('<div>').addClass('hp').text(hp+'/'+maxhp).appendTo(fighter);
		return fighter;
	},
	
	updateFighterDiv: function(fighter) {
		$('.hp', fighter).text(fighter.data('hp') + '/' + fighter.data('maxHp'));
	},
	
	startStory: function(scene) {
		// Write the text
		var desc = $('#description', Events.eventPanel());
		for(var i in scene.text) {
			$('<div>').text(scene.text[i]).appendTo(desc);
		}
		
		if(scene.textarea != null) {
			$('<textarea>').val(scene.textarea).appendTo(desc);
		}
		
		// Draw any loot
		if(scene.loot) {
			Events.drawLoot(scene.loot);
		}
		
		// Draw the buttons
		Events.drawButtons(scene);
	},
	
	drawButtons: function(scene) {
		var btns = $('#buttons', Events.eventPanel());
		for(var id in scene.buttons) {
			var info = scene.buttons[id];
				var b = new Button.Button({
					id: id,
					text: info.text,
					cost: info.cost,
					click: Events.buttonClick
				}).appendTo(btns);
			if(typeof info.available == 'function' && !info.available()) {
				Button.setDisabled(b, true);
			}
		}
		
		Events.updateButtons();
	},
	
	updateButtons: function() {
		var btns = Events.activeEvent().scenes[Events.activeScene].buttons;
		for(var bId in btns) {
			var b = btns[bId];
			var btnEl = $('#'+bId, Events.eventPanel());
			if(typeof b.available == 'function' && !b.available()) {
				Button.setDisabled(btnEl, true);
			} else if(b.cost) {
				var disabled = false;
				for(var store in b.cost) {
					var num = Engine.activeModule == World ? Path.outfit[store] : $SM.get('stores["'+store+'"]', true);
					if(typeof num != 'number') num = 0;
					if(num < b.cost[store]) {
						// Too expensive
						disabled = true;
						break;
					}
				}
				Button.setDisabled(btnEl, disabled);
			}
		}
	},
	
	buttonClick: function(btn) {
		var info = Events.activeEvent().scenes[Events.activeScene].buttons[btn.attr('id')];
		// Cost
		var costMod = {};
		if(info.cost) {
			for(var store in info.cost) {
				var num = Engine.activeModule == World ? Path.outfit[store] : $SM.get('stores["'+store+'"]', true);
				if(typeof num != 'number') num = 0;
				if(num < info.cost[store]) {
					// Too expensive
					return;
				}
				costMod[store] = -info.cost[store];
			}
			if(Engine.activeModule == World) {
				for(var k in costMod) {
					Path.outfit[k] += costMod[k];
				}
				World.updateSupplies();
			} else {
				$SM.addM('stores', costMod);
			}
		}
		
		if(typeof info.onChoose == 'function') {
			var textarea = Events.eventPanel().find('textarea');
			info.onChoose(textarea.length > 0 ? textarea.val() : null);
		}
		
		// Reward
		if(info.reward) {
			$SM.addM('stores', info.reward);
		}
		
		Events.updateButtons();
		
		// Notification
		if(info.notification) {
			Notifications.notify(null, info.notification);
		}
		
		// Next Scene
		if(info.nextScene) {
			if(info.nextScene == 'end') {
				Events.endEvent();
			} else {
				var r = Math.random();
				var lowestMatch = null;
				for(var i in info.nextScene) {
					if(r < i && (lowestMatch == null || i < lowestMatch)) {
						lowestMatch = i;
					}
				}
				if(lowestMatch != null) {
					Events.loadScene(info.nextScene[lowestMatch]);
					return;
				}
				Engine.log('ERROR: no suitable scene found');
				Events.endEvent();
			}
		}
	},
	
    // Makes an event happen!
    triggerEvent: function() {
    	if(Events.activeEvent() == null) {
	    	var possibleEvents = [];
	    	for(var i in Events.EventPool) {
	    		var event = Events.EventPool[i];
	    		if(event.isAvailable()) {
	    			possibleEvents.push(event);
	    		}
	    	}
			
			if(possibleEvents.length == 0) {
				Events.scheduleNextEvent(0.5);
				return;
			} else {
		    	var r = Math.floor(Math.random()*(possibleEvents.length));
		    	Events.startEvent(possibleEvents[r]);
	    	}
    	}
    	
    	Events.scheduleNextEvent();
    },
    
    triggerFight: function() {
    	var possibleFights = [];
    	for(var i in Events.Encounters) {
    		var fight = Events.Encounters[i];
    		if(fight.isAvailable()) {
    			possibleFights.push(fight);
    		}
    	}
    	
		var r = Math.floor(Math.random()*(possibleFights.length));
    	Events.startEvent(possibleFights[r]);
    },
	
	activeEvent: function() {
		if(Events.eventStack && Events.eventStack.length > 0) {
			return Events.eventStack[0];
		}
		return null;
	},
	
	eventPanel: function() {
		return Events.activeEvent().eventPanel;
	},
    
    startEvent: function(event, options) {
		if(event) {
			Engine.event('game event', 'event');
			Engine.keyLock = true;
			Events.eventStack.unshift(event);
			event.eventPanel = $('<div>').attr('id', 'event').addClass('eventPanel').css('opacity', '0');
			if(options != null && options.width != null) {
				Events.eventPanel().css('width', options.width);
			}
			$('<div>').addClass('eventTitle').text(Events.activeEvent().title).appendTo(Events.eventPanel());
			$('<div>').attr('id', 'description').appendTo(Events.eventPanel());
			$('<div>').attr('id', 'buttons').appendTo(Events.eventPanel());
			Events.loadScene('start');
			$('div#wrapper').append(Events.eventPanel());
			Events.eventPanel().animate({opacity: 1}, Events._PANEL_FADE, 'linear');
		}
    },
    
    scheduleNextEvent: function(scale) {
    	var nextEvent = Math.floor(Math.random()*(Events._EVENT_TIME_RANGE[1] - Events._EVENT_TIME_RANGE[0])) + Events._EVENT_TIME_RANGE[0];
    	if(scale > 0) { nextEvent *= scale; }
    	Engine.log('next event scheduled in ' + nextEvent + ' minutes');
    	Events._eventTimeout = setTimeout(Events.triggerEvent, nextEvent * 60 * 1000);
    },
    
    endEvent: function() {
    	Events.eventPanel().animate({opacity:0}, Events._PANEL_FADE, 'linear', function() {
    		Events.eventPanel().remove();
			Events.activeEvent().eventPanel = null;
			Events.eventStack.shift();
        	Engine.log(Events.eventStack.length + ' events remaining');
    		Engine.keyLock = false;
    		// Force refocus on the body. I hate you, IE.
    		$('body').focus();
    	});
    },
    
    handleStateUpdates: function(e){
		if(e.category == 'stores' && Events.activeEvent() != null){
			Events.updateButtons();
		}
	}
};