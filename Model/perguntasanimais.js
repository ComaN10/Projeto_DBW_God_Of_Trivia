const mongoose = require("mongoose");
var perguntasSchema = mongoose.Schema({
    pergunta: String,
    respostaCerta: String,
    respostaFalsa1: String,
    respostaFalsa2: String,
    respostaFalsa3: String,
    respostaFalsa4: String,
    respostaFalsa5: String,
    respostaFalsa6: String,
  });
  module.exports = mongoose.model("perguntasanimais", perguntasSchema);