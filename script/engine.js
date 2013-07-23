var Engine = {
		
	/* TODO *** MICHAEL IS A LAZY BASTARD AND DOES NOT WANT TO REFACTOR ***
	 * Here is what he should be doing:
	 * 	- All updating values (store numbers, incomes, etc...) should be objects that can register listeners to
	 * 	  value-change events. These events should be fired whenever a value (or group of values, I suppose) is updated.
	 * 	  That would be so elegant and awesome.
	 */
	SITE_URL: encodeURIComponent("http://adarkroom.doublespeakgames.com"),
	MAX_STORE: 99999999999999,
	SAVE_DISPLAY: 30 * 1000,
		
	Perks: {
		'boxer': {
			desc: 'punches do more damage',
			notify: 'learned to throw punches with purpose'
		},
		'martial artist': {
			desc: 'punches do even more damage.',
			notify: 'learned to fight quite effectively without weapons'
		},
		'unarmed master': {
			desc: 'punch twice as fast, and with even more force',
			notify: 'learned to strike faster without weapons'
		},
		'barbarian': {
			desc: 'melee weapons deal more damage',
			notify: 'learned to swing weapons with force'
		},
		'slow metabolism': {
			desc: 'go twice as far without eating',
			notify: 'learned how to ignore the hunger'
		},
		'desert rat': {
			desc: 'go twice as far without drinking',
			notify: 'learned to love the dry air'
		},
		'evasive': {
			desc: 'dodge attacks more effectively',
			notify: "learned to be where they're not"
		},
		'precise': {
			desc: 'land blows more often',
			notify: 'learned to predict their movement'
		},
		'scout': {
			desc: 'see farther',
			notify: 'learned to look ahead'
		},
		'stealthy': {
			desc: 'better avoid conflict in the wild',
			notify: 'learned how not to be seen'
		},
		'gastronome': {
			desc: 'restore more health when eating',
			notify: 'learned to make the most of food'
		}
	},
	
	options: {
		state: null,
		debug: true,
		log: true
	},
		
	init: function(options) {
		this.options = $.extend(
			this.options,
			options
		);
		this._debug = this.options.debug;
		this._log = this.options.log;
		
		// Check for HTML5 support
		if(!Engine.browserValid()) {
			window.location = 'browserWarning.html';
		}
		
		// Check for mobile
		if(Engine.isMobile()) {
			window.location = 'mobileWarning.html';
		}
		
		if(this.options.state != null) {
			window.State = this.options.state;
		} else {
			Engine.loadGame();
		}
		
		$('<div>').attr('id', 'locationSlider').appendTo('#main');
		
		$('<span>')
			.addClass('deleteSave')
			.text('restart.')
			.click(Engine.confirmDelete)
			.appendTo('body');
		
		$('<div>')
			.addClass('share')
			.text('share.')
			.click(Engine.share)
			.appendTo('body');
		
		// Register keypress handlers
		$('body').off('keydown').keydown(Engine.keyDown);
		$('body').off('keyup').keyup(Engine.keyUp);

		// Register swipe handlers
		swipeElement = $('#outerSlider');
		swipeElement.on('swipeleft', Engine.swipeLeft);
		swipeElement.on('swiperight', Engine.swipeRight);
		swipeElement.on('swipeup', Engine.swipeUp);
		swipeElement.on('swipedown', Engine.swipeDown);

		$SM.init();
		Notifications.init();
		Events.init();
		Room.init();
		
		if(Engine.storeAvailable('wood')) {
			Outside.init();
		}
		if(Engine.getStore('compass') > 0) {
			Path.init();
		}
		if($SM.get('features.location.spaceShip')) {
			Ship.init();
		}
		
		Engine.travelTo(Room);

	},
	
	browserValid: function() {
		return location.search.indexOf('ignorebrowser=true') >= 0 || (
				typeof Storage != 'undefined' &&
				!oldIE);
	},
	
	isMobile: function() {
		return location.search.indexOf('ignorebrowser=true') < 0 &&
			/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
	},
	
	saveGame: function() {
		if(typeof Storage != 'undefined' && localStorage) {
			if(Engine._saveTimer != null) {
				clearTimeout(Engine._saveTimer);
			}
			if(typeof Engine._lastNotify == 'undefined' || Date.now() - Engine._lastNotify > Engine.SAVE_DISPLAY){
				$('#saveNotify').css('opacity', 1).animate({opacity: 0}, 1000, 'linear');
				Engine._lastNotify = Date.now();
			}
			localStorage.gameState = JSON.stringify(State);
		}
	},
	
	loadGame: function() {
		try {
			var savedState = JSON.parse(localStorage.gameState);
			if(savedState) {
				State = savedState;
				Engine.upgradeState();
				Engine.log("loaded save!");
			}
		} catch(e) {
			State = {
				version: 1.2,
			};
			Engine.event('progress', 'new game');
		}
	},
	
	upgradeState: function() {
		/* Use this function to make old 
		 * save games compatible with newer versions */ 
		if(typeof State.version != 'number') {
			Engine.log('upgraded save to v1.0');
			State.version = 1.0;
		}
		if(State.version == 1.0) {
			// v1.1 introduced the Lodge, so get rid of lodgeless hunters
			delete State.outside.workers.hunter;
			delete State.income.hunter;
			Engine.log('upgraded save to v1.1');
			State.version = 1.1;
		}
		if(State.version == 1.1) {
			//v1.2 added the Swamp to the map, so add it to already generated maps
			if(State.world) {
				World.placeLandmark(15, World.RADIUS * 1.5, World.TILE.SWAMP, State.world.map);
			}
			Engine.log('upgraded save to v1.2');
			State.version = 1.2;
		}
	},
	
	event: function(cat, act) {
		if(typeof ga === 'function') {
			ga('send', 'event', cat, act);
		}
	},
	
	confirmDelete: function() {
		Events.startEvent({
			title: 'Restart?',
			scenes: {
				start: {
					text: ['restart the game?'],
					buttons: {
						'yes': {
							text: 'yes',
							nextScene: 'end',
							onChoose: Engine.deleteSave
						},
						'no': {
							text: 'no',
							nextScene: 'end'
						}
					}
				}
			}
		});
	},
	
	deleteSave: function() {
		if(typeof Storage != 'undefined' && localStorage) {
			localStorage.clear();
		}
		location.reload();
	},
	
	share: function() {
		Events.startEvent({
			title: 'Share',
			scenes: {
				start: {
					text: ['bring your friends.'],
					buttons: {
						'facebook': {
							text: 'facebook',
							nextScene: 'end',
							onChoose: function() {
								window.open('https://www.facebook.com/sharer/sharer.php?u=' + Engine.SITE_URL, 'sharer', 'width=626,height=436,location=no,menubar=no,resizable=no,scrollbars=no,status=no,toolbar=no');
							}
						},
						'google': {
							text:'google+',
							nextScene: 'end',
							onChoose: function() {
								window.open('https://plus.google.com/share?url=' + Engine.SITE_URL, 'sharer', 'width=480,height=436,location=no,menubar=no,resizable=no,scrollbars=no,status=no,toolbar=no');
							}
						},
						'twitter': {
							text: 'twitter',
							onChoose: function() {
								window.open('https://twitter.com/intent/tweet?text=A%20Dark%20Room&url=' + Engine.SITE_URL, 'sharer', 'width=660,height=260,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');
							},
							nextScene: 'end'
						},
						'reddit': {
							text: 'reddit',
							onChoose: function() {
								window.open('http://www.reddit.com/submit?url=' + Engine.SITE_URL, 'sharer', 'width=960,height=700,location=no,menubar=no,resizable=no,scrollbars=yes,status=no,toolbar=no');
							},
							nextScene: 'end'
						},
						'close': {
							text: 'close',
							nextScene: 'end'
						}
					}
				}
			}
		}, {width: '400px'});
	},
	
	// Gets a guid
	getGuid: function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		    return v.toString(16);
		});
	},
	
	activeModule: null,
	
	travelTo: function(module) {
		if(Engine.activeModule != module) {
			var currentIndex = Engine.activeModule ? $('.location').index(Engine.activeModule.panel) : 1;
			$('div.headerButton').removeClass('selected');
			module.tab.addClass('selected');

			var slider = $('#locationSlider');
			var stores = $('#storesContainer');
			var panelIndex = $('.location').index(module.panel);
			var diff = Math.abs(panelIndex - currentIndex);
			slider.animate({left: -(panelIndex * 700) + 'px'}, 300 * diff);

			if(Engine.storeAvailable('wood')) {
			// FIXME Why does this work if there's an animation queue...?
				stores.animate({right: -(panelIndex * 700) + 'px'}, 300 * diff);
			}

			module.onArrival(diff);

			if(Engine.activeModule == Room || Engine.activeModule == Path) {
				// Don't fade out the weapons if we're switching to a module
				// where we're going to keep showing them anyway.
				if (module != Room && module != Path) {
					$('div#weapons').animate({opacity: 0}, 300);
				}
			}

			if(module == Room || module == Path) {
				$('div#weapons').animate({opacity: 1}, 300);
			}

			Engine.activeModule = module;
			
			Notifications.printQueue(module);
		}
	},
	
	addPerk: function(name) {
		if(!$SM.get('character.perks')) {
			$SM.set('character.perks', {});
		}
		$SM.set('character.perks[\''+name+'\']', true);
		Notifications.notify(null, Engine.Perks[name].notify);
		if(Engine.activeModule == Path) {
			Path.updatePerks();
		}
	},
	
	hasPerk: function(name) {
		return typeof $SM.get('character.perks') == 'object' && $SM.get('character.perks[\''+name+'\']') == true;
	},
	
	setStore: function(name, number) {
		$SM.set('stores[\''+name+'\']', number);
		Room.updateStoresView();
		Room.updateBuildButtons();
		if($SM.get('features.location.outside')) {
			Outside.updateVillage();
		}
		Engine.saveGame();
	},
	
	setStores: function(list) {
		for(k in list) {
			$SM.set('stores[\''+k+'\']', list[k]);
		}
		Room.updateStoresView();
		Room.updateBuildButtons();
		if($SM.get('features.location.outside')) {
			Outside.updateVillage();
		}
		Engine.saveGame();
	},
	
	addStore: function(name, number) {
		var num = $SM.get('stores[\''+name+'\']');
		if(typeof num != 'number' || isNaN(num) || num < 0) num = 0;
		num += number;
		if(num > Engine.MAX_STORE) num = Engine.MAX_STORE;
		$SM.set('stores[\''+name+'\']', num);
		Room.updateStoresView();
		Room.updateBuildButtons();
		Outside.updateVillage();
		if(Engine.activeModule == Path) {
			Path.updateOutfitting();
		}
		Engine.saveGame();
	},
	
	addStores: function(list, ignoreCosts) {
		// Make sure any income costs can be paid
		if(!ignoreCosts) {
			for(k in list) {
				var num = $SM.get('stores[\''+k+'\']');
				if(typeof num != 'number' || isNaN(num) || num < 0) num = 0;
				if(num + list[k] < 0) {
					return false;
				}
			}
		}
		
		// Actually do the update
		for(k in list) {
			var num = $SM.get('stores[\''+k+'\']');
			if(typeof num != 'number') num = 0;
			num += list[k];
			num = num < 0 ? 0 : num;
			num = num > Engine.MAX_STORE ? Engine.MAX_STORE : num;
			$SM.set('stores[\''+k+'\']', num);
		}
		Room.updateStoresView();
		Room.updateBuildButtons();
		Outside.updateVillage();
		if(Engine.activeModule == Path) {
			Path.updateOutfitting();
		}
		Engine.saveGame();
		return true;
	},
	
	storeAvailable: function(name) {
		return typeof $SM.get('stores[\''+name+'\']') == 'number';
	},
	
	getStore: function(name) {
		if(typeof $SM.get('stores[\''+name+'\']') == 'undefined') {
			return 0;
		}
		return $SM.get('stores[\''+name+'\']');
	},
	
	setIncome: function(source, options) {
		var existing = $SM.get('income[\''+source+'\']');
		if(typeof existing != 'undefined') {
			options.timeLeft = existing.timeLeft;
		}
		$SM.set('income[\''+source+'\']', options);
	},
	
	getIncome: function(source) {
		var existing = $SM.get('income[\''+source+'\']');
		if(typeof existing != 'undefined') {
			return existing;
		}
		return {};
	},
	
	removeIncome: function(source) {
		$SM.remove('income[\''+source+'\']');
		Room.updateIncomeView();
	},
	
	collectIncome: function() {
		if(typeof $SM.get('income') != 'undefined' && Engine.activeModule != Space) {
			var changed = false;
			for(var source in $SM.get('income')) {
				var income = $SM.get('income[\''+source+'\']');
				if(typeof income.timeLeft != 'number')
				{
					income.timeLeft = 0;
				}
				income.timeLeft--;
				
				if(income.timeLeft <= 0) {
					Engine.log('collection income from ' + source);
					if(source == 'thieves') {
						Engine.addStolen(income.stores);
					}
					changed = Engine.addStores(income.stores) || changed;
					if(typeof income.delay == 'number') {
						income.timeLeft = income.delay;
					}
				}
			}
			if(changed) {
				Room.updateStoresView();
				Room.updateBuildButtons();
				Engine.saveGame();
				if(Events.activeEvent() != null) {
					Events.updateButtons();
				}
			}
		}
		Engine._incomeTimeout = setTimeout(Engine.collectIncome, 1000);
	},
	
	openPath: function() {
		Path.init();
		Engine.event('progress', 'path');
		Notifications.notify(Room, 'the compass points ' + World.dir);
	},
	
	addStolen: function(stores) {
		if(!$SM.get('game.stolen')) $SM.set('game.stolen', {});
		for(var k in stores) {
			if(!$SM.get('game.stolen[\''+k+'\']')) $SM.set('game.stolen[\''+k+'\']', 0);
			$SM.add('game.stolen[\''+k+'\']', stores[k] * -1);
		}
	},
	
	startThieves: function() {
		$SM.set('game.thieves', 1);
		Engine.setIncome('thieves', {
			delay: 10,
			stores: {
				'wood': -10,
				'fur': -5,
				'meat': -5
			}
		});
		Room.updateIncomeView();
	},

	// Move the stores panel beneath top_container (or to top: 0px if top_container
	// either hasn't been filled in or is null) using transition_diff to sync with
	// the animation in Engine.travelTo().
	moveStoresView: function(top_container, transition_diff) {
		var stores = $('#storesContainer');

		// If we don't have a storesContainer yet, leave.
		if(typeof(stores) === 'undefined') return;

		if(typeof(transition_diff) === 'undefined') transition_diff = 1;

		if(top_container === null) {
			stores.animate({top: '0px'}, {queue: false, duration: 300 * transition_diff});
		}
		else if(!top_container.length) {
			stores.animate({top: '0px'}, {queue: false, duration: 300 * transition_diff});
		}
		else {
			stores.animate({top: top_container.height() + 26 + 'px'},
						   {queue: false, duration: 300 * transition_diff});
		}
	},
	
	num: function(name, craftable) {
		switch(craftable.type) {
		case 'good':
		case 'tool':
		case 'weapon':
		case 'upgrade':
			return Engine.getStore(name);
		case 'building':
			return Outside.numBuilding(name);
		}
	},
	
	log: function(msg) {
		if(this._log) {
			console.log(msg);
		}
	},
	
	updateSlider: function() {
		var slider = $('#locationSlider');
		slider.width((slider.children().length * 700) + 'px');
	},
	
	updateOuterSlider: function() {
		var slider = $('#outerSlider');
		slider.width((slider.children().length * 700) + 'px');
	},
	
	getIncomeMsg: function(num, delay) {
		return (num > 0 ? "+" : "") + num + " per " + delay + "s";
	},
	
	keyDown: function(e) {
		if(!Engine.keyPressed && !Engine.keyLock) {
			Engine.pressed = true;
			if(Engine.activeModule.keyDown) {
				Engine.activeModule.keyDown(e);
			}
		}
		return false;
	},
	
	keyUp: function(e) {
		Engine.pressed = false;
		if(Engine.activeModule.keyUp) {
			Engine.activeModule.keyUp(e);
		}
		return false;
	},

	swipeLeft: function(e) {
		if(Engine.activeModule.swipeLeft) {
			Engine.activeModule.swipeLeft(e);
		}
	},

	swipeRight: function(e) {
		if(Engine.activeModule.swipeRight) {
			Engine.activeModule.swipeRight(e);
		}
	},

	swipeUp: function(e) {
		if(Engine.activeModule.swipeUp) {
			Engine.activeModule.swipeUp(e);
		}
	},

	swipeDown: function(e) {
		if(Engine.activeModule.swipeDown) {
			Engine.activeModule.swipeDown(e);
		}
	}
};

$(function() {
	Engine.init();
});