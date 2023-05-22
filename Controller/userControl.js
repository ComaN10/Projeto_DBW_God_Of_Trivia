const userModel = require("../Model/userModel");
const User = require("../Model/userModel");

//StartMenu
const startGet = function (req, res) {
  res.render("start");
};
//Perfil
const ProfileGet = async function (req, res) {
  const username = req.query.username;
  var idprofile;
    const users = await userModel.find({});
    console.log("id perfil"+ idprofile);
    users.forEach(user => {
      if (user.username === username) {
        idprofile=user._id;
        console.log("depois comp "+ idprofile);
        // Username matches, perform your desired actions here
      }
    });
  const userd= await userModel.findById(idprofile).exec();
  res.render("profile", {userd,userd}); 
};

const atualizaImg = async function (req, res) {
  const idprofile  = req.query._id; //Vamos buscar o ID que existe no URL
  const novaImg = req.body.imagem; //Vamos buscar a informação atualizado do formulário
  const userd= await userModel.findById(idprofile).exec();
  userd.imagem = novaImg; //Fazemos a atualização do documento mongoDB
  await userd.save(); //Gravamos a informação nova na BD
  
};


//StartLogged

const userGet = function (req, res) {
  res.render("registar");
};

const userPost = async function (req, res) {
  const { email, username, password } = req.body;

  const user = new User({ email, username }); // cria um novo utilizador
  await User.register(user, password); //guarda os dados na BD
  res.redirect("/login");
};


const loginGet = function (req, res) {
  res.render("login");
};

const logout = function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/login");
    });
  });
};


let userCont = async function (req, res) {
  if (!req.isAuthenticated()) {
    // Se não está autenticado, vai para o login!
    console.log("Nop, não tem acesso!");
    return res.redirect("/login");
  }
  let users = await User.find({});
  res.render("startLog", { info: users });
};

/*const showImagem = async function(req,res){
  try{
    const {id}=req.params;
    const imagem = await User.findById(id).exec();
    if (imagem){
      res.render("showImagem",{imagem: imagem });
    }else{
      console.log("Nao tem imagem");
    }
  }catch(error){
    console.error(error)
  }
}*/

module.exports = { userGet,userPost, loginGet, logout, startGet, userCont, ProfileGet,atualizaImg};