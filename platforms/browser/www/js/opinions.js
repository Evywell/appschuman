var opinionsFunctions = function (myApp, $$) {
    var opinionUrl = "http://www.euscope.eu/json/js.opinions.php";
    var lang = 'fr';

    var textes = {
        fr: {
            header_title: "Opinions",
            auteur: "Par"
        }
    };

    $$('.navbar .center').html(textes[lang]['header_title']);

    var articles = [];
    var currentArticle = null;
    var listOpinions = $$('.list');
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
        loadOpinion(id);
        document.querySelector('.opinions .article').scrollTop = 0;
    }

    articleBackBtn.on('click', function (e) {
        e.preventDefault();
        mode = 'liste';
        updateNavbar();
        divArticle.removeClass('show');
        listOpinions.removeClass('hidden');
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

    var feedOpinion = function (article) {
        var image;
        var div = '<div class="article-content"><div class="inside"><h1>' + article.title + '</h1>';
        if (article.image) {
            image = article.image;
        } else {
            image = "img/defaut-200-150.png";
        }
        div += '<div class="picto"><img src="' + image + '"></div>';
        div += '<div class="date-pub">' + article.pubDate + '</div></div>';
        div += '<div class="infos"><strong><em>' + textes[lang]['auteur'] + ':</em></strong><br />' + article.auteur + '</div>';
        div += '<div class="contenu inside">' + article.content + '</div></div>';
        return div;
    }

    var loadOpinion = function (id) {
        currentArticle = id;
        divArticle.empty();
        divArticle.html(feedOpinion(articles[id]));
        divArticle.addClass('fadeIn show');
        mode = 'show';
        updateNavbar();
        listOpinions.addClass('hidden');
        // Enlève le fadeIn car sinon problème !
        divArticle.animationEnd(function () {
            divArticle.removeClass('fadeIn');
        })
    }

    var clickLoadOpinion = function (e) {
        e.preventDefault();
        loadOpinion(this.dataset.article);
    }

    var feedOpinions = function (article, index) {
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

    var loadOpinions = function (lang) {
        mode = 'liste';
        updateNavbar();
        // On vide la liste
        listOpinions.empty();
        $$.get(opinionUrl, {lang: lang}, function (data){
            articles = JSON.parse(data).articles;
            for (var i in articles) {
                listOpinions.append(feedOpinions(articles[i], i));
            }
            // Ajout des évenements du clique
            $$('.list-lien').on('click', clickLoadOpinion);
        },function (err) {
            console.error(err);
        })
    }

    loadOpinions(lang);

}

myApp.onPageInit('opinions', function(page) {
    opinionsFunctions(myApp, $$);
});