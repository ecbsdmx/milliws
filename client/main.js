UI.registerHelper('trimUrlToSize', function(url, size) {
  var curLen = url.length;
  if (size < curLen) {
    shortUrl = url.substr(0, size);
    return shortUrl + "...";
  }
  return url;
});