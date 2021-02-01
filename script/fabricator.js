/**
 * Module that registers the fabricator functionality
 */
const Fabricator = {
  name: _('Fabricator'),
  Craftables: {
    'energy blade': {
      name: _('energy blade'),
      type: 'weapon',
      buildMsg: _("the blade hums, charged particles sparking and fizzing."),
      cost: () => ({
        'alien alloy': 1
      }),
      audio: AudioLibrary.CRAFT
    },
    'fluid recycler': {
      name: _('fluid recycler'),
			type: 'upgrade',
			maximum: 1,
			buildMsg: _('water out, water in. waste not, want not.'),
			cost: () => ({
        'alien alloy': 2
			}),
			audio: AudioLibrary.CRAFT
    },
    'cargo drone': {
			name: _('cargo drone'),
			type: 'upgrade',
			maximum: 1,
			buildMsg: _('the workhorse of the wanderer fleet.'),
			cost: () => ({
				'alien alloy': 2
			}),
			audio: AudioLibrary.CRAFT
		},
    'kinetic armour': {
      name: _('kinetic armour'),
			type: 'upgrade',
			maximum: 1,
			buildMsg: _('wanderer soldiers succeed by subverting the enemy\'s rage.'),
			cost: () => ({
				'alien alloy': 2
			}),
			audio: AudioLibrary.CRAFT
    },
    'disrupter': {
      name: _('disrupter'),
      type: 'weapon',
      buildMsg: _("somtimes it is best not to fight."),
      cost: () => ({
        'alien alloy': 1
      }),
      audio: AudioLibrary.CRAFT
    },
    'hypo': {
      name: _('hypo'),
      type: 'tool',
      buildMsg: _('a handful of hypos. life in a vial.'),
      cost: () => ({
        'alien alloy': 1
      }),
      quantity: 5,
      audio: AudioLibrary.CRAFT
    },
    'stim': {
      name: _('stim'),
      type: 'tool',
      buildMsg: _('sometimes it is best to fight without restraint.'),
      cost: () => ({
        'alien alloy': 1
      }),
      audio: AudioLibrary.CRAFT
    },
    'plasma rifle': {
      name: _('plasma rifle'),
      type: 'weapon',
      buildMsg: _("the peak of wanderer weapons technology, sleek and deadly."),
      cost: () => ({
        'alien alloy': 1
      }),
      audio: AudioLibrary.CRAFT
    },
    'glowstone': {
      name: _('glow stone'),
      type: 'tool',
      buildMsg: _('a smooth, perfect sphere. its light is inextinguishable.'),
      cost: () => ({
        'alien alloy': 1
      }),
      audio: AudioLibrary.CRAFT
    }
  },

  init: () => {

    if (!$SM.get('features.location.fabricator')) {
      $SM.set('features.location.fabricator', true);
    }

    // Create the Fabricator tab
		Fabricator.tab = Header.addLocation(_("A Whirring Fabricator"), "fabricator", Fabricator);
		
		// Create the Fabricator panel
		Fabricator.panel = $('<div>').attr('id', "fabricatorPanel")
			.addClass('location')
			.appendTo('div#locationSlider');
		
		Engine.updateSlider();

  },

  onArrival: transition_diff => {
		Fabricator.setTitle();
		if(!$SM.get('game.fabricator.seen')) {
			Notifications.notify(Fabricator, _('the familiar hum of wanderer machinery coming to life. finally, real tools.'));
			$SM.set('game.fabricator.seen', true);
		}
		AudioEngine.playBackgroundMusic(AudioLibrary.MUSIC_SHIP);

		Engine.moveStoresView(null, transition_diff);
	},

  setTitle: () => {
		if(Engine.activeModule == Fabricator) {
			document.title = _("A Whirring Fabricator");
		}
	},

};
