var Prestige = {
  save: function() {
    var prevStores = [
      $SM.get('stores.wood'),
      $SM.get('stores.fur'),
      $SM.get('stores.meat'),
      $SM.get('stores.iron'),
      $SM.get('stores.coal'),
      $SM.get('stores.sulphur'),
      $SM.get('stores.steel'),
      $SM.get('stores.cured meat'),
      $SM.get('stores.bullets'),
      $SM.get('stores.scales'),
      $SM.get('stores.teeth'),
      $SM.get('stores.leather')
    ];
    return prevStores;
  }
}