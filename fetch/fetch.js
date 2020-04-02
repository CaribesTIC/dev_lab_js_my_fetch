//https://formcarry.com/documentation/fetch-api-example
//https://www.todojs.com/api-fetch-el-nuevo-estandar-que-permite-hacer-llamadas-http/
//https://diego.com.es/headers-del-protocolo-http

/*
Las opciones que podemos configurar son:

    method: método a utilizar
    headers: cabeceras que se deben enviar (ver objeto Headers).
    body: cuerpo que se envía al servidor, que puede ser una cadena, un objecto Blob, BufferSource, FormData o URLSearchParams.
    mode: modo del la solicitud: ‘cors’, ‘no-cors’, ‘same-origin’, ‘navigate’.
    credentials: credenciales utilizadas: ‘omit’, ‘same-origin’, ‘include’.
    cache: forma de utilización de la caché: ‘default’, ‘no-store’, ‘reload’, ‘no-cache’, ‘force-cache’, ‘only-if-cached’.
    redirect: forma de gestionar la redirección: ‘follow’, ‘error’, ‘manual’.
    referrer: valor utilizado como referrer: ‘client’, ‘no-referrer’ una URL.
    referrerPolicy: especifica el valor de la cabecera referer: ‘no-referrer’, ‘no-referrer-when-downgrade’, ‘origin’, ‘origin-when-cross-origin’, ‘unsafe-url’.
    integrity: valor de integridad de la solicitud.
*/

var fetchRequest = (oRequest) => {

    let eDivWait = (() => {
        let eImg = document.createElement('img');
        eImg.setAttribute("src", "img/loading.gif");
        eImg.setAttribute("border", "0");
        let eDiv = document.createElement('div');            
        eDiv.innerHTML="Cargando...";
        eDiv.setAttribute('style','left:50%; top:50%;sition: fixed; z-index:2001;');
        eDiv.appendChild(eImg);
        document.getElementsByTagName('body')[0].appendChild(eDiv);
        return eDiv;
    })();

    function Request(obj) {
        this.url          = obj.url;
        this.funcResponse = obj.funcResponse;
        this.dataType     = obj.dataType ? obj.dataType : 'html';
        this.oInit        = {
            method : obj.method ? obj.method : 'GET',
            //headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            //headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
            //headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
            //headers: { 'Content-Type': 'application/x-www-form-url-encoded', 'Accept': 'application/json'},
            //headers: { 'Content-Type': 'application/json', 'Accept': 'application/json'},
              //headers: { 'Content-Type': 'multipart/form-data; boundary=something'},
              //headers: {},
           cache: 'no-cache',

            body   : obj.body ? obj.body : null    
        };
    };
    
    let oRqs = new Request(oRequest);
    
    let fetchPositive = (response) => {
         
        eDivWait.parentNode.removeChild(eDivWait);
        
        if(response.ok && response.status == 200) {
  
            /*console.log('response.body =', response.body);
            console.log('response.bodyUsed =', response.bodyUsed);
            console.log('response.headers =', response.headers);
            console.log('response.ok =', response.ok);
            console.log('response.status =', response.status);
            console.log('response.statusText =', response.statusText);
            console.log('response.type =', response.type);
            console.log('response.url =', response.url);*/


            switch (oRqs.dataType) {
                case 'json':
                    response.json().then(showResult);
                    break; 
                case 'html':
                    response.text().then(showResult);
                    break;
            }
         
        } else
            showError('status code: ' + response.status);

    }

    let showResult = (res) => {
        (res) ? oRqs.funcResponse(res) : alert('La petición no generó respuesta...'); 
    }

    let showError  = (err) => { 
        console.log('Error (', err, ')');
    }

    fetch(oRqs.url, oRqs.oInit).then(fetchPositive).catch(showError);

}

