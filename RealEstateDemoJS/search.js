function fullSearch(q)
{
	// Basically refresh page with new search
	if (q == "")
		q = "*";
	execSearch(q);
	execMultiSelectFacetQuery(q, "city", "cityDiv", "string");
	execMultiSelectFacetQuery(q, "tags", "tagsDiv", "collection");
}

function execSearch(q)
{
	// Execute a search
	var searchAPI = baseSearchURL + "/docs?api-version=2017-11-11&$top=" + documentsToRetrieve + "&$skip=" + documentsToRetrieve * (currentPage - 1) + "&$count=true&queryType=full&search=" + q;
	
	// Build up the facet filters
	// Create filter based on string fields
	var filterQuery = '';
	$( "#summaryContainer" ).html('');
	for (var facet in facetFiltersString)
	{
		if (facetFiltersString[facet].length > 0)
		{
			var subFilterQuery = "(search.in(" + facet + ", '" + facetFiltersString[facet].join() + "', ','))";
			if (filterQuery == '')
			{
				filterQuery = subFilterQuery;
			}
			else
			{
				filterQuery += " and " + subFilterQuery;
			}
		}
	}

	// Create filter based on collection fields
	for (var facet in facetFiltersCollection)
	{
		if (facetFiltersCollection[facet].length > 0)
		{
			var subFilterQuery = "(" + facet + "/any(t: (search.in(t, '" + facetFiltersCollection[facet].join() + "', ','))))";
			if (filterQuery == '')
			{
				filterQuery = subFilterQuery;
			}
			else
			{
				filterQuery += " and " + subFilterQuery;
			}
		}
	}
	
	if (filterQuery != '')
		searchAPI += "&$filter=" + filterQuery;
	
	$.ajax({
		url: searchAPI,
		beforeSend: function (request) {
			request.setRequestHeader("api-key", azureSearchQueryApiKey);
			request.setRequestHeader("Content-Type", "application/json");
			request.setRequestHeader("Accept", "application/json; odata.metadata=none");
		},
		type: "GET",
		success: function (data) {
			
			var htmlString = '';

			if (data.value.length > 0)
			{
				$("#docCount").html('Total Results: ' + data["@odata.count"]);
				
				for (var item in data["value"])
				{
				
					htmlString += "<div class='card m-1'><div class='row'><div class='col-md-2 p-3'><div class='card-block px-3'>";
					htmlString += "<img src='" + data.value[item].thumbnail + "'>";
					
					htmlString += "</div></div><div class='col-md-10 p-3'><div class='card-block px-3'>";
					
					htmlString += "<h4 class='card-title'>" + data.value[item].street + ", " + data.value[item].city + "</h4>";
					htmlString += "<p class='card-text'>" + data.value[item].summary + "<br>";
					
					// Add the tags collection
					for (var i = 0; i < data.value[item].tags.length; i++)
						htmlString += "<span class='badge badge-info'>" + data.value[item].tags[i] + "</span>&nbsp;&nbsp;";
					
					htmlString += "</p>";
					htmlString += "</div></div></div></div>";
				}
			}
			
			$( "#summaryContainer" ).append(htmlString);
		}
	});
}

function execSuggest(q, resolve)
{
	// Execute an autocomplete search to populate type ahead
	var searchAPI = baseSearchURL + "/docs/autocomplete?api-version=2017-11-11-Preview&suggesterName=sg&autocompleteMode=twoTerms&search=" + q;
	$.ajax({
		url: searchAPI,
		beforeSend: function (request) {
			request.setRequestHeader("api-key", azureSearchQueryApiKey);
			request.setRequestHeader("Content-Type", "application/json");
			request.setRequestHeader("Accept", "application/json; odata.metadata=none");
		},
		type: "GET",
		success: function (data) {
			availableTags = [];
			for (var item in data.value)
				availableTags.push(data.value[item].queryPlusText);
			resolve(availableTags);

		}
	});
}
