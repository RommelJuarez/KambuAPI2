const express=require('express');
const dotenv = require('dotenv');
const{initDB}=require('./db/dbConn');
const cors=require('cors');
const passport=require('passport');
const session=require('express-session');
const GitHubStrategy=require('passport-github2').Strategy;

const app=express();
const port=process.env.PORT || 8080;

dotenv.config();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization'
    );
    next();
  });
app.use(cors({methods:['GET','POST','PUT','DELETE','UPDATE','PATCH']}));
app.use(cors({origin:'*'}));
app.use(express.json());

// 📌 authentication middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {   
    return done(null, profile);
  }
));
passport.serializeUser((user, done) => {
  done(null, user);
});  
passport.deserializeUser((user, done) => {
  done(null, user);
});
app.get('/', (req, res) => {res.send(req.session.user !== undefined ? `Logged in as: ${req.session.user.displayName}` : 'Logged out')});
app.get('/github/callback', passport.authenticate('github', {
  failureRedirect: '/api-docs', session: true}),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
})

initDB((err,database)=>{
    if(err){
        console.error('Error connecting to the database:',err);
        return;
    }
});

app.use('/',require('./routes'));

app.listen(port,()=>{console.log(`Running on port: ${port}`)});