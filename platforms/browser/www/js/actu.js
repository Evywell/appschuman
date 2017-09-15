var actuFunctions = function (myApp, $$) {
    var actuUrl = "http://www.euscope.eu/json/js.actualites.php";
    var lang = 'fr';

    var listActu = $$('.listActu');

    var feedActu = function (actu, index) {
        var image;
        var div = '<li><a href="#' + index + '" class="listActu-lien">';
        if (actu.image) {
            image = actu.image;
        } else {
            image = "img/defaut-200-150.png";
        }
        div += '<div class="listActu-picto"><img src="' + image + '" class="shadow"></div>';
        div += '<div class="listActu-texte"><span class="titre-apercu">' + actu.title + '</span>';
        div += '<span class="texte-apercu">';
        if (actu.pubDate) {
            div += '<span class="pub-date-apercu">' + actu.pubDate + '</span>';
        }
        div += '</span></div></a></li>';
        return div;
    }

    var loadActu = function (lang) {
        listActu.empty();
        $$.get(actuUrl, {lang: lang}, function (data){
            var actus = JSON.parse(data).articles;
            for (var i = 0; i < actus.length; i++) {
                listActu.append(feedActu(actus[i], i));
            }
        }, function (err) {
            console.log(err);
        });
    }

    loadActu(lang);
}

myApp.onPageInit('actu', function(page) {
    actuFunctions(myApp, $$);
});