var laLettreFunctions = function(myApp, $$) {
    var debug = false;

    var baseUrl = debug ? 'http://localhost/applilettre/' : 'https://www.robert-schuman.eu/applilettre/';

    var deviceId;
    var appLang = window.localStorage.lang || 'fr';
    console.log('Device language', appLang);

    var noLanguageLetter = {fr: "Aucune lettre", en: "No letter", es: "No letter", de: "No letter", pl: "No letter"}
    var translations = {
        auteur: {fr: "Auteur", en: "Author", es: "Autor", de: "Autor", pl: "Autor"},
        auteurs: {fr: "Auteurs", en: "Authors", es: "Autores", de: "Autoren", pl: "Autorzy"},
        sommaire: {fr: "Sommaire", en: "Contents", es: "Sumario", de: "Übersicht", pl: "treszczenie"},
        choix_lettre: {fr: "Choix de la Lettre", en: "Choose the Letter", es: "Elección de la carta", de: "Choose the Letter", pl: "Choose the Letter"},
        versions_disponibles: {fr: "Versions disponibles", en: "Available versions", es: "Versions disponibles", de: "Available versions", pl: "Available versions"},
        lire_la_suite: {fr: "Lire la suite", en: "Read More", es: "Read More", de: "Read More", pl: "Read More"},
        autre_lien: {fr: "Autre lien", en: "Other link", es: "Other link", de: "Other link", pl: "Other link"}
    };

    var listeMois = {
        fr: ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
        en: ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        es: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        de: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
        pl: ["styczeń", "luty", "marzec", "kwiecień", "maj", "czerwiec", "lipiec", "sierpień", "wrzesień", "październik", "listopad", "grudzień"]
    };

    var updateMenu = function () {
        $$('.btn-sommaire').text(translations.sommaire[appLang]);
        $$('.popover-content-calendar__head').text(translations.choix_lettre[appLang]);
        $$('.popover-content-lang__head').text(translations.versions_disponibles[appLang]);
    }

    updateMenu();

    var modalCalendar;
    var modalLang;

    var scrollToTop = function () {
        var application = document.querySelector('.application');
        application.scrollTop = 0;
    }

    var launchWebView = function (href) {
        var ref = cordova.InAppBrowser.open(encodeURI(href), "_blank", 'location=yes');
        ref.addEventListener('loadstart', function (e) {
        });
        ref.show();
    }

    // Lettre courante
    var currentLetter = null;


    // Gestion des langues

    var changeLangue = function (langue) {
        appLang = langue;
        window.localStorage.setItem('lang', appLang);
    }

    var btnsLang = $$('.btn-lang-popover');

    btnsLang.each(function () {
        if(this.dataset.lang == appLang) {
            this.classList.add('disabled');
        }
    });

    var registerLang = function (lang) {
        $$.get(baseUrl + 'register/' + lang + '/' + deviceId, null, function (data) {
            console.log("Réponse du serveur pour l'enregistrement de la langue: ", data);
        });
    }

    var eventBtnLang = function (e) {
        e.preventDefault();
        var lang = this.dataset.lang;
        changeLangue(lang);
        updateMenu();
        registerLang(lang);
        btnsLang.each(function () {
            this.classList.remove('disabled');
        });
        this.classList.add('disabled');

        $$.get(baseUrl + 'last/' + appLang, null, function (data) {
            feedLettre(JSON.parse(data));
        });
        var mDate = new Date();
        calendarMonth('', parseMois(mDate.getMonth() + 1), mDate.getFullYear(),mDate);
        myApp.closeModal(modalLang, true);
    }

    btnsLang.each(function () {
        this.addEventListener('click', eventBtnLang);
    });

    var setSelectedLettre = function (idLettre) {
        $$('.calendar-popover .lettre').each(function () {
            if(this.dataset.lettreid == idLettre) {
                this.classList.add('disabled');
            } else {
                this.classList.remove('disabled');
            }
        });
    }

    var feedArticles = function (id, titre, contenu, groupes, last_groupe, fichier, liens, fr_titre_cours) {
        var div = "";
        if (!groupes.includes(last_groupe)) {
            div += "<div class='article-image' style='text-align:center;'><div" +
                " class='article-image__image'><img width='100%'" +
                " src='https://www.robert-schuman.eu/images/lettre/articles/" + fichier + "'></div><div" +
                " class='article-image__texte'><div>" + last_groupe + "</div></div></div>";
        }
        div += '<a class="article" id="' + id + '" data-id="' + id + '"><div class="article-titre">' + titre + '</div>';
        div += '<div class="article-contenu hidden">' + contenu;
        div += '<div class="article-btns"><button class="article-btn" data-href="' + liens[0][appLang + '_lien'] + '">' + translations.lire_la_suite[appLang] + '</button>';
        if (liens.length > 1) {
            div += '<button class="article-btn" data-href="' + liens[1][appLang + '_lien'] + '">' + translations.autre_lien[appLang] + '</button>'
        }
        div += '</div></div></div></a>';
        if(titre == null) {
            div = "";
        }
        return div;
    }

    var div_sommaire = $$('.sommaire-content');

    var feedSommaire = function (groupe_nom, values) {
        var newTexte = [];
        for (var i = 0 ; i < values.length; i++) {
            newTexte.push('<a data-href="#' + values[i].id+ '">' + values[i].titre + '</a>');
        }
        div_sommaire.append('<span class="titre">' + groupe_nom + ' : </span><span>' + newTexte.join(' - ') + '</span>');
    }

    var div_agenda = $$('.agenda .agenda-dates');

    var feedAgenda = function (agenda) {
        var div;
        var date;
        for (var i = 0; i < agenda.length; i++) {
            date = agenda[i];
            div = '<div class="agenda-date"><div class="agenda-date__date">' + date[appLang + '_date_rdv'] + '</div><div' +
                ' class="agenda-date__lieu">' + date[appLang + '_lieu'] + '</div>' +
                '<div class="agenda-date__content">' + date[appLang + '_texte'] + '</div></div>';
            div_agenda.append(div);
        }
    }

    var dateLoaded = [];
    var divCalendarDate = $$('#calendar-head-date');
    var divLettresCalendar = $$('.lettres');

    var parseMois = function (mois) {
        if (mois.toString().length == 1) {
            mois = "0" + mois;
        }
        return mois
    }


    var calendarMonth = function (type, mois, annee, currentDate) {
        $$.get(baseUrl + 'lettre/infos/' + mois + '/' + annee, null, function (data){
            var data = JSON.parse(data);
            if (data.length == 0) {
                if (type == 'previous') {
                    currentDate.setMonth(currentDate.getMonth() - 1);
                    mois = parseMois(currentDate.getMonth() + 1);
                    annee = currentDate.getFullYear();
                    calendarMonth('previous', mois, annee, currentDate);
                } else {
                    currentDate.setMonth(currentDate.getMonth() + 1);
                    if (currentDate > new Date()) {
                        return;
                    }
                    mois = parseMois(currentDate.getMonth() + 1);
                    annee = currentDate.getFullYear();
                    calendarMonth('previous', mois, annee, currentDate);
                }
                return;
            }
            feedCalendar(data, currentDate);
        });
    }

// Calendrier ajout event sur les boutons
    var calendarPreviousMonth = function (e) {
        e.preventDefault();
        var currentDate = new Date(divLettresCalendar.dataset('date').date);
        currentDate.setMonth(currentDate.getMonth() - 1);
        var mois = parseMois(currentDate.getMonth() + 1);
        var annee = currentDate.getFullYear();
        calendarMonth('previous', mois, annee, currentDate);
    }

    var calendarNextMonth = function (e) {
        e.preventDefault();
        var currentDate = new Date(divLettresCalendar.dataset('date').date);
        currentDate.setMonth(currentDate.getMonth() + 1);
        if (currentDate > new Date()) {
            return;
        }
        var mois = parseMois(currentDate.getMonth() + 1);
        var annee = currentDate.getFullYear();
        calendarMonth('next', mois, annee, currentDate);
    }


    $$('#calendar-previous').on('click', calendarPreviousMonth);
    $$('#calendar-next').on('click', calendarNextMonth);

    var feedCalendar = function (lettres, d) {
        divCalendarDate.text(listeMois[appLang][d.getMonth()] + " " + d.getFullYear());
        if(d.length < 1) {
            return;
        }
        var mois = (d.getMonth() + 1).toString();
        mois = parseMois(mois);
        divLettresCalendar.attr('data-date', d.getFullYear() + '-' + mois + '-01');
        var div = '<div class="row">';
        for (var i in lettres) {
            var lettre = lettres[i];
            div += '<div class="col-50 lettre" data-lettreid="' + lettre.id_lettre + '"><a data-id="' + lettre.numero + '" class="switch-lettre lettre' +
                ' ' + ((lettre.id_lettre == currentLetter) ? 'disabled' : '') + '"><div' +
                ' class="lettre-content"><div' +
                ' class="number">n°' + lettre.numero + '</div><div class="date">' + lettre.date_publication + '</div></div></a></div>';
        }
        div += '</div>';
        divLettresCalendar.html(div);
        dateLoaded.push({date: d.getMonth() + "-" + d.getFullYear(), html: div});
        // Evènement changer de lettre en cours
        $$('.switch-lettre').on('click', function (e) {
            e.preventDefault();
            var id = this.dataset.id;
            $$.get(baseUrl + 'lettre/' + id + '/' + appLang, null, function (data) {
                feedLettre(JSON.parse(data));
                setSelectedLettre(id);
            });
            myApp.closeModal(modalCalendar, true);
        })
    }

    var feedAuteurs = function (data) {
        return data.map(function (d) {
            return d.prenom + " " + d.nom;
        }).join(', ');
    }

    var feedLettre = function (data) {
        currentLetter = data.id;
        var div_article = $$('.articles');
        var div_date = $$('.bandeau-content__left');
        if(data.error != undefined && data.error == 'lang') {
            div_article.text(noLanguageLetter[appLang]);
            return;
        }
        var articles = data.articles;
        div_date.text(data.date_publication);
        // Clear les divs
        div_article.empty();
        div_sommaire.empty();
        div_agenda.empty();

        $$('.bottom').html(data.footer[appLang + '_footer']);

        // Titre et Auteurs
        var titre = data.lettre_titre.find(function (el) {
            return el.langue == appLang;
        }).titre;
        $$('.lettre-head .lettre-titre').text(titre);
        var auteurs = feedAuteurs(data.auteurs);
        $$('.lettre-head .lettre-soustitre').text((data.auteurs.length > 1 ? translations.auteurs[appLang] : translations.auteur[appLang]) + " : " + auteurs);
        feedAgenda(data.agenda);
        var arts, div, groupe, art, key;
        var groupes = [];
        var sommaire = [];
        for (var prop in articles) {
            arts =  articles[prop];
            sommaire[prop] = [];
            for (var i = 0; i < arts.length; i++) {
                art = arts[i];
                groupe = prop;
                div = feedArticles(art.id, art[appLang + '_titre'], art[appLang + '_texte'], groupes, groupe, art.fichier, art.liens, art[appLang + '_titre_cours']);
                sommaire[groupe].push({ titre: art[appLang + '_titre_cours'], id: art.id});
                groupes.push(groupe);
                div_article.append(div);
            }
        }

        for (var article in sommaire) {
            feedSommaire(article, sommaire[article]);
        }

        /**
         * Actions sur les titres des articles
         */
        $$('.article').on('click', function(e) {
            e.preventDefault();
            // Afficher / Masquer les boutons
            var el = this.children[1];
            el.classList.toggle('hidden');
        })

        $$('.article-btn').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation()
            var href = this.dataset.href;
            launchWebView(href);
            //createWebView(href);
        })

        $$('.sommaire-content span a').on('click', function () {
            div_sommaire.parent().removeClass('open');
            var href = this.dataset.href.substring(1);
            var el = document.getElementById(href);
            el.childNodes[1].classList.remove('hidden');
            el.scrollIntoView(true);
        });
    }

    /**
     * Action sur le bouton du sommaire
     */
    var sommaire = $$('.sommaire');
    $$('.btn-sommaire').on('click', function () {
        sommaire.toggleClass('open');
    });

    /**
     * Popover
     */
    var bandeau = $$('.bandeau');
    $$('.open-lang').on('click', function (e) {
        e.preventDefault();
        var link = this;
        scrollToTop();
        modalLang = myApp.popover('.lang-popover', link);
        $$('.lang-popover').css('top', '50%').transform('translateY(-50%)');
    })

    $$('.open-calendar').on('click', function (e) {
        e.preventDefault();
        var link = this;
        scrollToTop();
        modalCalendar = myApp.popover('.calendar-popover', link);
        $$('.calendar-popover').css('top', '50%').transform('translateY(-50%)');
    })

    $$.get(baseUrl + 'last/' + appLang, null, function (data) {
        feedLettre(JSON.parse(data));

        /**
         * Récuparation des lettres du mois pour le calendrier
         */
        var d = new Date();
        var month = (d.getMonth() + 1).toString();
        var year = d.getFullYear();
        month = parseMois(month);
        $$.get(baseUrl + 'lettre/infos/' + month + '/' + year, null, function (data) {
            feedCalendar(JSON.parse(data), d);
        })
    });

};

myApp.onPageInit('la-lettre', function(page) {
    console.log("La Lettre loaded!");
    laLettreFunctions(myApp, $$);
});