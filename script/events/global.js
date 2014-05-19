/**
 * Events that can occur when any module is active (Except World. It's special.)
 **/
Events.Global = [
	{ /* The Thief */
		title: _('The Thief'),
		isAvailable: function() {
			return (Engine.activeModule == Room || Engine.activeModule == Outside) && $SM.get('game.thieves') == 1;
		},
		scenes: {
			'start': {
				text: [
					_('the villagers haul a filthy man out of the store room.'),
					_("say his folk have been skimming the supplies."),
					_('say he should be strung up as an example.')
				],
				notification: _('a thief is caught'),
				buttons: {
					'kill': {
						text: _('hang him'),
						nextScene: {1: 'hang'}
					},
					'spare': {
						text: _('spare him'),
						nextScene: {1: 'spare'}
					}
				}
			},
			'hang': {
				text: [
			       _('the villagers hang the thief high in front of the store room.'),
			       _('the point is made. in the next few days, the missing supplies are returned.')
		        ],
		        onLoad: function() {
		        	$SM.set('game.thieves', 2);
		        	$SM.remove('income.thieves');
		        	$SM.addM('stores', $SM.get('game.stolen'));
		        },
		        buttons: {
					'leave': {
						text: _('leave'),
						nextScene: 'end'
					}
				}
			},
			'spare': {
				text: [
			       _("the man says he's grateful. says he won't come around any more."),
			       _("shares what he knows about sneaking before he goes.")
		        ],
		        onLoad: function() {
		        	$SM.set('game.thieves', 2);
		        	$SM.remove('income.thieves');
		        	$SM.addPerk('stealthy');
		        },
		        buttons: {
		        	'leave': {
		        		text: _('leave'),
		        		nextScene: 'end'
		        	}
		        }
			}
		}
	}
];