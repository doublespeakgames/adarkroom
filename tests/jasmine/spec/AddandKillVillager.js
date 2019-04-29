
describe("Add Villager", function(){
beforeEach function(){
Outside.init();
});
it("Add Villager", function(){
var init_villager = $SM.get('game.population');
Outside.IncreasePopulation();
expect($SM.get('game.population')).not.toBeLessThan(init_villager);
});

});
