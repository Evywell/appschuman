var electionsFunctions = function (myApp, $$) {
    var eveUrl = "http://www.euscope.eu/json/js.elections.php";
    var lang = 'fr';


    var textes = {
        fr: { header_title: "Elections", article_auteur: "Par" }
    };

    $$('.navbar .center').html(textes[lang]['header_title']);

    var articles = [];
    var currentArticle = null;
    var listElections = $$('.list');
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
        loadElection(id);
        document.querySelector('.elections .article').scrollTop = 0;
    }

    articleBackBtn.on('click', function (e) {
        e.preventDefault();
        mode = 'liste';
        updateNavbar();
        divArticle.removeClass('show');
        listElections.removeClass('hidden');
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

    var feedElection = function (article) {
        var image;
        var div = '<div class="article-content"><div class="inside"><h1>' + article.title + '</h1>';
        if (article.image) {
            image = article.image;
        } else {
            image = "img/defaut-200-150.png";
        }
        div += '<div class="picto"><img src="' + image + '"></div>';
        div += '<div class="date-pub">' + article.pubDate + '</div></div>';
        div += '<div class="infos"><strong><em>' + textes[lang]['article_auteur'] + ':</em></strong><br />' + article.auteur + '</div>';
        div += '<div class="contenu inside">' + article.content + '</div></div>';
        return div;
    }

    var loadElection = function (id) {
        currentArticle = id;
        divArticle.empty();
        divArticle.html(feedElection(articles[id]));
        divArticle.addClass('fadeIn show');
        mode = 'show';
        updateNavbar();
        listElections.addClass('hidden');
        // Enlève le fadeIn car sinon problème !
        divArticle.animationEnd(function () {
            divArticle.removeClass('fadeIn');
        })
    }

    var clickLoadElection = function (e) {
        e.preventDefault();
        loadElection(this.dataset.article);
    }

    var feedElections = function (article, index) {
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

    var loadElections = function (lang) {
        mode = 'liste';
        updateNavbar();
        // On vide la liste
        listElections.empty();
        $$.get(eveUrl, {lang: lang}, function (data){
            articles = JSON.parse(data).articles;
            for (var i in articles) {
                listElections.append(feedElections(articles[i], i));
            }
            // Ajout des évenements du clique
            $$('.list-lien').on('click', clickLoadElection);
        },function (err) {
            console.error(err);
        })
    }

    loadElections(lang);

}

myApp.onPageInit('elections', function(page) {
    electionsFunctions(myApp, $$);
    activeBandeau();
});