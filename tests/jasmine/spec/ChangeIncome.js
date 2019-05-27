describe("Test changing income", function () {
  var setAllIncome = function(val) {
    var allKeys = Object.keys(Outside._INCOME);

    for (var k in allKeys) {
      if (val == null) {
        $SM.setIncome(k, Outside._INCOME[k]);
      }
      else {
        $SM.setIncome(k, {});
      }
    }
  }

  describe("Test setting income", function() {
    beforeEach(function() {
      $SM.init();
      Outside.init();
      for(var source in $SM.get('income')) {
        $SM.setIncome(source, {
  				delay: 10,
  				stores: {'wood' : 0 }
  			});
      }
    });

    it("can set income to 1", function() {
      $SM.setIncome("gatherer", {
  			delay: 10,
  			stores: {
  				'wood': 1
  			}
  		});

      var wood_income = $SM.getIncome("gatherer");

      expect(wood_income["stores"]["wood"]).toEqual(1);
    });

    it("can set income to 10", function() {
      $SM.setIncome("gatherer", {
  			delay: 10,
  			stores: {
  				'wood': 10
  			}
  		});

      var wood_income = $SM.getIncome("gatherer");

      expect(wood_income["stores"]["wood"]).toEqual(10);
    });

    it("can set income to 0", function() {
      $SM.setIncome("gatherer", {
  			delay: 10,
  			stores: {
  				'wood': 0
  			}
  		});

      var wood_income = $SM.getIncome("gatherer");

      expect(wood_income["stores"]["wood"]).toEqual(0);
    });
  });

  describe("Test collecting income", function() {
    beforeEach(function() {
      $SM.init();
      Outside.init();
      for(var source in $SM.get('income')) {
        $SM.setIncome(source, {
  				delay: 10,
  				stores: {'wood' : 0 }
  			});
      }

      $SM.setIncome('thieves', {
  			delay: 10,
  			stores: {
  				'wood': 0,
  				'fur': 0,
  				'meat': 0
  			}
  		});

      $SM.set('stores.wood', 0);
    });

    it("can collect 1 income", function() {
      $SM.set('income["gatherer"]', {
        timeLeft: 0,
  			delay: 10,
  			stores: {
  				'wood': 1
  			}
  		});

      $SM.collectIncome();

      expect($SM.get('stores.wood')).toEqual(1);
    });

    it("can collect 10 income", function() {
      $SM.set('income["gatherer"]', {
        timeLeft: 0,
  			delay: 10,
  			stores: {
  				'wood': 10
  			}
  		});

      $SM.collectIncome();

      expect($SM.get('stores.wood')).toEqual(10);
    });

    it("can collect 0 income", function() {
      $SM.set('income["gatherer"]', {
        timeLeft: 0,
  			delay: 10,
  			stores: {
  				'wood': 0
  			}
  		});

      $SM.collectIncome();

      expect($SM.get('stores.wood')).toEqual(0);
    });
  });
});
