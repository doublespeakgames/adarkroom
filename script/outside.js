/**
 * Module that registers the outdoors functionality
 */
var Outside = {
	name: "Outside",
	
	_GATHER_DELAY: 60,
	_TRAPS_DELAY: 90,
	_POP_DELAY: [0.5, 3],
	
	_INCOME: {
		'збирачі': {
			delay: 10,
			stores: {
				'дерево': 1
			}
		},
		'мисливці': {
			delay: 10,
			stores: {
				'шкури': 0.5,
				'м’ясо': 0.5
			}
		},
		'ловці': {
			delay: 10,
			stores: {
				'м’ясо': -1,
				'приманка': 1
			}
		},
		'кожем’яки': {
			delay: 10,
			stores: {
				'шкури': -5,
				'шкіра': 1
			}
		},
		'коптярі': {
			delay: 10,
			stores: {
				'м’ясо': -5,
				'дерево': -5,
				'копченина': 1
			}
		},
		'шахтарі': {
			delay: 10,
			stores: {
				'копченина': -1,
				'залізо': 1
			}
		},
		'вуглекопи': {
			delay: 10,
			stores: {
				'копченина': -1,
				'вугілля': 1
			}
		},
		'хіміки': {
			delay: 10,
			stores: {
				'копченина': -1,
				'сірка': 1
			}
		},
		'ковалі': {
			delay: 10,
			stores: {
				'залізо': -1,
				'вугілля': -1,
				'сталь': 1
			}
		},
		'набивачі': {
			delay: 10,
			stores: {
				'сталь': -1,
				'сірка': -1,
				'набої': 1
			}
		}
	},
	
	TrapDrops: [
		{
			rollUnder: 0.5,
			name: 'шкури',
			message: 'уривки шкур'
		},
		{
			rollUnder: 0.75,
			name: 'м’ясо',
			message: 'шматки м’яса'
		},
		{
			rollUnder: 0.85,
			name: 'луска',
			message: 'дивна луска'
		},
		{
			rollUnder: 0.93,
			name: 'клики',
			message: 'розсипані зуби'
		},
		{
			rollUnder: 0.995,
			name: 'шмаття',
			message: 'обірвані шмаття'
		},
		{
			rollUnder: 1.0,
			name: 'буси',
			message: 'примітивні буси'
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
		this.tab = Header.addLocation("Тихий ліс", "outside", Outside);
		
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
			text: "дерево",
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
		return Outside.numBuilding('хатка') * 4;
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
				Notifications.notify(null, 'Незнайомець прибув уночі.');
			} else if(num < 5) {
				Notifications.notify(null, 'Обвітрена сім’я зайняла хатинку.');
			} else if(num < 10) {
				Notifications.notify(null, 'Маленький гурт прибув, сама шкіра та кістки.');
			} else if(num < 30) {
				Notifications.notify(null, 'Конвой прибув, в надії та тривогах.');
			} else {
				Notifications.notify(null, "Наплив людей у місті, слава поширюється навколо.");
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
		var gatherer = $('div#workers_row_збирачі', workers);
		
		for(var k in State.outside.workers) {
			var row = $('div#workers_row_' + k.replace(/ /g, '-'), workers);
			if(row.length == 0) {
				row = Outside.makeWorkerRow(k, State.outside.workers[k]);
				
				var curPrev = null;
				workers.children().each(function(i) {
					var child = $(this);
					var cName = child.attr('id').substring(12).replace(/-/g, ' ');
					if(cName != 'збирачі') {
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
					row.insertAfter(workers.find('#workers_row_' + curPrev.replace(/ /g, '-')));
				}
				
			} else {
				$('div#' + row.attr('id') + ' > div.row_val > span', workers).text(State.outside.workers[k]);
			}
			numGatherers -= State.outside.workers[k];
			if(State.outside.workers[k] == 0) {
				$('.dnBtn', row).addClass('disabled');
			} else {
				$('.dnBtn', row).removeClass('disabled');
			}
		}
		
		if(gatherer.length == 0) {
			gatherer = Outside.makeWorkerRow('збирачі', numGatherers);
			gatherer.prependTo(workers);
		} else {
			$('div#workers_row_збирачі > div.row_val > span', workers).text(numGatherers);
		}
		
		if(numGatherers == 0) {
			$('.upBtn', '#workers').addClass('disabled');
		} else {
			$('.upBtn', '#workers').removeClass('disabled');
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
			.attr('id', 'workers_row_' + name.replace(/ /g,'-'))
			.addClass('workerRow');
		$('<div>').addClass('row_key').text(name).appendTo(row);
		var val = $('<div>').addClass('row_val').appendTo(row);
		
		$('<span>').text(num).appendTo(val);
		
		if(name != 'збирачі') {
			$('<div>').addClass('upBtn').appendTo(val).click(Outside.increaseWorker);
			$('<div>').addClass('dnBtn').appendTo(val).click(Outside.decreaseWorker);
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
			Engine.log('increasing ' + worker);
			State.outside.workers[worker]++;
			Outside.updateVillageIncome();
			Outside.updateWorkersView();
		}
	},
	
	decreaseWorker: function(btn) {
		var worker = $(this).closest('.workerRow').children('.row_key').text();
		if(State.outside.workers[worker] > 0) {
			Engine.log('decreasing ' + worker);
			State.outside.workers[worker]--;
			Outside.updateVillageIncome();
			Outside.updateWorkersView();
		}
	},
	
	updateVillageRow: function(name, num, village) {
		var id = 'building_row_' + name.replace(/ /g, '-');
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
						var cName = child.attr('id').substring(13).replace(/-/g, ' ');
						if(cName < name && (curPrev == null || cName > curPrev)) {
							curPrev = cName;
						}
					}
				});
				if(curPrev == null) {
					row.prependTo(village);
				} else {
					row.insertAfter('#building_row_' + curPrev.replace(/ /g, '-'));
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
			if(k == 'пастки') {
				var numTraps = State.outside.buildings[k];
				var numBait = Engine.getStore('приманка');
				var traps = numTraps - numBait;
				traps = traps < 0 ? 0 : traps;
				Outside.updateVillageRow(k, traps, village);
				Outside.updateVillageRow('пастки з приманкою', numBait > numTraps ? numTraps : numBait, village);
			} else {
				if(Outside.checkWorker(k)) {
					Outside.updateWorkersView();
				}
				Outside.updateVillageRow(k, State.outside.buildings[k], village);
			}
		}
		
		population.text('нас ' + State.outside.population + '/' + this.getMaxPopulation());
		
		var hasPeeps;
		if(Outside.numBuilding('хатка') == 0) {
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
			'сторожка': ['мисливці', 'ловці'],
			'дубильня': ['кожем’яки'],
			'коптильня': ['коптярі'],
			'рудник': ['шахтарі'],
			'вуглекопальня': ['вуглекопи'],
			'родовище': ['хіміки'],
			'кузня': ['ковалі'],
			'арсенал' : ['набивачі']
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
			var num = worker == 'збирачі' ? Outside.getNumGatherers() : State.outside.workers[worker];
			if(typeof num == 'number') {
				var stores = {};
				if(num < 0) num = 0;
				var tooltip = $('.tooltip', 'div#workers_row_' + worker.replace(/ /g, '-'));
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
		if(Outside.numBuilding('пастки') > 0) {
			if(btn.length == 0) {
				new Button.Button({
					id: 'trapsButton',
					text: "пастки",
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
		var numHuts = this.numBuilding('хатка');
		var title;
		if(numHuts == 0) {
			title = "Тихий ліс";
		} else if(numHuts == 1) {
			title = "Самотня хатина";
		} else if(numHuts <= 4) {
			title = "Маленький хутір";
		} else if(numHuts <= 8) {
			title = "Невелике село";
		} else if(numHuts <= 14) {
			title = "Велике село";
		} else {
			title = "Гігантське село";
		}
		
		if(Engine.activeModule == this) {
			document.title = title;
		}
		$('#location_outside').text(title);
	},
	
	onArrival: function() {
		Outside.setTitle();
		if(!State.seenForest) {
			Notifications.notify(Outside, "Небо посірівше і вітер свище невпинно");
			State.seenForest = true;
		}
		Outside.updateTrapButton();
	},
	
	gatherWood: function() {
		Notifications.notify(Outside, "Сухі гілки падають на лісову підстилку")
		Engine.setStore('дерево', Engine.getStore('дерево') + (Outside.numBuilding('возик') > 0 ? 50 : 10));
	},
	
	checkTraps: function() {
		var drops = {};
		var msg = [];
		var numTraps = Outside.numBuilding('пастки');
		var numBait = Engine.getStore('приманка');
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
		var s = 'У пастках були ';
		for(var i = 0, len = msg.length; i < len; i++) {
			if(len > 1 && i > 0 && i < len - 1) {
				s += ", ";
			} else if(len > 1 && i == len - 1) {
				s += " і ";
			}
			s += msg[i];
		}
		
		var baitUsed = numBait < numTraps ? numBait : numTraps;
		drops['приманка'] = -baitUsed;
		
		Notifications.notify(Outside, s);
		Engine.addStores(drops);
	}
}