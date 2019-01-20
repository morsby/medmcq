const keys = require("../config/keys");
const passport = require("passport");
const async = require("async");
var crypto = require("crypto");
const sgMail = require("@sendgrid/mail");

const permit = require("../permission"); // middleware for checking if user's role is permitted to make request

const urls = require("../config/urls");

// MODELS
const User = require("../models/user");

module.exports = app => {
    // SIGNUP
    app.post("/api/signup", (req, res) => {
        let q = req.body;
        var user = new User();

        user.username = q.username;
        user.password = q.password;
        user.email = q.email;

        user.save(err => {
            if (err) return res.send(err);

            res.json({ message: "Bruger tilføjet", id: user._id });
        });
    });

    // Check username
    app.post("/api/auth/check-username", (req, res) => {
        // Matcher præcise brugernavne uafhængigt af case
        User.findOne(
            {
                username: {
                    $regex: new RegExp("^" + req.body.username + "$", "i")
                }
            },
            (err, user) => {
                if (err) throw err;

                let available = user ? false : true;
                res.send(available);
            }
        );
    });

    // SIGNIN
    app.post("/api/auth/login", (req, res, next) => {
        passport.authenticate("local", (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.json({ type: "failure", message: "Login failed" });
            }
            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }
                return res.json({ type: "success", user: user.username });
            });
        })(req, res, next);
    });

    // Logout
    app.get("/api/auth/logout", function(req, res) {
        req.logout();
        res.redirect("/logout");
    });

    // Get current user
    app.get("/api/auth/current_user", function(req, res) {
        res.send(req.user);
    });

    // DELETE user
    app.delete("/api/auth/delete", (req, res) => {
        if (!req.user)
            return res.send({ type: "error", data: "Du er ikke logget ind." });

        User.findById(req.user._id, "password", (err, user) => {
            if (!req.body.password) {
                return res.send({
                    type: "error",
                    data: "Du skal indtaste dit kodeord for at slette brugeren"
                });
            }

            user.comparePassword(req.body.password, (err, isValid) => {
                if (err || !isValid)
                    return res.send({
                        type: "error",
                        data: "Kodeordet er ugyldigt!"
                    });
                user.remove(() => {
                    req.logout();
                    res.send({ type: "success", data: "Brugeren er slettet!" });
                });
            });
        });
    });

    // Opdater profil
    app.put("/api/auth/edit", (req, res) => {
        if (!req.user)
            return res.send({ type: "error", data: "Du er ikke logget ind!" });
        let { password, email } = req.body;

        User.findById(req.user._id, (err, user) => {
            if (err) return res.send({ type: "error", data: err });
            if (password) {
                user.password = password;
            }
            if (email) {
                user.email = email;
            }

            user.save(err => {
                if (err) return res.send({ type: "error", data: err });
                res.send({ type: "success", data: "Profilen er ændret" });
            });
        });
    });

    // Glemt kodeord:
    app.post("/api/auth/forgot", function(req, res, next) {
        if (!req.body.email) {
            res.send({ type: "error", data: "Der er ikke indtastet en email" });
        } else {
            async.waterfall(
                [
                    function(done) {
                        crypto.randomBytes(20, function(err, buf) {
                            var token = buf.toString("hex");
                            done(err, token);
                        });
                    },
                    function(token, done) {
                        User.findOne({ email: req.body.email }, function(
                            err,
                            user
                        ) {
                            if (!user) {
                                return res.send({
                                    type: "error",
                                    data:
                                        "Der blev ikke fundet en bruger med den angivne email"
                                });
                            }
                            user.resetPasswordToken = token;
                            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                            user.save(function(err) {
                                done(err, token, user);
                            });
                        });
                    },
                    function(token, user, done) {
                        sgMail.setApiKey(keys.sendgrid_api_key);
                        var msg = {
                            to: user.email,
                            from: urls.emailFrom,
                            subject:
                                "Nulstilling af kodeord ved AU Medicin MCQ-sitet",
                            text:
                                "Du modtager denne mail, fordi du (eller en anden!) har bedt om nulstilling af dit kodeord.\n\n" +
                                "Klik på nedenstående link eller kopier det ind i den browser for at indstille et nyt kodeord. Du har en time til at gøre dette, før linket udløber\n\n" +
                                "http://" +
                                req.headers.host +
                                urls.forgotPassword +
                                token +
                                "\n\n" +
                                "Hvis du ikke har bedt om nulstilling af din kode, kan du blot ignorere denne mail, og din kode forbliver uændret. \n\n" +
                                "Med venlig hilsen Sigurd\n"
                        };
                        sgMail.send(msg);
                        done();
                    }
                ],
                function(err) {
                    if (err) return next(err);
                    res.send({
                        type: "success",
                        data: "En mail er blevet sendt med instruktioner!"
                    });
                }
            );
        }
    });

    // Do the reset
    app.post("/api/auth/reset/:token", function(req, res) {
        async.waterfall(
            [
                function(done) {
                    User.findOne(
                        {
                            resetPasswordToken: req.params.token,
                            resetPasswordExpires: { $gt: Date.now() }
                        },
                        function(err, user) {
                            if (err) res.send(err);
                            if (!user) {
                                return res.send({
                                    type: "error",
                                    data:
                                        "Reset-token er ikke gyldigt (længere?). Bed om et nyt via formularen \"Glemt kodeord\" og prøv igen."
                                });
                            }

                            user.password = req.body.password;
                            user.resetPasswordToken = undefined;
                            user.resetPasswordExpires = undefined;

                            user.save(function(err) {
                                if (err) {
                                    res.send(err);
                                    done(err, null);
                                }

                                done(err, user);
                            });
                        }
                    );
                },
                function(user, done) {
                    var msg = {
                        to: user.email,
                        from: urls.emailFrom,
                        subject:
                            "Dit kodeord er blevet ændret hos AU Medicin MCQ-sitet",
                        text:
                            "Hej,\n\n" +
                            "Denne mail er for at konfirmere, at koden til AU Medicin MCQ-sitet for brugeren med email " +
                            user.email +
                            " er blevet ændret.\n\n" +
                            "Har du ikke bedt om denne ændring, kan det skyldes at andre har adgang til din mail, eller en fejl i mit system - så kontakt mig gerne! \n\n" +
                            "Med venlig hilsen Sigurd\n"
                    };
                    sgMail.send(msg);

                    done(null);
                }
            ],
            function(err) {
                return res.send({
                    type: "success",
                    data:
                        "Kodeordet er nulstillet. Der er sendt en mail til dig for at bekræfte dette (du skal ikke gøre noget)."
                });
            }
        );
    });
};
