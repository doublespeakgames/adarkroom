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
      $SM.get('stores["wood"]'),
      $SM.get('stores["fur"]'),
      $SM.get('stores["meat"]'),
      $SM.get('stores["iron"]'),
      $SM.get('stores["coal"]'),
      $SM.get('stores["sulphur"]'),
      $SM.get('stores["steel"]'),
      $SM.get('stores["cured meat"]'),
      $SM.get('stores["scales"]'),
      $SM.get('stores["teeth"]'),
      $SM.get('stores["leather"]'),
      $SM.get('stores["bait"]'),
      $SM.get('stores["torch"]'),
      $SM.get('stores["cloth"]'),
      $SM.get('stores["bone spear"]'),
      $SM.get('stores["iron sword"]'),
      $SM.get('stores["steel sword"]'),
      $SM.get('stores["bayonet"]'),
      $SM.get('stores["rifle"]'),
      $SM.get('stores["laser rifle"]'),
      $SM.get('stores["bullets"]'),
      $SM.get('stores["energy cell"]'),
      $SM.get('stores["grenade"]'),
      $SM.get('stores["bolas"]')
    ];
    $SM.set('previous.stores', prevStores);
    return prevStores;
  },
  
  load: function() {
    var prevStores = $SM.get('previous.stores');
    $SM.add('stores["wood"]',prevStores[0]),
    $SM.add('stores["fur"]',prevStores[1]),
    $SM.add('stores["meat"]',prevStores[2]),
    $SM.add('stores["iron"]',prevStores[3]),
    $SM.add('stores["coal"]',prevStores[4]),
    $SM.add('stores["sulphur"]',prevStores[5]),
    $SM.add('stores["steel"]',prevStores[6]),
    $SM.add('stores["cured meat"]',prevStores[7]),
    $SM.add('stores["scales"]',prevStores[8]),
    $SM.add('stores["teeth"]',prevStores[9]),
    $SM.add('stores["leather"]',prevStores[10]),
    $SM.add('stores["bait"]',prevStores[11]),
    $SM.add('stores["torch"]',prevStores[12]),
    $SM.add('stores["cloth"]',prevStores[13]),
    $SM.add('stores["bone spear"]',prevStores[14]),
    $SM.add('stores["iron sword"]',prevStores[15]),
    $SM.add('stores["steel sword"]',prevStores[16]),
    $SM.add('stores["bayonet"]',prevStores[17]),
    $SM.add('stores["rifle"]',prevStores[18]),
    $SM.add('stores["laser rifle"]',prevStores[19]),
    $SM.add('stores["bullets"]',prevStores[20]),
    $SM.add('stores["energy cell"]',prevStores[21]),
    $SM.add('stores["grenade"]',prevStores[22]),
    $SM.add('stores["bolas"]',prevStores[23])
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