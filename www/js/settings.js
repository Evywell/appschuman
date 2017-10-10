var settingsFunctions = function (myApp, $$) {

    var lang = 'fr';
    var notifications_active = true;

    // Divs
    var divTitre = document.querySelector('.settings h1');
    var divChoixLangue = document.querySelector('.settings .settings-choix-langue');
    var divNotificationTitre = document.querySelector('.settings .settings-notifications-titre');
    var divNotificationEnable = document.querySelector('.settings .notification-text');
    var divSaveSettings = document.querySelector('.settings .settings-save button');
    var checkbox = document.querySelector('input[type="checkbox"]');
    var divSwitch = document.querySelector('.switch');

    var textes = {
        fr: { configuration_titre: "configuration", choix_langue: "Langue de l'Application", notification_titre: "Notifications", notification_texte: "Recevoir les notifications", sauvegarder: "Enregistrer"},
        en: { configuration_titre: "configuration", choix_langue: "Application Language", notification_titre: "Notifications", notification_texte: "Receive Notifications", sauvegarder: "Save Settings"},
        de: { configuration_titre: "Konfiguration", choix_langue: "Sprache der Anwendung", notification_titre: "Benachrichtigungen", notification_texte: "Benachrichtigungen erhalten", sauvegarder: "Save Settings"},
        es: { configuration_titre: "Configuración", choix_langue: "Idioma de la aplicación", notification_titre: "Notificaciones", notification_texte: "Recibir notificaciones", sauvegarder: "Save Settings"},
        pl: { configuration_titre: "configuration", choix_langue: "Application Language", notification_titre: "Notifications", notification_texte: "Receive Notifications", sauvegarder: "Save Settings"}
    };

    $$('.settings .settings-content .block-buttons button').on('click', changeLanguage);
    divSaveSettings.addEventListener('click', saveSettings);
    divSwitch.addEventListener('click', function (e) {
        e.preventDefault();
        if (checkbox.hasAttribute('checked')) {
            checkbox.removeAttribute('checked');
            notifications_active = false;
        } else {
            checkbox.setAttribute('checked', 'checked');
            notifications_active = true;
        }
    });

    function changeLanguage(e) {
        e.preventDefault();
        lang = this.dataset.lang;
        $$('.settings .settings-content .block-buttons button').removeClass('active');
        this.classList.add('active');
        reloadMenu(lang);
    }

    function reloadMenu(lang) {
        divTitre.innerText = textes[lang].configuration_titre;
        divChoixLangue.innerText = textes[lang].choix_langue;
        divNotificationTitre.innerText = textes[lang].notification_titre;
        divNotificationEnable.innerText = textes[lang].notification_texte;
        divSaveSettings.innerText = textes[lang].sauvegarder;
    }

    function saveSettings(e) {
        e.preventDefault();
        var settings = {lang: lang, notifications: notifications_active};
        setContentByKey('settings', JSON.stringify(settings));
        initAHeadScreen();
        $$('.navbar').show();
    }

}

myApp.onPageInit('settings', function(page) {
    $$('.navbar').hide();
    settingsFunctions(myApp, $$);
    activeBandeau();
});