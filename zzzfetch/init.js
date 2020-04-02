var sendRequest = () => {

    let fetchResponse = (response) => {
        console.log('fetchResponse: ', response);
        document.getElementById('parrafo').textContent=response;
    }

    const data = new FormData(document.getElementById('formulario'));

    fetchRequest({
        url         :'test.php',
        method      :'POST', 
        funcResponse: fetchResponse,
        body        : data,
        dataType    : 'json'});

    /*fetchRequest({
        url         :'test.php',
        method      :'POST', 
        funcResponse: fetchResponse,
        body        : data,
        dataType    : 'html'});*/
    /*fetchRequest({
        url         :'test.php?xxx=123',
        funcResponse: fetchResponse,
        dataType    : 'json'});*/

}

