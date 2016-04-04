/**
 * Created by Gebruiker on 3-4-2016.
 */
function LanguageController() {
    this.translations = [];
    this.translations['tab_pokemons'] = {english: 'Pokemons', dutch: 'Pokemons', german: 'Pokemons'};
    this.translations['tab_catch'] = {english: 'Catch', dutch: 'Vangen', german: 'Fangen'};
    this.translations['settings'] = {english: 'Settings', dutch: 'Instellingen', german: 'Einstellungen'};
    this.translations['nav_pokemon'] = {english: 'Go to pokemon', dutch: 'Ga naar pokemon', german: 'Geh zu pokemon'};
    this.translations['order'] = {english: 'order', dutch: 'volgorde', german: 'ordnung'};
    this.translations['experience'] = {english: 'experience', dutch: 'experience', german: 'erfahrung'};
    this.translations['weight'] = {english: 'weight', dutch: 'gewicht', german: 'gewicht'};
    this.translations['height'] = {english: 'height', dutch: 'hoogte', german: 'höhe'};
    this.translations['is_default'] = {english: 'is default', dutch: 'is standaard', german: 'ist standard'};
    this.translations['secret_pokemon'] = {english: 'Secret pokemon', dutch: 'Geheime pokemon', german: 'Geheimnis pokemon'};
    this.translations['secret_pokemon_notfound'] = {english: 'You have not found this pokemon yet!', dutch: 'Je hebt deze pokemon nog niet gevonden!', german: 'Sie haben nicht dieses Pokemon gefunden!'};
    this.translations['back'] = {english: 'Back', dutch: 'Terug', german: 'Zurück'};
    this.translations['loading_more'] = {english: 'loading more...', dutch: 'meer laden...', german: 'mehr laden...'};
    this.translations['loading'] = {english: 'loading...', dutch: 'laden...', german: 'laden...'};
    this.translations['language'] = {english: 'Language', dutch: 'Taal', german: 'Sprache'};
    this.translations['share'] = {english: 'Share', dutch: 'Delen', german: 'Teilen'};
    this.translations['share_message'] = {english: 'Pokedex App: I caught the pokemon {0} at location: {1}', dutch: 'Pokedex App: Ik heb de pokemon {0} gevangen op locatie: {1}', german: 'Pokedex App: Ich habe die Pokemon {0} nach Ort gefangen: {1}'};
    this.translations['credits'] = {english: 'Made by Stan van Heumen and Brian van den Broek', dutch: 'Gemaakt door Stan van Heumen and Brian van den Broek', german: 'Hergestellt von Stan van Heumen und Brian van den Broek'};

    this.language = localStorage.getItem('language');
    if(!this.language) {
        this.language = 'english';
    }
}

LanguageController.prototype = {
    invalidate: function() {
        var self = this;
        $('[data-localized]').each(function() {
            var localized = $(this).data('localized');
            $(this).text(self.getLocalized(localized));
        })
    },
    getLocalized: function(key) {
        return this.translations[key][this.language];
    },
    setLanguage: function(language) {
        this.language = language;
        localStorage.setItem('language', language);
        this.invalidate();
    },
    getLanguage: function() {
        return this.language;
    }
}