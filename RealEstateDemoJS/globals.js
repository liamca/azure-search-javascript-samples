var availableTags = [];
var azureSearchQueryApiKey = "595D275EDAA5A9B0268ECEE0AF22C159";	// this is a query key for demo purposes
var baseSearchURL = "https://azs-playground.search.windows.net/indexes/realestate-us-sample";

var facetFiltersString = [];
var facetFiltersCollection = [];
var currentPage = 1;
var documentsToRetrieve = 15;	// This is the maximum documents to retrieve / page
