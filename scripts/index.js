'use strict';
chrome.storage.local.get(null, function (result) {
	var isSites = result.isSites;
	if(!result.isSites) {
		isSites = ["stackoverflow.com"]; //checking websites stackoverflow
		chrome.storage.local.set({isSites: isSites});
	}
	for (let i = 0; i < isSites.length; i++) {
		if (window.location.href.indexOf(isSites[i]) > -1) {
			chrome.storage.local.get(null, function (result) {
				if (!result.snippetHistory) {
					chrome.storage.local.set({ snippetHistory: [] });
				}
				if (!result.numSnippets) {
					chrome.storage.local.set({ numSnippets: 5 });
				}
				if (!result.numChars) {
					chrome.storage.local.set({ numChars: 500 });
				}
			});
			Array.from(document.getElementsByTagName('pre')) // get all code snippets
				.forEach(function (block) {
					block.addEventListener('dblclick', function (event) {
						var range = document.createRange(); 
						range.selectNode(block);
						// Copy snippet to clipboard
						try {
							window.getSelection().removeAllRanges();
							window.getSelection().addRange(range);
							document.execCommand('copy');
							chrome.storage.local.get(null, function (result) {
								if (result.snippetHistory.length >= result.numSnippets) result.snippetHistory.pop();
								result.snippetHistory.unshift({
									snippet: range.toString().substring(0, Number(result.numChars)),
									URI: range.commonAncestorContainer.baseURI,
									date: new Date().toString()
								});
								chrome.storage.local.set({ snippetHistory: result.snippetHistory });
							});
							window.getSelection().removeAllRanges();
							block.style.outline = '1px solid #F9041D';
							setTimeout(function () {
								return block.style.outline = 'none';
							}, 500);
						} catch (err) {
							console.log('Failed to copy', err);
						}
					});
				});
			break;
		}
	}
});