export default {
  about: {
    header: ['Om siden', 'About this site'],
    contactInfo: [
      'Forbedringer, rettelser eller ideer bedes rettes til mailadressen: <a href="mailto:medmcq@fire.fundersclub.com">medmcq@fire.fundersclub.com</a>.',
      'For improvements, edits or ideas please contant us at the following email: <a href="mailto:medmcq@fire.fundersclub.com">medmcq@fire.fundersclub.com</a>'
    ],
    notice: {
      header: ['Bemærk', 'Notice'],
      body: [
        `<p>
            Denne side er et frivilligt arbejdsredskab til dig der
            vil teste dine MCQ-færdigheder inden for de medicinske
            specialer der bliver undervist i på Abdomen- og
            Inflammationssemesteret på kandidatuddannelsen i medicin
            ved Aarhus Universitet.
        </p>

        <p>
            MCQ-spørgsmål med svar, som du finder her på siden, er
            alle fra tidligere eksamener afholdt på de to semestre.
            Af samme årsag skal du derfor være opmærksom på:
            <ol>
                <li>
                    At ’korrekte’ svar kan have ændret sig siden.
                    Hvad der har været et korrekt svar til en
                    MCQ-eksamen i 2015, vil kunne være et forkert
                    svar i dag.
                </li>
                <li>
                    At pensum kan have ændret sig siden. Du vil
                    altså kunne opleve spørgsmål, der relaterer sig
                    til sygdomme som du ikke længere vil blive
                    eksamineret i. Omvendt kan du også opleve, at
                    der ikke er spørgsmålseksempler på sygdomme som
                    du vil kunne blive eksamineret i, i dag.
                </li>
                <li>
                    At flere spørgsmål fra tidligere eksamener har
                    været lavet under forudsætning af at
                    eksaminationen var med ’åben bog’ (eksamen med
                    hjælpemidler). Pt. er de fleste MCQ-eksamener
                    med ’lukket bog’, dvs. uden hjælpemidler. Dette
                    kan bl.a. have indflydelse på
                    kompleksitetsgraden af spørgsmålene.
                </li>
            </ol>
        </p>

        <p>
            Det er altid dit eget ansvar at holde dig ovenfor
            stående for øje og du vil derfor ikke kunne få medhold i
            en evt. eksamens-klagesag, med baggrund i denne sides
            materialer. Hverken Institut for Klinisk Medicin, Aarhus
            Universitet eller udvikler af systemet, Sigurd Morsby
            Larsen, efterredigerer spørgsmål og svar hvorfor
            spørgsmål og svar fremstår som da de blev anvendt ved
            den konkrete MCQ-eksamen.
        </p>`,
        `<p>
                This site is a voluntary work tool for anyone wishing to test their MCQ skills within the medical specialties taught and examined in the Inflammation, Abdominal, Cardiovacular and GOP-semesters of the master's degree medical programme at Aarhus University.
            </p>
            <p>MCQ questions and answers found on this site are all from previous examinations. For this reason, you must bear in mind that:
            <ol>
                <li>
                    'Correct' answers may have changed since. What was a correct answer at a MCQ exam in 2015 may be a wrong answer today.
                </li>
                <li>
                    The curriculum may have changed since. That is, you may encounter questions related to diseases you cannot be examined in. Likewise, you may never encounter a question about a disease that you <em>can</em> be examined in.
                </li>
                <li>
                    Multiple questions from previous examinations have been posed under the presumption that the examination was an 'open book examination' (with aids). As of now, most MCQ exams are 'closed book' (without aids). This may influence e.g. the complexity of the questions.
                </li>
            </ol>
        </p>
        
        <p>
            It is always your responsibility to keep the above in mind and a potential examination complaint will not be sustained by referring to this site. Neither The Department of Clinical Medicine, Aarhus University or developer of the system, Sigurd Morsby Larsen, edit questions or answers. As such, questions and answers appear as when posed at the specific MCQ examination
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
    }
  },
  fancyFeatures: {
    header: ['Smarte/skjulte funktioner', 'Fancy/hidden features'],
    body: [
      `<p>
            Siden gemmer mange ting lokalt på din enhed (ikke som cookies) -
            eksempelvis de spørgsmål, du er i gang med (hvis du har svaret på
            minimum ét spørgsmål), dit semester og andre valg, du foretager på
            siden – dette er så du nemt kan vende tilbage til siden.
        </p>
        <ul>
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
      `<p>
        The site saves many things locally on your devide (not as cookies) – for example the questions, you are currently answering (if you have answered at least one of them), your semester and other choices you make on the site. This is to make it more convenient for you on your next visit.
        </p>
        <ul>
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
        </ul>`
    ]
  },
  voting: {
    header: ['Stemme systemet', 'The voting system'],
    body: [
      `<p>Når du stemmer på et speciale, gælder det at specialet med flest stemmer bliver vist som det første. De specialer med 50% af stemmerne for det højst bedømte specialer bliver også tilføjet. Dvs. hvis et speciale har 6 stemmer, vil alle andre specialer med 3 eller flere stemmer også blive talt med. Vi gør det på denne måde, da vi ved at nogle spørgsmål kan referere til flere specialer på én gang </p><p>For tags gælder det, at kun tags, der er valg af mere end 5 brugere, bliver vist</p><p>Hver bruger tæller kun én gang per tag eller speciale.</p>`,
      `<p>When you vote for a specialty, the system makes the specialty with the most amount of uservotes the primary specialty. If another specialty has 50% or more of the votes of the primary specialty, this specialty is also added to the question. For example, if the highest voted specialty is hæmatologi with 6 votes, but paraklinik also has 3 votes, both hæmatologi and paraklinik will be added to the question. It is made this way, to make it possible for questions to have multiple specialties.</p><p>For tags, only the tags that have been voted for by 5 users or more are counted</p><p>Each user can only count once per specialty or tag.</p>`
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
  }
};
