/**
 * Module that registers the outdoors functionality
 */
var Outside = {
	name: "Outside",
	
	_GATHER_DELAY: 60,
	_TRAPS_DELAY: 90,
	_POP_DELAY: [0.5, 3],
	
	_INCOME: {
		'gatherer': {
			delay: 10,
			stores: {
				'wood': 1
			}
		},
		'hunter': {
			delay: 10,
			stores: {
				'fur': 0.5,
				'meat': 0.5
			}
		},
		'trapper': {
			delay: 10,
			stores: {
				'meat': -1,
				'bait': 1
			}
		},
		'tanner': {
			delay: 10,
			stores: {
				'fur': -5,
				'leather': 1
			}
		},
		'charcutier': {
			delay: 10,
			stores: {
				'meat': -5,
				'wood': -5,
				'cured meat': 1
			}
		},
		'iron miner': {
			delay: 10,
			stores: {
				'cured meat': -1,
				'iron': 1
			}
		},
		'coal miner': {
			delay: 10,
			stores: {
				'cured meat': -1,
				'coal': 1
			}
		},
		'sulphur miner': {
			delay: 10,
			stores: {
				'cured meat': -1,
				'sulphur': 1
			}
		},
		'steelworker': {
			delay: 10,
			stores: {
				'iron': -1,
				'coal': -1,
				'steel': 1
			}
		},
		'armourer': {
			delay: 10,
			stores: {
				'steel': -1,
				'sulphur': -1,
				'bullets': 1
			}
		}
	},
	
	TrapDrops: [
		{
			rollUnder: 0.5,
			name: 'fur',
			message: 'scraps of fur'
		},
		{
			rollUnder: 0.75,
			name: 'meat',
			message: 'bits of meat'
		},
		{
			rollUnder: 0.85,
			name: 'scales',
			message: 'strange scales'
		},
		{
			rollUnder: 0.93,
			name: 'teeth',
			message: 'scattered teeth'
		},
		{
			rollUnder: 0.995,
			name: 'cloth',
			message: 'tattered cloth'
		},
		{
			rollUnder: 1.0,
			name: 'charm',
			message: 'a crudely made charm'
		}
	],
	
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
		this.tab = Header.addLocation("A Silent Forest", "outside", Outside);
		
		// Create the Outside panel
		this.panel = $('<div>').attr('id', "outsidePanel")
			.addClass('location')
			.appendTo('div#locationSlider');
		
		if(typeof State.outside == 'undefined') {
			State.outside = {
				buildings: {},
				population: 0,
				workers: {}
			}
		}
		
		this.updateVillage();
		Outside.updateWorkersView();
		
		Engine.updateSlider();
		
		// Create the gather button
		new Button.Button({
			id: 'gatherButton',
			text: "gather wood",
			click: Outside.gatherWood,
			cooldown: Outside._GATHER_DELAY,
			width: '80px'
		}).appendTo('div#outsidePanel');
	},
	
	numBuilding: function(bName) {
		return State.outside && 
			State.outside.buildings && 
			State.outside.buildings[bName]  ? State.outside.buildings[bName] : 0;
	},
	
	addBuilding: function(bName, num) {
		var cur = State.outside.buildings[bName];
		if(typeof cur != 'number') cur = 0;
		cur += num;
		if(cur < 0) cur = 0;
		State.outside.buildings[bName] = cur;
		this.updateVillage();
		Engine.saveGame();
	},
	
	addBuildings: function(list) {
		for(k in list) {
			var num = State.outside.buildings[k];
			if(typeof num != 'number') num = 0;
			num += list[k];
			State.outside.buildings[k] = num;
		}
		this.updateVillage();
		Engine.saveGame();
	},
	
	getMaxPopulation: function() {
		return Outside.numBuilding('hut') * 4;
	},
	
	getPopulation: function() {
		if(State.outside && State.outside.population) {
			return State.outside.population;
		}
		return 0;
	},
	
	increasePopulation: function() {
		var space = Outside.getMaxPopulation() - State.outside.population;
		if(space > 0) {
			var num = Math.floor(Math.random()*(space/2) + space/2);
			if(num == 0) num = 1;
			if(num == 1) {
				Notifications.notify(null, 'a stranger arrives in the night');
			} else if(num < 5) {
				Notifications.notify(null, 'a weathered family takes up in one of the huts.');
			} else if(num < 10) {
				Notifications.notify(null, 'a small group arrives, all dust and bones.');
			} else if(num < 30) {
				Notifications.notify(null, 'a convoy lurches in, equal parts worry and hope.');
			} else {
				Notifications.notify(null, "the town's booming. word does get around.");
			}
			Engine.log('population increased by ' + num);
			State.outside.population += num;
			Outside.updateVillage();
			Outside.updateWorkersView();
			Outside.updateVillageIncome();
		}
		Outside.schedulePopIncrease();
	},
	
	killVillagers: function(num) {
		State.outside.population -= num;
		if(State.outside.population < 0) {
			State.outside.population = 0;
		}
		var remaining = Outside.getNumGatherers();
		if(remaining < 0) {
			var gap = -remaining;
			for(var k in State.outside.workers) {
				var num = State.outside.workers[k];
				if(num < gap) {
					gap -= num;
					State.outside.workers[k] = 0;
				} else {
					State.outside.workers[k] -= gap;
					break;
				}
			}
		}
		Outside.updateVillage();
		Outside.updateWorkersView();
		Outside.updateVillageIncome();
	},
	
	schedulePopIncrease: function() {
		var nextIncrease = Math.floor(Math.random()*(Outside._POP_DELAY[1] - Outside._POP_DELAY[0])) + Outside._POP_DELAY[0];
    	Engine.log('next population increase scheduled in ' + nextIncrease + ' minutes');
    	Outside._popTimeout = setTimeout(Outside.increasePopulation, nextIncrease * 60 * 1000);
	},
	
	updateWorkersView: function() {
		if(State.outside.population == 0) return;
		var workers = $('div#workers');
		var needsAppend = false;
		if(workers.length == 0) {
			needsAppend = true;
			workers = $('<div>').attr('id', 'workers').css('opacity', 0);
		}
		
		var numGatherers = State.outside.population;
		var gatherer = $('div#workers_row_gatherer', workers);
		
		for(var k in State.outside.workers) {
			var row = $('div#workers_row_' + k.replace(' ', '-'), workers);
			if(row.length == 0) {
				row = Outside.makeWorkerRow(k, State.outside.workers[k]);
				
				var curPrev = null;
				workers.children().each(function(i) {
					var child = $(this);
					var cName = child.attr('id').substring(12).replace('-', ' ');
					if(cName != 'gatherer') {
						if(cName < k && (curPrev == null || cName > curPrev)) {
							curPrev = cName;
						}
					}
				});
				if(curPrev == null && gatherer.length == 0) {
					row.prependTo(workers);
				} 
				else if(curPrev == null)
				{
					row.insertAfter(gatherer);
				} 
				else 
				{
					row.insertAfter(workers.find('#workers_row_' + curPrev.replace(' ', '-')));
				}
				
			} else {
				$('div#' + row.attr('id') + ' > div.row_val > span', workers).text(State.outside.workers[k]);
			}
			numGatherers -= State.outside.workers[k];
			if(State.outside.workers[k] == 0) {
				$('.dnBtn', row).addClass('disabled');
				$('.dnManyBtn', row).addClass('disabled');
			} else {
				$('.dnBtn', row).removeClass('disabled');
				$('.dnManyBtn', row).removeClass('disabled');
			}
		}
		
		if(gatherer.length == 0) {
			gatherer = Outside.makeWorkerRow('gatherer', numGatherers);
			gatherer.prependTo(workers);
		} else {
			$('div#workers_row_gatherer > div.row_val > span', workers).text(numGatherers);
		}
		
		if(numGatherers == 0) {
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
		var num = State.outside.population; 
		for(var k in State.outside.workers) {
			num -= State.outside.workers[k];
		}
		return num;
	},
	
	makeWorkerRow: function(name, num) {
		var row = $('<div>')
			.attr('id', 'workers_row_' + name.replace(' ','-'))
			.addClass('workerRow');
		$('<div>').addClass('row_key').text(name).appendTo(row);
		var val = $('<div>').addClass('row_val').appendTo(row);
		
		$('<span>').text(num).appendTo(val);
		
		if(name != 'gatherer') {
		  $('<div>').addClass('upManyBtn').appendTo(val).click([10], Outside.increaseWorker);
			$('<div>').addClass('upBtn').appendTo(val).click([1], Outside.increaseWorker);
			$('<div>').addClass('dnBtn').appendTo(val).click([1], Outside.decreaseWorker);
			$('<div>').addClass('dnManyBtn').appendTo(val).click([10], Outside.decreaseWorker);
		}
		
		$('<div>').addClass('clear').appendTo(row);
		
		var tooltip = $('<div>').addClass('tooltip bottom right').appendTo(row);
		var income = Outside._INCOME[name];
		for(var s in income.stores) {
			var r = $('<div>').addClass('storeRow');
			$('<div>').addClass('row_key').text(s).appendTo(r);
			$('<div>').addClass('row_val').text(Engine.getIncomeMsg(income.stores[s], income.delay)).appendTo(r);
			r.appendTo(tooltip);
		}
		
		return row;
	},
	
	increaseWorker: function(btn) {
		var worker = $(this).closest('.workerRow').children('.row_key').text();
		if(Outside.getNumGatherers() > 0) {
		  var increaseAmt = Math.min(Outside.getNumGatherers(), btn.data);
			Engine.log('increasing ' + worker + ' by ' + increaseAmt);
			State.outside.workers[worker] += increaseAmt;
			Outside.updateVillageIncome();
			Outside.updateWorkersView();
		}
	},
	
	decreaseWorker: function(btn) {
		var worker = $(this).closest('.workerRow').children('.row_key').text();
		if(State.outside.workers[worker] > 0) {
		  var decreaseAmt = Math.min(State.outside.workers[worker] || 0, btn.data);
			Engine.log('decreasing ' + worker + ' by ' + decreaseAmt);
			State.outside.workers[worker] -= decreaseAmt;
			Outside.updateVillageIncome();
			Outside.updateWorkersView();
		}
	},
	
	updateVillageRow: function(name, num, village) {
		var id = 'building_row_' + name.replace(' ', '-');
		var row = $('div#' + id, village);
			if(row.length == 0 && num > 0) {
				var row = $('<div>').attr('id', id).addClass('storeRow');
				$('<div>').addClass('row_key').text(name).appendTo(row);
				$('<div>').addClass('row_val').text(num).appendTo(row);
				$('<div>').addClass('clear').appendTo(row);
				var curPrev = null;
				village.children().each(function(i) {
					var child = $(this);
					if(child.attr('id') != 'population') {
						var cName = child.attr('id').substring(13).replace('-', ' ');
						if(cName < name && (curPrev == null || cName > curPrev)) {
							curPrev = cName;
						}
					}
				});
				if(curPrev == null) {
					row.prependTo(village);
				} else {
					row.insertAfter('#building_row_' + curPrev.replace(' ', '-'));
				}
			} else if(num > 0) {
				$('div#' + row.attr('id') + ' > div.row_val', village).text(num);
			} else if(num == 0) {
				row.remove();
			}
	},
	
	updateVillage: function() {
		var village = $('div#village');
		var pop = $('div#population');
		var needsAppend = false;
		if(village.length == 0) {
			needsAppend = true;
			village = $('<div>').attr('id', 'village').css('opacity', 0);
			population = $('<div>').attr('id', 'population').appendTo(village);
		}
		
		for(var k in State.outside.buildings) {
			if(k == 'trap') {
				var numTraps = State.outside.buildings[k];
				var numBait = Engine.getStore('bait');
				var traps = numTraps - numBait;
				traps = traps < 0 ? 0 : traps;
				Outside.updateVillageRow(k, traps, village);
				Outside.updateVillageRow('baited trap', numBait > numTraps ? numTraps : numBait, village);
			} else {
				if(Outside.checkWorker(k)) {
					Outside.updateWorkersView();
				}
				Outside.updateVillageRow(k, State.outside.buildings[k], village);
			}
		}
		
		population.text('pop ' + State.outside.population + '/' + this.getMaxPopulation());
		
		var hasPeeps;
		if(Outside.numBuilding('hut') == 0) {
			hasPeeps = false;
			village.addClass('noHuts');
		} else {
			hasPeeps = true;
			village.removeClass('noHuts');
		}
		
		if(needsAppend && village.children().length > 1) {
			village.appendTo('#outsidePanel');
			village.animate({opacity:1}, 300, 'linear');
		}
		
		if(hasPeeps && typeof Outside._popTimeout == 'undefined') {
			Outside.schedulePopIncrease();
		}
		
		this.setTitle();
	},
	
	checkWorker: function(name) {
		var jobMap = {
			'lodge': ['hunter', 'trapper'],
			'tannery': ['tanner'],
			'smokehouse': ['charcutier'],
			'iron mine': ['iron miner'],
			'coal mine': ['coal miner'],
			'sulphur mine': ['sulphur miner'],
			'steelworks': ['steelworker'],
			'armoury' : ['armourer']
		}
		
		var jobs = jobMap[name];
		var added = false;
		if(typeof jobs == 'object') {
			for(var i = 0, len = jobs.length; i < len; i++) {
				var job = jobs[i];
				if(typeof State.outside.buildings[name] == 'number' && 
						typeof State.outside.workers[job] != 'number') {
					Engine.log('adding ' + job + ' to the workers list')
					State.outside.workers[job] = 0;
					added = true;
				}
			}
		}
		return added;
	},
	
	updateVillageIncome: function() {		
		for(var worker in Outside._INCOME) {
			var income = Outside._INCOME[worker];
			var num = worker == 'gatherer' ? Outside.getNumGatherers() : State.outside.workers[worker];
			if(typeof num == 'number') {
				var stores = {};
				if(num < 0) num = 0;
				var tooltip = $('.tooltip', 'div#workers_row_' + worker.replace(' ', '-'));
				tooltip.empty();
				var needsUpdate = false;
				var curIncome = Engine.getIncome(worker);
				for(var store in income.stores) {
					stores[store] = income.stores[store] * num;
					if(curIncome[store] != stores[store]) needsUpdate = true;
					var row = $('<div>').addClass('storeRow');
					$('<div>').addClass('row_key').text(store).appendTo(row);
					$('<div>').addClass('row_val').text(Engine.getIncomeMsg(stores[store], income.delay)).appendTo(row);
					row.appendTo(tooltip);
				}
				if(needsUpdate) {
					Engine.setIncome(worker, {
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
		if(Outside.numBuilding('trap') > 0) {
			if(btn.length == 0) {
				new Button.Button({
					id: 'trapsButton',
					text: "check traps",
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
		var numHuts = this.numBuilding('hut');
		var title;
		if(numHuts == 0) {
			title = "A Silent Forest";
		} else if(numHuts == 1) {
			title = "A Lonely Hut";
		} else if(numHuts <= 4) {
			title = "A Tiny Village";
		} else if(numHuts <= 8) {
			title = "A Modest Village";
		} else if(numHuts <= 14) {
			title = "A Large Village";
		} else {
			title = "A Raucous Village";
		}
		
		if(Engine.activeModule == this) {
			document.title = title;
		}
		$('#location_outside').text(title);
	},
	
	onArrival: function() {
		Outside.setTitle();
		if(!State.seenForest) {
			Notifications.notify(Outside, "the sky is grey and the wind blows relentlessly");
			State.seenForest = true;
		}
		Outside.updateTrapButton();
	},
	
	gatherWood: function() {
		Notifications.notify(Outside, "dry brush and dead branches litter the forest floor")
		Engine.setStore('wood', Engine.getStore('wood') + (Outside.numBuilding('cart') > 0 ? 50 : 10));
	},
	
	checkTraps: function() {
		var drops = {};
		var msg = [];
		var numTraps = Outside.numBuilding('trap');
		var numBait = Engine.getStore('bait');
		var numDrops = numTraps + (numBait < numTraps ? numBait : numTraps);
		for(var i = 0; i < numDrops; i++) {
			var roll = Math.random();
			for(var j in Outside.TrapDrops) {
				var drop = Outside.TrapDrops[j];
				if(roll < drop.rollUnder) {
					var num = drops[drop.name]
					if(typeof num == 'undefined') {
						num = 0;
						msg.push(drop.message);
					}
					drops[drop.name] = num + 1;
					break;
				}
			}
		}
		var s = 'the traps contain ';
		for(var i = 0, len = msg.length; i < len; i++) {
			if(len > 1 && i > 0 && i < len - 1) {
				s += ", ";
			} else if(len > 1 && i == len - 1) {
				s += " and ";
			}
			s += msg[i];
		}
		
		var baitUsed = numBait < numTraps ? numBait : numTraps;
		drops['bait'] = -baitUsed;
		
		Notifications.notify(Outside, s);
		Engine.addStores(drops);
	}
}