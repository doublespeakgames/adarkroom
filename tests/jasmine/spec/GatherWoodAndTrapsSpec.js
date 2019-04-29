describe("Gather Wood and Check Traps Capabilities", function() {
  describe("Gather Wood", function() {
    it("gathers 10 wood with no cart", function() {
      Outside.init();
      var init_wood = $SM.get('stores.wood');
      Outside.gatherWood();
      expect($SM.get('stores.wood')).toEqual(init_wood + 10);
    });
  });
});
