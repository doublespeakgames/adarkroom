
describe("Add Villager and Kill Villager Capabilities", function () {
    describe("Add Villager", function () {
    beforeEach( function(){
        Outside.init();
      
    });
    it("Add Random Number of Villagers", function() {
    var init_villager = $SM.get('game.population');
    Outside.increasePopulation();
    expect($SM.get('game.population')).not.toBeLessThan(init_villager);
        });
        it("Max Population of Villagers", function () {
           
            $SM.set('game.buildings["hut"]', 1);
            $SM.set('game.population', 1);
            var init_villager = $SM.get('game.population');
            console.log(Outside.getMaxPopulation() - $SM.get('game.population'));
            Outside.increasePopulation();
            expect($SM.get('game.population')).not.toBeLessThan(init_villager);
            expect(Outside.getMaxPopulation()).toEqual(4);
        });
        it("Add Schedule of Villagers", function () {
            var init_villager = $SM.get('game.population');
            spyOn(Engine, "setTimeout");
         
           
            spyOn(Math, "floor").and.returnValues(0.5, 1.5, 2.5);
            Outside.schedulePopIncrease();
            
            expect(Engine.setTimeout).toHaveBeenCalled();
            expect($SM.get('game.population')).not.toBeLessThan(init_villager);
        });
    });
    describe("Kill Villager", function () {
        beforeEach(function () {
            Outside.init();
  
        });
        it("Kills 10 Villagers", function () {
            var init_villager_pop = $SM.get('game.population');

            $SM.add('game.population', 10);
            Outside.killVillagers(10);
            expect($SM.get('game.population')).toEqual(init_villager_pop);

        });
        it("Does Not Kill Too Many Villagers", function () {
           
            $SM.set('game.population', 3);
            var init_villager_pop = $SM.get('game.population');
            $SM.add('game.population', 10);
            Outside.killVillagers(init_villager_pop * 10);
            expect($SM.get('game.population')).toEqual(0);

        });

    });
});
