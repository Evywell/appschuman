// Initialize app
var myApp = new Framework7();

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Views
var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true,
    animatePages: false
});

mainView.router.load({url: 'actu.html', reload: true})

// Vue de la lettre
var lettreView = myApp.addView('.lettre-view', {
    // Désactivation de l'animation lors du clique sur le lien du side panel
    animatePages: false
});

var actuView = myApp.addView('.actu-view');
var publicationsView = myApp.addView('.publications-view');
var evenementsView = myApp.addView('.evenements-view');
var opinionsView = myApp.addView('.opinons-view');
var electionsView = myApp.addView('.elections-view');
var dossiersView = myApp.addView('.dossiers-predagogique');
var rsView = myApp.addView('.rs');
var librairieView = myApp.addView('.librairie');

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    $$('.open-panel').on('click', function (e) {
        e.preventDefault();
    });
    actuFunctions(myApp, $$);
    console.log('ready');
    var push = PushNotification.init({
        android: {},
        browser: {
            pushServiceURL: 'http://push.api.phonegap.com/v1/push'
        },
        ios: {
            alert: "true",
            badge: "true",
            sound: "true"
        },
        windows: {}
    });

    push.on('registration', function (data) {
        document.querySelector('body').innerHTML = data.registrationId;
        console.log(data);
    });

    push.on('notifications', function (data) {
        console.log(data);
    });

    push.on('error', function (e) {

        document.querySelector('body').innerHTML = e;
        console.log("Erreur", e);
    });
});
