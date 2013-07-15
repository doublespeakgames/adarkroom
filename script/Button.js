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
			.data("cooldown", typeof options.cooldown == 'number' ? options.cooldown : 0);
		
		el.append($("<div>").addClass('cooldown'));
		
		if(options.cost) {
			var ttPos = options.ttPos ? options.ttPos : "bottom right";
			var costTooltip = $('<div>').addClass('tooltip ' + ttPos);
			for(var k in options.cost) {
				$("<div>").addClass('row_key').text(k).appendTo(costTooltip);
				$("<div>").addClass('row_val').text(options.cost[k]).appendTo(costTooltip);
			}
			if(costTooltip.children().length > 0) {
				costTooltip.appendTo(el);
			}

			// The tooltip shares its hover state with its parent (the button),
			// which means it will still show if the cursor is hovering over
			// the tooltip. Since the tooltip and the button have no real
			// overlap, we hide the cost tooltip if the cursor moves into it.
			// Note that this overrides the CSS behaviour built in to the
			// tooltip class, so we have to be responsible for showing/hiding
			// now.
			costTooltip.mouseover(function() {
				$(this).hide();
			});
			el.mouseenter(function() {
				btn = $(this);
				if(!btn.hasClass('disabled')) {
					btn.children('div.tooltip*').show();
				}
			});
			el.mouseleave(function() {
				$(this).children('div.tooltip*').hide();
			});
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

				// We don't want the tooltip to stay around if the button
				// gets disabled...
				tooltip = btn.children('div.tooltip*');
				if(tooltip.length > 0) {
					tooltip.hide();
				}
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
	
	cooldown: function(btn) {
		var cd = btn.data("cooldown");
		if(cd > 0) {
			$('div.cooldown', btn).stop(true, true).width("100%").animate({width: '0%'}, cd * 1000, 'linear', function() {
				var b = $(this).closest('.button');
				b.data('onCooldown', false);
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