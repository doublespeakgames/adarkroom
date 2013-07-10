var World = {
	
	RADIUS: 30,
	VILLAGE_POS: [30, 30],
	TILE: {
		VILLAGE: 'A',
		IRON_MINE: 'I',
		COAL_MINE: 'C',
		SULPHUR_MINE: 'S',
		FOREST: 'T',
		FIELD: ',',
		BARRENS: '.',
		ROAD: '#',
		HOUSE: 'H',
		CAVE: 'V',
		TOWN: 'O',
		CITY: 'Y',
		OUTPOST: 'P',
		SHIP: 'W',
		BOREHOLE: 'B',
		BATTLEFIELD: 'F',
		SWAMP: 'M'
	},
	TILE_PROBS: {},
	LANDMARKS: {},
	STICKINESS: 0.5, // 0 <= x <= 1
	LIGHT_RADIUS: 2,
	BASE_WATER: 10,
	MOVES_PER_FOOD: 2,
	MOVES_PER_WATER: 1,
	DEATH_COOLDOWN: 120,
	FIGHT_CHANCE: 0.20,
	BASE_HEALTH: 10,
	BASE_HIT_CHANCE: 0.8,
	MEAT_HEAL: 10,
	FIGHT_DELAY: 3, // At least three moves between fights
	
	Weapons: {
		'fists': {
			verb: 'punch',
			type: 'unarmed',
			damage: 1,
			cooldown: 2
		},
		'bone spear': {
			verb: 'stab',
			type: 'melee',
			damage: 2,
			cooldown: 2
		},
		'iron sword': {
			verb: 'swing',
			type: 'melee',
			damage: 4,
			cooldown: 2
		},
		'steel sword': {
			verb: 'slash',
			type: 'melee',
			damage: 6,
			cooldown: 2
		},
		'bayonet': {
			verb: 'thrust',
			type: 'melee',
			damage: 8,
			cooldown: 2
		},
		'rifle': {
			verb: 'shoot',
			type: 'ranged',
			damage: 5,
			cooldown: 1,
			cost: { 'bullets': 1 }
		},
		'laser rifle': {
			verb: 'blast',
			type: 'ranged',
			damage: 8,
			cooldown: 1,
			cost: { 'energy cell': 1 }
		},
		'grenade': {
			verb: 'lob',
			type: 'ranged',
			damage: 15,
			cooldown: 5,
			cost: { 'grenade': 1 }
		},
		'bolas': {
			verb: 'tangle',
			type: 'ranged',
			damage: 'stun',
			cooldown: 15,
			cost: { 'bolas': 1 }
		}
	},
	
	name: 'World',
	options: {}, // Nothing for now
	init: function(options) {
		this.options = $.extend(
			this.options,
			options
		);
		
		// Setup probabilities. Sum must equal 1.
		World.TILE_PROBS[World.TILE.FOREST] = 0.15;
		World.TILE_PROBS[World.TILE.FIELD] = 0.35;
		World.TILE_PROBS[World.TILE.BARRENS] = 0.5;
		
		// Setpiece definitions
		World.LANDMARKS[World.TILE.OUTPOST] = { num: 0, minRadius: 0, maxRadius: 0, scene: 'outpost', label: 'An&nbsp;Outpost' };
		World.LANDMARKS[World.TILE.IRON_MINE] = { num: 1, minRadius: 5, maxRadius: 5, scene: 'ironmine', label: 'Iron&nbsp;Mine' };
		World.LANDMARKS[World.TILE.COAL_MINE] = { num: 1, minRadius: 10, maxRadius: 10, scene: 'coalmine', label: 'Coal&nbsp;Mine' };
		World.LANDMARKS[World.TILE.SULPHUR_MINE] = { num: 1, minRadius: 20, maxRadius: 20, scene: 'sulphurmine', label: 'Sulphur&nbsp;Mine' };
		World.LANDMARKS[World.TILE.HOUSE] = { num: 10, minRadius: 0, maxRadius: World.RADIUS * 1.5, scene: 'house', label: 'An&nbsp;Old&nbsp;House' };
		World.LANDMARKS[World.TILE.CAVE] = { num: 5, minRadius: 3, maxRadius: 10, scene: 'cave', label: 'A&nbsp;Damp&nbsp;Cave' };
		World.LANDMARKS[World.TILE.TOWN] = { num: 10, minRadius: 10, maxRadius: 20, scene: 'town', label: 'An&nbsp;Abandoned&nbsp;Town' };
		World.LANDMARKS[World.TILE.CITY] = { num: 20, minRadius: 20, maxRadius: World.RADIUS * 1.5, scene: 'city', label: 'A&nbsp;Ruined&nbsp;City' };
		World.LANDMARKS[World.TILE.SHIP] = {num: 1, minRadius: 28, maxRadius: 28, scene: 'ship', label: 'A&nbsp;Crashed&nbsp;Starship'};
		World.LANDMARKS[World.TILE.BOREHOLE] = {num: 10, minRadius: 15, maxRadius: World.RADIUS * 1.5, scene: 'borehole', label: 'A&nbsp;Borehole'};
		World.LANDMARKS[World.TILE.BATTLEFIELD] = {num: 5, minRadius: 18, maxRadius: World.RADIUS * 1.5, scene: 'battlefield', label: 'A&nbsp;Battlefield'};
		World.LANDMARKS[World.TILE.SWAMP] = {num: 1, minRadius: 15, maxRadius: World.RADIUS * 1.5, scene: 'swamp', label: 'A&nbsp;Murky&nbsp;Swamp'};
		
		if(typeof State.world == 'undefined') {
			State.world = {
				map: World.generateMap(),
				mask: World.newMask()
			};
		}
		
		// Create the World panel
		this.panel = $('<div>').attr('id', "worldPanel").addClass('location').appendTo('#outerSlider');
		
		// Create the shrink wrapper
		var outer = $('<div>').attr('id', 'worldOuter').appendTo(this.panel);
		
		// Create the bag panel
		$('<div>').attr('id', 'bagspace-world').append($('<div>')).appendTo(outer);
		$('<div>').attr('id', 'backpackTitle').appendTo(outer);
		$('<div>').attr('id', 'backpackSpace').appendTo(outer);
		$('<div>').attr('id', 'healthCounter').appendTo(outer);
		
		Engine.updateOuterSlider();
	},
	
	clearDungeon: function() {
		Engine.event('progress', 'dungeon cleared');
		World.state.map[World.curPos[0]][World.curPos[1]] = World.TILE.OUTPOST;
		World.drawRoad();
	},
	
	drawRoad: function() {
		var xDist = World.curPos[0] - World.RADIUS;
		var yDist = World.curPos[1] - World.RADIUS;
		var xDir = Math.abs(xDist)/xDist;
		var yDir = Math.abs(yDist)/yDist;
		var xIntersect, yIntersect;
		if(Math.abs(xDist) > Math.abs(yDist)) {
			xIntersect = World.RADIUS;
			yIntersect = World.RADIUS + yDist;
		} else {
			xIntersect = World.RADIUS + xDist;
			yIntersect = World.RADIUS;
		}
		
		for(var x = 0; x < Math.abs(xDist); x++) {
			if(World.isTerrain(World.state.map[World.RADIUS + (xDir*x)][yIntersect])) {
				World.state.map[World.RADIUS + (xDir*x)][yIntersect] = World.TILE.ROAD;
			}
		}
		for(var y = 0; y < Math.abs(yDist); y++) {
			if(World.isTerrain(World.state.map[xIntersect][World.RADIUS + (yDir*y)])) {
				World.state.map[xIntersect][World.RADIUS + (yDir*y)] = World.TILE.ROAD;
			}
		}
		World.drawMap();
	},
	
	updateSupplies: function() {
		var supplies = $('div#bagspace-world > div');
		
		if(!Path.outfit) {
			Path.outfit = {};
		}
		
		// Add water
		var water = $('div#supply_water');
		if(World.water > 0 && water.length == 0) {
			water = World.createItemDiv('water', World.water);
			water.prependTo(supplies);
		} else if(World.water > 0) {
			$('div#supply_water', supplies).text('water:' + World.water);
		} else {
			water.remove();
		}
		
		var total = 0;
		for(var k in Path.outfit) {
			var item = $('div#supply_' + k.replace(' ', '-'), supplies);
			var num = Path.outfit[k];
			total += num * Path.getWeight(k);
			if(num > 0 && item.length == 0) {
				item = World.createItemDiv(k, num);
				if(k == 'cured meat' && World.water > 0) {
					item.insertAfter(water);
				} else if(k == 'cured meat') {
					item.prependTo(supplies);
				} else {
					item.appendTo(supplies);
				}
			} else if(num > 0) {
				$('div#' + item.attr('id'), supplies).text(k + ':' + num);
			} else {
				item.remove();
			}
		}
		
		// Update label
		var t = 'pockets';
		if(Engine.getStore('rucksack') > 0) {
			t = 'rucksack';
		}
		$('#backpackTitle').text(t);
		
		// Update bagspace
		$('#backpackSpace').text('free ' + Math.floor(Path.getCapacity() - total) + '/' + Path.getCapacity());
	},
	
	setWater: function(w) {
		World.water = w;
		if(World.water > World.getMaxWater()) {
			World.water = World.getMaxWater();
		}
		World.updateSupplies();
	},
	
	setHp: function(hp) {
		if(typeof hp == 'number' && !isNaN(hp)) {
			World.health = hp;
			if(World.health > World.getMaxHealth()) {
				World.health = World.getMaxHealth();
			}
			$('#healthCounter').text('hp: ' + World.health + '/' + World.getMaxHealth());
		}
	},
	
	createItemDiv: function(name, num) {
		var div = $('<div>').attr('id', 'supply_' + name.replace(' ', '-'))
			.addClass('supplyItem')
			.text(name + ':' + num);
		
		return div;
	},
	
	keyDown: function(event) {
		var moved = true;
		var oldTile = World.state.map[World.curPos[0]][World.curPos[1]];
		switch(event.which) {
			case 38: // Up
			case 87:
				Engine.log('up');
				if(World.curPos[1] > 0) World.curPos[1]--;
				break;
			case 40: // Down
			case 83:
				Engine.log('down');
				if(World.curPos[1] < World.RADIUS * 2) World.curPos[1]++;
				break;
			case 37: // Left
			case 65:
				Engine.log('left');
				if(World.curPos[0] > 0) World.curPos[0]--;
				break;
			case 39: // Right
			case 68:
				Engine.log('right');
				if(World.curPos[0] < World.RADIUS * 2) World.curPos[0]++;
				break;
			default:
				moved = false;
				break;
		}
		if(moved) {
			World.narrateMove(oldTile, World.state.map[World.curPos[0]][World.curPos[1]]);
			World.lightMap(World.curPos[0], World.curPos[1], World.state.mask);
			World.drawMap();
			World.doSpace();
			if(World.checkDanger()) {
				if(World.danger) {
					Notifications.notify(World, 'dangerous to be this far from the village without proper protection')
				} else {
					Notifications.notify(World, 'safer here');
				}
			}
		}
	},
	
	checkDanger: function() {
		World.danger = typeof World.danger == 'undefined' ? false: World.danger;
		if(!World.danger) {
			if(!Engine.getStore('i armour') > 0 && World.getDistance() >= 8) {
				World.danger = true;
				return true;
			} 
			if(!Engine.getStore('s armour') > 0 && World.getDistance() >= 18) {
				World.danger = true;
				return true;
			}
		} else {
			if(World.getDistance() < 8) {
				World.danger = false;
				return true;
			}
			if(World.getDistance < 18 && Engine.getStore('i armour') > 0) {
				World.danger = false;
				return true;
			}
		}
		return false;
	},
	
	useSupplies: function() {
		World.foodMove++;
		World.waterMove++;
		// Food
		var movesPerFood = World.MOVES_PER_FOOD;
		movesPerFood *= Engine.hasPerk('slow metabolism') ? 2 : 1;
		if(World.foodMove >= movesPerFood) {
			World.foodMove = 0;
			var num = Path.outfit['cured meat'];
			num--;
			if(num == 0) {
				Notifications.notify(World, 'the meat has run out');
			} else if(num < 0) {
				// Starvation! Hooray!
				num = 0;
				if(!World.starvation) {
					Notifications.notify(World, 'starvation sets in')
					World.starvation = true;
				} else {
					State.starved = State.starved ? State.starved : 0;
					State.starved++;
					if(State.starved >= 10 && !Engine.hasPerk('slow metabolism')) {
						Engine.addPerk('slow metabolism');
					}
					World.die();
					return false;
				}
			} else {
				World.starvation = false;
				World.setHp(World.health + World.meatHeal());
			}
			Path.outfit['cured meat'] = num;
		}
		// Water
		var movesPerWater = World.MOVES_PER_WATER;
		movesPerWater *= Engine.hasPerk('desert rat') ? 2 : 1;
		if(World.waterMove >= movesPerWater) {
			World.waterMove = 0;
			var water = World.water;
			water--;
			if(water == 0) {
				Notifications.notify(World, 'there is no more water');
			} else if(water < 0) {
				water = 0;
				if(!World.thirst) {
					Notifications.notify(World, 'the thirst becomes unbearable');
					World.thirst = true;
				} else {
					State.dehydrated = State.dehydrated ? State.dehydrated : 0;
					State.dehydrated++;
					if(State.dehydrated >= 10 && !Engine.hasPerk('desert rat')) {
						Engine.addPerk('desert rat');
					}
					World.die();
					return false;
				}
			} else {
				World.thirst = false;
			}
			World.setWater(water);
			World.updateSupplies();
		}
		return true;
	},
	
	meatHeal: function() {
		return World.MEAT_HEAL * (Engine.hasPerk('gastronome') ? 2 : 1);
	},
	
	checkFight: function() {
		World.fightMove = typeof World.fightMove == 'number' ? World.fightMove : 0;
		World.fightMove++;
		if(World.fightMove > World.FIGHT_DELAY) {
			var chance = World.FIGHT_CHANCE;
			chance *= Engine.hasPerk('stealthy') ? 0.5 : 1;
			if(Math.random() < chance) {
				World.fightMove = 0;
				Events.triggerFight();
			}
		}
	},
	
	doSpace: function() {
		var curTile = World.state.map[World.curPos[0]][World.curPos[1]];

		if(curTile == World.TILE.VILLAGE) {
			World.goHome();
		} else if(typeof World.LANDMARKS[curTile] != 'undefined') {
			if(curTile != World.TILE.OUTPOST || !World.outpostUsed()) {
				Events.startEvent(Events.Setpieces[World.LANDMARKS[curTile].scene]);
			}
		} else {
			if(World.useSupplies()) {
				World.checkFight();
			}
		}
	},
	
	getDistance: function(from, to) {
		from = from || World.curPos;
		to = to || World.VILLAGE_POS;
		return Math.abs(from[0] - to[0]) + Math.abs(from[1] - to[1]);
	},
	
	getTerrain: function() {
		return World.state.map[World.curPos[0]][World.curPos[1]];
	},
	
	narrateMove: function(oldTile, newTile) {
		var msg = null;
		switch(oldTile) {
			case World.TILE.FOREST:
				switch(newTile) {
					case World.TILE.FIELD:
						msg = "the trees yield to dry grass. the yellowed brush rustles in the wind.";
						break;
					case World.TILE.BARRENS:
						msg = "the trees are gone. parched earth and blowing dust are poor replacements.";
						break;
				}
				break;
			case World.TILE.FIELD:
				switch(newTile) {
					case World.TILE.FOREST:
						msg = "trees loom on the horizon. grasses gradually yield to a forest floor of dry branches and fallen leaves.";
						break;
					case World.TILE.BARRENS:
						msg = "the grasses thin. soon, only dust remains.";
						break;
				}
				break;
			case World.TILE.BARRENS:
				switch(newTile) {
					case World.TILE.FIELD:
						msg = "the barrens break at a sea of dying grass, swaying in the arid breeze.";
						break;
					case World.TILE.FOREST:
						msg = "a wall of gnarled trees rises from the dust. their branches twist into a skeletal canopy overhead.";
						break;
				}
				break;
		}
		if(msg != null) {
			Notifications.notify(World, msg);
		}
	},
	
	newMask: function() {
		var mask = new Array(World.RADIUS * 2 + 1);
		for(var i = 0; i <= World.RADIUS * 2; i++) {
			mask[i] = new Array(World.RADIUS * 2 + 1);
		}
		World.lightMap(World.RADIUS, World.RADIUS, mask);
		return mask;
	},
	
	lightMap: function(x, y, mask) {
		var r = World.LIGHT_RADIUS;
		r *= Engine.hasPerk('scout') ? 2 : 1;
		World.uncoverMap(x, y, r, mask);
		return mask;
	},
	
	uncoverMap: function(x, y, r, mask) {
		mask[x][y] = true;
		for(var i = -r; i <= r; i++) {
			for(var j = -r + Math.abs(i); j <= r - Math.abs(i); j++) {
				if(y + j >= 0 && y + j <= World.RADIUS * 2 && 
						x + i <= World.RADIUS * 2 && 
						x + i >= 0) {
					mask[x+i][y+j] = true;
				}
			}
		}
	},
	
	applyMap: function() {
		var x = Math.floor(Math.random() * (World.RADIUS * 2) + 1);
		var y = Math.floor(Math.random() * (World.RADIUS * 2) + 1);
		World.uncoverMap(x, y, 5, State.world.mask);
	},
	
	generateMap: function() {
		var map = new Array(World.RADIUS * 2 + 1);
		for(var i = 0; i <= World.RADIUS * 2; i++) {
			map[i] = new Array(World.RADIUS * 2 + 1);
		}
		// The Village is always at the exact center
		// Spiral out from there
		map[World.RADIUS][World.RADIUS] = World.TILE.VILLAGE;
		for(var r = 1; r <= World.RADIUS; r++) {
			for(t = 0; t < r * 8; t++) {
				var x, y;
				if(t < 2 * r) {
					x = World.RADIUS - r + t;
					y = World.RADIUS - r;
				} else if(t < 4 * r) {
					x = World.RADIUS + r;
					y = World.RADIUS - (3 * r) + t;
				} else if(t < 6 * r) {
					x = World.RADIUS + (5 * r) - t;
					y = World.RADIUS + r;
				} else {
					x = World.RADIUS - r;
					y = World.RADIUS + (7 * r) - t;
				}
				
				map[x][y] = World.chooseTile(x, y, map);
			}
		}
		
		// Place landmarks
		for(var k in World.LANDMARKS) {
			var landmark = World.LANDMARKS[k];
			for(var i = 0; i < landmark.num; i++) {
				var pos = World.placeLandmark(landmark.minRadius, landmark.maxRadius, k, map);
				if(k == World.TILE.SHIP) {
					var dx = pos[0] - World.RADIUS, dy = pos[1] - World.RADIUS;
					var horz = dx < 0 ? 'west' : 'east';
					var vert = dy < 0 ? 'north' : 'south';
					if(Math.abs(dx) / 2 > Math.abs(dy)) {
						World.dir = horz;
					} else if(Math.abs(dy) / 2 > Math.abs(dx)){
						World.dir = vert;
					} else {
						World.dir = vert + horz;
					}
				}
			}
		}
		
		return map;
	},
	
	placeLandmark: function(minRadius, maxRadius, landmark, map) {
	
		var x = World.RADIUS, y = World.RADIUS;
		while(!World.isTerrain(map[x][y])) {
			var r = Math.floor(Math.random() * (maxRadius - minRadius)) + minRadius;
			var xDist = Math.floor(Math.random() * r);
			var yDist = r - xDist;
			if(Math.random() < 0.5) xDist = -xDist;
			if(Math.random() < 0.5) yDist = -yDist;
			x = World.RADIUS + xDist;
			if(x < 0) x = 0;
			if(x > World.RADIUS * 2) x = World.RADIUS * 2;
			y = World.RADIUS + yDist;
			if(y < 0) y = 0;
			if(y > World.RADIUS * 2) y = World.RADIUS * 2;
		}
		map[x][y] = landmark;
		return [x, y];
	},
	
	isTerrain: function(tile) {
		return tile == World.TILE.FOREST || tile == World.TILE.FIELD || tile == World.TILE.BARRENS;
	},
	
	chooseTile: function(x, y, map) {
		
		var log = x == World.RADIUS + 1 && y == World.RADIUS + 1;
		
		var adjacent = [
			y > 0 ? map[x][y-1] : null,
			y < World.RADIUS * 2 ? map[x][y+1] : null,
			x < World.RADIUS * 2 ? map[x+1][y] : null,
			x > 0 ? map[x-1][y] : null
		];
		
		var chances = {};
		var nonSticky = 1;
		for(var i in adjacent) {
			if(adjacent[i] == World.TILE.VILLAGE) {
				// Village must be in a forest to maintain thematic consistency, yo.
				return World.TILE.FOREST;
			} else if(typeof adjacent[i] == 'string') {
				var cur = chances[adjacent[i]];
				cur = typeof cur == 'number' ? cur : 0;
				chances[adjacent[i]] = cur + World.STICKINESS;
				nonSticky -= World.STICKINESS;
			}
		}
		for(var t in World.TILE) {
			var tile = World.TILE[t];
			if(World.isTerrain(tile)) {
				var cur = chances[tile];
				cur = typeof cur == 'number' ? cur : 0;
				cur += World.TILE_PROBS[tile] * nonSticky;
				chances[tile] = cur;
			}
		}
		
		var list = [];
		for(var t in chances) {
			list.push(chances[t] + '' + t);
		}
		list.sort(function(a, b) {
			var n1 = parseFloat(a.substring(0, a.length - 1));
			var n2 = parseFloat(b.substring(0, b.length - 1));
			return n2 - n1;
		});
		
		var c = 0;
		var r = Math.random();
		for(var i in list) {
			var prob = list[i];
			c += parseFloat(prob.substring(0,prob.length - 1));
			if(r < c) {
				return prob.charAt(prob.length - 1);
			}
		}
		
		return World.TILE.BARRENS;
	},
	
	markVisited: function(x, y) {
		World.state.map[x][y] = World.state.map[x][y] + '!';
	},
	
	drawMap: function() {
		var map = $('#map');
		if(map.length == 0) {
			map = new $('<div>').attr('id', 'map').appendTo('#worldOuter');
		}
		var mapString = "";
		for(var j = 0; j <= World.RADIUS * 2; j++) {
			for(var i = 0; i <= World.RADIUS * 2; i++) {
				var ttClass = "";
				if(i > World.RADIUS) {
					ttClass += " left";
				} else {
					ttClass += " right";
				}
				if(j > World.RADIUS) {
					ttClass += " top";
				} else {
					ttClass += " bottom";
				}
				if(World.curPos[0] == i && World.curPos[1] == j) {
					mapString += '<span class="landmark">@<div class="tooltip ' + ttClass + '">Wanderer</div></span>';
				} else if(World.state.mask[i][j]) {
					var c = World.state.map[i][j];
					switch(c) {
						case World.TILE.VILLAGE:
							mapString += '<span class="landmark">' + c + '<div class="tooltip' + ttClass + '">The&nbsp;Village</div></span>';
							break;
						default:
							if(typeof World.LANDMARKS[c] != 'undefined' && (c != World.TILE.OUTPOST || !World.outpostUsed(i, j))) {
								mapString += '<span class="landmark">' + c + '<div class="tooltip' + ttClass + '">' + World.LANDMARKS[c].label + '</div></span>';
							} else {
								if(c.length > 1) {
									c = c[0];
								}
								mapString += c;
							}
							break;
					}
				} else {
					mapString += '&nbsp;';
				}
			}
			mapString += '<br/>';
		}
		map.html(mapString);
	},
	
	die: function() {
		if(!World.dead) {
			World.dead = true;
			Engine.log('player death');
			Engine.event('game event', 'death');
			Engine.keyLock = true;
			// Dead! Discard any world changes and go home
			Notifications.notify(World, 'the world fades');
			World.state = null;
			Path.outfit = {};
			$('#outerSlider').animate({opacity: '0'}, 600, 'linear', function() {
				$('#outerSlider').css('left', '0px');
				$('#locationSlider').css('left', '0px');
				Engine.activeModule = Room;
				$('div.headerButton').removeClass('selected');
				Room.tab.addClass('selected');
				setTimeout(function(){ 
					Room.onArrival(); 
					$('#outerSlider').animate({opacity:'1'}, 600, 'linear');
					Button.cooldown($('#embarkButton'));
					Engine.keyLock = false;
				}, 2000);
			});
		}
	},
	
	goHome: function() {
		// Home safe! Commit the changes.
		State.world = World.state;
		if(World.state.sulphurmine && Outside.numBuilding('sulphur mine') == 0) {
			Outside.addBuilding('sulphur mine', 1);
			Engine.event('progress', 'sulphur mine');
		}
		if(World.state.ironmine && Outside.numBuilding('iron mine') == 0) {
			Outside.addBuilding('iron mine', 1);
			Engine.event('progress', 'iron mine');
		}
		if(World.state.coalmine && Outside.numBuilding('coal mine') == 0) {
			Outside.addBuilding('coal mine', 1);
			Engine.event('progress', 'coal mine');
		}
		if(World.state.ship && !State.ship) {
			Ship.init();
			Engine.event('progress', 'ship');
		}
		World.state = null;
		
		// Clear the embark cooldown
		var btn = Button.clearCooldown($('#embarkButton'));
		if(Path.outfit['cured meat'] > 0) {
			Button.setDisabled(btn, false);
		}
		
		for(var k in Path.outfit) {
			Engine.addStore(k, Path.outfit[k]);
			if(World.leaveItAtHome(k)) {
				Path.outfit[k] = 0;
			}
		}
		
		$('#outerSlider').animate({left: '0px'}, 300);
		Engine.activeModule = Path;
		Path.onArrival();
	},
	
	leaveItAtHome: function(thing) {
		 return thing != 'cured meat' && thing != 'bullets' && thing != 'energy cell'  && thing != 'charm'
			 && typeof World.Weapons[thing] == 'undefined' && typeof Room.Craftables[thing] == 'undefined';
	},
	
	getMaxHealth: function() {
		if(Engine.getStore('s armour') > 0) {
			return World.BASE_HEALTH + 35;
		} else if(Engine.getStore('i armour') > 0) {
			return World.BASE_HEALTH + 15;
		} else if(Engine.getStore('l armour') > 0) {
			return World.BASE_HEALTH + 5;
		}
		return World.BASE_HEALTH;
	},
	
	getHitChance: function() {
		if(Engine.hasPerk('precise')) {
			return World.BASE_HIT_CHANCE + 0.1;
		}
		return World.BASE_HIT_CHANCE;
	},
	
	getMaxWater: function() {
		if(Engine.getStore('water tank') > 0) {
			return World.BASE_WATER + 50;
		} else if(Engine.getStore('cask') > 0) {
			return World.BASE_WATER + 20;
		} else if(Engine.getStore('waterskin') > 0) {
			return World.BASE_WATER + 10;
		}
		return World.BASE_WATER;
	},
	
	outpostUsed: function(x, y) {
		x = typeof x == 'number' ? x : World.curPos[0];
		y = typeof y == 'number' ? y : World.curPos[1];
		var used = World.usedOutposts[x + ',' + y];
		return typeof used != 'undefined' && used == true;
	},
	
	useOutpost: function() {
		Notifications.notify(null, 'water replenished');
		World.setWater(World.getMaxWater());
		// Save progress at outposts
		State.world = World.state;
		// Mark this outpost as used
		World.usedOutposts[World.curPos[0] + ',' + World.curPos[1]] = true;
	},
	
	onArrival: function() {
		Engine.keyLock = false;
		// Explore in a temporary world-state. We'll commit the changes if you return home safe.
		World.state = $.extend(true, {}, State.world);
		World.setWater(World.getMaxWater());
		World.setHp(World.getMaxHealth());
		World.foodMove = 0;
		World.waterMove = 0;
		World.starvation = false;
		World.thirst = false;
		World.usedOutposts = {};
		World.curPos = World.copyPos(World.VILLAGE_POS);
		World.drawMap();
		World.setTitle();
		World.dead = false;
		$('div#bagspace-world > div').empty();
		World.updateSupplies();
		$('#bagspace-world').width($('#map').width());
	},
	
	setTitle: function() {
		document.title = 'A Barren World';
	},
	
	copyPos: function(pos) {
		return [pos[0], pos[1]];
	}
};