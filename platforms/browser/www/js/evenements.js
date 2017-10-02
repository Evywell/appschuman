var evenementsFunctions = function (myApp, $$) {
    var eveUrl = "http://www.euscope.eu/json/js.evenements.php";
    var lang = 'fr';

    var articles = [];
    var currentArticle = null;
    var listEve = $$('.list');
    var divArticle = $$('.article');
    var divArticleNav = $$('.article-nav');
    var divOpenPanel = $$('.open-panel');
    var articlePrevBtn =  $$('.article-prev');
    var articleNextBtn =  $$('.article-next');
    var articleBackBtn = $$('.goBack');

    // Modes: 'liste' et 'show'
    var mode = 'liste';

    var changeArticle = function (id) {
        if (id < 0 || id >= articles.length) {
            return;
        }
        loadEvenement(id);
        document.querySelector('.evenements .article').scrollTop = 0;
    }

    articleBackBtn.on('click', function (e) {
        e.preventDefault();
        mode = 'liste';
        updateNavbar();
        divArticle.removeClass('show');
        listEve.removeClass('hidden');
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

    var feedEvenement = function (article) {
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
        return div;
    }

    var loadEvenement = function (id) {
        currentArticle = id;
        divArticle.empty();
        divArticle.html(feedEvenement(articles[id]));
        divArticle.addClass('fadeIn show');
        mode = 'show';
        updateNavbar();
        listEve.addClass('hidden');
        // Enlève le fadeIn car sinon problème !
        divArticle.animationEnd(function () {
            divArticle.removeClass('fadeIn');
        })
    }

    var clickLoadEvenement = function (e) {
        e.preventDefault();
        loadEvenement(this.dataset.article);
    }

    var feedEvenements = function (article, index) {
        var image;
        var div = '<li><a href="#article' + index + '" data-article="' + index + '" class="list-lien">';
        if (article.image) {
            image = article.image;
        } else {
            image = "img/defaut-200-150.png";
        }
        div += '<div class="list-picto"><img src="' + image + '" class="shadow"></div>';
        div += '<div class="list-texte"><span class="titre-apercu">' + article.title + '</span>';
        div += '<span class="texte-apercu">';
        if (article.pubDate) {
            div += '<span class="pub-date-apercu">' + article.pubDate + '</span>';
        }
        div += '</span></div></a></li>';
        return div;
    }

    var loadEvenements = function (lang) {
        mode = 'liste';
        updateNavbar();
        // On vide la liste
        listEve.empty();
        $$.get(eveUrl, {lang: lang}, function (data){
            articles = JSON.parse(data).articles;
            for (var i in articles) {
                listEve.append(feedEvenements(articles[i], i));
            }
            // Ajout des évenements du clique
            $$('.list-lien').on('click', clickLoadEvenement);
        },function (err) {
            console.error(err);
        })
    }

    loadEvenements(lang);

}

myApp.onPageInit('evenements', function(page) {
    evenementsFunctions(myApp, $$);
});