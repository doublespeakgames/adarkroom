var delay = {

  _STORES_DELAY: 10
}

var OutsideSettings = {
  _STORES_OFFSET: 0,
	_GATHER_DELAY: 60,
	_TRAPS_DELAY: 90,
	_POP_DELAY: [0.5, 3],
  _STORES_DELAY: 10,
	_HUT_ROOM: 4,
  _INCOME: {
		'gatherer': {
			name: _('gatherer'),
			delay: delay._STORES_DELAY,
			stores: {
				'wood': 1
			}
		},
		'hunter': {
			name: _('hunter'),
			delay: delay._STORES_DELAY,
			stores: {
				'fur': 0.5,
				'meat': 0.5
			}
		},
		'trapper': {
			name: _('trapper'),
			delay: delay._STORES_DELAY,
			stores: {
				'meat': -1,
				'bait': 1
			}
		},
		'tanner': {
			name: _('tanner'),
			delay: delay._STORES_DELAY,
			stores: {
				'fur': -5,
				'leather': 1
			}
		},
		'charcutier': {
			name: _('charcutier'),
			delay: delay._STORES_DELAY,
			stores: {
				'meat': -5,
				'wood': -5,
				'cured meat': 1
			}
		},
		'iron miner': {
			name: _('iron miner'),
			delay: delay._STORES_DELAY,
			stores: {
				'cured meat': -1,
				'iron': 1
			}
		},
		'coal miner': {
			name: _('coal miner'),
			delay: delay._STORES_DELAY,
			stores: {
				'cured meat': -1,
				'coal': 1
			}
		},
		'sulphur miner': {
			name: _('sulphur miner'),
			delay: delay._STORES_DELAY,
			stores: {
				'cured meat': -1,
				'sulphur': 1
			}
		},
		'steelworker': {
			name: _('steelworker'),
			delay: delay._STORES_DELAY,
			stores: {
				'iron': -1,
				'coal': -1,
				'steel': 1
			}
		},
		'armourer': {
			name: _('armourer'),
			delay: delay._STORES_DELAY,
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
			message: _('scraps of fur')
		},
		{
			rollUnder: 0.75,
			name: 'meat',
			message: _('bits of meat')
		},
		{
			rollUnder: 0.85,
			name: 'scales',
			message: _('strange scales')
		},
		{
			rollUnder: 0.93,
			name: 'teeth',
			message: _('scattered teeth')
		},
		{
			rollUnder: 0.995,
			name: 'cloth',
			message: _('tattered cloth')
		},
		{
			rollUnder: 1.0,
			name: 'charm',
			message: _('a crudely made charm')
		}
	],
  IncreasePopMessages: [
    'a stranger arrives in the night',
    'a weathered family takes up in one of the huts.',
    'a small group arrives, all dust and bones.',
    'a convoy lurches in, equal parts worry and hope.',
    "the town's booming. word does get around."
  ],
TitleText: [
  "A Silent Forest",
  "A Lonely Hut",
  "A Tiny Village",
  "A Modest Village",
  "A Large Village",
  "A Raucous Village"
],
jobMap: {
  'lodge': ['hunter', 'trapper'],
  'tannery': ['tanner'],
  'smokehouse': ['charcutier'],
  'iron mine': ['iron miner'],
  'coal mine': ['coal miner'],
  'sulphur mine': ['sulphur miner'],
  'steelworks': ['steelworker'],
  'armoury' : ['armourer']
}


}
