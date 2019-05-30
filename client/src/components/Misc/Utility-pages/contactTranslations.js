export default {
  contact: {
    header: ['Kontakt os', 'Contact us'],
    subheader: [
      'Benyt nedenstående formular til at sende en besked til dem, der arbejder på siden.',
      'Use the form below to send a message to the people working on the site.'
    ],
    disclaimer: [
      `
Når du sender din besked, bliver den offentligt tilgængelig. Der oprettes en ny tråd på https://github.com/morsby/au-medicin-mcq/issues/.

Vi har ikke mulighed for at kontakte dig direkte som svar på din henvendelse, så har du behov for opfølgning henvises til ovenstående link.`,
      `
When you send your message, it will become public. A new thread will be created at https://github.com/morsby/au-medicin-mcq/issues/.

We cannot contact you directly. If you want to follow up on your message, please visit the link above.`
    ],
    form: {
      subject: ['Overskrift', 'Subject'],
      message: ['Besked', 'Message'],
      error: {
        header: ['Fejl', 'Error'],
        body: [
          'Din overskrift skal være mindst 3 tegn, og beskeden mindst 10 tegn.',
          'Your subject must be at least 3 characters and your message must be at least 10 characters.'
        ]
      },
      submitted: {
        header: ['Din besked er sendt!', 'Your message has been sent!'],
        body: [
          'Tak for din besked! Som skrevet kan du følge med i tråden her: https://github.com/morsby/au-medicin-mcq/issues/.',
          'Thank your for your message! As stated above, you can follow the thread here: https://github.com/morsby/au-medicin-mcq/issues/.'
        ]
      }
    }
  }
};
