/**
 * Module that handles the random event system
 */
var Events = {

	_EVENT_TIME_RANGE: [3, 6], // range, in minutes
	_PANEL_FADE: 200,
	_FIGHT_SPEED: 100,
	_EAT_COOLDOWN: 5,
	_MEDS_COOLDOWN: 7,
	_LEAVE_COOLDOWN: 1,
	STUN_DURATION: 4000,
	BLINK_INTERVAL: false,

	init: function(options) {
		this.options = $.extend(
			this.options,
			options
		);

		// Build the Event Pool
		Events.EventPool = [].concat(
			Events.Global,
			Events.Room,
			Events.Outside
		);

		Events.eventStack = [];

		Events.scheduleNextEvent();

		//subscribe to stateUpdates
		$.Dispatch('stateUpdate').subscribe(Events.handleStateUpdates);

		//check for stored delayed events
		Events.initDelay();
	},

	options: {}, // Nothing for now

	delayState: 'wait',
	activeScene: null,

	loadScene: function(name) {
		Engine.log('loading scene: ' + name);
		Events.activeScene = name;
		var scene = Events.activeEvent().scenes[name];

		// onLoad
		if(scene.onLoad) {
			scene.onLoad();
		}

		// Notify the scene change
		if(scene.notification) {
			Notifications.notify(null, scene.notification);
		}

		// Scene reward
		if(scene.reward) {
			$SM.addM('stores', scene.reward);
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
				if(typeof weapon.damage != 'number' || weapon.damage === 0) {
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
		if(numWeapons === 0) {
			// No weapons? You can punch stuff!
			Events.createAttackButton('fists').prependTo(btns);
		}

		Events.createEatMeatButton().appendTo(btns);
		if((Path.outfit['medicine'] || 0) !== 0) {
			Events.createUseMedsButton().appendTo(btns);
		}

		// Set up the enemy attack timer
		Events._enemyAttackTimer = Engine.setTimeout(Events.enemyAttack, scene.attackDelay * 1000);
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

		if(Path.outfit['cured meat'] === 0) {
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

		if((Path.outfit['medicine'] || 0) === 0) {
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
			if(Path.outfit['cured meat'] === 0) {
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
				var takeETbutton = Events.setTakeAll();
				Events.canLeave(takeETbutton);
			}
		}
	},

	useMeds: function() {
		if(Path.outfit['medicine'] > 0) {
			Path.outfit['medicine']--;
			World.updateSupplies();
			if(Path.outfit['medicine'] === 0) {
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
				var takeETbutton = Events.setTakeAll();
				Events.canLeave(takeETbutton);
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
						if(fists.length === 0) {
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
					msg = _('miss');
					dmg = 0;
				} else {
					msg = '-' + dmg;
					enemyHp = ((enemyHp - dmg) < 0) ? 0 : (enemyHp - dmg);
					enemy.data('hp', enemyHp);
					if(fighter.attr('id') == 'enemy') {
						World.setHp(enemyHp);
					}
					Events.updateFighterDiv(enemy);
				}
			} else {
				if(dmg == 'stun') {
					msg = _('stunned');
					enemy.data('stunned', true);
					Engine.setTimeout(function() {
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
					msg = _('miss');
					dmg = 0;
				} else {
					msg = '-' + dmg;
					enemyHp = ((enemyHp - dmg) < 0) ? 0 : (enemyHp - dmg);
					enemy.data('hp', enemyHp);
					if(fighter.attr('id') == 'enemy') {
						World.setHp(enemyHp);
					}
					Events.updateFighterDiv(enemy);
				}
			} else {
				if(dmg == 'stun') {
					msg = _('stunned');
					enemy.data('stunned', true);
					Engine.setTimeout(function() {
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

		Events._enemyAttackTimer = Engine.setTimeout(Events.enemyAttack, scene.attackDelay * 1000);
	},

	winFight: function() {
		Events.won = true;
		clearTimeout(Events._enemyAttackTimer);
		$('#enemy').animate({opacity: 0}, 300, 'linear', function() {
			Engine.setTimeout(function() {
				try {
					var scene = Events.activeEvent().scenes[Events.activeScene];
					var leaveBtn = false;
					var desc = $('#description', Events.eventPanel());
					var btns = $('#buttons', Events.eventPanel());
					desc.empty();
					btns.empty();
					$('<div>').text(scene.deathMessage).appendTo(desc);

					var takeETbtn = Events.drawLoot(scene.loot);

					if(scene.buttons) {
						// Draw the buttons
						leaveBtn = Events.drawButtons(scene);
					} else {
						leaveBtn = new Button.Button({
							id: 'leaveBtn',
							cooldown: Events._LEAVE_COOLDOWN,
							click: function() {
								if(scene.nextScene && scene.nextScene != 'end') {
									Events.loadScene(scene.nextScene);
								} else {
									Events.endEvent();
								}
							},
							text: _('leave')
						});
						Button.cooldown(leaveBtn.appendTo(btns));

						Events.createEatMeatButton(0).appendTo(btns);
						if((Path.outfit['medicine'] || 0) !== 0) {
							Events.createUseMedsButton(0).appendTo(btns);
						}
					}
					Events.allowLeave(takeETbtn, leaveBtn);
				} catch(e) {
					// It is possible to die and win if the timing is perfect. Just let it fail.
				}
			}, 1000, true);
		});
	},

	drawDrop:function(btn) {
		var name = btn.attr('id').substring(5).replace('-', ' ');
		var needsAppend = false;
		var weight = Path.getWeight(name);
		var freeSpace = Path.getFreeSpace();
		if(weight > freeSpace) {
			// Draw the drop menu
			Engine.log('drop menu');
			if($('#dropMenu').length){
				var dropMenu = $('#dropMenu');
				$('#dropMenu').empty();
			} else {
				var dropMenu = $('<div>').attr({'id': 'dropMenu', 'data-legend': _('drop:')});
				needsAppend = true;
			}
			for(var k in Path.outfit) {
				if(name == k) continue;
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
							.click(Events.dropStuff)
							.mouseenter(function(e){
								e.stopPropagation();
							});
						dropRow.appendTo(dropMenu);
					}
				}
			}
			$('<div>').attr('id','no_drop')
				.text(_('nothing'))
				.mouseenter(function(e){
					e.stopPropagation();
				})
				.click(function(e){
					e.stopPropagation();
					dropMenu.remove();
				})
				.appendTo(dropMenu);
			if(needsAppend){
				dropMenu.appendTo(btn);
			}
			btn.one("mouseleave", function() {
				$('#dropMenu').remove();
			});
		}
	},

	drawLootRow: function(name, num){
		var id = name.replace(' ', '-');
		var lootRow = $('<div>').attr('id','loot_' + id).data('item', name).addClass('lootRow');
		var take = new Button.Button({
			id: 'take_' + id,
			text: _(name) + ' [' + num + ']',
			click: Events.getLoot
		}).addClass('lootTake').data('numLeft', num).appendTo(lootRow);
		take.mouseenter(function(){
			Events.drawDrop(take);
		});
		var takeall = new Button.Button({
			id: 'all_take_' + id,
			text: _('take') + ' ',
			click: Events.takeAll
		}).addClass('lootTakeAll').appendTo(lootRow);
		$('<span>').insertBefore(takeall.children('.cooldown'));
		$('<div>').addClass('clear').appendTo(lootRow);
		return lootRow;
	},

	drawLoot: function(lootList) {
		var desc = $('#description', Events.eventPanel());
		var lootButtons = $('<div>').attr({'id': 'lootButtons', 'data-legend': _('take:')});
		for(var k in lootList) {
			var loot = lootList[k];
			if(Math.random() < loot.chance) {
				var num = Math.floor(Math.random() * (loot.max - loot.min)) + loot.min;
				var lootRow = Events.drawLootRow(k, num);
				lootRow.appendTo(lootButtons);
			}
		}
		lootButtons.appendTo(desc);
		if(lootButtons.children().length > 0) {
			var takeETrow = $('<div>').addClass('takeETrow');
			var takeET = new Button.Button({
				id: 'loot_takeEverything',
				text: '',
				click: Events.takeEverything
			}).appendTo(takeETrow);
			$('<span>').insertBefore(takeET.children('.cooldown'));
			$('<div>').addClass('clear').appendTo(takeETrow);
			takeETrow.appendTo(lootButtons);
			Events.setTakeAll(lootButtons);
		} else {
			var noLoot = $('<div>').addClass('noLoot').text( _('nothing to take') );
			noLoot.appendTo(lootButtons);
		}
		return takeET || false;
	},

	setTakeAll: function(lootButtons){
		var lootButtons = lootButtons || $('#lootButtons');
		var canTakeSomething = false;
		var free = Path.getFreeSpace();
		var takeETbutton = lootButtons.find('#loot_takeEverything');
		lootButtons.children('.lootRow').each(function(i){
			var name = $(this).data('item');
			var take = $(this).children('.lootTake').first();
			var takeAll = $(this).children('.lootTakeAll').first();
			var numLeft = take.data('numLeft');
			var num = Math.min(Math.floor(Path.getFreeSpace() / Path.getWeight(name)), numLeft);
			takeAll.data('numLeft', num);
			free -= numLeft * Path.getWeight(name);
			if(num > 0){
				takeAll.removeClass('disabled');
				canTakeSomething = true;
			} else {
				takeAll.addClass('disabled');
			}
			if(num < numLeft){
				takeAll.children('span').first().text(num);
			} else {
				takeAll.children('span').first().text(_('all'));
			}
		});
		if(canTakeSomething){
			takeETbutton.removeClass('disabled');
		} else {
			takeETbutton.addClass('disabled');
		}
		takeETbutton.data('canTakeEverything', (free >= 0) ? true : false);
		return takeETbutton;
	},

	allowLeave: function(takeETbtn, leaveBtn){
		if(takeETbtn){
			if(leaveBtn){
				takeETbtn.data('leaveBtn', leaveBtn);
			}
			Events.canLeave(takeETbtn);
		}
	},

	canLeave: function(btn){
		var basetext = _('take everything');
		var textbox = btn.children('span');
		var takeAndLeave = (btn.data('leaveBtn')) ? btn.data('canTakeEverything') : false;
		if(takeAndLeave){
			textbox.text( basetext + _(' and ') + _('leave') );
			btn.data('canLeave', true);
		} else {
			textbox.text( basetext );
			btn.data('canLeave', false)
		}
	},

	dropStuff: function(e) {
		e.stopPropagation();
		var btn = $(this);
		var target = btn.closest('.button');
		var thing = btn.data('thing');
		var id = 'take_' + thing.replace(' ', '-');
		var num = btn.data('num');
		var lootButtons = $('#lootButtons');
		Engine.log('dropping ' + num + ' ' + thing);

		var lootBtn = $('#' + id, lootButtons);
		if(lootBtn.length > 0) {
			var curNum = lootBtn.data('numLeft');
			curNum += num;
			lootBtn.text(_(thing) + ' [' + curNum + ']').data('numLeft', curNum);
		} else {
			var lootRow = Events.drawLootRow(thing, num);
			lootRow.insertBefore($('.takeETrow', lootButtons));
		}
		Path.outfit[thing] -= num;
		Events.getLoot(target);
		World.updateSupplies();
	},

	getLoot: function(btn, skipButtonSet) {
		var name = btn.attr('id').substring(5).replace('-', ' ');
		if(btn.data('numLeft') > 0) {
			var skipButtonSet = skipButtonSet || false;
			var weight = Path.getWeight(name);
			var freeSpace = Path.getFreeSpace();
			if(weight <= freeSpace) {
				var num = btn.data('numLeft');
				num--;
				btn.data('numLeft', num);
				// #dropMenu gets removed by this.
				btn.text(_(name) + ' [' + num + ']');
				if(num === 0) {
					Button.setDisabled(btn);
					btn.animate({'opacity':0}, 300, 'linear', function() {
						$(this).parent().remove();
						if($('#lootButtons').children().length == 1) {
							$('#lootButtons').remove();
						}
					});
				}
				var curNum = Path.outfit[name];
				curNum = typeof curNum == 'number' ? curNum : 0;
				curNum++;
				Path.outfit[name] = curNum;
				World.updateSupplies();

				if(!skipButtonSet){
					Events.setTakeAll();
				}
			}
			if(!skipButtonSet){
				Events.drawDrop(btn);
			}
		}
	},

	takeAll: function(btn){
		var target = $('#'+ btn.attr('id').substring(4));
		for(var k = 0; k < btn.data('numLeft'); k++){
			Events.getLoot(target, true);
		}
		Events.setTakeAll();
	},

	takeEverything: function(btn){
		$('#lootButtons').children('.lootRow').each(function(i){
			var target = $(this).children('.lootTakeAll').first();
			if(!target.hasClass('disabled')){
				Events.takeAll(target);
			}
		});
		if(btn.data('canLeave')){
			btn.data('leaveBtn').click();
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
		var leaveBtn = false;
		for(var i in scene.text) {
			$('<div>').text(scene.text[i]).appendTo(desc);
		}

		if(scene.textarea != null) {
			var ta = $('<textarea>').val(scene.textarea).appendTo(desc);
			if(scene.readonly) {
				ta.attr('readonly', true);
			}
			Engine.autoSelect('#description textarea');
		}

		// Draw any loot
		if(scene.loot) {
			var takeETbtn = Events.drawLoot(scene.loot);
		}

		// Draw the buttons
		leaveBtn = Events.drawButtons(scene);

		Events.allowLeave(takeETbtn, leaveBtn);
	},

	drawButtons: function(scene) {
		var btns = $('#buttons', Events.eventPanel());
		var btnsList = [];
		for(var id in scene.buttons) {
			var info = scene.buttons[id];
				var b = new Button.Button({
					id: id,
					text: info.text,
					cost: info.cost,
					click: Events.buttonClick,
					cooldown: info.cooldown
				}).appendTo(btns);
			if(typeof info.available == 'function' && !info.available()) {
				Button.setDisabled(b, true);
			}
			if(typeof info.cooldown == 'number') {
				Button.cooldown(b);
			}
			btnsList.push(b);
		}

		Events.updateButtons();
		return (btnsList.length == 1) ? btnsList[0] : false;
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

	// blinks the browser window title
	blinkTitle: function() {
		var title = document.title;

		// every 3 seconds change title to '*** EVENT ***', then 1.5 seconds later, change it back to the original title.
		Events.BLINK_INTERVAL = setInterval(function() {
			document.title = _('*** EVENT ***');
			Engine.setTimeout(function() {document.title = title;}, 1500, true);
		}, 3000);
	},

	stopTitleBlink: function() {
		clearInterval(Events.BLINK_INTERVAL);
		Events.BLINK_INTERVAL = false;
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

			if(possibleEvents.length === 0) {
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
			Engine.tabNavigation = false;
			Button.saveCooldown = false;
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
			var currentSceneInformation = Events.activeEvent().scenes[Events.activeScene];
			if (currentSceneInformation.blink) {
				Events.blinkTitle();
			}
		}
	},

	scheduleNextEvent: function(scale) {
		var nextEvent = Math.floor(Math.random()*(Events._EVENT_TIME_RANGE[1] - Events._EVENT_TIME_RANGE[0])) + Events._EVENT_TIME_RANGE[0];
		if(scale > 0) { nextEvent *= scale; }
		Engine.log('next event scheduled in ' + nextEvent + ' minutes');
		Events._eventTimeout = Engine.setTimeout(Events.triggerEvent, nextEvent * 60 * 1000);
	},

	endEvent: function() {
		Events.eventPanel().animate({opacity:0}, Events._PANEL_FADE, 'linear', function() {
			Events.eventPanel().remove();
			Events.activeEvent().eventPanel = null;
			Events.eventStack.shift();
			Engine.log(Events.eventStack.length + ' events remaining');
			Engine.keyLock = false;
			Engine.tabNavigation = true;
			Button.saveCooldown = true;
			if (Events.BLINK_INTERVAL) {
				Events.stopTitleBlink();
			}
			// Force refocus on the body. I hate you, IE.
			$('body').focus();
		});
	},

	handleStateUpdates: function(e){
		if((e.category == 'stores' || e.category == 'income') && Events.activeEvent() != null){
			Events.updateButtons();
		}
	},

	initDelay: function(){
		if($SM.get(Events.delayState)){
			Events.recallDelay(Events.delayState, Events);
		}
	},

	recallDelay: function(stateName, target){
		var state = $SM.get(stateName);
		for(var i in state){
			if(typeof(state[i]) == 'object'){
				Events.recallDelay(stateName +'["'+ i +'"]', target[i]);
			} else {
				if(typeof target[i] == 'function'){
					target[i]();
				} else {
					$SM.remove(stateName)
				}
			}
		}
		if($.isEmptyObject(state)){
			$SM.remove(stateName);
		}
	},

	saveDelay: function(action, stateName, delay){
		var state = Events.delayState + '.' + stateName;
		if(delay){
			$SM.set(state, delay);
		} else {
			var delay = $SM.get(state, true)
		}
		var time = Engine.setInterval(function(){
			// update state every half second
			$SM.set(state, ($SM.get(state) - 0.5), true);
		}, 500);
		Engine.setTimeout(function(){
			// outcome realizes. erase countdown
			window.clearInterval(time);
			$SM.remove(state);
			$SM.removeBranch(Events.delayState);
			action();
		}, delay * 1000);
	}
};
