/**
 * Events that can occur when any module is active (Except World. It's special.)
 **/
Events.Global = [
	{ /* The Thief */
		title: 'Злодій',
		isAvailable: function() {
			return (Engine.activeModule == Room || Engine.activeModule == Outside) && State.thieves == 1;
		},
		scenes: {
			'start': {
				text: [
					'Селяни зловили грязного злодія біля комори.',
					"Кажуть що він крав припаси.",
					'Кажуть що його потрібно повісити для прикладу.'
				],
				notification: 'Злодій впіймався.',
				buttons: {
					'kill': {
						text: 'повісити',
						nextScene: {1: 'hang'}
					},
					'spare': {
						text: 'пошкодувати',
						nextScene: {1: 'spare'}
					}
				}
			},
			'hang': {
				text: [
				   'Селяни повісили злодія навпроти комори.',
				   'Злодії злякалися. Через декілька днів припаси були повернуті.'
				],
				onLoad: function() {
					State.thieves = 2;
					Engine.removeIncome('злодії');
					Engine.addStores(State.stolen);
				},
				buttons: {
					'leave': {
						text: 'полишити',
						nextScene: 'end'
					}
				}
			},
			'spare': {
				text: [
				   "Мужчина каже що він дуже вдячний. Каже що не буде більше так робити.",
				   "Розказав все що знав про вкрадливість."
				],
				onLoad: function() {
					State.thieves = 2;
					Engine.removeIncome('злодії');
					Engine.addPerk('вкрадливість');
				},
				buttons: {
					'leave': {
						text: 'полишити',
						nextScene: 'end'
					}
				}
			}
		}
	}
];