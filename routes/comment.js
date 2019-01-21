// Dette route omhandler kommentarer på feedback-forslag
const express = require('express')
const router = express.Router()
var randomstring = require("randomstring");

const keys = require("../config/keys");

const permit = require("../permission"); // middleware for checking if user's role is permitted to make request

// MODELS
const Comment = require("../models/comment");
const Feedback = require("../models/feedback");

// POST: comment
router.post("/api/feedback/:f_id/comment", (req, res) => {
    let q = req.body;
    var comment = new Comment();

    let date = Date.now();
    let slug, full_slug;
    let slug_part = randomstring.generate({
        length: 4,
        capitalization: "lowercase"
    });
    let full_slug_part = `${date}:${slug_part}`;
    comment.date = date;
    comment.author = q.author;
    comment.text = q.text;
    comment.feedback_id = req.params.f_id;
    comment.parent_id = q.parent_id ? q.parent_id : null;

    const getSlugs = async q => {
        let slugs = {};
        if (q.parent_id) {
            let parent = await Comment.findById(q.parent_id);

            slugs.slug = `${parent.slug}/${slug_part}`;
            slugs.full_slug = `${parent.full_slug}/${full_slug_part}`;
        } else {
            slugs.slug = slug_part;
            slugs.full_slug = full_slug_part;
        }
        return slugs;
    };

    getSlugs(q).then(slugs => {
        comment.slug = slugs.slug;
        comment.full_slug = slugs.full_slug;

        comment.save(err => {
            if (err) res.send(err);

            res.json({ message: "Kommentar tilføjet feedback" });
        });
    });
});

// DELETE: comment
router.delete(
    "/api/feedback/:f_id/comment/:c_id",
    permit("admin"),
    (req, res) => {
        Comment.remove({ _id: req.params.c_id }, err => {
            if (err) res.send(err);
        });
        res.send({ message: "Beskeden er slettet" });
    }
);

module.exports = router
