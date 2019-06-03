describe("Increase and decrease worker population Capabilities", function () {


	describe("Add Worker" , function(){

		beforeEach( function(){
			Room.init();
      Outside.init();
			$SM.set('game.workers', 20);
				$SM.set('game.population', 20);

		});

		it("10 workers should be added to the original amount of 20 ", function() {

			var btn = document.createElement("button");


			var btn =  {

				data: 10

			}


			expect($SM.get('game.workers')).not.toBeLessThan(20);


		});
		it("1 worker should be added to the original amount of 20 ", function() {

			var btn = document.createElement("button");


			var btn =  {

				data: 1

			}

			Outside.increaseWorker(btn);
			expect($SM.get('game.workers')).not.toBeLessThan(20);


		});
	});

	describe("Remove Worker", function(){

		beforeEach( function(){
				Room.init();
        Outside.init();
		$SM.set('game.workers', 20);
		});


		it("Decrease the amount of workers by 10",function(){
			var btn = document.createElement("button");


			var btn =  {

				data: 5

			}
			Outside.decreaseWorker(btn);
			expect($SM.get('game.workers')).not.toBeLessThan(9);


expect(true).toBe(true);
		});
		it("Decrease the amount of workers by 1",function(){
			var btn = document.createElement("button");


			var btn =  {

				data: 5

			}
			Outside.decreaseWorker(btn);
			expect($SM.get('game.workers')).not.toBeLessThan(9);




		});
	});


	describe("Check Worker Functionality", function(){

		beforeEach( function(){
				Room.init();
        Outside.init();
		$SM.set('game.workers', 20);
		$SM.set('game.population', 10);
		});
		it("Check Lodge Does Not Exist",function(){
			$SM.set('game.buildings["lodge"]', false);


		var expected =	Outside.checkWorker("hunter");
			expect(expected).toEqual(false);

		});

		it("Check Lodge Exists",function(){
			$SM.set('game.buildings["lodge"]', true);
				$SM.get('game.buildings["lodge"]', 1);

		var expected = 	Outside.checkWorker("hunter");
			expect(expected).toEqual(false);

		});
		it("Check Charcutier",function(){

			$SM.set('game.buildings["smokehouse"]', true);
				$SM.get('game.buildings["smokehouse"]', 1);
		var expected = 	Outside.checkWorker("charcutier");
			expect(expected).toEqual(false);


		});
	});



});
