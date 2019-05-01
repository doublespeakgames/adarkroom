describe("Increase and decrease worker population Capabilities", function () {
	
	
	describe("Add Worker" , function(){
		
		beforeEach( function(){
        Outside.init();
		$SM.set('game.workers', 20);
      
		});
		
		it("5 workers should be added to the original amount of 20 ", function() {
			/*var row = $('<div>')
			.attr('key', key)
			.attr('id', 'workers_row_' + key.replace(' ','-'))
			.addClass('workerRow');
			$('<div>').addClass('row_key').text(name).appendTo(row);
			var val = $('<div>').addClass('row_val').appendTo(row);
			var btn = $('<div>').addClass('upBtn').appendTo(val).click([1], Outside.increaseWorker);*/
			
			//var btn = document.createElement("BUTTON");
			//document.body.appendEle
			
			var btn =  {
				
				data: 5
				
			}
			
			Outside.increaseWorker(btn);
			expect($SM.get('game.workers')).toEqual(25);
			
			
			
			
			
		});
		
		
		
		
		
		
		
		
		
		
	});	
	
	/*describe("Remove Worker", function(){
		
		beforeEach( function(){
        Outside.init();
		$SM.set('game.workers',100);
		});
		
		
		it("Decrease the amount of workers by 10",function(){
			
			expect($SM.get('game.workers')).toEqual(100);
			
			
		});	
		
		
		
		
		
		
		
		
	});	*/
	
	
	
	
	
});