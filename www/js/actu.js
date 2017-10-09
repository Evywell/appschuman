var actuFunctions = function (myApp, $$) {
    var actuUrl = "http://www.euscope.eu/json/js.actualites.php";
    var lang = 'fr';

    var textes = {
        fr: { header_title: "Actu'" }
    };

    var mode = 'liste';

    var articles = [];
    var currentArticle = null;
    var listActu = $$('.list');
    var divArticle = $$('.article');
    var divArticleNav = $$('.article-nav');
    var divOpenPanel = $$('.open-panel');
    var articlePrevBtn =  $$('.article-prev');
    var articleNextBtn =  $$('.article-next');
    var articleBackBtn = $$('.goBack');

    $$('.navbar .center').html(textes[lang]['header_title']);

    var launchWebView = function (href) {
        var ref = cordova.InAppBrowser.open(encodeURI(href), "_system", 'location=yes');
    }

    var changeArticle = function (id) {
        if (id < 0 || id >= articles.length) {
            return;
        }
        loadArticle(id);
    }

    articleBackBtn.on('click', function (e) {
        e.preventDefault();
        mode = 'liste';
        updateNavbar();
        divArticle.removeClass('show');
        listActu.removeClass('hidden');
    });

    articlePrevBtn.on('click', function (e) {
        e.preventDefault();
        changeArticle(parseInt(currentArticle) - 1);
    });

    articleNextBtn.on('click', function (e) {
        e.preventDefault();
        changeArticle(parseInt(currentArticle) + 1);
    });

    var updateNavbar = function () {
        if (mode == 'liste') {
            divArticleNav.addClass('hidden');
            divOpenPanel.removeClass('hidden');
            articleBackBtn.addClass('hidden');
        } else {
            articleBackBtn.removeClass('hidden');
            // Affichage des flèches de navigation
            if (currentArticle == 0) {
                articlePrevBtn.addClass('hidden');
                articleNextBtn.removeClass('hidden');
            } else if (currentArticle == articles.length - 1) {
                articlePrevBtn.removeClass('hidden');
                articleNextBtn.addClass('hidden');
            } else {
                articlePrevBtn.removeClass('hidden');
                articleNextBtn.removeClass('hidden');
            }
            divOpenPanel.addClass('hidden');
            divArticleNav.removeClass('hidden');
        }
    }

    var feedArticle = function (article) {
        var image;
        var div = '<div class="article-content"><div class="inside"><h1>' + article.title + '</h1>';
        if (article.image) {
            image = article.image;
        } else {
            image = "img/defaut-200-150.png";
        }
        div += '<div class="picto"><img src="' + image + '"></div>';
        div += '<div class="date-pub">' + article.pubDate + '</div>';
        div += '<div class="description">' + article.description + '</div></div>';
        div += '<div class="infos"></div>';
        div += '<div class="contenu inside">' + article.content + '</div></div>';
        return div;
    }

    var loadArticle = function (id) {
        currentArticle = id;
        divArticle.empty();
        divArticle.html(feedArticle(articles[id]));
        $$('.rsButtonParent a').on('click', function (e) {
            e.preventDefault();
            launchWebView(this.getAttribute('href'));
        });
        divArticle.addClass('fadeIn show');
        mode = 'show';
        updateNavbar();
        listActu.addClass('hidden');
        // Enlève le fadeIn car sinon problème !
        divArticle.animationEnd(function () {
            divArticle.removeClass('fadeIn');
        })
    }

    var clickLoadActu = function (e) {
        e.preventDefault();
        loadArticle(this.dataset.article);
    }

    var feedActu = function (actu, index) {
        var image;
        var div = '<li><a href="#article' + index + '" data-article="' + index + '" class="list-lien">';
        if (actu.image) {
            image = actu.image;
        } else {
            image = "img/defaut-200-150.png";
        }
        div += '<div class="list-picto"><img src="' + image + '" class="shadow"></div>';
        div += '<div class="list-texte"><span class="titre-apercu">' + actu.title + '</span>';
        div += '<span class="texte-apercu">';
        if (actu.pubDate) {
            div += '<span class="pub-date-apercu">' + actu.pubDate + '</span>';
        }
        div += '</span></div></a></li>';
        return div;
    }

    var loadActu = function (lang) {
        mode = 'liste';
        updateNavbar();
        listActu.empty();
        var cacheActu = getContentFromKey('actu');
        if (!online && cacheActu != null) {
            articles = JSON.parse(cacheActu);
            for (var i = 0; i < articles.length; i++) {
                listActu.append(feedActu(articles[i], i));
            }
            // Ajout des évenements du clique
            $$('.list-lien').on('click', clickLoadActu);
        } else if (!online && !cache) {
            alert("Vous devez vous connecter à internet pour afficher le ocntenu");
        } else {
            $$.get(actuUrl, {lang: lang}, function (data){
                articles = JSON.parse(data).articles;
                for (var i = 0; i < articles.length; i++) {
                    listActu.append(feedActu(articles[i], i));
                }
                setContentByKey('actu', data);
                // Ajout des évenements du clique
                $$('.list-lien').on('click', clickLoadActu);
            }, function (err) {
                console.log(err);
            });
        }

    }

    loadActu(lang);
}

myApp.onPageInit('actu', function(page) {
    actuFunctions(myApp, $$);
    activeBandeau();
});