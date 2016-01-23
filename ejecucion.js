var modulo = function(zl, async) {
  "use strict";

  // Dependencias en NodeJS
  if (!zl.io && typeof require !== "undefined") {
    require("./njsio")(zl);
  }

  // Async en NodeJS
  if (!async && typeof require !== "undefined") {
    async = require("async");
  }

  if (!async) {
    console.error("Se requiere async para la ejecución.");
    return zl;
  }

  zl.ejecucion = zl.ejecucion || {};

  var rte = {};
  if (typeof window !== "undefined")
    window.$zl_rte = rte;

  // mensaje es Texto de Entrada
  rte.mostrar = function(arg) {
    zl.io.outWrite(arg.mensaje + "\n");
  }

  rte.mostrarnumero = function(arg) {
    zl.io.outWrite(arg.mensaje.toPrecision(7) + "\n");
  }

  rte.leernumero = function(arg, callback) {
    rte.$ultimorte.$abortar = abortRead;
    zl.io.inRead(function cbck(err, value) {
      var x = parseFloat(value);
      if (isNaN(x))
        inRead(cbck);
      else
        callback(null, {
          mensaje: x
        });
    });
  }

  rte.leer = function(arg, callback) {
    rte.$ultimorte.$abortar = abortRead;
    zl.io.inRead(function(err, value) {
      callback(null, {
        mensaje: value
      });
    });
  }

  rte.aleatorio = function(arg) {
    return {
      resultado: Math.round((Math.random() * (arg.maximo - arg.minimo)) + arg.minimo)
    };
  }

  rte.limpiar = function(arg) {
    zl.io.limpiar();
  }

  rte.productoTexto = function(arg) {
    var texto =
      typeof arg.izq === "string" ? arg.izq : arg.der;

    var veces =
      typeof arg.izq === "number" ? arg.izq : arg.der;
    return (function ttimes(t, n) {
      // Hack: decimal a entero
      n = ~~n;
      if (n === 0)
        return "";
      var x = ttimes(t, n / 2);
      if (n % 2 === 0)
        return x + x;
      else
        return x + x + t;
    })(texto, veces);
  }

  rte.construirLista = function(dimensiones) {
    // TODO: Usar las dimensiones para construir el array.
    var r = [];
    return r;
  }

  rte.$alAcabar = function() {

  }

  rte.async = async;

  rte.$tipos = {
    "numero": {
      constructor: function(v) {
        return v || 0;
      },
      '>': null
    },
    "booleano": {
      constructor: function(v) {
        return v || false;
      }
    }
  };

  zl.eval = function(codigo) {
    eval(codigo);
  }

  zl.Cargar = function(javascript) {
    var carga = rte.$ultimorte = zl.writeJson({}, rte);
    // Cargar el código:
    rte.limpiar({});
    zl.eval.call(carga, javascript);
    return carga;
  }

  zl.Ejecutar = function(carga) {
    // Preparar la ejecución:
    var ejecucion = "var $t = this;";

    // TODO: Distinguir si this.inicio es asíncrona o no.
    if (typeof carga.inicio === "function") {
      ejecucion += "$t.inicio({},function() {";
    }
    // TODO: Tener en cuenta el retardo de cálculo y restárselo al interval.
    if (typeof carga.fotograma === "function") {
      ejecucion += "$t.$interval=setInterval(function cbck(){" +
        "clearInterval($t.$interval);" +
        "$t.fotograma({},function(){$t.$interval = setInterval(cbck," + 1 / zl.configuracion.fps * 1000 + ")})" +
        "}," + 1 / zl.configuracion.fps * 1000 + ");";
    } else {
      ejecucion += "$t.$alAcabar();";
    }
    if (typeof carga.inicio === "function") {
      ejecucion += "});";
    }
    // Y Ejecutar
    zl.eval.call(carga, ejecucion);
  }

  zl.Abortar = function(carga) {
    // Romper las llamadas asíncronas:
    if (carga.$abortar)
      carga.$abortar();
    delete carga.$abortar;
    // Romper la ejecución de los fotogramas:
    clearInterval(carga.$interval);
  }
}

if (typeof module !== "undefined") {
  module.exports = modulo;
}
else {
  this.zl = modulo(this.zl || {}, async);
}
