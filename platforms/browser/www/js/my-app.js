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
            laLettreFunctions(myApp, $$);
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

$$(document).on('deviceready', function() {
    console.log('ready');
    // Check si c'est la première fois qu'il ouvre l'application
    var cacheSettings = getContentFromKey('settings');
    if (cacheSettings === null) {
        // Première connection
        mainView.router.load({url: 'settings.html', reload: true});
    } else {
        if (online) {
            initAHeadScreen();
        }
    }

    //FCMPlugin.onTokenRefresh( onTokenRefreshCallback(token) );
    //Note that this callback will be fired everytime a new token is generated, including the first time.
    FCMPlugin.onTokenRefresh(function(token) {
        $$.get('https://www.robert-schuman.eu/applilettre/api/registration/fr/' + token, function(data) {
            alert(' Registration : ' + JSON.parse(data));
        });
        applicationToken = token;
        //alert(token);
    });

    //FCMPlugin.getToken( successCallback(token), errorCallback(err) );
    //Keep in mind the function will return null if the token has not been established yet.
    FCMPlugin.getToken(function(token) {
        $$.get('https://www.robert-schuman.eu/applilettre/api/registration/fr/' + token, function(data) {
            alert(' Registration : ' + JSON.parse(data));
        });
        applicationToken = token;
        //alert(token);
    });

    //FCMPlugin.subscribeToTopic( topic, successCallback(msg), errorCallback(err) );
    //All devices are subscribed automatically to 'all' and 'ios' or 'android' topic respectively.
    //Must match the following regular expression: "[a-zA-Z0-9-_.~%]{1,900}".
    FCMPlugin.subscribeToTopic('topicExample');

    //FCMPlugin.unsubscribeFromTopic( topic, successCallback(msg), errorCallback(err) );
    // FCMPlugin.unsubscribeFromTopic('topicExample');

    //FCMPlugin.onNotification( onNotificationCallback(data), successCallback(msg), errorCallback(err) )
    //Here you define your application behaviour based on the notification data.
    FCMPlugin.onNotification(function(data) {
            if (data.wasTapped) {
                //Notification was received on device tray and tapped by the user.
                //alert(JSON.stringify(data));
            } else {
                //Notification was received in foreground. Maybe the user needs to be notified.
                //alert(JSON.stringify(data));
            }
        },
        function(msg) {
            //alert(JSON.stringify(msg));
        },
        function(err) {
            //alert("Erreur onNotification :\n" + err);
        }
    );
});