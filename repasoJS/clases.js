
class Coche{
    constructor(modelo, velocidad, ano){
        this.modelo = modelo;
        this.velocidad = velocidad;
        this.ano = ano;
    }

    aumentaVelocidad(v){
        this.velocidad +=v;
    }

    reducirVelocidad(v){
        this.velocidad -=v;
    }
}


class Moto extends Coche{
    constructor(modelo, velocidad, ano, altura){
        super(modelo, velocidad, ano);
        this.altura = altura;
    }
}

let Coche1 = new Coche('BMW', 200, 2017);
let Coche2 = new Coche('Audi', 200, 2020);
let Coche3 = new Coche('CLio', 200, 2007);
let Moto1  = new Moto('Pegasus', 150, 2007, 5);


Moto1.reducirVelocidad(50);
console.log(Moto1.altura);
