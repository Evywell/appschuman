var rsFunctions = function (myApp, $$) {
    var rsUrl = "http://www.euscope.eu/json/js.rs.php";
    var lang = getLangue();
    var dossiers = [];

    var listDossiers = $$('.dossiers');

    var textes = {
        fr: {
            header_title: "Robert Schuman",
            en_savoir_plus: "En savoir plus"
        },
        en: {
            header_title: "Robert Schuman",
            en_savoir_plus: "En savoir plus"
        },
        de: {
            header_title: "Robert Schuman",
            en_savoir_plus: "En savoir plus"
        },
        es: {
            header_title: "Robert Schuman",
            en_savoir_plus: "En savoir plus"
        },
        pl: {
            header_title: "Robert Schuman",
            en_savoir_plus: "En savoir plus"
        }
    };

    $$('.navbar .center').html(textes[lang]['header_title']);

    var launchWebView = function (href) {
        var ref = cordova.InAppBrowser.open(encodeURI(href), "_system", 'location=yes');
    }

    var feedDossier = function (dossier) {
        var div = '<div class="dossier">';
        div += '<h1>' + dossier.nom + '</h1>';
        div += '<div class="content">' + dossier.presentation + '</div>';
        if (dossier.url) {
            div += '<div class="btns"><a href="' + dossier.url + '">' + textes[lang]['en_savoir_plus'] + '</a></div>';
        }
        div += '</div>';
        return div;
    }

    var loadDossiers = function (lang) {
        listDossiers.empty();
        if (online) {
            $$.get(rsUrl, {lang: lang}, function (data){
                setContentByKey('rs', data);
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
            var cacheRs = getContentFromKey('rs');
            if (cacheRs != null) {
                dossiers = JSON.parse(cacheRs).data;
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

myApp.onPageInit('rs', function(page) {
    rsFunctions(myApp, $$);
    activeBandeau();
});