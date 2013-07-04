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
	
	Craftables: {
		'пастки': {
			button: null,
			maximum: 10,
			availableMsg: 'Будівельниця каже що вміє робити пастки для ловлі тварин які ще можуть жити тут',
			buildMsg: 'Більше пасток щоб добувати більше здобичі',
			maxMsg: "Більше пасток не допоможуть",
			type: 'building',
			cost: function() {
				var n = Outside.numBuilding('пастки');
				return {
					'дерево': 10 + (n*10)
				};
			}
		},
		'возик': {
			button: null,
			maximum: 1,
			availableMsg: 'Будівельниця каже що може зробити візок щоб возити дерево',
			buildMsg: 'Хлипкий возик возитиме дерево з лісу',
			type: 'building',
			cost: function() {
				return {
					'дерево': 30
				};
			}
		},
		'хатка': {
			button: null,
			maximum: 20,
			availableMsg: "Будівельниця каже що тут є ще блукачі. Каже вони теж працюватимуть",
			buildMsg: 'Будівельниця поставила хатку у лісі. Каже що люди оцінять її роботу',
			maxMsg: 'Немає місця для хат.',
			type: 'building',
			cost: function() {
				var n = Outside.numBuilding('хатка');
				return {
					'дерево': 100 + (n*50)
				};
			}
		},
		'сторожка': {
			button: null,
			maximum: 1,
			availableMsg: 'Селяни можуть допомогти полювати, якщо їм скажуть',
			buildMsg: 'Мисливська сторожка постала у лісі, подалі від осель',
			type: 'building',
			cost: function() {
				return {
					'дерево': 200,
					'шкури': 10,
					'м’ясо': 5
				}
			}
		},
		'базар': {
			button: null,
			maximum: 1,
			availableMsg: 'Базар стимулюватиме торгівлю',
			buildMsg: "Тепер продавці матимуть місце для торгівлі, вони можуть затриматися у нас",
			type: 'building',
			cost: function() {
				return {
					'дерево': 400,
					'шкури': 100
				};
			}
		},
		'дубильня': {
			button: null,
			maximum: 1,
			availableMsg: "Будівельниця каже що шкіра згодиться. Каже що селяни можуть її робити.",
			buildMsg: 'Дубильня збудована швидко на околиці села',
			type: 'building',
			cost: function() {
				return {
					'дерево': 500,
					'шкури': 50
				};
			}
		},
		'коптильня': {
			button: null,
			maximum: 1,
			availableMsg: "Ми повинні коптити м’ясо, інакше воно зіпсується. Будівельниця каже що щось придумає.",
			buildMsg: 'Будівельниця завершила коптильню. Вона дивиться голодним поглядом.',
			type: 'building',
			cost: function() {
				return {
					'дерево': 600,
					'м’ясо': 50
				};
			}
		},
		'майстерня': {
			button: null,
			maximum: 1,
			availableMsg: "Будівельниця каже що може робити кращі речі, якщо матиме інструмент.",
			buildMsg: "Майстерня нарешті готова, будівельниця радо зайшла до неї.",
			type: 'building',
			cost: function() {
				return {
					'дерево': 800,
					'шкіра': 100,
					'луска': 10
				};
			}
		},
		'кузня': {
			button: null,
			maximum: 1,
			availableMsg: "Будівельниця каже що селяни можуть кувати сталь, якщо їх навчити.",
			buildMsg: "Дим накрив село коли розвели вогонь у печі кузні.",
			type: 'building',
			cost: function() {
				return {
					'дерево': 1500,
					'залізо': 100,
					'вугілля': 100
				};
			}
		},
		'арсенал': {
			button: null,
			maximum: 1,
			availableMsg: "Будівельниця каже що було б добре мати постійне джерело набоїв.",
			buildMsg: "Арсенал готовий, зброя минулого вертається знову.",
			type: 'building',
			cost: function() {
				return {
					'дерево': 3000,
					'сталь': 100,
					'сірка': 50
				};
			}
		},
		'смолоскип': {
			button: null,
			type: 'tool',
			buildMsg: 'Смолоскип освітлюватиме дорогу.',
			cost: function() {
				return {
					'дерево': 1,
					'шмаття': 1
				};
			}
		},
		'міх': {
			button: null,
			type: 'upgrade',
			maximum: 1,
			buildMsg: 'Цей міх зберігає хоч трохи води.',
			cost: function() {
				return {
					'шкіра': 50
				};
			}
		},
		'бочка': {
			button: null,
			type: 'upgrade',
			maximum: 1,
			buildMsg: 'Бочка містить достатньо води для довших експедицій.',
			cost: function() {
				return {
					'шкіра': 100,
					'залізо': 20
				};
			}
		},
		'цистерна': {
			button: null,
			type: 'upgrade',
			maximum: 1,
			buildMsg: 'Спрага забута назавжди.',
			cost: function() {
				return {
					'залізо': 100,
					'сталь': 50
				};
			}
		},
		'спис': {
			button: null,
			type: 'weapon',
			buildMsg: 'Цей спис не є чарівним, але ним добре колоти.',
			cost: function() {
				return {
					'дерево': 100,
					'клики': 5
				};
			}
		},
		'рюкзак': {
			button: null,
			type: 'upgrade',
			maximum: 1,
			buildMsg: 'Більше несеш — довше подорожуєш.',
			cost: function() {
				return {
					'шкіра': 200
				};
			}
		},
		'підвода': {
			button: null,
			type: 'upgrade',
			maximum: 1,
			buildMsg: 'На підводі можна вести дуже багато речей.',
			cost: function() {
				return {
					'дерево': 500,
					'залізо': 100
				};
			}
		},
		'колона': {
			button: null,
			type: 'upgrade',
			maximum: 1,
			buildMsg: 'Колона може вивезти практично усе.',
			cost: function() {
				return {
					'дерево': 1000,
					'залізо': 200,
					'сталь': 100
				};
			}
		},
		'жупан': {
			type: 'upgrade',
			maximum: 1,
			buildMsg: 'Шкіра не міцна, але краща за лахміття.',
			cost: function() {
				return {
					'шкіра': 200,
					'луска': 20
				};
			}
		},
		'лати': {
			type: 'upgrade',
			maximum: 1,
			buildMsg: "Залізо міцніше за шкіру.",
			cost: function() {
				return {
					'шкіра': 200,
					'залізо': 100
				}
			}
		},
		'кольчуга': {
			type: 'upgrade',
			maximum: 1,
			buildMsg: "Сталь міцніша за шкіру.",
			cost: function() {
				return {
					'шкіра': 200,
					'сталь': 100
				}
			}
		},
		'меч': {
			button: null,
			type: 'weapon',
			buildMsg: "Загострений меч — найкращий супутник у дорозі.",
			cost: function() {
				return {
					'дерево': 200,
					'шкіра': 50,
					'залізо': 20
				};
			}
		},
		'шабля': {
			button: null,
			type: 'weapon',
			buildMsg: "Міцна сталь і вправна ковка.",
			cost: function() {
				return {
					'дерево': 500,
					'шкіра': 100,
					'сталь': 20
				};
			}
		},
		'рушниця': {
			type: 'weapon',
			buildMsg: "Чорний порох і набої, як у старі добрі часи.",
			cost: function() {
				return {
					'дерево': 200,
					'сталь': 50,
					'сірка': 50
				}
			}
		}
	},
	
	TradeGoods: {
		'луска': {
			type: 'good',
			cost: function() {
				return { 'шкури': 150 };
			}
		},
		'клики': {
			type: 'good',
			cost: function() {
				return { 'шкури': 300 };
			}
		},
		'залізо': {
			type: 'good',
			cost: function() {
				return {
					'шкури': 150,
					'луска': 50
				}
			}
		},
		'вугілля': {
			type: 'good',
			cost: function() {
				return {
					'шкури': 200,
					'клики': 50
				}
			}
		},
		'сталь': {
			type: 'good',
			cost: function() {
				return {
					'шкури': 300,
					'луска': 50,
					'клики': 50
				}
			}
		},
		'набої': {
			type: 'good',
			cost: function() {
				return {
					'луска': 10
				}
			}
		},
		'батарейки': {
			type: 'good',
			cost: function() {
				return {
					'луска': 10,
					'клики': 10
				}
			}
		},
		'болас': {
			type: 'weapon',
			cost: function() {
				return {
					'клики': 10
				}
			}
		},
		'гранати': {
			type: 'weapon',
			cost: function() {
				return {
					'луска': 100,
					'клики': 50
				}
			}
		},
		'штик': {
			type: 'weapon',
			cost: function() {
				return {
					'луска': 500,
					'клики': 250
				}
			}
		},
		'космічний сплав': {
			type: 'good',
			cost: function() {
				return {
					'шкури': 1500,
					'луска': 750,
					'клики': 300
				}
			}
		},
		'компас': {
			type: 'upgrade',
			maximum: 1,
			cost: function() {
				return { 
					'шкури': 400, 
					'луска': 20, 
					'клики': 10 
				};
			}
		}
	},
	
	name: "Room",
	init: function(options) {
		this.options = $.extend(
			this.options,
			options
		);
		
		if(Engine._debug) {
			this._ROOM_WARM_DELAY = 1;
			this._BUILDER_STATE_DELAY = 1;
			this._STOKE_COOLDOWN = 0;
			this._NEED_WOOD_DELAY = 1;
		}
		
		if(typeof State.room == 'undefined') {
			State.room = {
				temperature: this.TempEnum.Cold,
				fire: this.FireEnum.Dead,
				buttons: {},
				builder: -1
			};
		}
		
		// Create the room tab
		this.tab = Header.addLocation("Темна кімната", "room", Room);
		
		// Create the Room panel
		this.panel = $('<div>')
			.attr('id', "roomPanel")
			.addClass('location')
			.appendTo('div#locationSlider');
		
		Engine.updateSlider();
		
		// Create the light button
		var lbtn = new Button.Button({
			id: 'lightButton',
			text: 'розпалити',
			click: Room.lightFire,
			cooldown: Room._STOKE_COOLDOWN,
			width: '80px',
			cost: {'дерево': 5}
		}).appendTo('div#roomPanel');
		
		// Create the stoke button
		var btn = new Button.Button({
			id: 'stokeButton',
			text: "підкинути",
			click: Room.stokeFire,
			cooldown: Room._STOKE_COOLDOWN,
			width: '80px',
			cost: {'дерево': 1}
		}).appendTo('div#roomPanel');
		
		// Create the stores container
		$('<div>').attr('id', 'storesContainer').appendTo('div#roomPanel');
		
		Room.updateButton();
		Room.updateStoresView();
		Room.updateIncomeView();
		Room.updateBuildButtons();
		
		Room._fireTimer = setTimeout(Room.coolFire, Room._FIRE_COOL_DELAY);
		Room._tempTimer = setTimeout(Room.adjustTemp, Room._ROOM_WARM_DELAY);
		
		/*
		 * Builder states:
		 * 0 - Approaching
		 * 1 - Collapsed
		 * 2 - Shivering
		 * 3 - Sleeping
		 * 4 - Helping
		 */
		if(State.room.builder >= 0 && State.room.builder < 3) {
			Room._builderTimer = setTimeout(Room.updateBuilderState, Room._BUILDER_STATE_DELAY);
		}
		if(State.room.builder == 1 && Engine.getStore('дерево') < 0) {
			setTimeout(Room.unlockForest, Room._NEED_WOOD_DELAY);
		}
		setTimeout(Engine.collectIncome, 1000);
		
		Notifications.notify(Room, "У кімнаті " + State.room.temperature.text);
		Notifications.notify(Room, "Вогонь " + State.room.fire.text);
	},
	
	options: {}, // Nothing for now
	
	onArrival: function() {
		Room.setTitle();
		if(Room.changed) {
			Notifications.notify(Room, "Вогонь " + State.room.fire.text);
			Notifications.notify(Room, "У кімнаті " + State.room.temperature.text);
			Room.changed = false;
		}
		if(State.room.builder == 3) {
			State.room.builder++;
			Engine.setIncome('builder', {
				delay: 10,
				stores: {'дерево' : 2 }
			});
			Room.updateIncomeView();
			Notifications.notify(Room, "Незнайомка підійшла до вогню. Каже що може допомогти. Каже вона вміє будувати.")
		}
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
		Freezing: { value: 0, text: 'морозно' },
		Cold: { value: 1, text: 'холодно' },
		Mild: { value: 2, text: 'прохолодно' },
		Warm: { value: 3, text: 'тепло' },
		Hot: { value: 4, text: 'гаряче' }
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
		Dead: { value: 0, text: 'згас' },
		Smoldering: { value: 1, text: 'димить' },
		Flickering: { value: 2, text: 'поблискує' },
		Burning: { value: 3, text: 'палає' },
		Roaring: { value: 4, text: 'гуде' }
	},
	
	setTitle: function() {
		var title = State.room.fire.value < 2 ? "Темна кімната" : "Освітлена кімната";
		if(Engine.activeModule == this) {
			document.title = title;
		}
		$('div#location_room').text(title);
	},
	
	updateButton: function() {
		var light = $('#lightButton.button');
		var stoke = $('#stokeButton.button');
		if(State.room.fire.value == Room.FireEnum.Dead.value && stoke.css('display') != 'none') {
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
		
		if(!Engine.storeAvailable('дерево')) {
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
		var wood = Engine.getStore('дерево');
		if(Engine.storeAvailable('дерево') && wood < 5) {
			Notifications.notify(Room, "Не вистачає дерева для підтримки вогню.");
			Button.clearCooldown($('#lightButton.button'));
			return;
		} else if(wood > 4) {
			Engine.setStore('дерево', wood - 5);
		}
		State.room.fire = Room.FireEnum.Burning;
		Room.onFireChange();
	},
	
	stokeFire: function() {
		var wood = Engine.getStore('дерево');
		if(Engine.storeAvailable('дерево') && wood == 0) {
			Notifications.notify(Room, "Дерево скінчилося.");
			Button.clearCooldown($('#stokeButton.button'));
			return;
		}
		if(wood > 0) {
			Engine.setStore('дерево', wood - 1);
		}
		if(State.room.fire.value < 4) {
			State.room.fire = Room.FireEnum.fromInt(State.room.fire.value + 1);
		}
		Room.onFireChange();
	},
	
	onFireChange: function() {
		if(Engine.activeModule != Room) {
			Room.changed = true;
		}
		Notifications.notify(Room, "Вогонь " + State.room.fire.text, true);
		if(State.room.fire.value > 1 && State.room.builder < 0) {
			State.room.builder = 0;
			Notifications.notify(Room, "Світло від вогню пробивається крізь вікна, освітлюючи темряву навколо.");
			setTimeout(Room.updateBuilderState, Room._BUILDER_STATE_DELAY);
		}	
		window.clearTimeout(Room._fireTimer);
		Room._fireTimer = setTimeout(Room.coolFire, Room._FIRE_COOL_DELAY);
		Room.updateButton();
		Room.setTitle();
	},
	
	coolFire: function() {
		if(State.room.fire.value <= Room.FireEnum.Flickering.value &&
		   State.room.builder > 3 && Engine.getStore('дерево') > 0) {
			Notifications.notify(Room, "Будівельниця підкинула у вогонь.", true);
			Engine.setStore('дерево', Engine.getStore('дерево') - 1);
			State.room.fire = Room.FireEnum.fromInt(State.room.fire.value + 1);
		}
		if(State.room.fire.value > 0) {
			State.room.fire = Room.FireEnum.fromInt(State.room.fire.value - 1);
			Room._fireTimer = setTimeout(Room.coolFire, Room._FIRE_COOL_DELAY);
			Room.onFireChange();
		}
	},
	
	adjustTemp: function() {
		var old = State.room.temperature.value;
		if(State.room.temperature.value > 0 && State.room.temperature.value > State.room.fire.value) {
			State.room.temperature = Room.TempEnum.fromInt(State.room.temperature.value - 1);
			Notifications.notify(Room, "У кімнаті " + State.room.temperature.text, true);
		}
		if(State.room.temperature.value < 4 && State.room.temperature.value < State.room.fire.value) {
			State.room.temperature = Room.TempEnum.fromInt(State.room.temperature.value + 1);
			Notifications.notify(Room, "У кімнаті " + State.room.temperature.text, true);
		}
		if(State.room.temperature.value != old) {
			Room.changed = true;
		}
		Room._tempTimer = setTimeout(Room.adjustTemp, Room._ROOM_WARM_DELAY);
	},
	
	unlockForest: function() {
		Engine.setStore('дерево', 4);
		Room.updateButton();
		Outside.init();
		Room.updateStoresView();
		Notifications.notify(Room, "Вітер свище за стінами");
		Notifications.notify(Room, "Деревина закінчується");
		Engine.event('progress', 'outside');
	},
	
	updateBuilderState: function() {
		if(State.room.builder == 0) {
			Notifications.notify(Room, "Незнайомка у лахмітті перепнулася через поріг і завалилася у кутку.");
			State.room.builder = 1;
			setTimeout(Room.unlockForest, Room._NEED_WOOD_DELAY);
		} 
		else if(State.room.builder < 3 && State.room.temperature.value >= Room.TempEnum.Warm.value) {
			var msg;
			switch(State.room.builder) {
			case 1:
				msg = "Незнайомка щось збуджено бурмоче. Слова нерозбірливі.";
				break;
			case 2:
				msg = "Незнайомка припинила бурмотати. Її дихання заспокоїлося.";
				break;
			}
			Notifications.notify(Room, msg);
			if(State.room.builder < 3) {
				State.room.builder++;
			}
		}
		if(State.room.builder < 3) {
			setTimeout(Room.updateBuilderState, Room._BUILDER_STATE_DELAY);
		}
		Engine.saveGame();
	},
	
	updateStoresView: function() {
		var stores = $('div#stores');
		var weapons = $('div#weapons');
		var needsAppend = false, wNeedsAppend = false, newRow = false;
		if(stores.length == 0) {
			stores = $('<div>').attr({
				id: 'stores'
			}).css('opacity', 0);
			needsAppend = true;
		}
		if(weapons.length == 0) {
			weapons = $('<div>').attr({
				id: 'weapons'
			}).css('opacity', 0);
			wNeedsAppend = true;
		}
		for(var k in State.stores) {
			
			var type = null;
			if(Room.Craftables[k]) {
				type = Room.Craftables[k].type;
			} else if(Room.TradeGoods[k]) {
				type = Room.TradeGoods[k].type;
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
			
			var id = "row_" + k.replace(/ /g, '-');
			var row = $('div#' + id, location);
			var num = State.stores[k];
			
			if(typeof num != 'number' || isNaN(num)) {
				// No idea how counts get corrupted, but I have reason to believe that they occassionally do.
				// Build a little fence around it!
				num = State.stores[k] = 0;
			}
			
			
			// thieves?
			if(typeof State.thieves == 'undefined' && num > 5000 && State.world) {
				Engine.startThieves();
			}
			
			if(row.length == 0 && num > 0) {
				var row = $('<div>').attr('id', id).addClass('storeRow');
				$('<div>').addClass('row_key').text(k).appendTo(row);
				$('<div>').addClass('row_val').text(Math.floor(num)).appendTo(row);
				$('<div>').addClass('clear').appendTo(row);
				var curPrev = null;
				location.children().each(function(i) {
					var child = $(this);
					var cName = child.attr('id').substring(4).replace(/-/g, ' ');
					if(cName < k && (curPrev == null || cName > curPrev)) {
						curPrev = cName;
					}
				});
				if(curPrev == null) {
					row.prependTo(location);
				} else {
					row.insertAfter(location.find('#row_' + curPrev.replace(/ /g, '-')));
				}
				newRow = true;
			} else if(num> 0){
				$('div#' + row.attr('id') + ' > div.row_val', location).text(Math.floor(num));
			} else if(num == 0) {
				row.remove();
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
	},
	
	updateIncomeView: function() {
		var stores = $('div#stores');
		if(stores.length == 0 || typeof State.income == 'undefined') return;
		$('div.storeRow', stores).each(function(index, el) {
			el = $(el);
			$('div.tooltip', el).remove();
			var tt = $('<div>').addClass('tooltip bottom right');
			var storeName = el.attr('id').substring(4).replace(/-/g, ' ');
			for(var incomeSource in State.income) {
				var income = State.income[incomeSource];
				for(var store in income.stores) {
					if(store == storeName && income.stores[store] != 0) {
						$('<div>').addClass('row_key').text(incomeSource).appendTo(tt);
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
		var numThings = Engine.getStore(thing);
		if(numThings < 0) numThings = 0;
		if(good.maximum <= numThings) {
			return;
		}
		
		var storeMod = {};
		var cost = good.cost();
		for(var k in cost) {
			var have = Engine.getStore(k)
			if(have < cost[k]) {
				Notifications.notify(Room, "Не достатньо " + k);
				return false;
			} else {
				storeMod[k] = have - cost[k];
			}
		}
		Engine.setStores(storeMod);
		
		Notifications.notify(Room, good.buildMsg);
		
		Engine.addStore(thing, 1);
		
		Room.updateBuildButtons();
		
		if(thing == 'компас') {
			Engine.openPath();
		}
	},
	
	build: function(buildBtn) {
		var thing = $(buildBtn).attr('buildThing');
		if(State.room.temperature.value <= Room.TempEnum.Cold.value) {
			Notifications.notify(Room, "Будівельниця лише затремтіла");
			return false;
		}
		var craftable = Room.Craftables[thing];
		
		var numThings = 0; 
		switch(craftable.type) {
		case 'good':
		case 'weapon':
		case 'tool':
		case 'upgrade':
			numThings = Engine.getStore(thing);
			break;
		case 'building':
			numThings = Outside.numBuilding(thing);
			break;
		}
		
		if(numThings < 0) numThings = 0;
		if(craftable.maximum <= numThings) {
			return;
		}
		
		var storeMod = {};
		var cost = craftable.cost();
		for(var k in cost) {
			var have = Engine.getStore(k)
			if(have < cost[k]) {
				Notifications.notify(Room, "Закінчилося " + k);
				return false;
			} else {
				storeMod[k] = have - cost[k];
			}
		}
		Engine.setStores(storeMod);
		
		Notifications.notify(Room, craftable.buildMsg);
		
		switch(craftable.type) {
		case 'good':
		case 'weapon':
		case 'upgrade':
		case 'tool':
			Engine.addStore(thing, 1);
			break;
		case 'building':
			Outside.addBuilding(thing, 1);
			break;
		}
		
		Room.updateBuildButtons();
		
	},
	
	needsWorkshop: function(type) {
		return type == 'weapon' || type == 'upgrade' || type =='tool';
	},
	
	craftUnlocked: function(thing) {
		if(typeof State.room != 'undefined' && 
				typeof State.room.buttons != 'undefined' && 
				State.room.buttons[thing]) {
			return true;
		}
		if(State.room.builder < 4) return false;
		var craftable = Room.Craftables[thing];
		if(Room.needsWorkshop(craftable.type) && Outside.numBuilding('майстерня') == 0) return false;
		var cost = craftable.cost();
		
		// Show buttons if we have at least 1/2 the wood, and all other components have been seen.
		if(Engine.getStore('дерево') < cost['дерево'] * 0.5) {
			return false;
		}
		for(var c in cost) {
			if(!Engine.storeAvailable(c)) {
				return false;
			}
		}
		
		State.room.buttons[thing] = true;
		Notifications.notify(Room, craftable.availableMsg);
		return true;
	},
	
	buyUnlocked: function(thing) {
		if(typeof State.room != 'undefined' && 
				typeof State.room.buttons != 'undefined' && 
				State.room.buttons[thing]) {
			return true;
		} else if(Outside.numBuilding('базар') > 0) {
			if(thing == 'компас' || Engine.storeAvailable(thing)) {
				// Allow the purchase of stuff once you've seen it
				return true;
			}
		}
		return false;
	},
	
	updateBuildButtons: function() {
		var buildSection = $('#buildBtns');
		var needsAppend = false;
		if(buildSection.length == 0) {
			buildSection = $('<div>').attr('id', 'buildBtns').css('opacity', 0);
			needsAppend = true;
		}
		
		var craftSection = $('#craftBtns');
		var cNeedsAppend = false;
		if(craftSection.length == 0 && Outside.numBuilding('майстерня') > 0) {
			craftSection = $('<div>').attr('id', 'craftBtns').css('opacity', 0);
			cNeedsAppend = true;
		}
		
		var buySection = $('#buyBtns');
		var bNeedsAppend = false;
		if(buySection.length == 0 && Outside.numBuilding('базар') > 0) {
			buySection = $('<div>').attr('id', 'buyBtns').css('opacity', 0);
			bNeedsAppend = true;
		}
		
		for(var k in Room.Craftables) {
			craftable = Room.Craftables[k];
			var max = Engine.num(k, craftable) + 1 > craftable.maximum;
			if(craftable.button == null) {
				if(Room.craftUnlocked(k)) {
					var loc = Room.needsWorkshop(craftable.type) ? craftSection : buildSection;
					craftable.button = new Button.Button({
						id: 'build_' + k,
						cost: craftable.cost(),
						text: k,
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
					$("<div>").addClass('row_key').text(k).appendTo(costTooltip);
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
			var max = Engine.num(k, good) + 1 > good.maximum;
			if(good.button == null) {
				if(Room.buyUnlocked(k)) {
					good.button = new Button.Button({
						id: 'build_' + k,
						cost: good.cost(),
						text: k,
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
					$("<div>").addClass('row_key').text(k).appendTo(costTooltip);
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
	}
};