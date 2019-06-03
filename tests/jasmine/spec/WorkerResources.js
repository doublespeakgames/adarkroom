describe("Test collecting income", function() {
    beforeEach(function() {
      $SM.init();
      Outside.init();
      for(var source in $SM.get('income')) {
        $SM.setIncome(source, {
  				delay: 10,
  				stores: {
					'wood' : 0,
					'fur': 0,
					'meat':0,
					'bait':0,
					'leather':0



				}
				
  			});
      }

      $SM.setIncome('thieves', {
  			delay: 10,
  			stores: {
  				'wood': 0,
  				'fur': 0,
  				'meat': 0,
				'bait':0,
				'leather':0
				
  			}
  		});

      $SM.set('stores.wood', 0);
	  $SM.set('stores.fur',0);
	  $SM.set('stores.meat',0);
	  $SM.set('stores.bait',0);
	  $SM.set('stores.leather',0);
    });
    
	it("can collect 5 woods from gatherer", function() {
      $SM.set('income["gatherer"]', {
        timeLeft: 0,
  			delay: 10,
  			stores: {
  				'wood': 5
  			}
  		});
		$SM.collectIncome();
		
      expect($SM.get('stores.wood')).toEqual(5);
	  
    });
	
	
	it("can collect 10 woods from gatherer and .5 fur, .5 meat from hunter ", function() {
      $SM.set('income["gatherer"]', {
        timeLeft: 0,
  			delay: 10,
  			stores: {
  				'wood': 10
  			}
  		});
		
		
		$SM.set('income["hunter"]', {
        timeLeft: 0,
  			delay: 10,
  			stores: {
  				'meat': 0.5,
				'fur': 0.5
  			}
  		});
		
      $SM.collectIncome();
		
      expect($SM.get('stores.wood')).toEqual(10);
	  expect($SM.get('stores.meat')).toEqual(0.5);
	  expect($SM.get('stores.fur')).toEqual(0.5);
	  
    });
	
	
	it("can collect 1 bait and 1 meat from the gatherer and negative 1 meats and 1 bait from the trapper ", function() {
      $SM.set('income["gatherer"]', {
        timeLeft: 0,
  			delay: 10,
  			stores: {
  				'meat': 1,
				'bait':1
				
  			}
  		});
		
		
		$SM.set('income["trapper"]', {
        timeLeft: 0,
  			delay: 10,
  			stores: {
  				'meat': -1,
				'bait': 1
  			}
  		});
		
      $SM.collectIncome();
		
      expect($SM.get('stores.bait')).toEqual(2);
	  expect($SM.get('stores.meat')).toEqual(0);
	  
	  
    });
	
  });