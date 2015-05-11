var Button = {
	Button: function(options) {
		if(typeof options.cooldown == 'number') {
			this.data_cooldown = options.cooldown;
		}
		this.data_remaining = 0;
		if(typeof options.click == 'function') {
			this.data_handler = options.click;
		}

		var el = $('<div>')
			.attr('id', typeof(options.id) != 'undefined' ? options.id : "BTN_" + Engine.getGuid())
			.addClass('button')
			.text(typeof(options.text) != 'undefined' ? options.text : "button")
			.click(function() {
				if(!$(this).hasClass('disabled')) {
					Button.cooldown($(this));
					$(this).data("handler")($(this));
				}
			})
			.data("handler",  typeof options.click == 'function' ? options.click : function() { Engine.log("click"); })
			.data("remaining", 0)
			.data("cooldown", typeof options.cooldown == 'number' ? options.cooldown : 0)
			.data("state", options.state || false);

		el.append($("<div>").addClass('cooldown'));

		if((options.state) && (!el.hasClass('disabled'))){
			// waiting for expiry of residual cooldown detected in state
			Button.cooldown(el, true);
		}

		if(options.cost) {
			var ttPos = options.ttPos ? options.ttPos : "bottom right";
			var costTooltip = $('<div>').addClass('tooltip ' + ttPos);
			for(var k in options.cost) {
				$("<div>").addClass('row_key').text(_(k)).appendTo(costTooltip);
				$("<div>").addClass('row_val').text(options.cost[k]).appendTo(costTooltip);
			}
			if(costTooltip.children().length > 0) {
				costTooltip.appendTo(el);
			}
		}

		if(options.width) {
			el.css('width', options.width);
		}

		return el;
	},

	setDisabled: function(btn, disabled) {
		if(btn) {
			if(!disabled && !btn.data('onCooldown')) {
				btn.removeClass('disabled');
			} else if(disabled) {
				btn.addClass('disabled');
			}
			btn.data('disabled', disabled);
		}
	},

	isDisabled: function(btn) {
		if(btn) {
			return btn.data('disabled') === true;
		}
		return false;
	},

	cooldown: function(btn,state) {
		var cd = btn.data("cooldown") * 2;
		var id = 'cooldown.'+ btn.attr('id');
		if((cd > 0) && ((state && $SM.get(id)) || (!state))) {
			// param "start" takes value from cooldown time if not specified
			if($SM.get(id)){
				var start = $SM.get(id)
			} else {
				var start = cd;
				$SM.set(id,start);
			}
			if(btn.data("state")){
				// residual value is measured as half seconds and stored accordingly
				// saves program performance
				var residual = Engine.setInterval(function(){
					$SM.set(id,($SM.get(id) - 1));
				},500);
			}
			var time = start;
			if (Engine.options.doubleTime){
				time /= 2;
			}
			$('div.cooldown', btn).stop(true, true).width(Math.floor((start / cd) * 100) +"%").animate({width: '0%'}, time * 500, 'linear', function() {
				var b = $(this).closest('.button');
				b.data('onCooldown', false);
				window.clearInterval(residual);
				if(!b.data('disabled')) {
					b.removeClass('disabled');
				}
			});
			btn.addClass('disabled');
			btn.data('onCooldown', true);
		}
	},

	clearCooldown: function(btn) {
		$('div.cooldown', btn).stop(true, true);
		btn.data('onCooldown', false);
		if(!btn.data('disabled')) {
			btn.removeClass('disabled');
		}
	}
};
