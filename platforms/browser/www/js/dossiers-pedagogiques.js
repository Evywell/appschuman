var dossiersFunctions = function (myApp, $$) {
    var dossiersUrl = "http://www.euscope.eu/json/js.dossiers-pedagogiques.php";
    var lang = 'fr';
    var dossiers = [];

    var listDossiers = $$('.dossiers');

    var launchWebView = function (href) {
        var ref = cordova.InAppBrowser.open(encodeURI(href), "_system", 'location=yes');
        ref.show();
    }

    var feedDossier = function (dossier) {
        console.log(dossier);
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
        $$.get(dossiersUrl, {lang: lang}, function (data){
            dossiers = JSON.parse(data).data;
            listDossiers.empty();
            for (var i in dossiers) {
                listDossiers.append(feedDossier(dossiers[i]));
            }
            $$('a').on('click', function (e) {
               e.preventDefault();
               launchWebView(this.getAttribute('href'));
            });
        },function (err) {
            console.error(err);
        })
    }

    loadDossiers(lang);

}

myApp.onPageInit('dossiers-pedagogiques', function(page) {
    dossiersFunctions(myApp, $$);
});