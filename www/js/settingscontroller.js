/**
 * Created by Gebruiker on 4-4-2016.
 */
function SettingsController(languagecontroller) {
    this.languagecontroller = languagecontroller;
}

SettingsController.prototype = {
    init: function() {
        var self = this;
        var language = this.languagecontroller.getLanguage();
        console.log('language: ' + language);
        $("input[value='" + language + "']").prop('checked', true);
        $("input[type='radio']").checkboxradio("refresh");
        $("input[name='language']").change(function() { self.onLanguageChange(this); });
    },
    onLanguageChange: function(element) {
        var language = $(element).val();
        this.languagecontroller.setLanguage(language);
    }
}
