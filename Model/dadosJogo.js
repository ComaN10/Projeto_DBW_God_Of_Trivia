const { Int32 } = require("mongodb");
var mongoose = require("mongoose");

var dadosJogoSchema=mongoose.Schema({
    nrPergunta:Number,
    score:String,
    pergunta:String,
    respA:String,
    respB:String,
    respC:String,
    respD:String,
    respEscolhida:String,
    respCerta:String,
    segundosResposta:Number,
    estadoWait:Boolean,
    estadoAvancar:Boolean,
    namePlayer:String,
    fastPlayer:String,
    resultado:String,
    pConnected:Boolean,
});
module.exports=mongoose.model("DadosJogo",dadosJogoSchema)