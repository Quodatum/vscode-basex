(: a simple thing but saxon requires namespace :)
declare namespace output = 'http://www.w3.org/2010/xslt-xquery-serialization';
declare option output:method "text";
"The time is :" || current-dateTime()