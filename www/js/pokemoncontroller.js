/**
 * Created by Gebruiker on 1-4-2016.
 */
function PokemonController(api, databasecontroller, languagecontroller) {
    this.api = api;
    this.databasecontroller = databasecontroller;
    this.languagecontroller = languagecontroller;
}

PokemonController.prototype = {
    loadPokemon: function(name, id, url, location) {
        $('#pokemontitle').text(name);
        var self = this;
        this.location = location;
        this.pokemonname = name;

        var sharePokemonButton = $('#share-pokemon');
        if(!location) {
            sharePokemonButton.hide();
        } else {
            sharePokemonButton.show();
            sharePokemonButton.on('tap', function() {
                self.onShareButtonClicked();
            });
        }

        this.databasecontroller.getPokemon(function(pokemon) {
            if(pokemon) {
                self.onPokemonFetched(pokemon);
            } else {
                self.updating = true;
                if (self.pageshowed) {
                    self.showLoader();
                }
                self.api.getPokemon(id, function(pokemon) { self.onPokemonFetched(pokemon) });
            }
        }, id);
    },
    onPageShowed: function() {
        this.pageshowed = true;
        if(this.updating) {
            this.showLoader();
        }
    },
    onPageHidden: function() {
        this.pageshowed = false;
    },
    showLoader: function() {
        $.mobile.loading("show", {
            text: this.languagecontroller.getLocalized('loading'),
            textVisible: true,
            theme: 'b'
        });
    },
    onPokemonFetched: function(pokemon) {
        this.updating = false;
        var imageholder = $('.pokemonimage');
        imageholder.append('<img src="' + this.api.getPokemonImageUrl(pokemon.id) + '" class="centered">');

        var details = $('#pokedetails');

        details.append('<li><span data-localized="order"></span>: ' + pokemon.order + '</li>');
        details.append('<li><span data-localized="experience"></span>: ' + pokemon.base_experience + '</li>');
        details.append('<li><span data-localized="weight"></span>: ' + pokemon.weight + '</li>');
        details.append('<li><span data-localized="height"></span>: ' + pokemon.height + '</li>');
        details.append('<li><span data-localized="is_default"></span>: ' + pokemon.is_default + '</li>');

        this.languagecontroller.invalidate();

        details.listview('refresh');

        $.mobile.loading("hide");
    },
    onShareButtonClicked: function() {
        var sharemessage = this.languagecontroller.getLocalized('share_message').format(this.pokemonname, this.location);
        window.plugins.socialsharing.share(sharemessage);
    }
};