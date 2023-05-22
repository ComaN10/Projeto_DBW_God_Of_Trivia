const router = require("express").Router();
const userCont = require("../Controller/userControl");
const passport = require("passport");

router.get("/registar", userCont.userGet);
router.post("/registar", userCont.userPost);

router.get("/login", userCont.loginGet);
router.post(
  "/login",
  passport.authenticate("local",{ successRedirect: '/startLog', failureRedirect: '/login' }),
  function (req, res) {
    res.redirect("/startLog");
  }
);

router.get('/startLog', function (req, res) {
  if (req.isAuthenticated()) {
    // User is authenticated
    // You can access the user object using req.user
    console.log('Authenticated user:', req.user);
    
    // Retrieve the username from the user object
    var username = req.user.username;

    // Render the startLog view and pass the username to it
    res.render('startLog', { username: username });
  } else {
    // User is not authenticated
    res.redirect('/login'); // Redirect to the login page
  }
});

router.get("/start", userCont.startGet);

router.get("/Profile", userCont.ProfileGet);

router.get("/logout", userCont.logout);

router.get("/start", userCont.userCont);

router.post("/Profile", userCont.atualizaImg);


module.exports = router;