xquery version "3.1";

module namespace ecd = 'http://enccre.org/ice-contrib-edit';

import module namespace icg = 'http://enccre.org/ice-config' at 'ice_config.xqm';
import module namespace icc = 'http://enccre.org/ice-common' at 'ice_common.xqm';
import module namespace ics = 'http://enccre.org/ice-resources' at 'ice_resources.xqm';

declare namespace tei="http://www.tei-c.org/ns/1.0";

declare
  %rest:path("/api/EDE/contributeuredit")
  %rest:PUT
  %rest:form-param("contribInfo", "{$contribInfo}")
  %rest:produces("application/json")
  %output:method("json")
  
 %updating function ecd:createContributeur($contribInfo as xs:string, $contributeurs as node()*, $contrib as node())
{
    let $contribid := ($contributeurs/contrib/@contribid)
    let $contribData := json:parse($contribInfo, map{'format': 'map'})
 
    return
      
        let $contributeurs := db:open($icg:CONTRIB_DBNAME)/contributeurs
        return (
          insert node
            <contrib contribid="{$contribid}">
              <nomcomplet>{$contribData('nomcomplet')}</nomcomplet>
              <nomusage>{$contribData('nomusage')}</nomusage>
              <datenaissance>{$contribData('datenaissance')}</datenaissance>
              <lieunaissance>{$contribData('lieunaissance')}</lieunaissance>
              <datedeces>{$contribData('datedeces')}</datedeces>
              <lieudeces>{$contribData('lieudeces')}</lieudeces>
              <sourceetatcivil>{$contribData('sourceetatcivil')}</sourceetatcivil>
            </contrib>
          as first into $contributeurs
          ,
          db:output(
            <rest:response>
              <http:response status="201">
                <http:header name="location" value="{ $contribid }"/>
              </http:response>
            </rest:response>
          )
     )
};






(:---------------------- update -------------------------------:)




declare
  %rest:path("/api/EDE/contrib/{$contribid}")
  %rest:PUT
  %rest:header-param("X-ENCCRE-User", "{$username}")
  %rest:form-param("editeurInfo", "{$editeurInfo}")

  %rest:produces("application/json")
  %output:method("json")
%updating function ecd:updateContributeur($contribid as xs:string, $contrib as node(), $contribInfo as xs:string, $username as xs:string?)
{
  let $adminid := icc:getUserID($username)

  return 
    let $contribData := json:parse($contribInfo, map{'format': 'map'})
   let $contributeurs := db:open($icg:CONTRIB_DBNAME)/contributeurs
        return (
          replace node $contrib with
             <contrib contribid="{$contribid}">
              <nomcomplet>{$contribData('nomcomplet')}</nomcomplet>
              <nomusage>{$contribData('nomusage')}</nomusage>
              <datenaissance>{$contribData('datenaissance')}</datenaissance>
              <lieunaissance>{$contribData('lieunaissance')}</lieunaissance>
              <datedeces>{$contribData('datedeces')}</datedeces>
              <lieudeces>{$contribData('lieudeces')}</lieudeces>
              <sourceetatcivil>{$contribData('sourceetatcivil')}</sourceetatcivil>
            </contrib>
          ,
          db:output(
            <rest:response>
              <http:response status="201">
                <http:header name="location" value="{ $contribid }"/>
              </http:response>
            </rest:response>
          )
      )
};

