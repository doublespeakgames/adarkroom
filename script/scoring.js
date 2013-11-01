var Score = {

	name: 'Score',

	options: {},

	init: function(options) {
		this.options = $.extend(this.options, options);
	},

  calculateScore: function() {
    var scoreUnadded = $SM.getStores();
      var fullScore = 0;
      fullScore = fullScore + scoreUnadded[0] * 1;
      fullScore = fullScore + scoreUnadded[1] * 1.5;
      fullScore = fullScore + scoreUnadded[2] * 1;
      fullScore = fullScore + scoreUnadded[3] * 2;
      fullScore = fullScore + scoreUnadded[4] * 2;
      fullScore = fullScore + scoreUnadded[5] * 3;
      fullScore = fullScore + scoreUnadded[6] * 3;
      fullScore = fullScore + scoreUnadded[7] * 2;
      fullScore = fullScore + scoreUnadded[8] * 2;
      fullScore = fullScore + scoreUnadded[9] * 2;
      fullScore = fullScore + scoreUnadded[10] * 2;
      fullScore = fullScore + scoreUnadded[11] * 1.5;
      fullScore = fullScore + scoreUnadded[12] * 1;
      fullScore = fullScore + scoreUnadded[13] * 1;
      fullScore = fullScore + scoreUnadded[14] * 10;
      fullScore = fullScore + scoreUnadded[15] * 30;
      fullScore = fullScore + scoreUnadded[16] * 50;
      fullScore = fullScore + scoreUnadded[17] * 100;
      fullScore = fullScore + scoreUnadded[18] * 150;
      fullScore = fullScore + scoreUnadded[19] * 150;
      fullScore = fullScore + scoreUnadded[20] * 3;
      fullScore = fullScore + scoreUnadded[21] * 3;
      fullScore = fullScore + scoreUnadded[22] * 5;
      fullScore = fullScore + scoreUnadded[23] * 4;
      fullScore = fullScore + $SM.get('stores["alien alloy"]') * 10;
      fullScore = fullScore + Ship.getMaxHull() * 50;
    return fullScore;
  },
  
  saveScore: function() {
    var score = Score.calculateScore();
    $SM.set('playStats.score',score);
    return score;
  },
  
  totalScore: function() {
    var totScore = $SM.get('previous.score') + Score.saveScore(); //$SM.get('playStats.score');
    if (!totScore) {totScore = $SM.get('playStats.score')};
    return totScore;
  }
}