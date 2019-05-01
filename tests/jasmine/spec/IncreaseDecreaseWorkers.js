describe("Increase and decrease worker population Capabilities", function () {
	
	
	describe("Add Worker" , function(){
		
		beforeEach( function(){
        Outside.init();
		
		});
		
		it("1 worker should be added to the original amount of 10, resulting in 11", function() {
			$SM.set('game.workers', 10);			
			var btn =  {
				
				data: 10,
				
			}
			Outside.increaseWorker(btn);
			expect($SM.get('game.workers')).toEqual(11);
					
			
			
		});
		
		it("1 worker should be added to the original amount of 15, resulting in 16", function() {
			$SM.set('game.workers', 15);			
			var btn =  {
				
				data: 15,
				
			}
			Outside.increaseWorker(btn);
			expect($SM.get('game.workers')).toEqual(16);
					
			
			
		});
		
		
				
		
		
		
		
		
	});	
	
	describe("Remove Worker", function(){
		
		
		beforeEach( function(){
        Outside.init();
		
		});
		
		it("1 worker should be removed from the original amount of 10, resulting in 9", function() {
			$SM.set('game.workers', 10);			
			var btn =  {
				
				data: 10,
				
			}
			Outside.decreaseWorker(btn);
			expect($SM.get('game.workers')).toEqual(9);
					
			
			
			
		});
		
		
		
		it("1 worker should be removed from the original amount of 15, resulting in 14", function() {
			$SM.set('game.workers', 15);			
			var btn =  {
				
				data: 15,
				
			}
			Outside.decreaseWorker(btn);
			expect($SM.get('game.workers')).toEqual(14);
					
			
			
		});
		
		
		
		
		
		
	});		
	
	
	
	
});