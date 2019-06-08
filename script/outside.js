/**
 * Module that registers the outdoors functionality
 */
var Outside = {
	name: _("Outside"),

	_STORES_OFFSET: OutsideSettings._STORES_OFFSET,
	_GATHER_DELAY:  OutsideSettings._GATHER_DELAY,
	_TRAPS_DELAY:  OutsideSettings._TRAPS_DELAY,
	_POP_DELAY: OutsideSettings._POP_DELAY,
	_HUT_ROOM:  OutsideSettings._HUT_ROOM,

	_INCOME: OutsideSettings._INCOME,

	TrapDrops: OutsideSettings.TrapDrops,

	init: function(options) {
		this.options = $.extend(
			this.options,
			options
		);

		if(Engine._debug) {
			this._GATHER_DELAY = 0;
			this._TRAPS_DELAY = 0;
		}

		// Create the outside tab
		this.tab = Header.addLocation(_("A Silent Forest"), "outside", Outside);

		// Create the Outside panel
		this.panel = $('<div>').attr('id', "outsidePanel")
			.addClass('location')
			.appendTo('div#locationSlider');

		//subscribe to stateUpdates
		$.Dispatch('stateUpdate').subscribe(Outside.handleStateUpdates);

		if(typeof $SM.get('features.location.outside') == 'undefined') {
			$SM.set('features.location.outside', true);
			if(!$SM.get('game.buildings')) $SM.set('game.buildings', {});
			if(!$SM.get('game.population')) $SM.set('game.population', 0);
			if(!$SM.get('game.workers')) $SM.set('game.workers', {});
		}

		this.updateVillage();
		Outside.updateWorkersView();
		Outside.updateVillageIncome();

		Engine.updateSlider();

		// Create the gather button
		new Button.Button({
			id: 'gatherButton',
			text: _("gather wood"),
			click: Outside.gatherWood,
			cooldown: OutsideSettings._GATHER_DELAY,
			width: '80px'
		}).appendTo('div#outsidePanel');

		Outside.updateTrapButton();
	},

	getMaxPopulation: function() {
		return $SM.get('game.buildings["hut"]', true) * OutsideSettings._HUT_ROOM;
	},

	getSpace: function(){
	return	Outside.getMaxPopulation() - $SM.get('game.population');

	},

	increasePopulation: function() {
		var space = Outside.getSpace();
		if(space > 0) {
			var num = Math.floor(Math.random()*(space/2) + space/2);
			if(num === 0) num = 1;
			if(num == 1) {
				Notifications.notify(null, _(OutsideSettings.IncreasePopMessages[0]));
			} else if(num < 5) {
				Notifications.notify(null, _(OutsideSettings.IncreasePopMessages[1]));
			} else if(num < 10) {
				Notifications.notify(null, _(OutsideSettings.IncreasePopMessages[2]));
			} else if(num < 30) {
				Notifications.notify(null, _(OutsideSettings.IncreasePopMessages[3]));
			} else {
				Notifications.notify(null, _(OutsideSettings.IncreasePopMessages[4]));
			}
			Engine.log('population increased by ' + num);
			$SM.add('game.population', num);
		}
		Outside.schedulePopIncrease();
	},

	killVillagers: function(num) {
		$SM.add('game.population', num * -1);
		if($SM.get('game.population') < 0) {
			$SM.set('game.population', 0);
		}
		var remaining = Outside.getNumGatherers();
		if(remaining < 0) {
			var gap = -remaining;
			for(var k in $SM.get('game.workers')) {
				var numWorkers = $SM.get('game.workers["'+k+'"]');
				if(numWorkers < gap) {
					gap -= numWorkers;
					$SM.set('game.workers["'+k+'"]', 0);
				} else {
					$SM.add('game.workers["'+k+'"]', gap * -1);
					break;
				}
			}
		}
	},

	destroyHuts: function(num, allowEmptyHuts) {
		var num_dead = 0;
		for(var i = 0; i < num; i++){
			var population = $SM.get('game.population', true);
			var rate = population / Outside._HUT_ROOM;
			var full = Math.floor(rate);
			// by default this is used to destroy full or half-full huts
			// pass allowEmptyHuts to include empty huts in the armageddon
			var huts = (allowEmptyHuts) ? $SM.get('game.buildings["hut"]', true) : Math.ceil(rate);
			if(!huts) {
				break;
			}
			// random can be 0 but not 1; however, 0 as a target is useless
			var target = Math.floor(Math.random() * huts) + 1;
			var inhabitants = 0;
			if(target <= full){
				inhabitants = OutsideSettings._HUT_ROOM;
			} else if(target == full + 1){
				inhabitants = population % OutsideSettings._HUT_ROOM;
			}
			$SM.set('game.buildings["hut"]', ($SM.get('game.buildings["hut"]') - 1));
			if(inhabitants){
				Outside.killVillagers(inhabitants);
				num_dead += inhabitants;
			}
		}
		// this method returns the total number of victims, for further actions
		return num_dead;
	},
	getNextIncrease: function(){
		return Math.floor(Math.random()*(OutsideSettings._POP_DELAY[1] - OutsideSettings._POP_DELAY[0])) + OutsideSettings._POP_DELAY[0];

	},

	schedulePopIncrease: function() {
		var nextIncrease = Outside.getNextIncrease();
		Engine.log('next population increase scheduled in ' + nextIncrease + ' minutes');
		Outside._popTimeout = Engine.setTimeout(Outside.increasePopulation, nextIncrease * 60 * 1000);
	},
	updateIndivWorker: function(workers, gatherer, numGatherers){
		for(var k in $SM.get('game.workers')) {
			var lk = _(k);
			var workerCount = $SM.get('game.workers["'+k+'"]');
			var row = $('div#workers_row_' + k.replace(' ', '-'), workers);
			if(row.length === 0) {
				row = Outside.makeWorkerRow(k, workerCount);

				var curPrev = null;
				workers.children().each(function(i) {
					var child = $(this);
					var cName = child.children('.row_key').text();
					if(cName != 'gatherer') {
						if(cName < lk) {
							curPrev = child.attr('id');
						}
					}
				});
				if(curPrev == null && gatherer.length === 0) {
					row.prependTo(workers);
				} else if(curPrev == null) {
					row.insertAfter(gatherer);
				} else {
					row.insertAfter(workers.find('#'+ curPrev));
				}

			} else {
				$('div#' + row.attr('id') + ' > div.row_val > span', workers).text(workerCount);
			}
			numGatherers -= workerCount;
			if(workerCount === 0) {
				$('.dnBtn', row).addClass('disabled');
				$('.dnManyBtn', row).addClass('disabled');
			} else {
				$('.dnBtn', row).removeClass('disabled');
				$('.dnManyBtn', row).removeClass('disabled');
			}
		}
	},

	updateWorkersView: function() {
		var workers = $('div#workers');

		// If our population is 0 and we don't already have a workers view,
		// there's nothing to do here.
		if(!workers.length && $SM.get('game.population') === 0) return;

		var needsAppend = false;
		if(workers.length === 0) {
			needsAppend = true;
			workers = $('<div>').attr('id', 'workers').css('opacity', 0);
		}

		var numGatherers = $SM.get('game.population');
		var gatherer = $('div#workers_row_gatherer', workers);

		Outside.updateIndivWorker(workers, gatherer, numGatherers);

		if(gatherer.length === 0) {
			gatherer = Outside.makeWorkerRow('gatherer', numGatherers);
			gatherer.prependTo(workers);
		} else {
			$('div#workers_row_gatherer > div.row_val > span', workers).text(numGatherers);
		}

		if(numGatherers === 0) {
			$('.upBtn', '#workers').addClass('disabled');
			$('.upManyBtn', '#workers').addClass('disabled');
		} else {
			$('.upBtn', '#workers').removeClass('disabled');
			$('.upManyBtn', '#workers').removeClass('disabled');
		}


		if(needsAppend && workers.children().length > 0) {
			workers.appendTo('#outsidePanel').animate({opacity:1}, 300, 'linear');
		}
	},

	getNumGatherers: function() {
		var num = $SM.get('game.population');
		for(var k in $SM.get('game.workers')) {
			num -= $SM.get('game.workers["'+k+'"]');
		}
		return num;
	},

	makeWorkerRow: function(key, num) {
		name = OutsideSettings._INCOME[key].name;
		if(!name) name = key;
		var row = $('<div>')
			.attr('key', key)
			.attr('id', 'workers_row_' + key.replace(' ','-'))
			.addClass('workerRow');
		$('<div>').addClass('row_key').text(name).appendTo(row);
		var val = $('<div>').addClass('row_val').appendTo(row);

		$('<span>').text(num).appendTo(val);

		if(key != 'gatherer') {
			$('<div>').addClass('upBtn').appendTo(val).click([1], Outside.increaseWorker);
			$('<div>').addClass('dnBtn').appendTo(val).click([1], Outside.decreaseWorker);
			$('<div>').addClass('upManyBtn').appendTo(val).click([10], Outside.increaseWorker);
			$('<div>').addClass('dnManyBtn').appendTo(val).click([10], Outside.decreaseWorker);
		}

		$('<div>').addClass('clear').appendTo(row);

		var tooltip = $('<div>').addClass('tooltip bottom right').appendTo(row);
		var income = Outside._INCOME[key];
		for(var s in income.stores) {
			var r = $('<div>').addClass('storeRow');
			$('<div>').addClass('row_key').text(_(s)).appendTo(r);
			$('<div>').addClass('row_val').text(Engine.getIncomeMsg(income.stores[s], income.delay)).appendTo(r);
			r.appendTo(tooltip);
		}

		return row;
	},

	increaseWorker: function(btn) {
		var worker = $(this).closest('.workerRow').attr('key');
		if(Outside.getNumGatherers() > 0) {

			var increaseAmt = Math.min(Outside.getNumGatherers(), btn.data);

			Engine.log('increasing ' + worker + ' by ' + increaseAmt);
			$SM.add('game.workers["'+worker+'"]', increaseAmt);



		}
	},

	decreaseWorker: function(btn) {
		var worker = $(this).closest('.workerRow').attr('key');
		if($SM.get('game.workers["'+worker+'"]') > 0) {
			var decreaseAmt = Math.min($SM.get('game.workers["'+worker+'"]') || 0, btn.data);
			Engine.log('decreasing ' + worker + ' by ' + decreaseAmt);
			$SM.add('game.workers["'+worker+'"]', decreaseAmt * -1);
		}
	},

	updateVillageRow: function(name, num, village) {
		var id = 'building_row_' + name.replace(' ', '-');
		var lname = _(name);
		var row = $('div#' + id, village);
		if(row.length === 0 && num > 0) {
			row = $('<div>').attr('id', id).addClass('storeRow');
			$('<div>').addClass('row_key').text(lname).appendTo(row);
			$('<div>').addClass('row_val').text(num).appendTo(row);
			$('<div>').addClass('clear').appendTo(row);
			var curPrev = null;
			village.children().each(function(i) {
				var child = $(this);
				if(child.attr('id') != 'population') {
					var cName = child.children('.row_key').text();
					if(cName < lname) {
						curPrev = child.attr('id');
					}
				}
			});
			if(curPrev == null) {
				row.prependTo(village);
			} else {
				row.insertAfter('#' + curPrev);
			}
		} else if(num > 0) {
			$('div#' + row.attr('id') + ' > div.row_val', village).text(num);
		} else if(num === 0) {
			row.remove();
		}
	},

	updateVillage: function(ignoreStores) {
		var village = $('div#village');
		var population = $('div#population');
		var needsAppend = false;
		if(village.length === 0) {
			needsAppend = true;
			village = $('<div>').attr('id', 'village').css('opacity', 0);
			population = $('<div>').attr('id', 'population').appendTo(village);
		}

		for(var k in $SM.get('game.buildings')) {
			if(k == 'trap') {
				var numTraps = $SM.get('game.buildings["'+k+'"]');
				var numBait = $SM.get('stores.bait', true);
				var traps = numTraps - numBait;
				traps = traps < 0 ? 0 : traps;
				Outside.updateVillageRow(k, traps, village);
				Outside.updateVillageRow('baited trap', numBait > numTraps ? numTraps : numBait, village);
			} else {
				if(Outside.checkWorker(k)) {
					Outside.updateWorkersView();
				}
				Outside.updateVillageRow(k, $SM.get('game.buildings["'+k+'"]'), village);
			}
		}
		/// TRANSLATORS : pop is short for population.
		population.text(_('pop ') + $SM.get('game.population') + '/' + this.getMaxPopulation());

		var hasPeeps;
		if($SM.get('game.buildings["hut"]', true) === 0) {
			hasPeeps = false;
			village.attr('data-legend', _('forest'));
		} else {
			hasPeeps = true;
			village.attr('data-legend', _('village'));
		}

		if(needsAppend && village.children().length > 1) {
			village.prependTo('#outsidePanel');
			village.animate({opacity:1}, 300, 'linear');
		}

		if(hasPeeps && typeof Outside._popTimeout == 'undefined') {
			Outside.schedulePopIncrease();
		}

		this.setTitle();

		if(!ignoreStores && Engine.activeModule === Outside && village.children().length > 1) {
			$('#storesContainer').css({top: village.height() + 26 + Outside._STORES_OFFSET + 'px'});
		}
	},

	checkWorker: function(name) {

var jobMap = OutsideSettings.jobMap;
		var jobs = jobMap[name];
		var added = false;
		if(typeof jobs == 'object') {
			for(var i = 0, len = jobs.length; i < len; i++) {
				var job = jobs[i];
				if(typeof $SM.get('game.buildings["'+name+'"]') == 'number' &&
						typeof $SM.get('game.workers["'+job+'"]') != 'number') {
					Engine.log('adding ' + job + ' to the workers list');
					$SM.set('game.workers["'+job+'"]', 0);
					added = true;
				}
			}
		}
		return added;
	},

	updateVillageIncome: function() {
		for(var worker in Outside._INCOME) {
			var income = Outside._INCOME[worker];
			var num = worker == 'gatherer' ? Outside.getNumGatherers() : $SM.get('game.workers["'+worker+'"]');
			if(typeof num == 'number') {
				var stores = {};
				if(num < 0) num = 0;
				var tooltip = $('.tooltip', 'div#workers_row_' + worker.replace(' ', '-'));
				tooltip.empty();
				var needsUpdate = false;
				var curIncome = $SM.getIncome(worker);
				for(var store in income.stores) {
					stores[store] = income.stores[store] * num;
					if(curIncome[store] != stores[store]) needsUpdate = true;
					var row = $('<div>').addClass('storeRow');
					$('<div>').addClass('row_key').text(_(store)).appendTo(row);
					$('<div>').addClass('row_val').text(Engine.getIncomeMsg(stores[store], income.delay)).appendTo(row);
					row.appendTo(tooltip);
				}
				if(needsUpdate) {
					$SM.setIncome(worker, {
						delay: income.delay,
						stores: stores
					});
				}
			}
		}
		Room.updateIncomeView();
	},

	updateTrapButton: function() {
		var btn = $('div#trapsButton');
		if($SM.get('game.buildings["trap"]', true) > 0) {
			if(btn.length === 0) {
				new Button.Button({
					id: 'trapsButton',
					text: _("check traps"),
					click: Outside.checkTraps,
					cooldown: Outside._TRAPS_DELAY,
					width: '80px'
				}).appendTo('div#outsidePanel');
			} else {
				Button.setDisabled(btn, false);
			}
		} else {
			if(btn.length > 0) {
				Button.setDisabled(btn, true);
			}
		}
	},

	setTitle: function() {
		var numHuts = $SM.get('game.buildings["hut"]', true);
		var title;
		if(numHuts === 0) {
			title = _(OutsideSettings.TitleText[0]);
		} else if(numHuts == 1) {
			title = _(OutsideSettings.TitleText[1]);
		} else if(numHuts <= 4) {
			title = _(OutsideSettings.TitleText[2]);
		} else if(numHuts <= 8) {
			title = _(OutsideSettings.TitleText[3]);
		} else if(numHuts <= 14) {
			title = _(OutsideSettings.TitleText[4]);
		} else {
			title = _(OutsideSettings.TitleText[5]);
		}

		if(Engine.activeModule == this) {
			document.title = title;
		}
		$('#location_outside').text(title);
	},

	onArrival: function(transition_diff) {
		Outside.setTitle();
		if(!$SM.get('game.outside.seenForest')) {
			Notifications.notify(Outside, _("the sky is grey and the wind blows relentlessly"));
			$SM.set('game.outside.seenForest', true);
		}
		Outside.updateTrapButton();
		Outside.updateVillage(true);

		Engine.moveStoresView($('#village'), transition_diff);
	},

	gatherWood: function() {
		Notifications.notify(Outside, _("dry brush and dead branches litter the forest floor"));
		var gatherAmt = $SM.get('game.buildings["cart"]', true) > 0 ? 50 : 10;
		$SM.add('stores.wood', gatherAmt);
	},
	trapsTranslate: function(msg){
		/// TRANSLATORS : Mind the whitespace at the end.
		var s = _('the traps contain ');
		for(var l = 0, len = msg.length; l < len; l++) {
			if(len > 1 && l > 0 && l < len - 1) {
				s += ", ";
			} else if(len > 1 && l == len - 1) {
				/// TRANSLATORS : Mind the whitespaces at the beginning and end.
				s += _(" and ");
			}
			s += msg[l];
		}
			Notifications.notify(Outside, s);
	},

	checkTraps: function() {
		var drops = {};
		var msg = [];
		var numTraps = $SM.get('game.buildings["trap"]', true);
		var numBait = $SM.get('stores.bait', true);
		var numDrops = numTraps + (numBait < numTraps ? numBait : numTraps);
		for(var i = 0; i < numDrops; i++) {
			var roll = Math.random();
			for(var j in Outside.TrapDrops) {
				var drop = Outside.TrapDrops[j];
				if(roll < drop.rollUnder) {
					var num = drops[drop.name];
					if(typeof num == 'undefined') {
						num = 0;
						msg.push(drop.message);
					}
					drops[drop.name] = num + 1;
					break;
				}
			}
		}
	Outside.trapsTranslate(msg);

		var baitUsed = numBait < numTraps ? numBait : numTraps;
		drops['bait'] = -baitUsed;


		$SM.addM('stores', drops);
	},

	handleStateUpdates: function(e){
		if(e.category == 'stores'){
			Outside.updateVillage();
		} else if(e.stateName.indexOf('game.workers') === 0 || e.stateName.indexOf('game.population') === 0){
			Outside.updateVillage();
			Outside.updateWorkersView();
			Outside.updateVillageIncome();
		}
	},

	scrollSidebar: function(direction, reset) {

		if( typeof reset != "undefined" ){
			$('#village').css('top', '0px');
			$('#storesContainer').css('top', '224px');
			OutsideSettings._STORES_OFFSET = 0;
			return false;
		}

		var momentum = 10;

		// If they hit up, we scroll everything down
		if( direction == 'up' )
			momentum = momentum * -1;

		/* Let's stop scrolling if the top or bottom bound is in the viewport, based on direction */
		if( direction == 'down' && inView( direction, $('#village') ) ){

			return false;

		}else if( direction == 'up' && inView( direction, $('#storesContainer') ) ){

			return false;

		}

		scrollByX( $('#village'), momentum );
		scrollByX( $('#storesContainer'), momentum );
		OutsideSettings._STORES_OFFSET += momentum;

	}
};
