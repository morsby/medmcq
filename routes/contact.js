const express = require('express');
const router = express.Router();

const sgMail = require('@sendgrid/mail');
const keys = require('../config/keys');
const urls = require('../config/urls');

router.post('/', (req, res) => {
  let { subject, message } = req.body;
  message = message.replace(/(.)\n(.)/g, '$1<br>$2');
  sgMail.setApiKey(keys.sendgrid_api_key);
  const msg = {
    to: urls.email.issue,
    from: `medMCQ-app <${urls.email.noreply}>`,
    subject: subject,
    text: message + '<br><br><em>Sendt via kontaktformularen</em>'
  };
  sgMail.send(msg);

  res.json({ type: 'success', message: 'message_sent' });
});

module.exports = router;
