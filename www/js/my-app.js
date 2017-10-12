// Initialize app
var myApp = new Framework7();

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var online = false;

// Views
var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true,
    animatePages: false
});

var applicationToken = null;
var showBandeau = false;
var devicePlatform = null;

function activeBandeau() {
    if (showBandeau) {
        var bandeau = document.querySelector('.lettre-bandeau');
        bandeau.style.display = "block";
        document.querySelector('.pages').classList.add('bandeau-show');
    } else {
        document.querySelector('.pages').classList.remove('bandeau-show');
    }
}

function getContentFromKey(key) {
    if (window.localStorage[key]) {
        console.log("Récuperation du cache pour", key);
        return window.localStorage[key];
    }
    return null;
}

function setContentByKey(key, content) {
    window.localStorage.setItem(key, content);
    console.log("Actualisation du cache pour", key);
}

function getLangue() {
    var settings = getContentFromKey('settings');
    if (settings != null) {
        return JSON.parse(settings).lang;
    }
    return 'fr';
}

// Vue de la lettre
/*var lettreView = myApp.addView('.lettre-view', {
    // Désactivation de l'animation lors du clique sur le lien du side panel
    animatePages: false
});*/

/*var actuView = myApp.addView('.actu-view');
var publicationsView = myApp.addView('.publications-view');
var evenementsView = myApp.addView('.evenements-view');
var opinionsView = myApp.addView('.opinons-view');
var electionsView = myApp.addView('.elections-view');
var dossiersView = myApp.addView('.dossiers-predagogique');
var rsView = myApp.addView('.rs');
var librairieView = myApp.addView('.librairie');
*/


// Handle Cordova Device Ready Event
document.addEventListener('online', function (){
    online = true;
    console.log('Device ', online ? 'online': 'offline');
});

function initAHeadScreen() {
    $$.get('https://robert-schuman.eu/applilettre/ahead', null, function (data) {
        data = JSON.parse(data);
        if (data.lettre_a_head) {
            mainView.router.load({url: 'la-lettre.html', reload: true});
            laLettreFunctions(myApp, $$, applicationToken);
        } else {
            mainView.router.load({url: 'actu.html', reload: true});
            actuFunctions(myApp, $$);
        }
    });

    $$.get('https://robert-schuman.eu/applilettre/bandeau', null, function (data) {
        data = JSON.parse(data);
        if (data.bandeau) {
            showBandeau = true;
        }
    });
}

function updateNotificationAccord(accord) {
    if (applicationToken) {
        $$.get('https://www.robert-schuman.eu/applilettre/api/registration/' + getLangue() + '/' + applicationToken + '/' + devicePlatform + '?accord=' + accord, function(data) {
            //alert(' Registration : ' + JSON.parse(data));
        });
    }
}

function registration() {
    var push = PushNotification.init({
        android: {
            senderID: "847561506467"
        },
        browser: {
            pushServiceURL: 'http://push.api.phonegap.com/v1/push'
        },
        ios: {
            alert: "true",
            badge: "true",
            sound: "true",
            senderID: "847561506467",
            gcmSandbox: true
        },
        windows: {}
    });

    push.on('registration', function(data) {
        // data.registrationId
        console.log('registration id: ' + data.registrationId);
        var settingsStr = getContentFromKey('settings');
        var accordNotification = false;
        if (settingsStr != null) {
            var settings = JSON.parse(settingsStr);
            if(settings.notifications === true) {
                accordNotification = true;
            }
        }
        $$.get('https://www.robert-schuman.eu/applilettre/api/registration/' + getLangue() + '/' + data.registrationId + '/' + devicePlatform + '?accord=' + accordNotification, function(data) {
            console.log('Enregistrement distant effectue');
            alert('Enregistrement distant effectue');
        });

        alert('RegistrationId: ' + data.registrationId);
    });

    push.on('notification', function(data) {
        // data.message,
        // data.title,
        // data.count,
        // data.sound,
        // data.image,
        // data.additionalData
        console.log('Notification reveived!');
        console.log(data);
        alert(data.title + "\n" + data.message);
    });

    push.on('error', function(e) {
        // e.message
        console.log('error on notification!');
        console.log(e.message);
        alert('Erreur Push: ' + e.message);
    });

    push.finish(function() {
        console.log('success');
    }, function() {
        console.log('error');
    }, 'push-1');
}

$$(document).on('deviceready', function() {
    console.log('ready');
    devicePlatform = device.platform;
    setTimeout(function () {
        navigator.splashscreen.hide();
    }, 3000);
    updatePanel(getLangue());
    // Check si c'est la première fois qu'il ouvre l'application
    var cacheSettings = getContentFromKey('settings');
    if (cacheSettings === null) {
        // Première connexion
        mainView.router.load({url: 'settings.html', reload: true});
    } else {
        if (online) {
            registration();
            initAHeadScreen();
        } else {
            mainView.router.load({url: 'actu.html', reload: true});
        }
    }
});


var globalTraductions = {
    fr: {
        actu: 'actu\'',
        la_lettre: 'la lettre',
        publications: 'publications',
        evenements: 'événements',
        opinions: 'opinions',
        elections: 'elections',
        et_aussi: 'Et Aussi',
        dossier_pedagogiques: 'dossiers pedagogiques',
        rs: 'robert schuman',
        librairie: 'librairie',
        configuration: 'configuration'
    },
    en: {
        actu: 'news',
        la_lettre: 'the letter',
        publications: 'publications',
        evenements: 'events',
        opinions: 'opinions',
        elections: 'elections',
        et_aussi: '&nbsp;',
        dossier_pedagogiques: 'information files',
        rs: 'robert schuman',
        librairie: 'bookshop',
        configuration: 'configuration'
    },
    de: {
        actu: 'news',
        la_lettre: 'the letter',
        publications: 'publications',
        evenements: 'events',
        opinions: 'opinions',
        elections: 'elections',
        et_aussi: '&nbsp;',
        dossier_pedagogiques: 'information files',
        rs: 'robert schuman',
        librairie: 'bookshop',
        configuration: 'configuration'
    },
    es: {
        actu: 'news',
        la_lettre: 'the letter',
        publications: 'publications',
        evenements: 'events',
        opinions: 'opinions',
        elections: 'elections',
        et_aussi: '&nbsp;',
        dossier_pedagogiques: 'information files',
        rs: 'robert schuman',
        librairie: 'bookshop',
        configuration: 'configuration'
    },
    pl: {
        actu: 'news',
        la_lettre: 'the letter',
        publications: 'publications',
        evenements: 'events',
        opinions: 'opinions',
        elections: 'elections',
        et_aussi: '&nbsp;',
        dossier_pedagogiques: 'information files',
        rs: 'robert schuman',
        librairie: 'bookshop',
        configuration: 'configuration'
    }
};

var panel = document.querySelector('.panel .content');
var actu = panel.querySelector('a[data-menu="actu"]');
var la_lettre = panel.querySelector('a[data-menu="lettre"]');
var publications = panel.querySelector('a[data-menu="publications"]');
var evenements = panel.querySelector('a[data-menu="evenements"]');
var opinions = panel.querySelector('a[data-menu="opinions"]');
var elections = panel.querySelector('a[data-menu="elections"]');
var dossiers_pedagogiques = panel.querySelector('a[data-menu="dossiers_pedagogiques"]');
var rs = panel.querySelector('a[data-menu="rs"]');
var librairie = panel.querySelector('a[data-menu="librairie"]');
var configuration = panel.querySelector('a[data-menu="configuration"]');
var et_aussi = panel.querySelector('.separator');

function updatePanel(lang) {
    actu.innerText = globalTraductions[lang].actu;
    la_lettre.innerText = globalTraductions[lang].la_lettre;
    publications.innerText = globalTraductions[lang].publications;
    evenements.innerText = globalTraductions[lang].evenements;
    opinions.innerText = globalTraductions[lang].opinions;
    elections.innerText = globalTraductions[lang].elections;
    dossiers_pedagogiques.innerText = globalTraductions[lang].dossier_pedagogiques;
    rs.innerText = globalTraductions[lang].rs;
    librairie.innerText = globalTraductions[lang].librairie;
    configuration.innerText = globalTraductions[lang].configuration;
    et_aussi.innerHTML = globalTraductions[lang].et_aussi;
}