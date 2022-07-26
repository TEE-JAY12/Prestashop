/**
 * Copyright since 2007 PrestaShop SA and Contributors
 * PrestaShop is an International Registered Trademark & Property of PrestaShop SA
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.md.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/OSL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade PrestaShop to newer
 * versions in the future. If you wish to customize PrestaShop for your
 * needs please refer to https://devdocs.prestashop.com/ for more information.
 *
 * @author    PrestaShop SA and Contributors <contact@prestashop.com>
 * @copyright Since 2007 PrestaShop SA and Contributors
 * @license   https://opensource.org/licenses/OSL-3.0 Open Software License (OSL 3.0)
 */

$(() => {
  let storage = false;

  if (typeof (getStorageAvailable) !== 'undefined') {
    // eslint-disable-next-line
    storage = getStorageAvailable();
  }

  window.initHelp = function () {
    $('#main').addClass('helpOpen');
    // first time only
    if ($('#help-container').length === 0) {
      // add css
      $('head').append('<link href="//help.prestashop.com/css/help.css" rel="stylesheet">');
      // add container
      $('#main').after('<div id="help-container"></div>');
    }
    // init help (it use a global javascript variable to get actual controller)
    // eslint-disable-next-line
    pushContent(help_class_name);
    $('#help-container').on('click', '.popup', (e) => {
      e.preventDefault();
      if (storage) storage.setItem('helpOpen', false);
      $('.toolbarBox a.btn-help').trigger('click');
      window.open(
        // eslint-disable-next-line
        `index.php?controller=${help_class_name}?token=${token}&ajax=1&action=OpenHelp`,
        'helpWindow',
        'width=450, height=650, scrollbars=yes',
      );
    });
  };

  // init
  $('.toolbarBox a.btn-help').on('click', (e) => {
    e.preventDefault();
    if (!$('#main').hasClass('helpOpen') && document.body.clientWidth > 1200) {
      if (storage) storage.setItem('helpOpen', true);
      $('.toolbarBox a.btn-help i').removeClass('process-icon-help').addClass('process-icon-loading');
      window.initHelp();
    } else if (!$('#main').hasClass('helpOpen') && document.body.clientWidth < 1200) {
      window.open(
        // eslint-disable-next-line
        `index.php?controller=${help_class_name}?token=${token}&ajax=1&action=OpenHelp`,
        'helpWindow',
        'width=450, height=650, scrollbars=yes',
      );
    } else {
      $('#main').removeClass('helpOpen');
      $('#help-container').html('');
      $('.toolbarBox a.btn-help i').removeClass('process-icon-close').addClass('process-icon-help');
      if (storage) storage.setItem('helpOpen', false);
    }
  });

  // Help persistency
  if (storage && storage.getItem('helpOpen') === 'true') {
    $('a.btn-help').trigger('click');
  }

  // switch home
  let language = window.iso_user;
  let home;

  switch (language) {
    case 'en':
      home = '19726802';
      break;
    case 'fr':
      home = '20840479';
      break;
    default:
      language = 'en';
      home = '19726802';
  }

  // feedback
  const arrFeedback = {};
  arrFeedback.page = 'page';
  arrFeedback.helpful = 'helpful';

  // toc
  const toc = [];
  const lang = [
    ['en', '19726802'],
    ['fr', '20840479'],
  ];

  // change help icon
  function iconCloseHelp() {
    $('.toolbarBox a.btn-help i').removeClass('process-icon-loading').addClass('process-icon-close');
  }

  // get content
  function getHelp(pageController) {
    // eslint-disable-next-line
    const request = encodeURIComponent(`getHelp=${pageController}&version=${_PS_VERSION_}&language=${iso_user}`);
    const d = new $.Deferred();
    $.ajax({
      url: `//help.prestashop.com/api/?request=${request}`,
      jsonp: 'callback',
      dataType: 'jsonp',
      success(data) {
        if (window.isCleanHtml(data)) {
          $('#help-container').html(data);
          d.resolve();
        }
      },
    });
    return d.promise();
  }

  // update content
  function pushContent(target) {
    $('#help-container').removeClass('openHelpNav');
    $('#help-container').html('');
    // @todo: track event
    getHelp(target)
      .then(iconCloseHelp)
      .then(initToc)
      .then(initNavigation)
      .then(initSearch)
      .then(initFeedback);
  }

  // build navigation
  function initNavigation() {
    const d = new $.Deferred();
    const request = encodeURIComponent(`api/content/${home}/child?expand=page`);
    $.ajax({
      url: `//help.prestashop.com/api/?request=${request}`,
      jsonp: 'callback',
      dataType: 'jsonp',
      success(data) {
        for (let i = 0; i < data.page.results.length; i += 1) {
          // eslint-disable-next-line
          if (window.isCleanHtml(data.page.results[i].id + data.page.results[i].title)) $('#help-container #main-nav').append(`<a href="//help.prestashop.com/${data.page.results[i].id}?version=${_PS_VERSION_}" data-target="${data.page.results[i].id}">${data.page.results[i].title}</a>`);
        }
        $('#help-container #main-nav a').on('click', function (e) {
          e.preventDefault();
          pushContent($(this).data('target'));
        });
        $('#help-container .open-menu').on('click', (e) => {
          e.preventDefault();
          $('#help-container').addClass('openHelpNav');
        });
        $('#help-container .close-menu').on('click', (e) => {
          e.preventDefault();
          $('#help-container').removeClass('openHelpNav');
        });
        d.resolve();
      },
    });
    return d.promise();
  }

  // build toc getting children from home page recursively
  function initToc() {
    const getLinksByLang = function (item) {
      const d = new $.Deferred();
      const request = encodeURIComponent(`api/content/${item[1]}/child/page?expand=children.page&limit=100`);
      $.ajax({
        url: `//help.prestashop.com/api/?request=${request}`,
        jsonp: 'callback',
        dataType: 'jsonp',
        success(data) {
          toc[item[0]] = {
            title: `Home ${item[0]}`,
            lang: item[0],
            id: item[1],
            children: [],
          };
          data.results.forEach((page, j) => {
            const children = [];

            page.children.page.results.forEach((child, i) => {
              children[i] = {
                title: child.title,
                // eslint-disable-next-line
                link: child._links.webui,
                id: child.id,
                lang: item[0],
              };
            });

            toc[item[0]].children[j] = {
              title: page.title,
              // eslint-disable-next-line
              link: page._links.webui,
              id: page.id,
              children,
              lang: item[0],
            };
          });

          d.resolve();
        },
      });
      return d.promise();
    };

    return $.when.apply(null, lang.map(getLinksByLang)).then(() => {
      // build mapping
      const mapping = {};
      $.each(toc[language].children, (i, section) => {
        mapping[section.link] = [section.id, section.title, section.lang];
        if (typeof section.children !== 'undefined') {
          $.each(section.children, (counter, lowerSection) => {
            mapping[lowerSection.link] = [lowerSection.id, lowerSection.title, lowerSection.lang];
          });
        }
      });
      // remap links
      $("#help-container a[href^='/display/']").on('click', function (e) {
        e.preventDefault();
        const href = $(this).attr('href');
        const target = mapping[href][0];
        pushContent(target);
      });
      $("#help-container a[href^='/pages/viewpage.action?pageId=']").on('click', function (e) {
        e.preventDefault();
        const pageId = $(this).attr('href').match(/\d+$/);

        if (pageId) {
          pushContent(pageId[0]);
        }
      });

      // home link
      $('#help-container a.home').attr(
        'href',
        // eslint-disable-next-line
        `//help.prestashop.com/${toc[language].id}?version=${window._PS_VERSION_}`,
      ).on('click', (e) => {
        e.preventDefault();
        pushContent(toc[language].id);
      });
      // target _blank external link
      $("#help-container a[href^='http://']").attr('href', function () {
        $(this).attr('target', '_blank').append('&nbsp;<i class="fa fa-external-link"></i>');
      });
      // add class anchor to link from table of content
      $('#help-container .toc-indentation a').addClass('anchor');
    });
  }

  // search
  function initSearch() {
    // replace tag from confluence search api
    function strongify(str) {
      return str.replace(/@@@hl@@@/g, '<strong>').replace(/@@@endhl@@@/g, '</strong>');
    }
    $('#help-container #search-box').on('submit', (e) => {
      e.preventDefault();
      $('#help-container #search-results').html('');
      const searchUrl = encodeURIComponent('searchv3/1.0/search?where=PS16&type=page&queryString=');
      const searchTerm = encodeURIComponent($('input[name="search"]').val());
      $.ajax({
        url: `//help.prestashop.com/api/?request=${searchUrl}${searchTerm}`,
        jsonp: 'callback',
        dataType: 'jsonp',
        success(data) {
          if (data.results.length === 0) {
            $('#search-results').addClass('hide');
          }
          for (let i = 0; i < data.results.length; i += 1) {
            if (window.isCleanHtml(data.results[i].id + data.results[i].title + data.results[i].bodyTextHighlights)) {
              $('#search-results').removeClass('hide')
                // eslint-disable-next-line
                .append(`<div class="result-item"><i class="fa fa-file-o"></i> <a href="//help.prestashop.com/${data.results[i].id}?version=${window._PS_VERSION_}" data-target="${data.results[i].id}">${strongify(data.results[i].title)}</a><p>${strongify(data.results[i].bodyTextHighlights)}</p></div>`);
            }
          }
          $('#search-results a').on('click', function (event) {
            event.preventDefault();
            pushContent($(this).data('target'));
          });
        },
      });
    });
    $('#help-container').on('click', '.search', (e) => {
      e.preventDefault();
      $('#help-container #search-box').removeClass('hide');
      $('#help-container .header-navigation').addClass('hide');
      $('#search-box input[name=search]').focus();
    });
    $('#help-container').on('click', '.close-search', () => {
      $('#help-container #search-box').addClass('hide');
      $('#help-container .header-navigation').removeClass('hide');
    });
  }

  // feedback
  function initFeedback() {
    const defaultFeedback = {
      /* eslint-disable */
      version: _PS_VERSION_,
      controller: help_class_name,
      language: iso_user,
      helpful: null,
      reason: null,
      comment: null,
      /* eslint-enable */
    };
    $('#help-container .helpful-labels li').on('click', function () {
      const percentageMap = {
        0: 'Not at all', 25: 'Not very', 50: 'Somewhat', 75: 'Very', 100: 'Extremely',
      };
      const percentage = parseInt($(this).data('percentage'), 10);
      defaultFeedback.helpful = percentageMap[percentage];
      $('#help-container .slider-cursor').removeClass('hide');
      $('#help-container .helpful-labels li').removeClass('active');
      $('#help-container .slider-cursor').css('left', `${percentage}%`);
      $('#help-container .helpful-labels li').addClass('disabled').off();
      $(this).removeClass('disabled').addClass('active');
      if (percentage <= 25) {
        $('#help-container .feedback-reason').show();
      } else if (percentage > 25) {
        submitFeedback(defaultFeedback);
      }
    });
    $('#help-container .feedback-reason .radio label').on('click', () => {
      const reasonMap = {
        1: 'Not related', 2: 'Too complicated', 3: 'Too much', 4: 'Incorrect', 5: 'Unclear', 6: 'Incomplete',
      };
      defaultFeedback.reason = reasonMap[$('input[name=lowrating-reason]:checked').val()];
    });
    $('#help-container .feedback-submit').on('click', (e) => {
      e.preventDefault();
      defaultFeedback.comment = $('textarea[name=feedback-detail]').val();
      submitFeedback(defaultFeedback);
    });
  }

  function submitFeedback(currentFeedback) {
    let feedback = '?';
    const keys = Object.keys(currentFeedback);

    for (let i = 0; i < keys.length; i += 1) {
      if (i > 0) {
        feedback += '&';
      }
      feedback += `${keys[i]}=${currentFeedback[keys[i]]}`;
    }
    $.ajax({
      url: `//help.prestashop.com/api/feedback/${feedback}`,
      dataType: 'jsonp',
      jsonp: 'callback',
      success() {
        $('#help-container #helpful-feedback').hide();
        $('#help-container .thanks').removeClass('hide');
      },
    });
  }
});
