var Score = {

	name : 'Score',

	options : {},

	init : function(options) {
		this.options = $.extend(this.options, options);
	},

	calculateScore : function() {
		var scoreUnadded = Prestige.getStores(false);
		var fullScore = 0;
		
		var factor = [1, 1.5, 1, 2, 2, 3, 3, 2, 2, 2, 2, 1.5, 1, 
			     1, 10, 30, 50, 100, 150, 150, 3, 3, 5, 4];
		for(var i = 0; i< factor.length; i++){
			fullScore += scoreUnadded[i] * factor[i];
		}
		
		fullScore = fullScore + $SM.get('stores["alien alloy"]', true) * 10;
		fullScore = fullScore + $SM.get('stores["fleet beacon"]', true) * 500;
		fullScore = fullScore + Ship.getMaxHull() * 50;
		return Math.floor(fullScore);
	},

	save: function() {
		$SM.set('playStats.score', Score.calculateScore());
	},

	totalScore : function() {
		return $SM.get('previous.score', true) + Score.calculateScore();
	}
};
