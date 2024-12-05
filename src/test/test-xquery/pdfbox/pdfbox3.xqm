xquery version '3.1';
(:~ 
pdfbox 3.0 https://pdfbox.apache.org/ BaseX 10.7+ interface library, 
requires pdfbox jar on classpath
3.02+ required tested with pdfbox-app-3.0.2.jar
@see download https://pdfbox.apache.org/download.cgi
@javadoc https://javadoc.io/static/org.apache.pdfbox/pdfbox/3.0.2/

:)
module namespace pdfbox="urn:expkg-zone58:pdfbox3";

declare namespace Loader ="java:org.apache.pdfbox.Loader"; 
declare namespace PDFTextStripper = "java:org.apache.pdfbox.text.PDFTextStripper";

(:~ 
@see https://javadoc.io/static/org.apache.pdfbox/pdfbox/3.0.0/org/apache/pdfbox/pdmodel/PDDocument.html 
:)
declare namespace PDDocument ="java:org.apache.pdfbox.pdmodel.PDDocument";

declare namespace PDDocumentCatalog ="java:org.apache.pdfbox.pdmodel.PDDocumentCatalog";
declare namespace PDPageLabels ="java:org.apache.pdfbox.pdmodel.common.PDPageLabels";

(:~ 
@see https://javadoc.io/static/org.apache.pdfbox/pdfbox/3.0.0/org/apache/pdfbox/multipdf/PageExtractor.html 
:)
declare namespace PageExtractor ="java:org.apache.pdfbox.multipdf.PageExtractor";
 
(:~ 
 @see https://javadoc.io/static/org.apache.pdfbox/pdfbox/3.0.0/org/apache/pdfbox/pdmodel/PDPageTree.html
:)
declare namespace PDPageTree ="java:org.apache.pdfbox.pdmodel.PDPageTree";

(:~ 
@see https://javadoc.io/static/org.apache.pdfbox/pdfbox/3.0.2/org/apache/pdfbox/pdmodel/interactive/documentnavigation/outline/PDDocumentOutline.html 
:)
declare namespace PDDocumentOutline ="java:org.apache.pdfbox.pdmodel.interactive.documentnavigation.outline.PDDocumentOutline";

declare namespace PDDocumentInformation ="java:org.apache.pdfbox.pdmodel.PDDocumentInformation";
(:~ 
@see https://javadoc.io/static/org.apache.pdfbox/pdfbox/3.0.0/org/apache/pdfbox/pdmodel/interactive/documentnavigation/outline/PDOutlineItem.html 
:)
declare namespace PDOutlineItem="java:org.apache.pdfbox.pdmodel.interactive.documentnavigation.outline.PDOutlineItem";

declare namespace RandomAccessReadBufferedFile = "java:org.apache.pdfbox.io.RandomAccessReadBufferedFile";
declare namespace File ="java:java.io.File";


(:~ open pdf, returns handle :)
declare function pdfbox:open($pdfpath as xs:string)
as item(){
  Loader:loadPDF( RandomAccessReadBufferedFile:new($pdfpath))
};


(:~ outline for $doc as map()* :)
declare function pdfbox:outline($doc as item())
as map(*)*{
  (# db:wrapjava some #) {
  let $outline:=
                PDDocument:getDocumentCatalog($doc)
                =>PDDocumentCatalog:getDocumentOutline()
 
  return  if(exists($outline))
          then pdfbox:outline($doc,PDOutlineItem:getFirstChild($outline))
          else () 
  }
};

(:~ return bookmark info for children of $outlineItem as seq of maps :)
declare function pdfbox:outline($doc as item(),$outlineItem as item()?)
as item()
{
  let $find:=hof:until(
            function($output as item()*) { empty($output?this) },
            function($input as item()) { 
                      let $bk:= ()
                      let $bk:= if($bk?hasChildren)
                                then let $kids:=pdfbox:outline($doc,PDOutlineItem:getFirstChild($input?this))
                                     return map:merge(($bk,map:entry("children",$kids)))
                                else $bk 
                      return map{
                            "list": ($input?list, $bk),
                            "this":  PDOutlineItem:getNextSibling($input?this)}
                          },
            map{"list":(),"this":$outlineItem}
        )
  return $find?list
};






