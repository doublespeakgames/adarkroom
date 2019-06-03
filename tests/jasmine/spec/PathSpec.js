describe("Path Capabilities", function () {
    describe("Appropriate Capacity for Path", function () {
        beforeEach(function () {
            Path.init();
            $SM.set('stores.rucksack', false);
            $SM.set('stores.convoy', false);
            $SM.set('stores.wagon', false);
            Path.DEFAULT_BAG_SPACE = 10;
        });
        it("Appropriate Capacity for Default", function () {
			$SM.set('stores.rucksack', false);
            expect(Path.getCapacity()).toEqual(Path.DEFAULT_BAG_SPACE);
        });
        it("Appropriate Capacity for Rucksack", function () {
            $SM.set('stores.rucksack', true);
            expect(Path.getCapacity()).toEqual(Path.DEFAULT_BAG_SPACE + 10);
        });
        it("Appropriate Capacity for Wagon", function () {
            $SM.set('stores.wagon', true);
            expect(Path.getCapacity()).toEqual(Path.DEFAULT_BAG_SPACE + 30);
        });
        it("Appropriate Capacity for Convoy", function () {
            $SM.set('stores.convoy', true);
            expect(Path.getCapacity()).toEqual(Path.DEFAULT_BAG_SPACE + 60);
        });
    
    });
    describe("Appropriate Weight", function () {
        beforeEach(function () {
            Path.init();
            $SM.set('stores.rucksack', false);
            $SM.set('stores.convoy', false);
            $SM.set('stores.wagon', false);
            Path.DEFAULT_BAG_SPACE = 10;
        });
        it("Appropriate Weight for Bone Spear", function () {
            Path.getWeight("bone spear");
            expect(Path.getWeight("bone spear")).toEqual(2);
        });
        it("Appropriate Weight for Iron Sword", function () {
            Path.getWeight("iron sword");
            expect(Path.getWeight("iron sword")).toEqual(3);
        });
        it("Appropriate Weight for Steel Sword", function () {
            Path.getWeight("steel sword");
            expect(Path.getWeight("steel sword")).toEqual(5);
        });
        it("Appropriate Weight for Rifle", function () {
            Path.getWeight("rifle");
            expect(Path.getWeight("rifle")).toEqual(5);
        });
        it("Appropriate Weight for Bullets", function () {
            Path.getWeight("bullets");
            expect(Path.getWeight("bullets")).toEqual(0.1);
        });
        it("Appropriate Weight for energy cell", function () {
            Path.getWeight("energy cell");
            expect(Path.getWeight("energy cell")).toEqual(0.2);
        });
        it("Appropriate Weight for laser rifle", function () {
            Path.getWeight("laser rifle");
            expect(Path.getWeight("laser rifle")).toEqual(5);
        });
        it("Appropriate Weight for bolas", function () {
            Path.getWeight("bolas");
            expect(Path.getWeight("bolas")).toEqual(0.5);
        });
    });
	
	describe("Appropiate free space", function() {
		beforeEach(function () {
            Path.init();
            $SM.set('stores.rucksack', false);
            $SM.set('stores.convoy',false);
            $SM.set('stores.wagon', false);
            Path.DEFAULT_BAG_SPACE = 10;
        });
		
		it("Expect free space to equal 10", function(){
			var freeSpace = Path.getFreeSpace();
			expect(freeSpace).toEqual(10);
		});
		
		it("Expect free space to equal 20", function(){

			$SM.set('stores.rucksack',true);
			var freeSpace = Path.getFreeSpace();
			expect(freeSpace).toEqual(20);
			

		});	

		it("Expect free space to equal 40", function(){
			
			$SM.set('stores.rucksack',true);
			$SM.set('stores.wagon',true);
			var freeSpace = Path.getFreeSpace();
			expect(freeSpace).toEqual(40);
					
			
			
		});
		
		it("Expect free space to equal 70", function(){
			
			$SM.set('stores.rucksack',true);
			$SM.set('stores.wagon',true);
			$SM.set('stores.convoy',true);
			var freeSpace = Path.getFreeSpace();
			expect(freeSpace).toEqual(70);
					
			
		});
		
		
		
		
		
	});
   
});
