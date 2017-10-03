var librairieFunctions = function (myApp, $$) {
    var libUrl = "http://www.euscope.eu/json/js.librairie.php";
    var lang = 'fr';

    var articles = [];
    var currentArticle = null;
    var listArticle = $$('.list');
    var divArticle = $$('.article');
    var divArticleNav = $$('.article-nav');
    var divOpenPanel = $$('.open-panel');
    var articlePrevBtn =  $$('.article-prev');
    var articleNextBtn =  $$('.article-next');
    var articleBackBtn = $$('.goBack');

    var filters = $$('.filtres a');

    // Modes: 'liste' et 'show'
    var mode = 'liste';

    var launchWebView = function (href) {
        var ref = cordova.InAppBrowser.open(encodeURI(href), "_system", 'location=yes');
    }

    var clearActifFilter = function () {
        filters.removeClass('active');
    }

    var changeFilter = function (e) {
        e.preventDefault();
        clearActifFilter();
        this.classList.add('active');
        var type = this.dataset.type;
        loadArticles(lang, type);
    }

    var changeArticle = function (id) {
        if (id < 0 || id >= articles.length) {
            return;
        }
        loadArticle(id);
        document.querySelector('.librairie .article').scrollTop = 0;
    }

    articleBackBtn.on('click', function (e) {
        e.preventDefault();
        mode = 'liste';
        updateNavbar();
        divArticle.removeClass('show');
        listArticle.removeClass('hidden');
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
        var div = '<div class="article-content"><div class="inside"><h1>' + article.title + '</h1>';
        div += '<div class="article-infos"><div class="picto"><img src="' + article.image + '"></div>';
        div += '<div class="date-pub">' + article.pubDate + '</div>';
        div += '<div class="editeur">Editeur : ' + article.editeur + '</div>';
        div += '<div class="nbpages">Nombre de pages : ' + article.nb_pages + '</div>';
        div += '<div class="isbn">ISBN : ' + article.isbn + '</div></div>';
        div += '<div class="contenu inside">' + article.content + '</div>';
        div += '<div class="btns"><a href="https://www.robert-schuman.eu' + article.url + '" class="rs-button">En savoir plus et commander</a></div></div>';
        return div;
    }

    var loadArticle = function (id) {
        currentArticle = id;
        divArticle.empty();
        divArticle.html(feedArticle(articles[id]));
        divArticle.addClass('fadeIn show');
        mode = 'show';
        updateNavbar();
        listArticle.addClass('hidden');
        // Enlève le fadeIn car sinon problème !
        divArticle.animationEnd(function () {
            divArticle.removeClass('fadeIn');
        })
        $$('.article a').on('click', function (e) {
            e.preventDefault();
            launchWebView(this.getAttribute('href'));
        });
    }

    var clickLoadArticle = function (e) {
        e.preventDefault();
        loadArticle(this.dataset.article);
    }

    var feedArticles = function (article, index) {
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

    var loadArticles = function (lang, type) {
        mode = 'liste';
        updateNavbar();
        // On vide la liste
        listArticle.empty();
        $$.get(libUrl, {lang: lang}, function (data){
            articles = JSON.parse(data);
            console.log(articles);
            for (var i in articles) {
                if (articles[i].id_type == type) {
                    listArticle.append(feedArticles(articles[i], i));
                }
            }
            // Ajout des évenements du clique
            $$('.list-lien').on('click', clickLoadArticle);
        },function (err) {
            console.error(err);
        })
    }

    var initFilters = function () {
        filters.on('click', changeFilter);
    }

    loadArticles(lang, 5);
    initFilters();

}

myApp.onPageInit('librairie', function(page) {
    librairieFunctions(myApp, $$);
});