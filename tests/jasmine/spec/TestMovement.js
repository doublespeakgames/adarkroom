describe("Test Movement Capabilities", function() {
  describe("Test Moving", function() {
    beforeEach(function() {
      World.init();
      World.onArrival();
      World.curPos[0] = World.RADIUS;
      World.curPos[1] = World.RADIUS;
    });

    it("can move north", function() {
      World.moveNorth();
      expect(World.curPos[1]).toEqual(World.RADIUS - 1);
    });

    it("can move south", function() {
      World.moveSouth();
      expect(World.curPos[1]).toEqual(World.RADIUS + 1);
    });

    it("can move west", function() {
      World.moveWest();
      expect(World.curPos[0]).toEqual(World.RADIUS - 1);
    });

    it("can move east", function() {
      World.moveEast();
      expect(World.curPos[0]).toEqual(World.RADIUS + 1);
    });
  });

  describe("Test Consuming Meat", function() {
    var consumeAllMeat = function() {
      var orig_meat = Path.outfit["cured meat"];
      for (var i = 0; i < World.MOVES_PER_FOOD * orig_meat; i++) {
        World.moveNorth();
      }
    }

    beforeEach(function() {
      World.init();
      World.onArrival();
      World.curPos[0] = World.RADIUS;
      World.curPos[1] = World.RADIUS;
      Path.init();
      Path.updateOutfitting();
      Path.outfit["cured meat"] = 0;
      $SM.set('character.perks["slow metabolism"]', false);
      $SM.set('character.starved', 0);
    });

    it("consumes one meat per two normal moves", function() {
      Path.outfit["cured meat"] = 5;
      consumeAllMeat();

      expect(Path.outfit["cured meat"]).toEqual(0);
    });

    it("consumes one meat per four slow metabolism moves", function() {
      $SM.set('character.perks["slow metabolism"]', true);
      Path.outfit["cured meat"] = 4;
      consumeAllMeat();

      expect(Path.outfit["cured meat"]).toEqual(2);
    });

    it("gets starvation after consuming all meat", function() {
      World.moveNorth();
      World.moveNorth();
      expect(World.starvation).toEqual(true);
    });

    it("dies after starving to death", function() {
      World.moveNorth();
      World.moveNorth();
      World.moveNorth();
      World.moveNorth();
      expect($SM.get('character.starved')).toEqual(1);
    });
  });

  describe("Test Consuming Water", function() {
    var consumeAllWater = function() {
      var orig_water = World.water;
      for (var i = 0; i < World.MOVES_PER_WATER * orig_water; i++) {
        World.moveNorth();
      }
    }

    beforeEach(function() {
      World.init();
      World.onArrival();
      World.curPos[0] = World.RADIUS;
      World.curPos[1] = World.RADIUS;
      World.water = 0;
      $SM.set('character.perks["desert rat"]', false);
      $SM.set('character.dehydrated', 0);
    });

    it("consumes one water per one normal moves", function() {
      World.water = 5;
      consumeAllWater();

      expect(World.water).toEqual(0);
    });

    it("consumes one water per two desert rat moves", function() {
      $SM.set('character.perks["desert rat"]', true);
      World.water = 4;
      consumeAllWater();

      expect(World.water).toEqual(2);
    });

    it("gets dehydration after consuming all water", function() {
      World.moveNorth();
      expect(World.thirst).toEqual(true);
    });

    it("dies after dehydrating to death", function() {
      World.moveNorth();
      World.moveNorth();
      expect($SM.get('character.dehydrated')).toEqual(1);
    });
  });
});
