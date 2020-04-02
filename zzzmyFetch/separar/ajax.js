/* 
/** Envia y ejecuta el objeto Ajax.
* url - Tipo: String; Cadena que contiene la URL a la que se envía la solicitud.
*
* async - (valor predeterminado: true) Tipo: Boolean De forma predeterminada, todas las solicitudes se envían de forma asíncrona (es decir, se 
*        establece en true de forma predeterminada). Si necesita solicitudes síncronas, defina esta opción como falsa. Solicitud entre dominios y tipo 
*        de datos: las peticiones "jsonp" no admiten la operación síncrona. Tenga en cuenta que las solicitudes síncronas pueden bloquear 
*         temporalmente el navegador, deshabilitando cualquier acción mientras la solicitud esté activa. El uso de async: false está obsoleto;
*
* dataType (default: Intelligent Guess (xml, json, script, or html))
*     Type: String  El tipo de datos que espera del servidor. Si no se especifica ninguno, Se intentará inferirlo basado en el tipo MIME de la respuesta 
*     (un tipo XML generará XML, JSON producirá un objeto JavaScript, script ejecutará el script y todo lo demás será devuelto como una cadena). 
*     Los tipos disponibles (y el resultado pasado como el primer argumento a su devolución de llamada de éxito) son:
*
*     "xml":  Devuelve un documento XML que se puede procesar.
*     "html": Devuelve HTML como texto plano; las etiquetas de script incluidas se evalúan cuando se insertan en el DOM.
*     "json": Evalúa la respuesta como JSON y devuelve un objeto JavaScript. Los datos JSON se analizan de manera estricta; 
*             cualquier JSON malformado es rechazado y se genera un error de análisis. El servidor debe devolver una respuesta de null o {} en su lugar. 
*             (Consulte json.org para obtener más información sobre el formato adecuado de JSON.)
*
* method (default: 'GET') Type: String The HTTP method to use for the request ("POST", "GET"). Tipo: Función a ser llamada si la solicitud tiene éxito. 
* @param method (string) Indica el método bien sea GET o POST.
* @param url (string) Indica la ruta + el archivo (+ los valores si el método es GET).
* @param funResponse (string) Nombre de la función donde será devuelta la respuesta del llamado Ajax.
* @param data (string) Valores si el método es POST.
* @param capaContenedora (string) Identificador del elemento contenedor donde mostrará un mensaje de espera.
* @param dataType (string)  El tipo de datos que espera del servidor.
* @return null
*/

function sendAjax( method='GET', url, funResponse, data, container=null, dataType='html', async=true, b64=false, contentType = true )
{
    this.method = method;
    this.url = url;
    this.funResponse = funResponse;
    this.data = data;
    this.container = container;
    this.dataType = dataType;
    this.async = async;
    this.b64  = b64;
    this.contentType = contentType;
    this.send = () =>
    {
        var showConnecting = () =>
        {
            var objImg = document.createElement('img');
            objImg.setAttribute("src", "../../../"+appOrg+"/img/loading.gif");
            objImg.setAttribute("border", "0");
            var objDiv = ( this.container != null ) ? document.getElementById( this.container ) : document.createElement( 'div' );
            objDiv.innerHTML="Cargando...";
            objDiv.appendChild(objImg);
            if ( this.container == null ) {   
                objDiv.id= "showConnecting";
                objDiv.setAttribute('style','left:50%; top:50%; position: fixed; z-index:2001;');
                document.getElementsByTagName('body')[0].appendChild(objDiv);
            }
        }
        showConnecting();
        var ajax = function() 
        {
            var objetoAjax=false;
            try {
                objetoAjax = new ActiveXObject("Msxml2.XMLHTTP");/*Para navegadores distintos a internet explorer*/
            }
            catch (e) {
                try {
                    objetoAjax = new ActiveXObject("Microsoft.XMLHTTP");/*Para explorer*/
                }
                catch (E) {
                    objetoAjax = false;
                }
            }
            if (!objetoAjax && typeof XMLHttpRequest!='undefined')
                objetoAjax = new XMLHttpRequest();
            return objetoAjax;
        }();
        ajax.open( this.method, this.url, this.async );
        ajax.onreadystatechange = () => 
        {
            var completed = () =>
            {
                var success = () =>
                {
                    switch( this.dataType ) {
                        case 'xml':
                            this.funResponse( ajax.responseXML );break;
                        case 'json':
                            this.funResponse( 
                                JSON.parse( this.b64 ? b64DecodeUnicode( ajax.responseText ) 
                                                     : ajax.responseText ) 
                            );break;
                        case 'html':
                            this.funResponse( 
                                this.b64 ? b64DecodeUnicode( ajax.responseText.replace( /^\s*|\s*$/g,"" ) ) 
                                         : ajax.responseText.replace( /^\s*|\s*$/g,"" ) 
                            );break;
                    }
                }
                ( this.container != null ) 
                    ? document.getElementById( this.container ).innerHTML = "" 
                    : document.getElementById( 'showConnecting' ).parentNode.removeChild( document.getElementById( 'showConnecting' ) );    
                if ( ajax.status == 200 &&  ajax.responseText != '' )
                    success();
                else if ( ajax.status == 404 )
                    alert( "La direccion no existe" );
                else if (ajax.responseText == '' )
                    alert( 'La petición no generó respuesta...' + ajax.status );
                else
                    alert( "Error: " + ajax.status );
            }

            if ( ajax.readyState === 4 ) 
                completed();            
        }
        if ( this.contentType ) 
            ajax.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
        ajax.send( this.data );
        return;
    }
}

function request( oContainer, b64 = false, typeReqs='txt', url = false )
{

    var objsSelect = oContainer.getElementsByTagName("select");
    var objsTextArea = oContainer.getElementsByTagName("textarea");
    var objsInput = oContainer.getElementsByTagName("input");
    var objsRadioCheck = [];
    var k=0;

    if ( typeReqs === 'txt' || typeReqs === 'json' ) //( inArray( typeReqs, ['txt', 'json'] ) )
        var resp = '';
    else if (typeReqs === 'formdata')
        var data = new FormData();

    this.reqsAux = function(obj)
    {
        var valor = () => { return !url ? obj.value : encodeURIComponent(obj.value); }

        if ( typeReqs === 'txt' )
            return ( b64 ) 
                ? b64EncodeUnicode( obj.name ) + '=' + b64EncodeUnicode( valor() ) + '&' 
                : obj.name + '=' + valor() + '&';
        else if ( typeReqs === 'json' )
            return ( b64 ) 
                ? '"' + b64EncodeUnicode( obj.name ) + '" : "' + b64EncodeUnicode( valor() ) + '", '
                : '"' + obj.name + '" : "' + valor() + '", ';
        else if ( typeReqs === 'formdata' )
            return ( b64 )
                ? data.append( b64EncodeUnicode( obj.name ), b64EncodeUnicode( valor() ) )
                : data.append( obj.name, valor() );
    }

    for ( var i = 0; i < objsSelect.length; i++ )
        if ( objsSelect[i].disabled == false )
            resp += reqsAux( objsSelect[i] );            

    for( var i = 0; i < objsTextArea.length; i++ )
        if (objsTextArea[i].disabled == false)
            resp += reqsAux( objsTextArea[i] ); 

    for ( var i=0; i < objsInput.length; i++ )
        if ( objsInput[i].getAttribute('type') != 'button' && objsInput[i].getAttribute('type') != 'submit' 
        && objsInput[i].getAttribute('type') != 'radio' && objsInput[i].getAttribute('type') != 'checkbox' 
        && objsInput[i].disabled == false )
            resp += reqsAux( objsInput[i] );
        else if ( objsInput[i].getAttribute('type') == 'radio' || objsInput[i].getAttribute('type') == 'checkbox' )
            objsRadioCheck[k++] = objsInput[i];

    if ( objsRadioCheck.length>0 ) {
        var key=0;
        var keyAux = 0;
        var strRadioCheckName = objsRadioCheck[0].name;
        var mObjsRadioCheck = [];
        mObjsRadioCheck[key] = [];
        mObjsRadioCheck[key][keyAux++] = objsRadioCheck[0];
        for ( var i = 1; i < objsRadioCheck.length; i++ )
            if ( strRadioCheckName == objsRadioCheck[i].name ) {
                while (strRadioCheckName == objsRadioCheck[i].name ) {
                    mObjsRadioCheck[key][keyAux++] = objsRadioCheck[i++];
                    if ( i == objsRadioCheck.length )
                        break;
                }
                if ( i == objsRadioCheck.length )
                    break;
                else {
                    strRadioCheckName = objsRadioCheck[i--].name;
                    keyAux = 0;
                    mObjsRadioCheck[++key] = [];
                }
            } else {
                strRadioCheckName = objsRadioCheck[i--].name;
                keyAux = 0;
                mObjsRadioCheck[++key] = [];
            }
            for ( var i = 0; i < mObjsRadioCheck.length; i++ )
                for ( var j = 0; j < mObjsRadioCheck[i].length; j++ )
                    if ( mObjsRadioCheck[i][j].checked )
                        resp += reqsAux( mObjsRadioCheck[i][j], b64 );
    }

    if ( typeReqs === 'txt' )
        return resp.substring( 0, resp.length-1 );
    else if ( typeReqs === 'json' )
        return '{ ' + resp.substring( 0, resp.length-2 ) + ' }';
    else if ( typeReqs === 'formdata' )
        return data;

}

//Código Obsoleto de esta líne hasta el final
/** Construye un objeto Ajax.
* @return objetoAjax (object) Devuelve un objeto Ajax.*/
function createAjax()
{
    var objetoAjax=false;
    try {
        objetoAjax = new ActiveXObject("Msxml2.XMLHTTP");/*Para navegadores distintos a internet explorer*/
    }
    catch (e) {
        try {
            objetoAjax = new ActiveXObject("Microsoft.XMLHTTP");/*Para explorer*/
        }
        catch (E) {
            objetoAjax = false;
        }
    }
    if (!objetoAjax && typeof XMLHttpRequest!='undefined')
        objetoAjax = new XMLHttpRequest();
    return objetoAjax;
}
/** Envia y ejecuta el objeto Ajax.
* @param metodo (string) Indica el método bien sea GET o POST.
* @param paginaMasArgumento (string) Indica la ruta + el archivo (+ los valores si el método es GET).
* @param functionResponse (string) Nombre de la función donde será devuelta la respuesta del llamado Ajax.
* @param valores (string) Valores si el método es POST.
* @param capaContenedora (string) Identificador del elemento contenedor donde mostrará un mensaje de espera.
* @param bObj (string) Si este valor es TRUE indica que la respuesta será un objeto JSON.
* @return null*/
function send_ajax( metodo, paginaMasArgumento, functionResponse, valores, capaContenedora, bObj, bAsync=true, b64=false, contentType = true )
{
    var ajax = createAjax();
    ajax.open(metodo, paginaMasArgumento, bAsync);
    ajax.onreadystatechange = function(){
        if (ajax.readyState == 1 && capaContenedora != null){
	    var node = "Cargando...<IMG src='../../../"+appOrg+"/img/loading.gif' border='0'>";
            document.getElementById(capaContenedora).innerHTML = node;
        }else if (ajax.readyState == 4){
            if (capaContenedora != null)
                document.getElementById(capaContenedora).innerHTML = "";
            if (ajax.status == 200 &&  ajax.responseText != '')
                if (bObj){
                    if (b64)
                        functionResponse(JSON.parse(b64DecodeUnicode(ajax.responseText)));
                    else
                        functionResponse(JSON.parse(ajax.responseText));
                }else{
                    if (b64)
                        functionResponse(b64DecodeUnicode(ajax.responseText.replace(/^\s*|\s*$/g,"")));
                    else
                        functionResponse(ajax.responseText.replace(/^\s*|\s*$/g,""));
                } 
            else if(ajax.status == 404)
                alert("La direccion no existe");
            else if(ajax.responseText == '')
                alert('La petición no generó respuesta...'+ajax.status);
            else
                alert("Error: "+ajax.status);
        }
    }

    if (contentType) 
        ajax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    ajax.send(valores);
    return;
}

/*
function serialize (form) {
    if (!form || form.nodeName !== "FORM") {
            return;
    }
    var i, j, q = [];
    for (i = form.elements.length - 1; i >= 0; i = i - 1) {
        if (form.elements[i].name === "") {
            continue;
        }
        switch (form.elements[i].nodeName) {
            case 'INPUT':
                switch (form.elements[i].type) {
                    case 'text':
                    case 'tel':
                    case 'email':
                    case 'hidden':
                    case 'password':
                    case 'button':
                    case 'reset':
                    case 'submit':
                        q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                        break;
                    case 'checkbox':
                    case 'radio':
                        if (form.elements[i].checked) {
                                q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                        }                                               
                        break;
                }
                break;
                case 'file':
                break; 
            case 'TEXTAREA':
                    q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                    break;
            case 'SELECT':
                switch (form.elements[i].type) {
                    case 'select-one':
                        q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                        break;
                    case 'select-multiple':
                        for (j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
                            if (form.elements[i].options[j].selected) {
                                    q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].options[j].value));
                            }
                        }
                        break;
                }
                break;
            case 'BUTTON':
                switch (form.elements[i].type) {
                    case 'reset':
                    case 'submit':
                    case 'button':
                        q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                        break;
                }
                break;
            }
        }
    return q.join("&");
}
*/

