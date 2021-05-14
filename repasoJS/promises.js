

var saludar = new Promise((resolve, reject) => {
    
    setTimeout(() => {
        let hi = "Hey chavales";

        if(hi){
            //resolve(hi);
        }
        else reject ('No hay saludo disponible');

    }, 2000);
});


saludar.then(resultado => {
    alert(resultado);
}).catch(err => {
    alert(err);
});