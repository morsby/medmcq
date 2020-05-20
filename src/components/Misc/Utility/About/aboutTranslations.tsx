export default {
  about: {
    header: ['Om siden', 'About this site'],
    openFirstTimeAgain: ['Gå til informationssiden', 'Go to the information page'],
    contactInfo: [
      'Forbedringer, rettelser eller ideer bedes rettes til mailadressen: <a href="mailto:thjendk@fire.fundersclub.com">thjendk@fire.fundersclub.com</a>.',
      'For improvements, edits or ideas please contant us at the following email: <a href="mailto:thjendk@fire.fundersclub.com">thjendk@fire.fundersclub.com</a>'
    ],
    frontDisclaimer: [
      '<p>medMCQ besidder MCQ-eksamenspørgsmål fra tidligere semestre og du bør derfor være opmærksom på:</p><ol><li>Nogle besvarelser kan være forældet ift. hvad vil være korrekt i dag.</li><li>Pensum kan siden være ændret, hvorfor du kan møde spørgsmål der ligger uden for pensum. Der kan også være elementer af pensum, som der ikke er spørgsmål indenfor.</li><li>Flere af spørgsmålene er udviklet til MCQ-eksamener med hjælpemidler. Derfor kan du opleve at spørgsmålene har et højere kompleksitetsniveau.</li></ol>',
      '<p>Welcome to medMCQ. You can test your abilities within different semesters and different medical specialties. Since the site contains MCQ examination questions from earlier semesters, you should be aware that</p><ol><li>Some answers might be outdated.</li><li>The curriculum may be different today, which means that some questions may be irrelevant for your upcoming exam and some areas of relevance may not be covered by the questions.</li><li>Some of the questions were for an examination where aid was permitted, which means you may experience a higher level of complexity in the questions.</li></ol>'
    ],
    privacy: {
      header: ['Privatliv og cookies', 'Privacy and cookies'],
      body: [
        `<p>
                Siden benytter open source tracking i form af Matomo. Denne
                er indstillet til at respektere browser-opt-out, ikke at
                sætte cookies og at anonymisere IP-adresser. Det vil sige,
                at du er fuldstændig anonym. Data gemmes i min egen database
                og deles ikke. Data bruges til at skabe et (dermed
                underestimeret) overslag over brugen af siden.
            </p>
            <p>
                Siden benytter ingen cookies, med mindre du opretter en
                bruger og logger ind. I dette tilfælde sættes en cookie, der
                husker, at du er logget ind til næste gang.
            </p>`,
        `<p>
                The site uses open source tracking (Matomo). This is configured to respect browser-opt-out, not to set any cookies and to anonymize IP-addresses. This means that you are completely anonymous. Data is saved in my own database and is not shared. Data is used to create a (under)estimate of the site's usage.
            </p>
            <p>
                The site uses no cookies unless you register for an account and log in. In this case, a cookie is set to remember you for your next visit.
            </p>`
      ]
    }
  },
  voting: {
    header: ['Stemmesystemet', 'The voting system'],
    body: [
      `
    <p>Når du stemmer på et speciale eller tag, så tæller du 1 point. Du kan tilføje nye tags eller specialer i dropdown menuerne. Hvis du er den eneste der har stemt på tagget, vil tagget blive fjernet, hvis du nedstemmer spørgsmålet til 0. Hvis også andre har stemt på samme speciale eller tag som dig, så skal pointene nå -1 før det forsvinder. 
    </p>`,
      `
      <p>When voting for a specialty or tag, your vote will count for 1 point. You can add new tags or specialties in the dropdown menus. If you are the only one, who has voted on the tag, the tag will dissapear, if you downvote it to 0 points. If others have voted on the same specialty or tag, the points will need to reach -1 before it is removed.
      </p>`
    ]
  },
  privacy: {
    header: ['Privatliv og cookies', 'Privacy and cookies'],
    body: [
      `<p>
              Siden benytter open source tracking i form af Matomo. Denne
              er indstillet til at respektere browser-opt-out, ikke at
              sætte cookies og at anonymisere IP-adresser. Det vil sige,
              at du er fuldstændig anonym. Data gemmes i min egen database
              og deles ikke. Data bruges til at skabe et (dermed
              underestimeret) overslag over brugen af siden.
          </p>
          <p>
              Siden benytter ingen cookies, med mindre du opretter en
              bruger og logger ind. I dette tilfælde sættes en cookie, der
              husker, at du er logget ind til næste gang.
          </p>`,
      `<p>
              The site uses open source tracking (Matomo). This is configured to respect browser-opt-out, not to set any cookies and to anonymize IP-addresses. This means that you are completely anonymous. Data is saved in my own database and is not shared. Data is used to create a (under)estimate of the site's usage.
          </p>
          <p>
              The site uses no cookies unless you register for an account and log in. In this case, a cookie is set to remember you for your next visit.
          </p>`
    ]
  },
  changelog: {
    header: ['Hvad er nyt på siden?', "What's new on the site?"],
    body: [
      `
      <h3>v.2.3.0 - 24/04-2020</h3>
      <ul>
        <li>
          Yes! En ventet og højt ønsket funktion er kommet. Notifikationer! Denne feature vil over den kommende tid blive opgraderet, men jeg synes I skulle have den mindste version med det samme. Hver gang en person kommenterer på et spørgsmål, som du tidligere har kommenteret på, vil du få en notifikation.
        </li>
      </ul>
      <h3>v.2.2.0 - 24/04-2020</h3>
      <ul>
        <li>
          Databasen har fået en ordentlig overhaling. Dette ville du ikke direkte lægge mærke til, men det gør at vores profilside kører langt hurtigere. Specifikt har vi ændret på den måde hvorpå vi lagrer de svar du vælger når du er logget ind. Du kan senere se disse på profilsiden eller bruge til at sortere quizzen med.
        </li>
      </ul>
      <h3>v.2.1.0 - 24/04-2020</h3>
      <ul>
        <li>
          Profilsiden har fået en opgradering i både udseende og hastighed. Derudover smårettelser.
        </li>
        <li>
            Der udvikles på siden uden at dokumentere dette, så nye funktioner vil løbende poppe op hist og her.
        </li>
      </ul>
    <h3>v.2.0.0 - 24/05-2019</h3>
    <ul>
        <li>
            Vi har omskrevet vores server helt fra bunden og ændret mange ting på hjemmesiden bag kulisserne! Dette betyder for dig, at du kan forvente en hurtigere responsrate på jeres ønsker til nye funktioner. Derudover kører hjemmesiden nu også meget hurtigere, som du måske vil kunne mærke.
        </li>
        <li>
            Vi har fået en ny eksamens-mode, hvor du kan teste dine evner med en timer og uden at du får svar med det samme. En hyppigt ønsket feature, som nu endelig er her!
        </li>
        <li>
            Du kan se procenter på hver svarmulighed, som viser hvor stor del af dine medstuderende, der har valgt hvad du har.
        </li>
        <li>
            Du kan nu se præcist hvor mange spørgsmål du mangler at besvare i hvert enkelt sæt. Find det under fulde eksamenssæt!
        </li>
        <li>
            Vi har fået et nyt kommentarfelt layout, som gør det en smule mere kompakt. På den måde kan du se flere kommentarer, uden at skulle scrolle ned!
        </li>
    </ul>
    <h3>v.1.2.3 - 24/05-2019</h3>
    <ul>
        <li>
            Vi har fået et nyt stemmesystem! Du kan nu også nedstemme specialer og tags. Du kan læse om det nye system længere nede.
        </li>
    </ul>
    <h3>v.1.2.2 - 2019-04-25</h3>
    <ul>
      <li>
          Der kan nu søges efter spørgsmål (med én frase). Søg efter 
          ordstammen for at få flest resultater ("hjerte" vil også matche 
          "hjerte<em>r</em>" og "hjerte<em>sygdomme</em>").
      </li>
  </ul>
<h3>v.1.2.1 - 2019-04-12</h3>
<ul>
    <li>
        Der kan nu også vælges spørgsmål efter tag.
    </li>
</ul>
<h3>v1.2.0 - 2019-03-25</h3>
<ul>
    <li>
        Alle brugere kan nu stemme på specialer og tags til spørgsmål.
    </li>
    <li>
        Brugere kan gemme private kommentarer.
    </li>
    <li>
        Vi har tilføjet en kontaktformular (se bunden af siden), hvor udviklerne let kan kontaktes.
    </li>
    <li>
        Forskellige bugfixes (layout, navigation m.v.).
    </li>
</ul>
<h3>v1.1.0 - 2018-11-26</h3>
<ul>
    <li>
    Siden gemmer mange ting lokalt på din enhed (ikke som cookies) -
    eksempelvis de spørgsmål, du er i gang med (hvis du har svaret på
    minimum ét spørgsmål), dit semester og andre valg, du foretager på
    siden – dette er så du nemt kan vende tilbage til siden.
    </li>
    <li>
      På en computer kan du
      <ul>
          <li>
              navigere mellem spørgsmål med piletasterne
          </li>
          <li>
              besvare spørgsmål ved brug af tallene 1, 2 og 3 for hhv.
              svarmulighed A, B og C.
          </li>
      </ul>
  </li>
  <li>
      På en telefon kan du
      <ul>
          <li>
              navigere mellem spørgsmål ved at swipe (virker måske
              også på en touchskærms-pc?)
          </li>
      </ul>
  </li>
  <li>
      Opretter du en bruger
      <ul>
          <li>
              holder systemet styr på, hvilke spørgsmål du har
              besvaret – og viser dig, når du har besvaret et fuldt
              eksamenssæt
          </li>
          <li>
              vil systemet gemme alle dine svar, så du kan se, hvor
              det går galt (og om der er systematik bag)
          </li>
          <li>
              kan du bede om kun at få spørgsmål, du <em>ikke</em>
              allerede har svaret på
          </li>
      </ul>
  </li>
</ul>`,
      `
      <h3>v.2.3.0 - 24/04-2020</h3>
      <ul>
        <li>
          Translation missing...
        </li>
      </ul>
      <h3>v.2.2.0 - 24/04-2020</h3>
      <ul>
        <li>
          The database has undergone some serious changes. You will not be able to spot this directly, however among other things it makes the profile page run much smoother and faster. We have specifically changed the way we register the answers you make, when you are logged in. You use these data to sort the quiz or guide you on the profilepage.
        </li>
      </ul>
      <h3>v.2.1.0 - 24/04-2020</h3>
      <ul>
        <li>
              The visuals and performance of the profile page have been upgraded.
        </li>
        <li>
              The site is always under ongoing development, and new features will appear from time to time, without explicit documentation.
        </li>
     </ul>
    <h3>v.1.2.3 - 24/05-2019</h3>
    <ul>
        <li>
            We have a new voting system! You can now also downvote wrongly labelled specialties and tags. You can read more about the new system further down.
        </li>
    </ul>
  <h3>v.1.2.2 - 2019-04-25</h3>
  <ul>
    <li>
        You can search for questions (by one phrase). Search for the base of the 
        word for most results ("child" will also match "child<em>ren</em>").
    </li>
  </ul>
  <h3>v.1.2.1 - 2019-04-12</h3>
  <ul>
      <li>
          Questions can also be filtered by tag.
      </li>
  </ul>
  <h3>v0.2.0 - 2019-03-25</h3>
  <ul>
      <li>
          All logged-in users can vote on specialties and tags for a question.
      </li>
      <li>
          Logged-in users can save private comments.
      </li>
      <li>
          We have add a contact form (see bottom of page), from which developers can easily be reached. 
      </li>
      <li>
          Various bugfixes (layout, navigation etc.).
      </li>
  </ul>
<h3>v0.1.0 - 2018-11-26</h3>
<ul>
  <li>
    The site saves many things locally on your devide (not as cookies) – for example the questions, you are currently answering 
    (if you have answered at least one of them), your semester and other choices you make on the site. This is to make it more convenient for you on your next visit.
    </li>
  <li>
      On a computer you can
      <ul>
          <li>
              navigate between questions using the arrow keys
          </li>
          <li>
              answer questions using the number keys 1, 2 and 3 to to answer A, B and C, respectively.
          </li>
      </ul>
  </li>
  <li>
      On a phone you can 
      <ul>
          <li>
              navigate between questions by swiping (might also work on a touchscreen pc?)
          </li>
      </ul>
  </li>
  <li>
      If you register for an account
      <ul>
          <li>
              the system keeps track of which questions you have answered – and shows you when you have fully answered a set
          </li>
          <li>
              the system saves all your answers so you can see if there are any areas you need to read up on
          </li>
          <li>
              you can choose to solely request questions you have <em>not</em> previously answered
          </li>
      </ul>
  </li>
</ul>
      `
    ]
  },
  firstTime: {
    title: [
      `
        <h1>Kære bruger. Velkommen til medMCQ!</h1>
        <p>
          Hvis du er ny bruger af siden så anbefaler vi dig at læse følgende. Selv hvis du er habil
          bruger, så kan det også være du finder funktioner, som du ikke kender til.
          <br />
          Nogle af sidens funktioner afhænger af, om du opretter en gratis bruger eller ej.
        </p>
      `,
      `
      <h1>Dear user. Welcome to medMCQ!</h1>
      <p>
        If you are a new user, we recommend that you read the following page. Even if you are a seasoned user, it is likely that you will find features that you didn't know about.
        <br />
        Some of the features of the page depend on whether you create a free user or not.
      </p>
    `
    ],
    withoutUserTitle: ['Uden bruger', 'Without user'],
    withoutUser: [
      `
    <ul>
        <li>
        <b>Valg af spørgsmål tilfældigt</b>, ud fra specialer eller tags eller ud fra hele
        eksamenssæt
        </li>
        <li>
        <b>Besvarelse af 1000-vis af spørgsmål</b> fra tidligere eksamenssæt - helt gratis
        og uden begrænsning!
        </li>
        <li>
        <b>Dele spørgsmål</b> med din læsegruppe eller underviser gennem direkte links.
        </li>
        <li>
        <b>Læsning af kommentarer</b> under spørgsmålene, blandt de 100-vis af kommentarer,
        der er blevet skrevet på siden. Mange kommentarer indeholder gode forklaringer og
        tips til spørgsmålene.
        </li>
    </ul>
    `,
      `
    <ul>
        <li>
        <b>Choice of questions randomly</b>,based on specialties or tags or from the entire exam set.
        </li>
        <li>
        <b>Answering of thousands of questions</b> from previous exam sets - completely free and without limitation
        </li>
        <li>
        <b>Sharing of questions</b> with your study group or through direct links.
        </li>
        <li>
        <b>Ability to read comments</b> below each question, among the countless of comments that users have left on the site. Many comments contain useful descriptions or tips for the questions.
        </li>
    </ul>
    `
    ],
    withUserTitle: [
      `
    <h2>Med bruger</h2>
      <h5>
        Du behøver ikke oprette en gratis bruger, men vær opmærksom på, at du med en (helt gratis!) bruger får
        flere funktioner. Du kan:
      </h5>
      `,
      `
      <h2>With a user</h2>
        <h5>
          You do not have to create a user, but be aware that you with a (totally free!) user will get access to more features. You can:
        </h5>
        `
    ],
    withUser: [
      `
    <ul>
    <li>
      <b>Skrive kommentarer:</b> Du vil have mulighed under spørgsmålene at skrive
      kommentarer til at hjælpe medstuderende med at forstå et spørgsmål. Vi anbefaler på
      det kraftigste at du bidrager til fællesskabet med din viden, da det både hjælper
      din egen forståelse og andres. Når vi hjælper hinanden går det hele en del nemmere.
      Du kan endda skrive kommentarer helt anonymt!
    </li>
    <li>
      Skrive <b>private kommentarer:</b> Selvom vi anbefaler at skrive offentlige eller
      anonyme kommentarer, sådan at alle for gavn af din viden, så har du med en bruger
      også mulighed for at skrive private kommentarer, som du kun selv kan se.
    </li>
    <li>
      <b>Gemme spørgsmål</b>, så du kan vende tilbage til dem senere.
    </li>
    <li>
      <b>Stemme på specialer og tags</b>, for at kategorisere spørgsmålene.
    </li>
    <li>
      <b>Tilgå din profilside</b> med statistik over hvilke spørgsmål du har besvaret, og
      hvordan det er gået.
    </li>
  </ul>
`,
      `
<ul>
<li>
  <b>Write comments</b> You will get the ability to, below the questions, write comments to help your fellow students understand a question. We wholeheartedly recommend that you contribute with your knowledge, as it both helps your own but also other's understanding of the question. When we help eachother, everything works out for the better. You can even write comments totally anonymous!
</li>
<li>
  Write <b>private comments</b>. Even though we recommend that you write public or anonymous comments, that benefit everyone, you can with a user create private commments only you have access to.
</li>
<li>
  <b>Save questions</b>, so you can come back to them later.
</li>
<li>
  <b>Vote on specialties and tags</b>, to categorize questions.
</li>
<li>
  <b>Access your profile page</b> that includes statistics based on which questions answered, and how well you are doing.
</li>
</ul>
`
    ],
    haveFun: [
      'Du ønskes held og lykke med eksamenslæsningen og god fornøjelse fra os - Sigurd Morsby og Thomas Jensen',
      'We wish you good luck with your exam-reading and hope that you have a blast - Sigurd Morsby and Thomas Jensen'
    ],
    begin: ['Begynd', 'Begin'],
    toastTitle: ['Velkommen til medMCQ!', 'Welcome to medMCQ!'],
    toast: [
      'Om du er her for første gang, eller har brugt siden længe, så ser her for nogle gode tips og tricks!',
      'Whether you are here for the first time, or are a veteran of the site, then look here for some useful features and tips!'
    ],
    toastShowMe: ['Vis mig det!', 'Show me!'],
    toastNoThanks: ['Ellers tak', 'No thank you']
  }
};
