
formatEntrypoint = function(url) {
  var pos = url.indexOf("/data");
  if (-1 < pos) {
    return url.substring(0, pos);
  } else {
    return url;
  }
}
formatPathParams = function(url) {
  var pos = url.indexOf("/data");
  var end = url.indexOf("?");
  if (-1 < pos) {
    return -1 < end ? url.substring(pos, end) : url.substring(pos);
  } else {
    return "-";
  }
}

formatQueryStringParams = function(url) {
  var pos = url.indexOf("?");
  if (-1 < pos) {
    return url.substring(pos + 1);
  } else {
    return "-";
  }
}

formatFormQueryStringParams = function(url) {
  var pos = url.indexOf("?");
  if (-1 < pos) {
    return url.substring(pos + 1);
  } else {
    return "";
  }
}

updateCollapseMode = function(state, $panel) {
  if (typeof(state) == 'undefined') {
    state = defaultJobPanelState;
  }
  switch (state) {
    case "edit":
    case "details":
      $panel.removeClass("collapsed").addClass("details");
      break;
    case "" :
      $panel.removeClass("details").addClass("collapsed");
      break;
  }
}

mapOperatorToSymbol = function(operator) {
  var symbol;
  switch(operator) {
    case "gte":
      symbol = "≥";
      break;
    case "lte":
      symbol = "≤";
      break;
    case "rg":
      symbol = "[,]";
      break;
    case "in":
      symbol = "∈";
      break;
    case "nin":
      symbol = "∉";
      break;
    default:
    symbol="";
  }
  return symbol;
}

mapSymbolToOperator = function(symbol) {
  var operator;
  switch(symbol) {
    case "≥":
      operator = "gte";
      break;
    case "≤":
      operator = "lte";
      break;
    case "[,]":
      operator = "rg";
      break;
    case "∈":
      operator = "in";
      break;
    case "∉":
      operator = "nin";
      break;
  }
  return operator;
}

formatMs = function(number) {
  return number ? Math.round(number) + "ms" : "n/a";
}

formatCount = function(number) {
  return number ? number : "n/a";
}

formatNumber = function(number) {
  return number ? number.toLocaleString() : 0;
}
