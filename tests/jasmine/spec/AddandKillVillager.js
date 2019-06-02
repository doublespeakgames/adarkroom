
describe("Add Villager and Kill Villager Capabilities", function () {
  describe("Test Max Population", function ()
  {
      beforeEach(function ()
      {
          Outside.init();
          $SM.set('game.population', 1);
          $SM.set('game.buildings["hut"]', 1);
      })
  });
      it("Gets appropriate max population with huts = 4 && hut room = 4", function ()
      {
        $SM.set('game.buildings["hut"]', 4);
        Outside._HUT_ROOM = 4;
        expect(Outside.getMaxPopulation()).toEqual(16);
        Outside._HUT_ROOM = 4;
      });
      it("Gets appropriate max population with hut room = 4", function ()
      {
          $SM.set('game.buildings["hut"]', 1);
        Outside._HUT_ROOM = 4;
        expect(Outside.getMaxPopulation()).toEqual(4);
        Outside._HUT_ROOM = 4;
      });
      it("Gets appropriate max population with hut room = 5", function ()
      {
          $SM.set('game.buildings["hut"]', 1);
        Outside._HUT_ROOM = 5;
        expect(Outside.getMaxPopulation()).toEqual(5);
        Outside._HUT_ROOM = 4;
      });

  describe("Add Villager", function ()
  {
    beforeEach( function()
    {

        Outside.init();
        Outside._HUT_ROOM = 4;
    });
    it("Add Random Number of Villagers", function()
    {
      var init_villager = $SM.get('game.population');
      Outside.increasePopulation();
      expect($SM.get('game.population')).not.toBeLessThan(init_villager);
    });
        it("Increase Population of Villagers num = 0", function ()
        {
            $SM.set('game.buildings["hut"]', 1);
            $SM.set('game.population', 1);
            var init_villager = $SM.get('game.population');
            console.log(Outside.getMaxPopulation() - $SM.get('game.population'));
            spyOn(Notifications, "notify");
            spyOn(Math, 'random').and.returnValues(0);
            Outside.increasePopulation();
            expect(Notifications.notify).toHaveBeenCalledWith(null, _('a stranger arrives in the night'));
            expect($SM.get('game.population')).not.toBeLessThan(init_villager);
            expect(Outside.getMaxPopulation()).toEqual(4);
        });
        it("Increase Population of Villagers num = 4", function ()
        {
            $SM.set('game.buildings["hut"]', 1);
            $SM.set('game.population', 1);
              Outside._HUT_ROOM = 5;
            var init_villager = $SM.get('game.population');
            var space = (Outside.getMaxPopulation() - $SM.get('game.population'));
            console.log(space);
  spyOn(Notifications, "notify");
            Outside.increasePopulation();
              expect(Notifications.notify).toHaveBeenCalledWith(null, _('a weathered family takes up in one of the huts.'));
            expect($SM.get('game.population')).not.toBeLessThan(init_villager);
            expect(Outside.getMaxPopulation()).toEqual(5);
        });
        it("Increase Population of Villagers num = 7", function ()
        {
            $SM.set('game.buildings["hut"]', 1);
            $SM.set('game.population', 1);
              Outside._HUT_ROOM = 11;
            var init_villager = $SM.get('game.population');
            var space = (Outside.getMaxPopulation() - $SM.get('game.population'));
            console.log(space);
  spyOn(Notifications, "notify");
            Outside.increasePopulation();
              expect(Notifications.notify).toHaveBeenCalledWith(null, _('a small group arrives, all dust and bones.'));
            expect($SM.get('game.population')).not.toBeLessThan(init_villager);
            expect(Outside.getMaxPopulation()).toEqual(11);
        });
        it("Increase Population of Villagers num = 19", function ()
        {
            $SM.set('game.buildings["hut"]', 1);
            $SM.set('game.population', 1);
              Outside._HUT_ROOM = 25;
            var init_villager = $SM.get('game.population');
            var space = (Outside.getMaxPopulation() - $SM.get('game.population'));
            console.log(space);
  spyOn(Notifications, "notify");
            Outside.increasePopulation();
              expect(Notifications.notify).toHaveBeenCalledWith(null, _('a convoy lurches in, equal parts worry and hope.'));
            expect($SM.get('game.population')).not.toBeLessThan(init_villager);
            expect(Outside.getMaxPopulation()).toEqual(25);
        });
        it("Increase Population of Villagers num = 39", function ()
        {
            $SM.set('game.buildings["hut"]', 1);
            $SM.set('game.population', 1);
              Outside._HUT_ROOM = 63;
            var init_villager = $SM.get('game.population');
            var space = (Outside.getMaxPopulation() - $SM.get('game.population'));
            console.log(space);
  spyOn(Notifications, "notify");
            Outside.increasePopulation();
              expect(Notifications.notify).toHaveBeenCalledWith(null, _("the town's booming. word does get around."));
            expect($SM.get('game.population')).not.toBeLessThan(init_villager);
            expect(Outside.getMaxPopulation()).toEqual(63);
        });
        it("Add Schedule of Villagers", function ()
        {
            var init_villager = $SM.get('game.population');
            spyOn(Engine, "setTimeout");

            spyOn(Math, "floor").and.returnValues(0.5, 1.5, 2.5, 3);
            Outside.schedulePopIncrease();

            expect(Engine.setTimeout).toHaveBeenCalled();

            expect($SM.get('game.population')).not.toBeLessThan(init_villager);

        });
    });
    describe("Kill Villager", function ()
    {
        beforeEach(function ()
        {
            Outside.init();
        });

        it("Kills 10 Villagers", function ()
        {
            var init_villager_pop = $SM.get('game.population');
            $SM.add('game.population', 10);
            Outside.killVillagers(10);
            expect($SM.get('game.population')).toEqual(init_villager_pop);

        });
        it("Does Not Kill Too Many Villagers", function ()
        {
            $SM.set('game.population', 3);
            var init_villager_pop = $SM.get('game.population');
            $SM.add('game.population', 10);
            Outside.killVillagers(init_villager_pop * 10);
            expect($SM.get('game.population')).toEqual(0);

        });
      
    });
});
