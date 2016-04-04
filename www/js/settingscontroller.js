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
        $("input[value='" + language + "']").prop('checked', true);
        $("input[type='radio']").checkboxradio("refresh");
        $("input[name='language']").change(function() { self.onLanguageChange(this); });
        this.initPlaceholders();
        this.initInputFields();
    },
    onLanguageChange: function(element) {
        var language = $(element).val();
        this.languagecontroller.setLanguage(language);
        this.initPlaceholders();
    },
    initPlaceholders: function () {
        $("#firstname").attr('placeholder', this.languagecontroller.getLocalized('first_name'));
        $("#lastname").attr('placeholder', this.languagecontroller.getLocalized('last_name'));
    },
    initInputFields: function () {
        var firstname = $('#firstname');
        var lastname = $('#lastname');
        firstname.on('input', function () {
            localStorage.setItem('firstname', $(this).val());
        });
        lastname.on('input', function () {
            localStorage.setItem('lastname', $(this).val());
        });

        var firstname_text = localStorage.getItem('firstname');
        var lastname_text = localStorage.getItem('lastname');
        if (firstname_text) firstname.val(firstname_text);
        if (lastname_text) lastname.val(lastname_text);
    }
};
