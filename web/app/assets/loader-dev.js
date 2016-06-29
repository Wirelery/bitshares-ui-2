require("./stylesheets/app.scss");
require("file?name=index.html!./index-dev.html");
require("file?name=favicon.ico!./favicon.ico");
require("file?name=logo.png!./logo-ico-blue.png");
require("file?name=fresh-bolt2.png!./fresh-bolt2.png");
require("file?name=dictionary.json!common/dictionary_en.json");
require("babel/polyfill");
require("whatwg-fetch");
require("indexeddbshim");
require("./asset-symbols/symbols.js");
require("./locales/locales.js");
