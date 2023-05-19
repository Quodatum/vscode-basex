(: folder date fix
report or move files that belong elsewhere based on file name for given year
 :)
declare variable $year:="2023";
declare variable $base:="P:\pictures\Pictures\" || $year || "\";
declare variable $folders:=file:list($base)[matches(.,"\d{4}-\d{2}-\d{2}\\")]! substring(.,1,10);

(:~ 
 return "$year-mm-dd" if date in filename or empty
:)
declare function local:extract($filename as xs:string,$year as xs:string)
as xs:string?{
 let  $reDate:=".*" || $year || "-?(\d{2})-?(\d{2}).*"
 return if(matches($filename,$reDate)) 
        then replace($filename,$reDate, $year ||"-$1-$2")
        else () 
};

(:~ 
  files in $base folder with a date in filename that does not match date-folder name 
:)
declare function local:date-wrong($date-folder as xs:string, $year as xs:string)
as map(*)*
{
 for $f in file:list($base || $date-folder)
 let $target:=local:extract($f, $year )
 where $target and $target ne $date-folder
 let $original:=  ".picasaoriginals\"  || $f
 let $files:=($f,if(file:exists($base || $date-folder || "\" || $original )) then $original else ())
 group by $target
 return map{"key": $target, "files":$files}
};

(:~  move a file, create folder if needed :)
declare function local:move($src as xs:string, $dest as xs:string)
{
  file:create-dir(file:parent($dest)),
  file:move($src,$dest)
};

declare function local:print($src as xs:string, $dest as xs:string)
{
 concat($src,"->", $dest)
};

declare function local:do($actions){
  for $date-folder in $folders
  for $target in local:date-wrong( $date-folder, $year),
      $f in $target?files
  let $src:= $base || $date-folder || "\" || $f
  let $dest:= $base || $target?key || "\" || $f
  return $actions!.($src,$dest)
};

let $moved:=(local:print#2,local:move#2)=>head()=>local:do()
return if(exists($moved))
       then $moved
       else "No targets found"