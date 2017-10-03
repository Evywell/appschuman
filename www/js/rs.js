var rsFunctions = function (myApp, $$) {
    var rsUrl = "http://www.euscope.eu/json/js.rs.php";
    var lang = 'fr';
    var dossiers = [];

    var listDossiers = $$('.dossiers');

    var launchWebView = function (href) {
        var ref = cordova.InAppBrowser.open(encodeURI(href), "_system", 'location=yes');
        ref.show();
    }

    var feedDossier = function (dossier) {
        var div = '<div class="dossier">';
        div += '<h1>' + dossier.nom + '</h1>';
        div += '<div class="content">' + dossier.presentation + '</div>';
        if (dossier.url) {
            div += '<div class="btns"><a href="' + dossier.url + '">En savoir plus</a></div>';
        }
        div += '</div>';
        return div;
    }

    var loadDossiers = function (lang) {
        $$.get(rsUrl, {lang: lang}, function (data){
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

myApp.onPageInit('rs', function(page) {
    rsFunctions(myApp, $$);
});