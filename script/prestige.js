var Prestige = {
  name: 'Prestige',
  
	options: {},
  
	init: function(options) {
		this.options = $.extend(
			this.options,
			options
		);
  },
  
  save: function() {
    var prevStores = [ //g = goods, w = weapons, a = ammo
      $SM.get('stores["wood"]'), // randGen('g'),
      $SM.get('stores["fur"]'), // randGen('g'),
      $SM.get('stores["meat"]'), // randGen('g'),
      $SM.get('stores["iron"]'), // randGen('g'),
      $SM.get('stores["coal"]'), // randGen('g'),
      $SM.get('stores["sulphur"]'), // randGen('g'),
      $SM.get('stores["steel"]'), // randGen('g'),
      $SM.get('stores["cured meat"]'), // randGen('g'),
      $SM.get('stores["scales"]'), // randGen('g'),
      $SM.get('stores["teeth"]'), // randGen('g'),
      $SM.get('stores["leather"]'), // randGen('g'),
      $SM.get('stores["bait"]'), // randGen('g'),
      $SM.get('stores["torch"]'), // randGen('g'),
      $SM.get('stores["cloth"]'), // randGen('g'),
      $SM.get('stores["bone spear"]'), // randGen('w'),
      $SM.get('stores["iron sword"]'), // randGen('w'),
      $SM.get('stores["steel sword"]'), // randGen('w'),
      $SM.get('stores["bayonet"]'), // randGen('w'),
      $SM.get('stores["rifle"]'), // randGen('w'),
      $SM.get('stores["laser rifle"]'), // randGen('w'),
      $SM.get('stores["bullets"]'), // randGen('a'),
      $SM.get('stores["energy cell"]'), // randGen('a'),
      $SM.get('stores["grenade"]'), // randGen('a'),
      $SM.get('stores["bolas"]') // randGen('a')
    ];
    $SM.set('previous.stores', prevStores);
    return prevStores;
  },
  
  load: function() {
    var prevStores = $SM.get('previous.stores');
    return prevStores;
  }
  
  /*randGen: function(storeType) {
      if (storeType == 'g') {
        divisor = Math.floor(Math.random()*10)
      }
      else if (storeType == 'w') {
        divisor = Math.floor(Math.floor(Math.random()*10)/2)
      }
      else if (storeType == 'a') {
        divisor = Math.floor(Math.random()*10*Math.floor(Math.random()*10/5))
      }
      else { divisor = 1 };
      if (divisor === 0) {
        divisor = 1
      };
      return divisor;
  }*/
  
}