import express, { json } from "express";
import methodOverride from "method-override";
import pg from "pg";
import session from "express-session";
import passport from "passport";
import env from "dotenv";
import bcrypt from "bcrypt";
import GoogleStrategy from "passport-google-oauth2";
import GitHubStrategy from "passport-github2";

env.config();
const saltRounds = 10;


const app = express();
const port = process.env.PORT || 3000;

app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
  },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride((req, res) => {
  if ('_method' in req.body) {
    return req.body._method;
  }
  else {
  return "POST";
}

}));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "notepad",
  password: "NikoBelic",
  port: 5432,
});



// Connect once when the application starts
db.connect((err) => {
  if (err) {
	console.error("Connection error", err.stack);
  } 
});

const interval = 24 * 60 * 60 * 1000
let lastReset = "undefined"


app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});


function getRandomLightColor() {
  let ranges = [[128, 152], [182, 203], [233, 256]];
  ranges = shuffleArray(ranges);
  const r = Math.floor(Math.random() * (ranges[0][1] - ranges[0][0]) + ranges[0][0]); 
  const g = Math.floor(Math.random() * (ranges[1][1] - ranges[1][0]) + ranges[1][0]);
  const b = Math.floor(Math.random() * (ranges[2][1] - ranges[2][0]) + ranges[2][0]);
  return `rgb(${r}, ${g}, ${b})`;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
  [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

async function resetLoginAttempts() {


  const currentMoment = new Date();
 // console.log(currentMoment)
 if (lastReset === "undefined") {
  const dbRes = await db.query("SELECT last_reset FROM timestamps WHERE id = 1");
   lastReset = new Date(dbRes.rows[0].last_reset);
 }

  //console.log(lastReset)

  if (currentMoment - lastReset >= interval) {
    lastReset = currentMoment;
      await db.query("UPDATE users SET login_attempts = 0");
      await db.query("UPDATE timestamps SET last_reset = $1", [lastReset.toISOString()]);
     
  }
}



app.get("/", async (req, res) => {

if (req.isAuthenticated()) {
 // console.log(req.user.username)
  try {
    const dbRes = await db.query("SELECT * FROM notes WHERE user_id = $1 ORDER BY update_time DESC", [req.user.id]);
    const notes = dbRes.rows;
   // console.log(notes);
  const data = {
    notes: notes,
    };
  
    res.render("home.ejs", data);
    } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).send("Database error");
    }
}
else {
  res.redirect("/login") 
 
}
  
});

app.get("/about", (req, res) => {
  res.render("about.ejs")
})

app.get("/login", async (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/");
  }
  else {
  
    try {
    await resetLoginAttempts()
  } catch (err) {
      console.error("Error executing query", err.stack);
      res.status(500).send("Database error");
      }

     let error = "No error"
     if (req.query.error) {
      error = "This account uses a different sign-in method"
     } 

    res.render("login.ejs", {
      error: error
    });
  }


});




app.post("/upload", async (req, res) => {
  if (req.isAuthenticated()) {
    const creationTime = new Date().toISOString(); 
    // notes.push(new Note(req.body.title, req.body.content));
    try {
     await db.query("INSERT INTO notes (title, content, bg_color, creation_time, update_time, user_id, visibility) VALUES ($1, $2, $3, $4, $4, $5, $6)", [req.body.title, req.body.content, getRandomLightColor(), creationTime, req.user.id, req.body.visibility]);
   
   
     res.redirect("/");
     } catch (err) {
     console.error("Error executing query", err.stack);
     res.status(500).send("Database error");
     }
     
  }
  else {
    res.status(401).render("error.ejs", {errorMessage: "401 - Unauthorized"});
  }

    
});

passport.serializeUser((user, cb) => {
  cb(null, user);
});


passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);


    if (checkResult.rows.length > 0) {
      
      res.render("login.ejs", {
        error: "User already exists"
      });
    } else {
      //hashing the password and saving it in the database
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
        //  console.log("Hashed Password:", hash);
          const userJoinTime = new Date().toISOString(); 
          const result = await db.query(
            "INSERT INTO users (username, password, join_time) VALUES ($1, $2, $3) RETURNING *",
            [username, hash, userJoinTime]
          );
          const user = result.rows[0];
          req.login(user, (err) => {
            if (err) {
              console.error("Error logging in after registration:", err);
              res.render("login.ejs", {
                  error: "An error occurred during login after registration"
              });
          } else {
              res.redirect("/");
          }
          });
         
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});


app.post("/login", async (req, res) => {
 // console.log("logging the user in!")
  const username = req.body.username;
  const password = req.body.password;
  try {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      let numberOfAttempts = Number(user.login_attempts)
      if (numberOfAttempts > 5) {
        
        res.render("login.ejs", {
          error: "Too many login attempts. Try again later"
        });
        return;
      } 
      
      const storedHashedPassword = user.password;
      bcrypt.compare(password, storedHashedPassword, async (err, result) => {
        if (err) {
          console.error("Error comparing passwords", err.stack);
          res.status(500).send("Password comparison error");
        } else {
         // console.log(result);
          if (result) {
         //   console.log("regular logged in successfully!")
            try  {
              await db.query("UPDATE users SET login_attempts = 0 WHERE id = $1", [user.id ]);

            } catch (err) {
              console.error("Error executing query", err.stack);
              res.status(500).send("Database error");
            }
            req.login(user, (err) => {
              if (err) {
                console.error("Error logging in: ", err)
                res.render("login.ejs", {
                  error: "An error occurred during login"
                });
              } else {
                  res.redirect("/")
              }
            });
            
          } else {
            
              numberOfAttempts++;
              try {
                await db.query("UPDATE users SET login_attempts = $1 WHERE id = $2", [numberOfAttempts, user.id ]);
  
              } catch (err) {
                console.error("Error executing query", err.stack);
                res.status(500).send("Database error");
              }
              
  
              res.render("login.ejs", {
                error: "Wrong username or password"
              });
 
            
          }
        }
      });
    } else {
      
      res.render("login.ejs", {
        error: "User not found"
      });
    }
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).send("Database error");
  }

});

app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      console.error("Error logging out:", err);
      return res.status(500).send("Failed to log out");
  } else {
    res.redirect("/login");
  }
   
  });
});





app.get("/new", (req, res) => {
  
  if (req.isAuthenticated()) {
    res.render("new.ejs");
  }
  else {
    res.redirect("/login");
  }
    
});

app.get("/note", async (req, res) => {
  // req.query.id

  if (typeof req.query.id === "undefined") {
    res.redirect("/")
  } else {
  try {
    const dbRes = await db.query("SELECT * FROM notes WHERE id = $1", [req.query.id]);
    const note = dbRes.rows[0];
    if (typeof note === "undefined") {
      res.status(404).render("error.ejs", {errorMessage: "404 - Not Found"}); 
      return;
    }
    const logged_in = req.isAuthenticated()
    if (note.visibility === "Private") {
      if (!logged_in) {
        res.status(401).render("error.ejs", {errorMessage: "401 - Unauthorized"}); 
        return;
      }
      if (req.user.id !== note.user_id) {
        res.status(403).render("error.ejs", {errorMessage: "403 - Forbidden"}); 
        return;
      }
    }
    let owns = false
    if (logged_in && req.user.id === note.user_id ) {
      owns = true
    }
    const data = {
      note: note,
      owns: owns,
      logged_in: logged_in
      };
      res.render("note.ejs", data);
    } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).send("Database error");
    }

} 

});

app.put("/update", async (req, res) => {
  // req.body.id
  const updateTime = new Date().toISOString(); 
  try {
    await db.query("UPDATE notes SET title = $1, content = $2, update_time = $3, visibility = $4 WHERE id = $5", [req.body.title, req.body.content, updateTime, req.body.visibility, req.body.id]);
 
    res.redirect("/");
    } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).send("Database error");
    }  
    
});




app.delete("/update", async (req, res) => {

  try {
    await db.query("DELETE FROM notes WHERE id = $1", [req.body.id]);
 
    res.redirect("/");
    } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).send("Database error");
    } 
 
  
});



app.post(
  "/googleAuth/start",
  passport.authenticate("google", {
    scope: ["email"],
    prompt: "select_account", // Forces the account picker to appear
  })
);



app.get("/googleAuth/end", passport.authenticate("google", {
  successRedirect: "/",
  failureRedirect: "/login?error=oauth",
}))

app.post(
  "/githubAuth/start",
  passport.authenticate("github", {
    scope: ["user:email"],
    prompt: "select_account", 
  })
);


app.get("/githubAuth/end", passport.authenticate("github", {
  successRedirect: "/",
  failureRedirect: "/login?error=oauth",
}))





passport.use("google", new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/googleAuth/end",
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
}, async (accessToken, refreshToken, profile, cb) => {
    //  console.log(profile);
      try {
       const result = await db.query("SELECT * FROM users WHERE username = $1", [profile.email])
       if (result.rows.length === 0) {
      //  console.log("Google registered successfully!")
        const userJoinTime = new Date().toISOString(); 
        const newUser = await db.query("INSERT INTO users (username, password, join_time) VALUES ($1, $2, $3) RETURNING *", [profile.email, "google", userJoinTime])
        cb(null, newUser.rows[0])
       } else {
        // Already existing user
    //    console.log("Google logged in successfully!")
        const user = result.rows[0]
        if (user.password === "google") {
          cb(null, user);
        }
        else {

          cb(null, false)
        }
        
       }
      } catch (err) {
        cb(err);
      }
  })
);

passport.use("github", new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/githubAuth/end",
}, async (accessToken, refreshToken, profile, cb) => {
    //  console.log(profile);
      const username = profile.emails?.[0].value || profile.username
      try {
       const result = await db.query("SELECT * FROM users WHERE username = $1", [username])
       if (result.rows.length === 0) {
      //  console.log("Github registered successfully!")
        const userJoinTime = new Date().toISOString(); 
        const newUser = await db.query("INSERT INTO users (username, password, join_time) VALUES ($1, $2, $3) RETURNING *", [username, "github", userJoinTime])
        cb(null, newUser.rows[0])
       } else {
        // Already existing user
    //    console.log("Github logged in successfully!")
    const user = result.rows[0]
    if (user.password === "github") {
      cb(null, user);
    }
    else {
    //  console.log("password should've been github, but it's " + user.password)
      cb(null, false)
    }
       }
      } catch (err) {
        cb(err);
      }
  })
);

app.use((req, res) => {
 
 // res.redirect("/")
    res.status(404).render("error.ejs", {errorMessage: "404 - Not Found"}); // Using EJS for templating
 
});


const array = ["SIGINT", "SIGTERM"];

array.forEach((signal) => {
  process.on(signal, async () => {
	try {
  	await db.end();
  	console.log(`Database connection closed due to ${signal}. App will now exit.`);
	} catch (err) {
  	console.error(`Error closing database connection on ${signal}:`, err.stack);
	}
  });
});



