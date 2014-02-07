(function(){
	//only used for poedit to find translatable strings
	var keywords = [ _('wood'),_('builder'),_('teeth'),_('meat'),_('fur'), _('alien alloy'), _('bullets'),
	                 _('charm'),_('leather'),_('iron'), _('steel'), _('coal'),
	                 _('torch'),_('medicine'),_('hunter'),_('trapper'),_('tanner'),
	                 _("charcutier"),_('iron miner'),_('coal miner'), _('sulphur miner'),  _('armourer'),
	                 _('steelworker'),_('bait'),_('cured meat'), _('scales'), _('compass'),
	                 _('gatherer'),_('cloth'), _('scales'), _('cured meat'), _('thieves'),
	                 _('not enough fur.'), _('not enough wood.'), _('not enough coal.'), _('not enough iron.'), _('not enough steel.'), _('baited trap'),
	                 _('the compass points east.'), _('the compass points west.'), _('the compass points north.'), _('the compass points south.')]; 
	delete keywords;
	
	//translate text in css by overriding attributes
	$("<style>").text('\
			div#stores:before{ content: \''+ _("stores") + '\'}\
			div#weapons:before{ content: \''+ _("weapons") + '\'}\
			div#buildBtns:before{ content: \''+ _("build:") + '\'}\
			div#craftBtns:before{ content: \''+ _("craft:") + '\'}\
			div#buyBtns:before{ content: \''+ _("buy:") + '\'}\
			div#outfitting:before{ content: \''+ _("supplies:") + '\'}\
			div#perks:before{ content: \''+ _("perks:") + '\'}\
			div#lootButtons:before { content: \''+ _("take:") + '\'}\
	').appendTo($('head'));
	
	// resize buttons so the text is not wrap
	function resizeButtons($div){
		return;
		var maxWidth = 80;
		$div.find('.button').each(function(){
			$(this).data('display',$(this).css('display'));
		}).css({
			width: "auto",
			display: "inline-block"
		}).each(function(){
			maxWidth = Math.max($(this).width(), maxWidth);
		}).css({
			width: maxWidth+"px"
		}).each(function(){
			$(this).css('display',$(this).data('display'));			
		});
	}
	
	parseOutsidePanel = false;
	$(document).on("DOMNodeInserted", "#outsidePanel",function(){
		resizeButtons($(this));
	});
	$(document).on("DOMNodeInserted", "#roomPanel",function(){
		resizeButtons($(this));
	});
	$(document).on("DOMNodeInserted", "#buttons",function(){
		resizeButtons($(this));
	});
	
	document.addEventListener("DOMNodeInserted", function(){
		if(parseOutsidePanel) return;
		else if($("#outsidePanel").length){
			resizeButtons($("#outsidePanel"));
			$('#outsidePanel')[0].addEventListener("DOMNodeInserted", resizeButtons($("#outsidePanel")));		
			parseOutsidePanel = true;
		}
	});
	
})();