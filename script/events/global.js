/**
 * Events that can occur when any module is active (Except World. It's special.)
 **/
Events.Global = [
	{ /* The Thief */
		title: 'The Thief',
		isAvailable: function() {
			return (Engine.activeModule == Room || Engine.activeModule == Outside) && State.thieves == 1;
		},
		scenes: {
			'start': {
				text: [
					'the villagers haul a filthy man out of the store room.',
					"say his folk have been skimming the supplies.",
					'say he should be strung up as an example.'
				],
				notification: 'a thief is caught',
				buttons: {
					'kill': {
						text: 'hang him',
						nextScene: {1: 'hang'}
					},
					'spare': {
						text: 'spare him',
						nextScene: {1: 'spare'}
					}
				}
			},
			'hang': {
				text: [
			       'the villagers hang the thief high in front of the store room.',
			       'the point is made. in the next few days, the missing supplies are returned.'
		        ],
		        onLoad: function() {
		        	State.thieves = 2;
		        	Engine.removeIncome('thieves');
		        	Engine.addStores(State.stolen);
		        },
		        buttons: {
					'leave': {
						text: 'leave',
						nextScene: 'end'
					}
				}
			},
			'spare': {
				text: [
			       "the man says he's grateful. says he won't come around any more.",
			       "shares what he knows about sneaking before he goes."
		        ],
		        onLoad: function() {
		        	State.thieves = 2;
		        	Engine.removeIncome('thieves');
		        	Engine.addPerk('stealthy');
		        },
		        buttons: {
		        	'leave': {
		        		text: 'leave',
		        		nextScene: 'end'
		        	}
		        }
			}
		}
	}
];