/**
 * Module that registers the starship!
 */
var Ship = {
	LIFTOFF_COOLDOWN: 120,
	ALLOY_PER_HULL: 1,
	ALLOY_PER_THRUSTER: 1,
	BASE_HULL: 0,
	BASE_THRUSTERS: 1,
	name: _("Ship"),
	init: function(options) {
		this.options = $.extend(
			this.options,
			options
		);
		
		if(!$SM.get('features.location.spaceShip')) {
			$SM.set('features.location.spaceShip', true);
			$SM.setM('game.spaceShip', {
				hull: Ship.BASE_HULL,
				thrusters: Ship.BASE_THRUSTERS
			});
		}
		
		// Create the Ship tab
		this.tab = Header.addLocation(_("An Old Starship"), "ship", Ship);
		
		// Create the Ship panel
		this.panel = $('<div>').attr('id', "shipPanel")
			.addClass('location')
			.appendTo('div#locationSlider');
		
		Engine.updateSlider();
		
		// Draw the hull label
		var hullRow = $('<div>').attr('id', 'hullRow').appendTo('div#shipPanel');
		$('<div>').addClass('row_key').text(_('hull:')).appendTo(hullRow);
		$('<div>').addClass('row_val').text($SM.get('game.spaceShip.hull')).appendTo(hullRow);
		$('<div>').addClass('clear').appendTo(hullRow);
		
		// Draw the thrusters label
		var engineRow = $('<div>').attr('id', 'engineRow').appendTo('div#shipPanel');
		$('<div>').addClass('row_key').text(_('engine:')).appendTo(engineRow);
		$('<div>').addClass('row_val').text($SM.get('game.spaceShip.thrusters')).appendTo(engineRow);
		$('<div>').addClass('clear').appendTo(engineRow);
		
		// Draw the reinforce button
		new Button.Button({
			id: 'reinforceButton',
			text: _('reinforce hull'),
			click: Ship.reinforceHull,
			width: '100px',
			cost: {'alien alloy': Ship.ALLOY_PER_HULL}
		}).appendTo('div#shipPanel');
		
		// Draw the engine button
		new Button.Button({
			id: 'engineButton',
			text: _('upgrade engine'),
			click: Ship.upgradeEngine,
			width: '100px',
			cost: {'alien alloy': Ship.ALLOY_PER_THRUSTER}
		}).appendTo('div#shipPanel');
		
		// Draw the lift off button
		var b = new Button.Button({
			id: 'liftoffButton',
			text: _('lift off'),
			click: Ship.checkLiftOff,
			width: '100px',
			cooldown: Ship.LIFTOFF_COOLDOWN
		}).appendTo('div#shipPanel');
		
		if($SM.get('game.spaceShip.hull') <= 0) {
			Button.setDisabled(b, true);
		}
		
		// Init Space
		Space.init();
		
		//subscribe to stateUpdates
		$.Dispatch('stateUpdate').subscribe(Ship.handleStateUpdates);
	},
	
	options: {}, // Nothing for now
	
	onArrival: function(transition_diff) {
		Ship.setTitle();
		if(!$SM.get('game.spaceShip.seenShip')) {
			Notifications.notify(Ship, _('somewhere above the debris cloud, the wanderer fleet hovers. been on this rock too long.'));
			$SM.set('game.spaceShip.seenShip', true);
		}
		AudioEngine.playBackgroundMusic(AudioLibrary.MUSIC_SHIP);

		Engine.moveStoresView(null, transition_diff);
	},
	
	setTitle: function() {
		if(Engine.activeModule == this) {
			document.title = _("An Old Starship");
		}
	},
	
	reinforceHull: function() {
		if($SM.get('stores["alien alloy"]', true) < Ship.ALLOY_PER_HULL) {
			Notifications.notify(Ship, _("not enough alien alloy"));
			return false;
		}
		$SM.add('stores["alien alloy"]', -Ship.ALLOY_PER_HULL);
		$SM.add('game.spaceShip.hull', 1);
		if($SM.get('game.spaceShip.hull') > 0) {
			Button.setDisabled($('#liftoffButton', Ship.panel), false);
		}
		$('#hullRow .row_val', Ship.panel).text($SM.get('game.spaceShip.hull'));
		AudioEngine.playSound(AudioLibrary.REINFORCE_HULL);
	},
	
	upgradeEngine: function() {
		if($SM.get('stores["alien alloy"]', true) < Ship.ALLOY_PER_THRUSTER) {
			Notifications.notify(Ship, _("not enough alien alloy"));
			return false;
		}
		$SM.add('stores["alien alloy"]', -Ship.ALLOY_PER_THRUSTER);
		$SM.add('game.spaceShip.thrusters', 1);
		$('#engineRow .row_val', Ship.panel).text($SM.get('game.spaceShip.thrusters'));
		AudioEngine.playSound(AudioLibrary.UPGRADE_ENGINE);
	},
	
	getMaxHull: function() {
		return $SM.get('game.spaceShip.hull');
	},
	
	checkLiftOff: function() {
		if(!$SM.get('game.spaceShip.seenWarning')) {
			Events.startEvent({
				title: _('Ready to Leave?'),
				scenes: {
					'start': {
						text: [
							_("time to get out of this place. won't be coming back.")
						],
						buttons: {
							'fly': {
								text: _('lift off'),
								onChoose: function() {
									$SM.set('game.spaceShip.seenWarning', true);
									Ship.liftOff();
								},
								nextScene: 'end'
							},
							'wait': {
								text: _('linger'),
								onChoose: function() {
									Button.clearCooldown($('#liftoffButton'));
								},
								nextScene: 'end'
							}
						}
					}
				}
			});
		} else {
			Ship.liftOff();
		}
	},
	
	liftOff: function () {
		$('#outerSlider').animate({top: '700px'}, 300);
		Space.onArrival();
		Engine.activeModule = Space;
		AudioEngine.playSound(AudioLibrary.LIFT_OFF);
	},
	
	handleStateUpdates: function(e){
		
	}
};
