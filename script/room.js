/**
 * Module that registers the simple room functionality
 */
var Room = {
	// times in (minutes * seconds * milliseconds)
	_FIRE_COOL_DELAY: 5 * 60 * 1000, // time after a stoke before the fire cools
	_ROOM_WARM_DELAY: 30 * 1000, // time between room temperature updates
	_BUILDER_STATE_DELAY: 0.5 * 60 * 1000, // time between builder state updates
	_STOKE_COOLDOWN: 10, // cooldown to stoke the fire
	_NEED_WOOD_DELAY: 15 * 1000, // from when the stranger shows up, to when you need wood
	
	buttons:{},
	
	Craftables: {
		'trap': {
			name: _('trap'),
			button: null,
			maximum: 10,
			availableMsg: _('builder says she can make traps to catch any creatures might still be alive out there'),
			buildMsg: _('more traps to catch more creatures'),
			maxMsg: _("more traps won't help now"),
			type: 'building',
			cost: function() {
				var n = $SM.get('game.buildings["trap"]', true);
				return {
					'wood': 10 + (n*10)
				};
			}
		},
		'cart': {
			name: _('cart'),
			button: null,
			maximum: 1,
			availableMsg: _('builder says she can make a cart for carrying wood'),
			buildMsg: _('the rickety cart will carry more wood from the forest'),
			type: 'building',
			cost: function() {
				return {
					'wood': 30
				};
			}
		},
		'hut': {
			name: _('hut'),
			button: null,
			maximum: 20,
			availableMsg: _("builder says there are more wanderers. says they'll work, too."),
			buildMsg: _('builder puts up a hut, out in the forest. says word will get around.'),
			maxMsg: _('no more room for huts.'),
			type: 'building',
			cost: function() {
				var n = $SM.get('game.buildings["hut"]', true);
				return {
					'wood': 100 + (n*50)
				};
			}
		},
		'lodge': {
			name: _('lodge'),
			button: null,
			maximum: 1,
			availableMsg: _('villagers could help hunt, given the means'),
			buildMsg: _('the hunting lodge stands in the forest, a ways out of town'),
			type: 'building',
			cost: function() {
				return {
					wood: 200,
					fur: 10,
					meat: 5
				};
			}
		},
		'trading post': {
			name: _('trading post'),
			button: null,
			maximum: 1,
			availableMsg: _("a trading post would make commerce easier"),
			buildMsg: _("now the nomads have a place to set up shop, they might stick around a while"),
			type: 'building',
			cost: function() {
				return {
					'wood': 400,
					'fur': 100
				};
			}
		},
		'tannery': {
			name: _('tannery'),
			button: null,
			maximum: 1,
			availableMsg: _("builder says leather could be useful. says the villagers could make it."),
			buildMsg: _('tannery goes up quick, on the edge of the village'),
			type: 'building',
			cost: function() {
				return {
					'wood': 500,
					'fur': 50
				};
			}
		},
		'smokehouse': {
			name: _('smokehouse'),
			button: null,
			maximum: 1,
			availableMsg: _("should cure the meat, or it'll spoil. builder says she can fix something up."),
			buildMsg: _('builder finishes the smokehouse. she looks hungry.'),
			type: 'building',
			cost: function() {
				return {
					'wood': 600,
					'meat': 50
				};
			}
		},
		'workshop': {
			name: _('workshop'),
			button: null,
			maximum: 1,
			availableMsg: _("builder says she could make finer things, if she had the tools"),
			buildMsg: _("workshop's finally ready. builder's excited to get to it"),
			type: 'building',
			cost: function() {
				return {
					'wood': 800,
					'leather': 100,
					'scales': 10
				};
			}
		},
		'steelworks': {
			name: _('steelworks'),
			button: null,
			maximum: 1,
			availableMsg: _("builder says the villagers could make steel, given the tools"),
			buildMsg: _("a haze falls over the village as the steelworks fires up"),
			type: 'building',
			cost: function() {
				return {
					'wood': 1500,
					'iron': 100,
					'coal': 100
				};
			}
		},
		'armoury': {
			name: _('armoury'),
			button: null,
			maximum: 1,
			availableMsg: _("builder says it'd be useful to have a steady source of bullets"),
			buildMsg: _("armoury's done, welcoming back the weapons of the past."),
			type: 'building',
			cost: function() {
				return {
					'wood': 3000,
					'steel': 100,
					'sulphur': 50
				};
			}
		},
		'torch': {
			name: _('torch'),
			button: null,
			type: 'tool',
			buildMsg: _('a torch to keep the dark away'),
			cost: function() {
				return {
					'wood': 1,
					'cloth': 1
				};
			}
		},
		'waterskin': {
			name: _('waterskin'),
			button: null,
			type: 'upgrade',
			maximum: 1,
			buildMsg: _('this waterskin\'ll hold a bit of water, at least'),
			cost: function() {
				return {
					'leather': 50
				};
			}
		},
		'cask': {
			name: _('cask'),
			button: null,
			type: 'upgrade',
			maximum: 1,
			buildMsg: _('the cask holds enough water for longer expeditions'),
			cost: function() {
				return {
					'leather': 100,
					'iron': 20
				};
			}
		},
		'water tank': {
			name: _('water tank'),
			button: null,
			type: 'upgrade',
			maximum: 1,
			buildMsg: _('never go thirsty again'),
			cost: function() {
				return {
					'iron': 100,
					'steel': 50
				};
			}
		},
		'bone spear': {
			name: _('bone spear'),
			button: null,
			type: 'weapon',
			buildMsg: _("this spear's not elegant, but it's pretty good at stabbing"),
			cost: function() {
				return {
					'wood': 100,
					'teeth': 5
				};
			}
		},
		'rucksack': {
			name: _('rucksack'),
			button: null,
			type: 'upgrade',
			maximum: 1,
			buildMsg: _('carrying more means longer expeditions to the wilds'),
			cost: function() {
				return {
					'leather': 200
				};
			}
		},
		'wagon': {
			name: _('wagon'),
			button: null,
			type: 'upgrade',
			maximum: 1,
			buildMsg: _('the wagon can carry a lot of supplies'),
			cost: function() {
				return {
					'wood': 500,
					'iron': 100
				};
			}
		},
		'convoy': {
			name: _('convoy'),
			button: null,
			type: 'upgrade',
			maximum: 1,
			buildMsg: _('the convoy can haul mostly everything'),
			cost: function() {
				return {
					'wood': 1000,
					'iron': 200,
					'steel': 100
				};
			}
		},
		'l armour': {
			name: _('l armour'),
			type: 'upgrade',
			maximum: 1,
			buildMsg: _("leather's not strong. better than rags, though."),
			cost: function() {
				return {
					'leather': 200,
					'scales': 20
				};
			}
		},
		'i armour': {
			name: _('i armour'),
			type: 'upgrade',
			maximum: 1,
			buildMsg: _("iron's stronger than leather"),
			cost: function() {
				return {
					'leather': 200,
					'iron': 100
				};
			}
		},
		's armour': {
			name: _('s armour'),
			type: 'upgrade',
			maximum: 1,
			buildMsg: _("steel's stronger than iron"),
			cost: function() {
				return {
					'leather': 200,
					'steel': 100
				};
			}
		},
		'iron sword': {
			name: _('iron sword'),
			button: null,
			type: 'weapon',
			buildMsg: _("sword is sharp. good protection out in the wilds."),
			cost: function() {
				return {
					'wood': 200,
					'leather': 50,
					'iron': 20
				};
			}
		},
		'steel sword': {
			name: _('steel sword'),
			button: null,
			type: 'weapon',
			buildMsg: _("the steel is strong, and the blade true."),
			cost: function() {
				return {
					'wood': 500,
					'leather': 100,
					'steel': 20
				};
			}
		},
		'rifle': {
			name: _('rifle'),
			type: 'weapon',
			buildMsg: _("black powder and bullets, like the old days."),
			cost: function() {
				return {
					'wood': 200,
					'steel': 50,
					'sulphur': 50
				};
			}
		}
	},
	
	TradeGoods: {
		'scales': {
			type: 'good',
			cost: function() {
				return { fur: 150 };
			}
		},
		'teeth': {
			type: 'good',
			cost: function() {
				return { fur: 300 };
			}
		},
		'iron': {
			type: 'good',
			cost: function() {
				return {
					'fur': 150,
					'scales': 50
				};
			}
		},
		'coal': {
			type: 'good',
			cost: function() {
				return {
					'fur': 200,
					'teeth': 50
				};
			}
		},
		'steel': {
			type: 'good',
			cost: function() {
				return {
					'fur': 300,
					'scales': 50,
					'teeth': 50
				};
			}
		},
		'medicine': {
			type: 'good',
			cost: function() {
				return {
					'scales': 50, 'teeth': 30
				};
			}
		},
		'bullets': {
			type: 'good',
			cost: function() {
				return {
					'scales': 10
				};
			}
		},
		'energy cell': {
			type: 'good',
			cost: function() {
				return {
					'scales': 10,
					'teeth': 10
				};
			}
		},
		'bolas': {
			type: 'weapon',
			cost: function() {
				return {
					'teeth': 10
				};
			}
		},
		'grenade': {
			type: 'weapon',
			cost: function() {
				return {
					'scales': 100,
					'teeth': 50
				};
			}
		},
		'bayonet': {
			type: 'weapon',
			cost: function() {
				return {
					'scales': 500,
					'teeth': 250
				};
			}
		},
		'alien alloy': {
			type: 'good',
			cost: function() {
				return {
					'fur': 1500,
					'scales': 750,
					'teeth': 300
				};
			}
		},
		'compass': {
			type: 'upgrade',
			maximum: 1,
			cost: function() {
				return { 
					fur: 400, 
					scales: 20, 
					teeth: 10 
				};
			}
		}
	},
	
	MiscItems: {
		'laser rifle': {
			type: 'weapon'
		}
	},
	
	name: _("Room"),
	init: function(options) {
		this.options = $.extend(
			this.options,
			options
		);
		
		if(Engine._debug) {
			this._ROOM_WARM_DELAY = 5000;
			this._BUILDER_STATE_DELAY = 5000;
			this._STOKE_COOLDOWN = 0;
			this._NEED_WOOD_DELAY = 5000;
		}
		
		if(typeof $SM.get('features.location.room') == 'undefined') {
			$SM.set('features.location.room', true);
			$SM.set('game.builder.level', -1);
		}
		
		// If this is the first time playing, the fire is dead and it's freezing. 
		// Otherwise grab past save state temp and fire level.
		$SM.set('game.temperature', $SM.get('game.temperature.value')===undefined?this.TempEnum.Freezing:$SM.get('game.temperature'));
		$SM.set('game.fire', $SM.get('game.fire.value')===undefined?this.FireEnum.Dead:$SM.get('game.fire'));
		
		// Create the room tab
		this.tab = Header.addLocation(_("A Dark Room"), "room", Room);
		
		// Create the Room panel
		this.panel = $('<div>')
			.attr('id', "roomPanel")
			.addClass('location')
			.appendTo('div#locationSlider');
		
		Engine.updateSlider();
		
		// Create the light button
		new Button.Button({
			id: 'lightButton',
			text: _('light fire'),
			click: Room.lightFire,
			cooldown: Room._STOKE_COOLDOWN,
			width: '80px',
			cost: {'wood': 5}
		}).appendTo('div#roomPanel');
		
		// Create the stoke button
		new Button.Button({
			id: 'stokeButton',
			text: _("stoke fire"),
			click: Room.stokeFire,
			cooldown: Room._STOKE_COOLDOWN,
			width: '80px',
			cost: {'wood': 1}
		}).appendTo('div#roomPanel');
		
		// Create the stores container
		$('<div>').attr('id', 'storesContainer').appendTo('div#roomPanel');
		
		//subscribe to stateUpdates
		$.Dispatch('stateUpdate').subscribe(Room.handleStateUpdates);
		
		Room.updateButton();
		Room.updateStoresView();
		Room.updateIncomeView();
		Room.updateBuildButtons();
		
		Room._fireTimer = Engine.setTimeout(Room.coolFire, Room._FIRE_COOL_DELAY);
		Room._tempTimer = Engine.setTimeout(Room.adjustTemp, Room._ROOM_WARM_DELAY);
		
		/*
		 * Builder states:
		 * 0 - Approaching
		 * 1 - Collapsed
		 * 2 - Shivering
		 * 3 - Sleeping
		 * 4 - Helping
		 */
		if($SM.get('game.builder.level') >= 0 && $SM.get('game.builder.level') < 3) {
			Room._builderTimer = Engine.setTimeout(Room.updateBuilderState, Room._BUILDER_STATE_DELAY);
		}
		if($SM.get('game.builder.level') == 1 && $SM.get('stores.wood', true) < 0) {
			Engine.setTimeout(Room.unlockForest, Room._NEED_WOOD_DELAY);
		}
		Engine.setTimeout($SM.collectIncome, 1000);

		Notifications.notify(Room, _("the room is {0}", Room.TempEnum.fromInt($SM.get('game.temperature.value')).text));
		Notifications.notify(Room, _("the fire is {0}", Room.FireEnum.fromInt($SM.get('game.fire.value')).text));
	},
	
	options: {}, // Nothing for now
	
	onArrival: function(transition_diff) {
		Room.setTitle();
		if(Room.changed) {
			Notifications.notify(Room, _("the fire is {0}", Room.FireEnum.fromInt($SM.get('game.fire.value')).text));
			Notifications.notify(Room, _("the room is {0}", Room.TempEnum.fromInt($SM.get('game.temperature.value')).text));
			Room.changed = false;
		}
		if($SM.get('game.builder.level') == 3) {
			$SM.add('game.builder.level', 1);
			$SM.setIncome('builder', {
				delay: 10,
				stores: {'wood' : 2 }
			});
			Room.updateIncomeView();
			Notifications.notify(Room, _("the stranger is standing by the fire. she says she can help. says she builds things."));
		}

		Engine.moveStoresView(null, transition_diff);
	},
	
	TempEnum: {
		fromInt: function(value) {
			for(var k in this) {
				if(typeof this[k].value != 'undefined' && this[k].value == value) {
					return this[k];
				}
			}
			return null;
		},
		Freezing: { value: 0, text: _('freezing') },
		Cold: { value: 1, text: _('cold') },
		Mild: { value: 2, text: _('mild') },
		Warm: { value: 3, text: _('warm') },
		Hot: { value: 4, text: _('hot') }
	},
	
	FireEnum: {
		fromInt: function(value) {
			for(var k in this) {
				if(typeof this[k].value != 'undefined' && this[k].value == value) {
					return this[k];
				}
			}
			return null;
		},
		Dead: { value: 0, text: _('dead') },
		Smoldering: { value: 1, text: _('smoldering') },
		Flickering: { value: 2, text: _('flickering') },
		Burning: { value: 3, text: _('burning') },
		Roaring: { value: 4, text: _('roaring') }
	},
	
	setTitle: function() {
		var title = $SM.get('game.fire.value') < 2 ? _("A Dark Room") : _("A Firelit Room");
		if(Engine.activeModule == this) {
			document.title = title;
		}
		$('div#location_room').text(title);
	},
	
	updateButton: function() {
		var light = $('#lightButton.button');
		var stoke = $('#stokeButton.button');
		if($SM.get('game.fire.value') == Room.FireEnum.Dead.value && stoke.css('display') != 'none') {
			stoke.hide();
			light.show();
			if(stoke.hasClass('disabled')) {
				Button.cooldown(light);
			}
		} else if(light.css('display') != 'none') {
			stoke.show();
			light.hide();
			if(light.hasClass('disabled')) {
				Button.cooldown(stoke);
			}
		}
		
		if(!$SM.get('stores.wood')) {
			light.addClass('free');
			stoke.addClass('free');
		} else {
			light.removeClass('free');
			stoke.removeClass('free');
		}
	},
	
	_fireTimer: null,
	_tempTimer: null,
	lightFire: function() {
		var wood = $SM.get('stores.wood');
		if(wood < 5) {
			Notifications.notify(Room, _("not enough wood to get the fire going"));
			Button.clearCooldown($('#lightButton.button'));
			return;
		} else if(wood > 4) {
			$SM.set('stores.wood', wood - 5);
		}
		$SM.set('game.fire', Room.FireEnum.Burning);
		Room.onFireChange();
	},
	
	stokeFire: function() {
		var wood = $SM.get('stores.wood');
		if(wood === 0) {
			Notifications.notify(Room, _("the wood has run out"));
			Button.clearCooldown($('#stokeButton.button'));
			return;
		}
		if(wood > 0) {
			$SM.set('stores.wood', wood - 1);
		}
		if($SM.get('game.fire.value') < 4) {
			$SM.set('game.fire', Room.FireEnum.fromInt($SM.get('game.fire.value') + 1));
		}
		Room.onFireChange();
	},
	
	onFireChange: function() {
		if(Engine.activeModule != Room) {
			Room.changed = true;
		}
		Notifications.notify(Room, _("the fire is {0}", Room.FireEnum.fromInt($SM.get('game.fire.value')).text), true);
		if($SM.get('game.fire.value') > 1 && $SM.get('game.builder.level') < 0) {
			$SM.set('game.builder.level', 0);
			Notifications.notify(Room, _("the light from the fire spills from the windows, out into the dark"));
			Engine.setTimeout(Room.updateBuilderState, Room._BUILDER_STATE_DELAY);
		}	
		window.clearTimeout(Room._fireTimer);
		Room._fireTimer = Engine.setTimeout(Room.coolFire, Room._FIRE_COOL_DELAY);
		Room.updateButton();
		Room.setTitle();
	},
	
	coolFire: function() {
		var wood = $SM.get('stores.wood');
		if($SM.get('game.fire.value') <= Room.FireEnum.Flickering.value &&
			$SM.get('game.builder.level') > 3 && wood > 0) {
			Notifications.notify(Room, _("builder stokes the fire"), true);
			$SM.set('stores.wood', wood - 1);
			$SM.set('game.fire',Room.FireEnum.fromInt($SM.get('game.fire.value') + 1));
		}
		if($SM.get('game.fire.value') > 0) {
			$SM.set('game.fire',Room.FireEnum.fromInt($SM.get('game.fire.value') - 1));
			Room._fireTimer = Engine.setTimeout(Room.coolFire, Room._FIRE_COOL_DELAY);
			Room.onFireChange();
		}
	},
	
	adjustTemp: function() {
		var old = $SM.get('game.temperature.value');
		if($SM.get('game.temperature.value') > 0 && $SM.get('game.temperature.value') > $SM.get('game.fire.value')) {
			$SM.set('game.temperature',Room.TempEnum.fromInt($SM.get('game.temperature.value') - 1));
			Notifications.notify(Room, _("the room is {0}" , Room.TempEnum.fromInt($SM.get('game.temperature.value')).text), true);
		}
		if($SM.get('game.temperature.value') < 4 && $SM.get('game.temperature.value') < $SM.get('game.fire.value')) {
			$SM.set('game.temperature', Room.TempEnum.fromInt($SM.get('game.temperature.value') + 1));
			Notifications.notify(Room, _("the room is {0}" , Room.TempEnum.fromInt($SM.get('game.temperature.value')).text), true);
		}
		if($SM.get('game.temperature.value') != old) {
			Room.changed = true;
		}
		Room._tempTimer = Engine.setTimeout(Room.adjustTemp, Room._ROOM_WARM_DELAY);
	},
	
	unlockForest: function() {
		$SM.set('stores.wood', 4);
		Outside.init();
		Notifications.notify(Room, _("the wind howls outside"));
		Notifications.notify(Room, _("the wood is running out"));
		Engine.event('progress', 'outside');
	},
	
	updateBuilderState: function() {
		var lBuilder = $SM.get('game.builder.level');
		if(lBuilder === 0) {
			Notifications.notify(Room, _("a ragged stranger stumbles through the door and collapses in the corner"));
			lBuilder = $SM.setget('game.builder.level', 1);
			Engine.setTimeout(Room.unlockForest, Room._NEED_WOOD_DELAY);
		} 
		else if(lBuilder < 3 && $SM.get('game.temperature.value') >= Room.TempEnum.Warm.value) {
			var msg = "";
			switch(lBuilder) {
			case 1:
				msg = _("the stranger shivers, and mumbles quietly. her words are unintelligible.");
				break;
			case 2:
				msg = _("the stranger in the corner stops shivering. her breathing calms.");
				break;
			}
			Notifications.notify(Room, msg);
			if(lBuilder < 3) {
				lBuilder = $SM.setget('game.builder.level', lBuilder + 1);
			}
		}
		if(lBuilder < 3) {
			Engine.setTimeout(Room.updateBuilderState, Room._BUILDER_STATE_DELAY);
		}
		Engine.saveGame();
	},
	
	updateStoresView: function() {
		var stores = $('div#stores');
		var weapons = $('div#weapons');
		var needsAppend = false, wNeedsAppend = false, newRow = false;
		if(stores.length === 0) {
			stores = $('<div>').attr({
				id: 'stores'
			}).css('opacity', 0);
			needsAppend = true;
		}
		if(weapons.length === 0) {
			weapons = $('<div>').attr({
				id: 'weapons'
			}).css('opacity', 0);
			wNeedsAppend = true;
		}
		for(var k in $SM.get('stores')) {
			
			var type = null;
			if(Room.Craftables[k]) {
				type = Room.Craftables[k].type;
			} else if(Room.TradeGoods[k]) {
				type = Room.TradeGoods[k].type;
			} else if (Room.MiscItems[k]) {
				type = Room.MiscItems[k].type;
			}
			
			var location;
			switch(type) {
			case 'upgrade':
				// Don't display upgrades on the Room screen
				continue;
			case 'weapon':
				location = weapons;
				break;
			default:
				location = stores;
				break;
			}
			
			var id = "row_" + k.replace(' ', '-');
			var row = $('div#' + id, location);
			var num = $SM.get('stores["'+k+'"]');
			
			if(typeof num != 'number' || isNaN(num)) {
				// No idea how counts get corrupted, but I have reason to believe that they occassionally do.
				// Build a little fence around it!
				num = 0;
				$SM.set('stores["'+k+'"]', 0);
			}
			
			
			// thieves?
			if(typeof $SM.get('game.thieves') == 'undefined' && num > 5000 && $SM.get('features.location.world')) {
				$SM.startThieves();
			}
			
			if(row.length === 0 && num > 0) {
				row = $('<div>').attr('id', id).addClass('storeRow');
				$('<div>').addClass('row_key').text(_(k)).appendTo(row);
				$('<div>').addClass('row_val').text(Math.floor(num)).appendTo(row);
				$('<div>').addClass('clear').appendTo(row);
				var curPrev = null;
				location.children().each(function(i) {
					var child = $(this);
					var cName = child.attr('id').substring(4).replace('-', ' ');
					if(cName < k && (curPrev == null || cName > curPrev)) {
						curPrev = cName;
					}
				});
				if(curPrev == null) {
					row.prependTo(location);
				} else {
					row.insertAfter(location.find('#row_' + curPrev.replace(' ', '-')));
				}
				newRow = true;
			} else if(num>= 0){
				$('div#' + row.attr('id') + ' > div.row_val', location).text(Math.floor(num));
			}
		}
		
		if(needsAppend && stores.children().length > 0) {
			stores.appendTo('div#storesContainer');
			stores.animate({opacity: 1}, 300, 'linear');
		}
		
		if(wNeedsAppend && weapons.children().length > 0) {
			weapons.appendTo('div#storesContainer');
			weapons.animate({opacity: 1}, 300, 'linear');
		}
		
		if(newRow) {
			Room.updateIncomeView();
		}

		if($("div#outsidePanel").length) {
			Outside.updateVillage();
		}
	},
	
	updateIncomeView: function() {
		var stores = $('div#stores');
		if(stores.length === 0 || typeof $SM.get('income') == 'undefined') return;
		$('div.storeRow', stores).each(function(index, el) {
			el = $(el);
			$('div.tooltip', el).remove();
			var tt = $('<div>').addClass('tooltip bottom right');
			var storeName = el.attr('id').substring(4).replace('-', ' ');
			for(var incomeSource in $SM.get('income')) {
				var income = $SM.get('income["'+incomeSource+'"]');
				for(var store in income.stores) {
					if(store == storeName && income.stores[store] !== 0) {
						$('<div>').addClass('row_key').text(_(incomeSource)).appendTo(tt);
						$('<div>')
							.addClass('row_val')
							.text(Engine.getIncomeMsg(income.stores[store], income.delay))
							.appendTo(tt);
					}
				}
			}
			if(tt.children().length > 0) {
				tt.appendTo(el);
			}
		});
	},
	
	buy: function(buyBtn) {
		var thing = $(buyBtn).attr('buildThing');
		var good = Room.TradeGoods[thing];
		var numThings = $SM.get('stores["'+thing+'"]', true);
		if(numThings < 0) numThings = 0;
		if(good.maximum <= numThings) {
			return;
		}
		
		var storeMod = {};
		var cost = good.cost();
		for(var k in cost) {
			var have = $SM.get('stores["'+k+'"]', true);
			if(have < cost[k]) {
				Notifications.notify(Room, _("not enough " + k));
				return false;
			} else {
				storeMod[k] = have - cost[k];
			}
		}
		$SM.setM('stores', storeMod);
		
		Notifications.notify(Room, good.buildMsg);
		
		$SM.add('stores["'+thing+'"]', 1);
		
		if(thing == 'compass') {
			Path.openPath();
		}
	},
	
	build: function(buildBtn) {
		var thing = $(buildBtn).attr('buildThing');
		if($SM.get('game.temperature.value') <= Room.TempEnum.Cold.value) {
			Notifications.notify(Room, _("builder just shivers"));
			return false;
		}
		var craftable = Room.Craftables[thing];
		
		var numThings = 0; 
		switch(craftable.type) {
		case 'good':
		case 'weapon':
		case 'tool':
		case 'upgrade':
			numThings = $SM.get('stores["'+thing+'"]', true);
			break;
		case 'building':
			numThings = $SM.get('game.buildings["'+thing+'"]', true);
			break;
		}
		
		if(numThings < 0) numThings = 0;
		if(craftable.maximum <= numThings) {
			return;
		}
		
		var storeMod = {};
		var cost = craftable.cost();
		for(var k in cost) {
			var have = $SM.get('stores["'+k+'"]', true);
			if(have < cost[k]) {
				Notifications.notify(Room, _("not enough "+k));
				return false;
			} else {
				storeMod[k] = have - cost[k];
			}
		}
		$SM.setM('stores', storeMod);
		
		Notifications.notify(Room, craftable.buildMsg);
		
		switch(craftable.type) {
		case 'good':
		case 'weapon':
		case 'upgrade':
		case 'tool':
			$SM.add('stores["'+thing+'"]', 1);
			break;
		case 'building':
			$SM.add('game.buildings["'+thing+'"]', 1);
			break;
		}		
	},
	
	needsWorkshop: function(type) {
		return type == 'weapon' || type == 'upgrade' || type =='tool';
	},
	
	craftUnlocked: function(thing) {
		if(Room.buttons[thing]) {
			return true;
		}
		if($SM.get('game.builder.level') < 4) return false;
		var craftable = Room.Craftables[thing];
		if(Room.needsWorkshop(craftable.type) && $SM.get('game.buildings["'+'workshop'+'"]', true) === 0) return false;
		var cost = craftable.cost();
		
		//show button if one has already been built
		if($SM.get('game.buildings["'+thing+'"]') > 0){
			Room.buttons[thing] = true;
			return true;
		}
		// Show buttons if we have at least 1/2 the wood, and all other components have been seen.
		if($SM.get('stores.wood', true) < cost['wood'] * 0.5) {
			return false;
		}
		for(var c in cost) {
			if(!$SM.get('stores["'+c+'"]')) {
				return false;
			}
		}
		
		Room.buttons[thing] = true;
		//don't notify if it has already been built before
		if(!$SM.get('game.buildings["'+thing+'"]')){
			Notifications.notify(Room, craftable.availableMsg);
		}
		return true;
	},
	
	buyUnlocked: function(thing) {
		if(Room.buttons[thing]) {
			return true;
		} else if($SM.get('game.buildings["trading post"]', true) > 0) {
			if(thing == 'compass' || typeof $SM.get('stores["'+thing+'"]') != 'undefined') {
				// Allow the purchase of stuff once you've seen it
				return true;
			}
		}
		return false;
	},
	
	updateBuildButtons: function() {
		var buildSection = $('#buildBtns');
		var needsAppend = false;
		if(buildSection.length === 0) {
			buildSection = $('<div>').attr('id', 'buildBtns').css('opacity', 0);
			needsAppend = true;
		}
		
		var craftSection = $('#craftBtns');
		var cNeedsAppend = false;
		if(craftSection.length === 0 && $SM.get('game.buildings["workshop"]', true) > 0) {
			craftSection = $('<div>').attr('id', 'craftBtns').css('opacity', 0);
			cNeedsAppend = true;
		}
		
		var buySection = $('#buyBtns');
		var bNeedsAppend = false;
		if(buySection.length === 0 && $SM.get('game.buildings["trading post"]', true) > 0) {
			buySection = $('<div>').attr('id', 'buyBtns').css('opacity', 0);
			bNeedsAppend = true;
		}
		
		for(var k in Room.Craftables) {
			craftable = Room.Craftables[k];
			var max = $SM.num(k, craftable) + 1 > craftable.maximum;
			if(craftable.button == null) {
				if(Room.craftUnlocked(k)) {
					var loc = Room.needsWorkshop(craftable.type) ? craftSection : buildSection;
					craftable.button = new Button.Button({
						id: 'build_' + k,
						cost: craftable.cost(),
						text: _(k),
						click: Room.build,
						width: '80px',
						ttPos: loc.children().length > 10 ? 'top right' : 'bottom right'
					}).css('opacity', 0).attr('buildThing', k).appendTo(loc).animate({opacity: 1}, 300, 'linear');
				}
			} else {
				// refresh the tooltip
				var costTooltip = $('.tooltip', craftable.button);
				costTooltip.empty();
				var cost = craftable.cost();
				for(var k in cost) {
					$("<div>").addClass('row_key').text(_(k)).appendTo(costTooltip);
					$("<div>").addClass('row_val').text(cost[k]).appendTo(costTooltip);
				}
				if(max && !craftable.button.hasClass('disabled')) {
					Notifications.notify(Room, craftable.maxMsg);
				}
			}
			if(max) {
				Button.setDisabled(craftable.button, true);
			} else {
				Button.setDisabled(craftable.button, false);
			}
		}
		
		for(var k in Room.TradeGoods) {
			good = Room.TradeGoods[k];
			var max = $SM.num(k, good) + 1 > good.maximum;
			if(good.button == null) {
				if(Room.buyUnlocked(k)) {
					good.button = new Button.Button({
						id: 'build_' + k,
						cost: good.cost(),
						text: _(k),
						click: Room.buy,
						width: '80px'
					}).css('opacity', 0).attr('buildThing', k).appendTo(buySection).animate({opacity:1}, 300, 'linear');
				}
			} else {
				// refresh the tooltip
				var costTooltip = $('.tooltip', good.button);
				costTooltip.empty();
				var cost = good.cost();
				for(var k in cost) {
					$("<div>").addClass('row_key').text(_(k)).appendTo(costTooltip);
					$("<div>").addClass('row_val').text(cost[k]).appendTo(costTooltip);
				}
				if(max && !good.button.hasClass('disabled')) {
					Notifications.notify(Room, good.maxMsg);
				}
			}
			if(max) {
				Button.setDisabled(good.button, true);
			} else {
				Button.setDisabled(good.button, false);
			}
		}
		
		if(needsAppend && buildSection.children().length > 0) {
			buildSection.appendTo('div#roomPanel').animate({opacity: 1}, 300, 'linear');
		}
		if(cNeedsAppend && craftSection.children().length > 0) {
			craftSection.appendTo('div#roomPanel').animate({opacity: 1}, 300, 'linear');
		}
		if(bNeedsAppend && buildSection.children().length > 0) {
			buySection.appendTo('div#roomPanel').animate({opacity: 1}, 300, 'linear');
		}
	},
	
	handleStateUpdates: function(e){
		if(e.category == 'stores'){
			Room.updateStoresView();
			Room.updateBuildButtons();
		} else if(e.category == 'income'){
			Room.updateStoresView();
			Room.updateIncomeView();
		} else if(e.stateName.indexOf('game.buildings') === 0){
			Room.updateBuildButtons();
		}
	}
};
