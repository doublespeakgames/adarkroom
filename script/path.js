var Path = {
		
	DEFAULT_BAG_SPACE: 10,
	
	// Everything not in this list weighs 1
	Weight: {
		'спис': 2,
		'меч': 3,
		'шабля': 5,
		'рушниця': 5,
		'набої': 0.1,
		'батарейки': 0.2,
		'лазерна гвинтівка': 5,
		'болас': 0.5
	},
		
	name: 'Path',
	options: {}, // Nuthin'
	init: function(options) {
		this.options = $.extend(
			this.options,
			options
		);
		
		// Init the World
		World.init();
		
		// Create the path tab
		this.tab = Header.addLocation("Пустир", "path", Path);
		
		// Create the Path panel
		this.panel = $('<div>').attr('id', "pathPanel")
			.addClass('location')
			.appendTo('div#locationSlider');
		
		// Add the outfitting area
		var outfitting = $('<div>').attr('id', 'outfitting').appendTo(this.panel);
		var bagspace = $('<div>').attr('id', 'bagspace').appendTo(outfitting);
		
		// Add the embark button
		new Button.Button({
			id: 'embarkButton',
			text: "у подорож",
			click: Path.embark,
			width: '80px',
			cooldown: World.DEATH_COOLDOWN
		}).appendTo(this.panel);
		
		Path.outfit = {};
		
		Engine.updateSlider();
	},
	
	getWeight: function(thing) {
		var w = Path.Weight[thing];
		if(typeof w != 'number') w = 1;
		
		return w;
	},
	
	getCapacity: function() {
		if(Engine.getStore('колона') > 0) {
			return Path.DEFAULT_BAG_SPACE + 60;
		} else if(Engine.getStore('підвода') > 0) {
			return Path.DEFAULT_BAG_SPACE + 30;
		} else if(Engine.getStore('рюкзак') > 0) {
			return Path.DEFAULT_BAG_SPACE + 10;
		}
		return Path.DEFAULT_BAG_SPACE;
	},
	
	getFreeSpace: function() {
		var num = 0;
		if(Path.outfit) {
			for(var k in Path.outfit) {
				var n = Path.outfit[k];
				if(isNaN(n)) {
					// No idea how this happens, but I will fix it here!
					Path.outfit[k] = n = 0;
				}
				num += n * Path.getWeight(k);
			}
		}
		return Path.getCapacity() - num;
	},
	
	updatePerks: function() {
		if(State.perks) {
			var perks = $('#perks');
			var needsAppend = false;
			if(perks.length == 0) {
				needsAppend = true;
				perks = $('<div>').attr('id', 'perks');
			}
			for(var k in State.perks) {
				var id = 'perk_' + k.replace(/ /g, '-');
				var r = $('#' + id);
				if(State.perks[k] && r.length == 0) {
					r = $('<div>').attr('id', id).addClass('perkRow').appendTo(perks);
					$('<div>').addClass('row_key').text(k).appendTo(r);
					$('<div>').addClass('tooltip bottom right').text(Engine.Perks[k].desc).appendTo(r);
				}
			}
			
			if(needsAppend && perks.children().length > 0) {
				perks.appendTo(Path.panel);
			}
		}
	},
	
	updateOutfitting: function() {
		var outfit = $('div#outfitting');
		
		if(!Path.outfit) {
			Path.outfit = {};
		}
		
		// Add the armour row
		var armour = "нічого";
		if(Engine.getStore('кольчуга') > 0)
			armour = "сталь";
		else if(Engine.getStore('лати') > 0)
			armour = "залізо";
		else if(Engine.getStore('жупан') > 0)
			armour = "шкіра";
		var aRow = $('#armourRow');
		if(aRow.length == 0) {
			aRow = $('<div>').attr('id', 'armourRow').addClass('outfitRow').prependTo(outfit);
			$('<div>').addClass('row_key').text('броня').appendTo(aRow);
			$('<div>').addClass('row_val').text(armour).appendTo(aRow);
			$('<div>').addClass('clear').appendTo(aRow);
		} else {
			$('.row_val', aRow).text(armour);
		}
		
		// Add the water row
		var wRow = $('#waterRow');
		if(wRow.length == 0) {
			wRow = $('<div>').attr('id', 'waterRow').addClass('outfitRow').insertAfter(aRow);
			$('<div>').addClass('row_key').text('вода').appendTo(wRow);
			$('<div>').addClass('row_val').text(World.getMaxWater()).appendTo(wRow);
			$('<div>').addClass('clear').appendTo(wRow);
		} else {
			$('.row_val', wRow).text(World.getMaxWater());
		}
		
		
		var space = Path.getFreeSpace();
		var total = 0;
		// Add the non-craftables to the craftables
		var carryable = $.extend({
			'копченина': { type: 'tool' },
			'набої': { type: 'tool' },
			'гранати': {type: 'weapon' },
			'болас': {type: 'weapon' },
			'лазерна гвинтівка': {type: 'weapon' },
			'батарейки': {type: 'tool' },
			'штик': {type: 'weapon' },
			'буси': {type: 'tool'}
		}, Room.Craftables);
		
		for(var k in carryable) {
			var store = carryable[k];
			var have = State.stores[k];
			var num = Path.outfit[k];
			num = typeof num == 'number' ? num : 0;
			var numAvailable = Engine.getStore(k);
			var row = $('div#outfit_row_' + k.replace(/ /g, '-'), outfit);
			if((store.type == 'tool' || store.type == 'weapon') && have > 0) {
				total += num * Path.getWeight(k);
				if(row.length == 0) {
					row = Path.createOutfittingRow(k, num);
					
					var curPrev = null;
					outfit.children().each(function(i) {
						var child = $(this);
						if(child.attr('id').indexOf('outfit_row_') == 0) {
							var cName = child.attr('id').substring(11).replace(/-/g, ' ');
							if(cName < k && (curPrev == null || cName > curPrev)) {
								curPrev = cName;
							}
						}
					});
					if(curPrev == null) {
						row.insertAfter(wRow);
					} 
					else 
					{
						row.insertAfter(outfit.find('#outfit_row_' + curPrev.replace(/ /g, '-')));
					}
				} else {
					$('div#' + row.attr('id') + ' > div.row_val > span', outfit).text(num);
					$('div#' + row.attr('id') + ' .tooltip .numAvailable', outfit).text(numAvailable - num);
				}
				if(num == 0) {
					$('.dnBtn', row).addClass('disabled');
				} else {
					$('.dnBtn', row).removeClass('disabled');
				}
				if(num >= numAvailable || space < Path.getWeight(k)) {
					$('.upBtn', row).addClass('disabled');
				} else if(space >= Path.getWeight(k)) {
					$('.upBtn', row).removeClass('disabled');
				}
			} else if(have == 0 && row.length > 0) {
				row.remove();
			}
		}
		
		// Update bagspace
		$('#bagspace').text('вільно ' + Math.floor(Path.getCapacity() - total) + '/' + Path.getCapacity());
		
		if(Path.outfit['копченина'] > 0) {
			Button.setDisabled($('#embarkButton'), false);
		} else {
			Button.setDisabled($('#embarkButton'), true);
		}
	},
	
	createOutfittingRow: function(name, num) {
		var row = $('<div>').attr('id', 'outfit_row_' + name.replace(/ /g, '-')).addClass('outfitRow');
		$('<div>').addClass('row_key').text(name).appendTo(row);
		var val = $('<div>').addClass('row_val').appendTo(row);
		
		$('<span>').text(num).appendTo(val);
		$('<div>').addClass('upBtn').appendTo(val).click(Path.increaseSupply);
		$('<div>').addClass('dnBtn').appendTo(val).click(Path.decreaseSupply);
		$('<div>').addClass('clear').appendTo(row);
		
		var numAvailable = Engine.getStore(name);
		var tt = $('<div>').addClass('tooltip bottom right').appendTo(row);
		$('<div>').addClass('row_key').text('вага').appendTo(tt);
		$('<div>').addClass('row_val').text(Path.getWeight(name)).appendTo(tt);
		$('<div>').addClass('row_key').text('доступно').appendTo(tt);
		$('<div>').addClass('row_val').addClass('numAvailable').text(numAvailable).appendTo(tt);
		
		return row;
	},
	
	increaseSupply: function() {
		var supply = $(this).closest('.outfitRow').children('.row_key').text().replace(/-/g, ' ');
		Engine.log('increasing ' + supply);
		var cur = Path.outfit[supply];
		cur = typeof cur == 'number' ? cur : 0;
		if(Path.getFreeSpace() >= Path.getWeight(supply) && cur < Engine.getStore(supply)) {
			Path.outfit[supply] = cur + 1;
			Path.updateOutfitting();
		}
	},
	
	decreaseSupply: function() {
		var supply = $(this).closest('.outfitRow').children('.row_key').text().replace(/-/g, ' ');
		Engine.log('decreasing ' + supply);
		var cur = Path.outfit[supply];
		cur = typeof cur == 'number' ? cur : 0;
		if(cur > 0) {
			Path.outfit[supply] = cur - 1;
			Path.updateOutfitting();
		}
	},
	
	onArrival: function() {
		Path.setTitle();
		Path.updateOutfitting();
		Path.updatePerks();
	},
	
	setTitle: function() {
		document.title = 'A Dusty Path';
	},
	
	embark: function() {
		for(var k in Path.outfit) {
			Engine.addStore(k, -Path.outfit[k]);
		}
		World.onArrival();
		$('#outerSlider').animate({left: '-700px'}, 300);
		Engine.activeModule = World;
	}
}