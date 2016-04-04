/**
 * Created by Gebruiker on 1-4-2016.
 */

function PokelistController(api, databasecontroller, languagecontroller) {
    this.api = api;
    this.databasecontroller = databasecontroller;
    this.languagecontroller = languagecontroller;
}

PokelistController.prototype = {
    init: function() {
        var self = this;

        this.updating = true;
        this.listOffset = 0;
        this.fetchPokemons();
        $(document).on("scrollstop", function(e) { self.onSrollChange(e) });
    },
    fetchPokemons: function() {
        var self = this;

        this.databasecontroller.getPokemons(function(pokemons) {
            if(pokemons) {
                self.pokemonsReceived(pokemons);
            } else {
                self.api.getPokemons(self.listOffset, function(data) { self.pokemonsReceived(data) });
            }
        }, this.listOffset);

        //this.api.getPokemons(this.listOffset, function(data) { self.pokemonsReceived(data) });
    },
    pokemonsReceived: function(pokemons) {

        var pokelist = $('#pokelist');

        for(var i = 0; i < pokemons.length; i++) {
            var pokemon = pokemons[i];
            pokelist.append('<li><a data-transition="slideup" href="pokemonview.html?name=' + pokemon.name + '&id=' + pokemon.id + '&url=' + pokemon.url + '"><img src="' + pokemon.image + '"/>' + pokemon.name + '</a></li>');
        }
        pokelist.listview("refresh");
        this.updating = false;
        $.mobile.loading("hide");
    },
    onSrollChange: function() {
        if (this.updating) return;

        var activePage = $.mobile.pageContainer.pagecontainer("getActivePage"),
            screenHeight = $.mobile.getScreenHeight(),
            contentHeight = $(".ui-content", activePage).outerHeight(),
            header = $(".ui-header", activePage).outerHeight() - 1,
            scrolled = $(window).scrollTop(),
            footer = $(".ui-footer", activePage).outerHeight() - 1,
            scrollEnd = contentHeight - screenHeight + header + footer;
        if (activePage[0].id == "home" && scrolled >= scrollEnd) {
            this.updating = true;
            this.listOffset += 30;
            var self = this;

            $.mobile.loading("show", {
                text: this.languagecontroller.getLocalized('loading_more'),
                textVisible: true,
                theme: 'b'
            });

            this.fetchPokemons();
        }
    }
}