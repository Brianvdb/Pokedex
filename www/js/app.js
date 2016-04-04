var app = {
    // Application Constructor
    initialize: function() {
        this.api = new API(this);

        // init controllers
        this.languagecontroller = new LanguageController();
        this.databasecontroller = new DatabaseController(this.api);
        this.pokelistcontroller = new PokelistController(this.api, this.databasecontroller);
        this.pokemoncontroller = new PokemonController(this.api, this.databasecontroller, this.languagecontroller);
        this.catchcontroller = new CatchController(this.api, this.databasecontroller, this.languagecontroller);
        this.navigatecontroller = new NavigateController();
        this.tabcontroller = new TabController(this.catchcontroller);

        // binds events
        this.bindEvents();

        $.urlParam = this.getParameterByName;
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        var self = this;
        document.addEventListener('deviceready', function() { self.onDeviceReady() }, false);
        $(document).on("pagecontainerbeforeshow", function(event, ui) { self.onPageBeforeShow(event, ui) });
        $(document).on('pagecontainershow', function(event, ui) { self.onPageShow(event, ui) });
    },
    onDeviceReady: function() {
        this.databasecontroller.init();
        this.tabcontroller.init();
        this.pokelistcontroller.init();
    },
    onPageBeforeShow: function(event, ui) {
        var id = ui.toPage[0].id;
        if (id == 'pokemonview') {
            var url = ui.toPage.data('url');
            var name = $.urlParam(url, 'name');
            var apiUrl = $.urlParam(url, 'url');
            var pokemonid = $.urlParam(url, 'id');
            this.pokemoncontroller.loadPokemon(name, pokemonid, apiUrl);
        }

        this.languagecontroller.invalidate();
    },
    onPageShow: function(event, ui) {
        console.log('show..');
        var id = ui.toPage[0].id;
        if(id == 'map-page') {
            var url = ui.toPage.data('url');
            console.log('url: ' + url);
            var lat = $.urlParam(url, 'lat');
            var lng = $.urlParam(url, 'lng');
            this.navigatecontroller.loadMap(lat, lng);
        }
        if(id == 'pokemonview') {
            this.pokemoncontroller.onPageShowed();
        }
    },
    getParameterByName: function(url, name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(url);
        if (results == null) {
            return null;
        } else {
            return decodeURI(results[1]) || 0;
        }
    }
};