(function(){
	//only used for poedit to find translatable strings
	var keywords = [ _('saved.'), _('wood'),_('builder'),_('teeth'),_('meat'),_('fur'), _('alien alloy'), _('bullets'),
	                 _('charm'),_('leather'),_('iron'), _('steel'), _('coal'), _('enegy cell'),
	                 _('torch'),_('medicine'),_('hunter'),_('trapper'),_('tanner'), _('grenade'), _('bolas'), 
	                 _("charcutier"),_('iron miner'),_('coal miner'), _('sulphur miner'),  _('armourer'),
	                 _('steelworker'),_('bait'),_('cured meat'), _('scales'), _('compass'), _('laser rifle'),
	                 _('gatherer'),_('cloth'), _('scales'), _('cured meat'), _('thieves'),
	                 _('not enough fur'), _('not enough wood'), _('not enough coal'), _('not enough iron'), _('not enough steel'), _('baited trap'),
			 _('not enough scales'),_('not enough cloth'),  _('not enough teeth'), _('not enough leather'),
	                 _('the compass points east.'), _('the compass points west.'), _('the compass points north.'), _('the compass points south.'), 
	                 _('the compass points northeast.'), _('the compass points northwest.'), _('the compass points southeast.'), _('the compass points southwest.')]; 
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
			div#dropMenu:before { content: \''+ _("drop:") + '\'}\
			div#village.noHuts:before { content: \'' + _("forest") + '\'}\
			div#village:before { content: \'' + _("village") + '\'}\
	').appendTo($('head'));
})();
