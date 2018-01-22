/**
 * Script initializations
 */

;(function () {

	//
	// Variables
	//

	var form = document.querySelector('#form-search');
	var input = document.querySelector('#input-search');
	var resultList = document.querySelector('#search-results');
	var loading = document.querySelector('#search-loading');
	var ready = document.querySelector('#search-content');
	var timeout;

	// Only run if the form input and results container exist
	if (!form || !input || !resultList || !loading || !ready) return;


	//
	// Methods
	//

	// Get the value of a query string from a URL
	var getQueryString = function (field, url) {
		var href = url ? url : window.location.href;
		var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
		var string = reg.exec(href);
		return string ? string[1] : null;
	};

	var updateURL = function (query) {
		if (!history.pushState) return;
		history.pushState({}, document.title, window.location.origin + window.location.pathname + '?s=' + encodeURI(query));
	};

	// Display results
	var displayResults = function (results) {
		var display = '';
		if (results.length < 1) {
			display = '<p>Sorry, there weren\'t any matches found.</p>';
		} else {
			for (var i = 0; i < results.length; i++) {
				var id = results[i].ref;
				var match = searchIndex[id];
				display +=
					'<div class="margin-bottom" id="search-result-' + id + '">' +
						'<a class="link-block" href="' + match.url + '">' +
							'<h2 class="h3 link-block-styled link-no-underline no-margin-bottom">' + match.title + '</h2>' +
							match.summary.slice(0, 150) + '...<br>' +
							'<span class="link-block-styled link-no-underline">' + match.url + '</span>' +
						'</a>' +
					'</div>';
			}
		}
		resultList.innerHTML = display;
	};

	// Run a search
	var runSearch = function (query) {
		var results = idx.search(query + '~3');
		displayResults(results);
	};


	//
	// Event Listeners & Inits
	//

	// Setup Lunr
	var idx = lunr(function () {
		var search = this;
		search.ref('id');
		search.field('title');
		search.field('content');

		if (searchIndex.length > 0) {
			for (var i = 0; i < searchIndex.length; i++) {
				searchIndex[i].id = i;
				search.add(searchIndex[i]);
			}
		}
	});

	// Show form once ready
	loading.setAttribute('hidden', 'hidden');
	ready.removeAttribute('hidden');

	// If there's a querystring on load, search for it
	var query = getQueryString('s');
	if (query) {
		runSearch(decodeURI(query));
		input.value = decodeURI(query);
	}

	// Prevent default submit event
	form.addEventListener('submit', function (event) {
		event.preventDefault();
		if (input.value.length < 1) {
			resultList.innerHTML = '';
			updateURL('');
		} else {
			runSearch(input.value);
			updateURL(input.value);
		}
	}, false);

	// Listen for querystring changes
	if (history.pushState) {
		window.addEventListener('popstate', function (event) {
			query = getQueryString('s');
			console.log(query);
			if (query) {
				runSearch(decodeURI(query));
				input.value = decodeURI(query);
			} else {
				resultList.innerHTML = '';
			}
		}, false);
	}

})();