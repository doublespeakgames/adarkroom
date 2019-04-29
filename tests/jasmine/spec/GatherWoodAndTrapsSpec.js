describe("Gather Wood and Check Traps Capabilities", function() {
  describe("Gather Wood", function() {
    beforeEach(function() {
      Outside.init();
      $SM.set('stores.wood', 0);
      $SM.set('game.buildings["cart"]', 0);
    });

    it("gathers 10 wood with no cart", function() {
      Outside.gatherWood();
      expect($SM.get('stores.wood')).toEqual(10);
    });

    it("gathers 50 wood with a cart", function() {
      $SM.add('game.buildings["cart"]', 1)
      Outside.gatherWood();
      expect($SM.get('stores.wood')).toEqual(50);
    });
  });

  describe("Check Traps", function() {
    var getTotalTraps = function() {
      var total = 0;
      for (var i in Outside.TrapDrops) {
        total += $SM.get('stores.' + Outside.TrapDrops[i].name);
      }

      return total;
    }

    beforeEach(function() {
      Outside.init();

      for (var i in Outside.TrapDrops) {
        $SM.set('stores.' + Outside.TrapDrops[i].name, 0);
      }

      $SM.set('stores.bait', 0);
      $SM.set('game.buildings["trap"]', 0);
    });

    it("gets nothing with zero traps", function() {
      Outside.checkTraps();
      expect(getTotalTraps()).toEqual(0);
    });

    it("gets one drop with one trap and no bait", function() {
      $SM.set('game.buildings["trap"]', 1);
      Outside.checkTraps();
      expect(getTotalTraps()).toEqual(1);
    });

    it("gets two drops with one trap and one bait", function() {
      $SM.set('game.buildings["trap"]', 1);
      $SM.set('stores.bait', 1);
      Outside.checkTraps();
      expect(getTotalTraps()).toEqual(2);
    });

    it("gets two drops with one trap and ten bait", function() {
      $SM.set('game.buildings["trap"]', 1);
      $SM.set('stores.bait', 10);
      Outside.checkTraps();
      expect(getTotalTraps()).toEqual(2);
    });

    it("gets ten drops with ten traps and no bait", function() {
      $SM.set('game.buildings["trap"]', 10);
      Outside.checkTraps();
      expect(getTotalTraps()).toEqual(10);
    });

    it("gets twenty drops with ten traps and ten bait", function() {
      $SM.set('game.buildings["trap"]', 10);
      $SM.set('stores.bait', 10);
      Outside.checkTraps();
      expect(getTotalTraps()).toEqual(20);
    });

    it("gets no drops with no traps and ten bait", function() {
      $SM.set('stores.bait', 10);
      Outside.checkTraps();
      expect(getTotalTraps()).toEqual(0);
    });

    it("uses one bait for each trap", function() {
      $SM.set('stores.bait', 10);

      $SM.set('game.buildings["trap"]', 1);
      Outside.checkTraps();
      expect($SM.get('stores.bait')).toEqual(9);

      $SM.set('game.buildings["trap"]', 6);
      Outside.checkTraps();
      expect($SM.get('stores.bait')).toEqual(3);

      Outside.checkTraps();
      expect($SM.get('stores.bait')).toEqual(0);
    });

    it("get correct drops for each roll", function() {
      $SM.set('game.buildings["trap"]', 1);
      spyOn(Math, "random").and.returnValues(0.49, 0.74, 0.84, 0.92, 0.99, 0.999);

      Outside.checkTraps();
      expect($SM.get('stores.fur')).toEqual(1);

      Outside.checkTraps();
      expect($SM.get('stores.meat')).toEqual(1);

      Outside.checkTraps();
      expect($SM.get('stores.scales')).toEqual(1);

      Outside.checkTraps();
      expect($SM.get('stores.teeth')).toEqual(1);

      Outside.checkTraps();
      expect($SM.get('stores.cloth')).toEqual(1);

      Outside.checkTraps();
      expect($SM.get('stores.charm')).toEqual(1);
    });
  });
});
