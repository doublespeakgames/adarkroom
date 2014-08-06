/**
 * Module that registers the notification box and handles messages
 */
var Notifications = {
	
	init: function(options) {
		this.options = $.extend(
			this.options,
			options
		);
		this.options.maxSize = 50;
		
		// Create the notifications box
		elem = $('<div>').attr({
			id: 'notifications',
			className: 'notifications'
		});
		
		elem.appendTo('div#wrapper');
	},
	
	options: {}, // Nothing for now
	
	elem: null,
	
	notifyQueue: {},
	
	// Allow notification to the player
	notify: function(module, text, noQueue) {
		if(typeof text == 'undefined') return;
		if(text.slice(-1) != ".") text += ".";
		if(module != null && Engine.activeModule != module) {
			if(!noQueue) {
				if(typeof this.notifyQueue[module] == 'undefined') {
					this.notifyQueue[module] = new Array();
				}
				this.notifyQueue[module].push(text);
			}
		} else {
			Notifications.printMessage(text);
		}
		Engine.saveGame();
	},
	
	clearHidden: function() {
		// To fix some memory usage issues, we clear notifications after the last 50.
		$('#notifications').find(":nth-child(n+" + this.options.maxSize + ")").remove();
	},
	
	printMessage: function(text, tooltipText) {
		tooltipText = "helo";
		var text = $('<div>').addClass('notification').text(text).prependTo('div#notifications');
		if (tooltipText) {
			var tooltip = $('<div>').addClass('tooltip');
			tooltip.text(tooltipText);
			tooltip.appendTo(text);
		}
		Notifications.clearHidden();
	},
	
	printQueue: function(module) {
		if(typeof this.notifyQueue[module] != 'undefined') {
			while(this.notifyQueue[module].length > 0) {
				Notifications.printMessage(this.notifyQueue[module].shift());
			}
		}
	}
};
