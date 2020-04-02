var fetchRequest = (oRequest) => {

    let objImg = document.createElement('img');
    objImg.setAttribute("src", "loading.gif");
    objImg.setAttribute("border", "0");
    let objDiv = document.createElement('div');            
    objDiv.innerHTML="Cargando...";
    objDiv.setAttribute('style','left:50%; top:50%; position: fixed; z-index:2001;');
    objDiv.appendChild(objImg);
    document.getElementsByTagName('body')[0].appendChild(objDiv);

    function Request(obj) {
        this.url          = obj.url;
        this.funcResponse = obj.funcResponse;
        this.dataType     = obj.dataType ? obj.dataType : 'html';
        this.oInit        = {
            method : obj.method ? obj.method : 'GET',
            body   : obj.body ? obj.body : null    
        };
    };
    
    let oRqs = new Request(oRequest);
    
    let fetchPositive = (response) => {
         
        objDiv.parentNode.removeChild(objDiv);
        
        if(response.ok && response.status == 200) {
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
        console.log('Error: ', err);
    }

    fetch(oRqs.url, oRqs.oInit).then(fetchPositive).catch(showError);

}

