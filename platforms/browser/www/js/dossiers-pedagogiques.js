var dossiersFunctions = function (myApp, $$) {
    var dossiersUrl = "http://www.euscope.eu/json/js.dossiers-pedagogiques.php";
    var lang = getLangue();
    var dossiers = [];

    var textes = {
        fr: { header_title: "Dossiers pédagogiques" },
        en: { header_title: "Our information files" },
        de: { header_title: "Our information files" },
        es: { header_title: "Our information files" },
        pl: { header_title: "Our information files" }
    };

    $$('.navbar .center').html(textes[lang]['header_title']);

    var listDossiers = $$('.dossiers');

    var launchWebView = function (href) {
        var ref = cordova.InAppBrowser.open(encodeURI(href), "_system", 'location=yes');
    }

    var feedDossier = function (dossier) {
        var image;
        if (dossier.image) {
            image = dossier.image;
        } else {
            image = "img/defaut-200-150.png";
        }
        var div = '<div class="dossier">';
        div += '<h1>' + dossier.nom + '</h1>';
        div += '<div class="image"><img src="' + image + '"></div>';
        div += '<div class="content">' + dossier.presentation + '</div>';
        div += '<div class="btns"><a href="' + dossier.url + '">En savoir plus</a></div>';
        div += '</div>';
        return div;
    }

    var loadDossiers = function (lang) {
        listDossiers.empty();
        if (online) {
            var l = (lang != 'fr' && lang != 'en') ? 'fr' : lang;
            $$.get(dossiersUrl, {lang: l}, function (data){
                setContentByKey('dossiers', data);
                dossiers = JSON.parse(data).data;
                for (var i in dossiers) {
                    listDossiers.append(feedDossier(dossiers[i]));
                }
                $$('.dossier a').on('click', function (e) {
                    e.preventDefault();
                    launchWebView(this.getAttribute('href'));
                });
            },function (err) {
                console.error(err);
            })
        } else {
            var cacheDossiers = getContentFromKey('dossiers');
            if (cacheDossiers != null) {
                dossiers = JSON.parse(cacheDossiers).data;
                for (var i in dossiers) {
                    listDossiers.append(feedDossier(dossiers[i]));
                }
                $$('.dossier a').on('click', function (e) {
                    e.preventDefault();
                    launchWebView(this.getAttribute('href'));
                });
            }
        }

    }

    loadDossiers(lang);

}

myApp.onPageInit('dossiers-pedagogiques', function(page) {
    dossiersFunctions(myApp, $$);
    activeBandeau();
});