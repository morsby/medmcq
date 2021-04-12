const sampleQuestions = [
  {
    text: 'Hvad er det omtrentlige antal af nydiagnostiserede cancertilfælde per år i Danmark?',
    answer1: {
      answer: '36.000'
    },
    answer2: {
      answer: '24.000'
    },
    answer3: {
      answer: '18.000'
    },
    examSetQno: 21,
    correctAnswers: [1],
    examSet: {
      semester: {
        value: 8
      },
      id: 5,
      year: 2012,
      season: 'E'
    }
  },
  {
    text: 'Hvad er den hyppigste årsag til monosymptomatisk ikterus?',
    answer1: {
      answer: 'Galdesten'
    },
    answer2: {
      answer: 'Caput pancreatis cancer'
    },
    answer3: {
      answer: 'Hepatitis'
    },
    examSetQno: 7,
    correctAnswers: [2],
    examSet: {
      semester: {
        value: 8
      },
      id: 5,
      year: 2012,
      season: 'E'
    }
  },
  {
    text:
      '30-årig mand, som så længe han kan huske, intermitterende har haft fornemmelsen af, at kød og ris kunne sætte sig fast i spiserøret. Han er kendt med allergisk rhinitis. Han mistænkes for at have eosinofil øsophagitis.\n\nHvordan bekræftes denne diagnose?',
    answer1: {
      answer: 'Blodprøve, hvori der findes eosinofili'
    },
    answer2: {
      answer: 'Gastroskopi med fund af sårbare slimhinder'
    },
    answer3: {
      answer: 'Gastroskopi med biopsi fra øsophagus, hvori der findes eosinofili'
    },
    examSetQno: 69,
    correctAnswers: [3],
    examSet: {
      semester: {
        value: 8
      },
      id: 5,
      year: 2012,
      season: 'E'
    }
  },
  {
    text: 'Ved kræft udvikles ofte resistens overfor cytostatika.\n\nHvilket udsagn er korrekt?',
    answer1: {
      answer:
        'Resistens mod cytostatika er ofte forårsaget af højt indhold af et cellemembranbundet glykoprotein (p-glykoprotein)'
    },
    answer2: {
      answer:
        'Resistens skyldes oftest, at cytostatika ikke når frem til kræftcellen pga. tumorers ringe blodforsyning'
    },
    answer3: {
      answer: 'Resistens er oftest relateret til øget nedbrydning/inaktivering af cytostatika'
    },
    examSetQno: 70,
    correctAnswers: [1],
    examSet: {
      semester: {
        value: 8
      },
      id: 5,
      year: 2012,
      season: 'E'
    }
  },
  {
    text:
      '19-årig mand, som har været i byen med vennerne og drukket en del alkohol. Henvender sig nu kl. 2 om natten, da han efter gentagne opkastninger nu har blod i opkastet\n\nHvad er den mest sandsynlige årsag til den blodige opkastning?',
    answer1: {
      answer: 'Blødning fra esophagusvaricer'
    },
    answer2: {
      answer: 'Blødning fra Mallory-Weiss læsion'
    },
    answer3: {
      answer: 'Blødning fra ulcus ventrikuli'
    },
    examSetQno: 38,
    correctAnswers: [2],
    examSet: {
      semester: {
        value: 8
      },
      id: 5,
      year: 2012,
      season: 'E'
    }
  },
  {
    text:
      'Hvad betegnes en medicinsk behandling som gives efter radikal kirurgi for en kræftsygdom med det formål at nedsætte risikoen for recidiv?',
    answer1: {
      answer: 'Adjuverende behandling'
    },
    answer2: {
      answer: 'Concomitant behandling'
    },
    answer3: {
      answer: 'Neo-adjuverende behandling'
    },
    examSetQno: 50,
    correctAnswers: [1],
    examSet: {
      semester: {
        value: 8
      },
      id: 5,
      year: 2012,
      season: 'E'
    }
  },
  {
    text:
      '51-årig mand kontakter dig pga. blod i afføringen et par gange gennem de sidste to uger. Han er kendt med hæmorider gennem flere år. Normalt plejer han at have 1-2 formede afføringer dagligt. Siden han var på ferie for ca. 2 måneder siden, har han haft perioder med løs afføring, som han i første omgang tilskrev "feriemave". På det seneste har der tillige været perioder med hård afføring. Patienten har ikke haft feber, opkastninger eller vægttab.\n\nObjektiv undersøgelse: God almen tilstand. Ved eksploratio rektalis findes der 2 små hæmorider uden pågående blødning. Ingen palpable tumores. Prostata vurderes normal. Abdomen: i.a.\n\nHvordan bør du håndtere denne patient?',
    answer1: {
      answer: 'Patientens symptomer kan skyldes c. coli og han henvises til udredning på sygehuset.'
    },
    answer2: {
      answer:
        'Patientens symptomer skyldes hæmorider og han sættes i behandling med sup. Doloproct x 2 dagligt i 5 dage samt tilrådes rigelig væske, motion og fibertilskud i form af HUSK.'
    },
    answer3: {
      answer:
        'Patienten har haft symptomer på hæmorider i flere år og henvises derfor til behandling af disse på sygehuset.'
    },
    examSetQno: 59,
    correctAnswers: [1],
    examSet: {
      semester: {
        value: 8
      },
      id: 5,
      year: 2012,
      season: 'E'
    }
  },
  {
    text:
      'Patienten henvender sig hos egen læge fordi vedkommende har følt en knude på halsen, og er bange for at det drejer sig om kræft. Egen læge genfinder en knude i skjoldbruskkirtlen.\n\nHvilket af nedenstående udsagn er korrekt og vil være relevant information til patienten?',
    answer1: {
      answer: 'Malignitet forekommer hos 2-4% og risikoen er øget hos mænd'
    },
    answer2: {
      answer: 'Malignitet forekommer hos 10-15% og risikoen er øget hos ældre'
    },
    answer3: {
      answer: 'Malignitet forekommer hos 2-4% og prognosen er bedst hos de ældre patienter'
    },
    examSetQno: 64,
    correctAnswers: [1],
    examSet: {
      semester: {
        value: 8
      },
      id: 5,
      year: 2012,
      season: 'E'
    }
  },
  {
    text: 'Hvad består en screeningmammografi af?',
    answer1: {
      answer: 'Mammografi af brystet i 3 projektioner, ultralyd og palpation'
    },
    answer2: {
      answer: 'Mammografi af brystet i 2 projektioner'
    },
    answer3: {
      answer: 'Mammografi af brystet i 2 projektioner og ultralyd'
    },
    examSetQno: 36,
    correctAnswers: [2],
    examSet: {
      semester: {
        value: 8
      },
      id: 5,
      year: 2012,
      season: 'E'
    }
  },
  {
    text:
      'En 60-årig patient søger egen læge pga tiltagende obstipation. Symptomet har været under udvikling i 6 måneder. Du udfører en almindelig objektiv undersøgelse, der er normal.\n\nHvad vil du gøre?',
    answer1: {
      answer: 'Ordinere laxantia'
    },
    answer2: {
      answer: 'Ordinere kostregulering'
    },
    answer3: {
      answer: 'Henvise til koloskopi'
    },
    examSetQno: 22,
    correctAnswers: [3],
    examSet: {
      semester: {
        value: 8
      },
      id: 5,
      year: 2012,
      season: 'E'
    }
  },
  {
    text:
      'En 27-årig mand har været på en 2 måneder varende rygsækrejse i Indien og Nepal. Han har under rejsen haft flere episoder med diarré. Han henvises 3 uger efter hjemkomsten, da han er træt, har tabt i vægt og har vedvarende diarré med vekslende og ildelugtende affnring. Han klager over luft i maven og tendens til at bøvse. Han er afebril og der har ikke været blod eller slim i afføringen.\n\nHvilken ætiologi er den mest sandsynlige?',
    answer1: {
      answer: 'Giardia intestinalis'
    },
    answer2: {
      answer: 'Clostridium difficile'
    },
    answer3: {
      answer: 'Salmonella enteritidis'
    },
    examSetQno: 65,
    correctAnswers: [1],
    examSet: {
      semester: {
        value: 7
      },
      id: 30,
      year: 2018,
      season: 'F'
    }
  },
  {
    text:
      '29-årig kvinde henvises med 10-15 vandtynde diareer uden blod og uden slim. Symptomerne har stået på igennem 3 måneder. Det er ingen vægttab. Ingen rejseanamnese. Fæces calprotectin normal.\n\nHvilke af de nævnte forslag til udredning vælger du som det mest oplagte første valg?',
    answer1: {
      answer: 'Se-HCAT scanning.'
    },
    answer2: {
      answer: 'Koloskopi med biopsi.'
    },
    answer3: {
      answer:
        'Afføringsprøver til undersøgelse for tarmpatogene bakterier, P-C-reaktiv protein, P-albumin.'
    },
    examSetQno: 28,
    correctAnswers: [1],
    examSet: {
      semester: {
        value: 7
      },
      id: 30,
      year: 2018,
      season: 'F'
    }
  },
  {
    text:
      'En midaldrende læge vender hjem fra ferie på en Middelhavsø, hvor han har oyklet ca. 500 km i bjergrigt terræn. Han klager over voldsom bilateral ømhed i gluteal muskulatur, m. quadriceps femoris og m. gastrochnemius. Der er ingen forudgående almensymptomer og ingen objektive ledforandringer.\n\nHvilket råd er mest korrekt?',
    answer1: {
      answer: 'Tre til fire dages pause fra fysiske strabadser'
    },
    answer2: {
      answer: 'Inj. Fragmin 200 IE/kg og bilateral UL af underekstremiteter'
    },
    answer3: {
      answer:
        'Udredning med P-Myoglobin, P-Kreatinkinase, P-Aldolase, A-ANA, Hæm. kvant. og diff. samt væsketal'
    },
    examSetQno: 44,
    correctAnswers: [1],
    examSet: {
      semester: {
        value: 7
      },
      id: 30,
      year: 2018,
      season: 'F'
    }
  },
  {
    text:
      'Søren på 45 år har fået konstateret hypertension. Udredning har vist nyrepåvirkning med P-Kreatinin mellem 100-120 µmol/l (ref: 60-105) og Urin-Albumin/kreatinin ratio på 421 mg/g (ref: < 30 mg/g). Desuden tegn til venstreventrikel hypertrofi i ekg. Det büluttes at påbegynde antihypertensiv behandling.\n\nHvilket udsagn er korrekt?',
    answer1: {
      answer: 'Betablokker bør indgå i behandlingen'
    },
    answer2: {
      answer: 'ACE-hæmmer eller angiotension II-receptorblokker bør indgå i behandlingen'
    },
    answer3: {
      answer: 'Calciumantagonist bør indgå i behandlingen'
    },
    examSetQno: 29,
    correctAnswers: [2],
    examSet: {
      semester: {
        value: 7
      },
      id: 30,
      year: 2018,
      season: 'F'
    }
  },
  {
    text:
      'En 42-årig somalisk mand har gennem flere måneder haft almensmptomer med træthed, vægttab og tiltagende lænderygsmerter. Han har boet i Danmark i 24 år og der er ingen nylig rejseanamnese.\n\nDer er forhøjet sedimentationsreaktion.\n\nMR-skanning af columna thoracolumbalis har vist tegn på spondylodiskitis sv.t. Th12/L1 samt højresidig psoas-absces.\n\nHvad er den mest sandsynlige ætiologi?',
    answer1: {
      answer: '_Mycobacterium tuberculosis_'
    },
    answer2: {
      answer: '_Streptococcus pneumoniae_'
    },
    answer3: {
      answer: '_Brucella melitensis_'
    },
    examSetQno: 40,
    correctAnswers: [1],
    examSet: {
      semester: {
        value: 7
      },
      id: 30,
      year: 2018,
      season: 'F'
    }
  },
  {
    text:
      'En 19-årig dreng med astma, som aktuelt er på efterskole, indlægges med en uges varende høj feber, synkesmerter og problemer med at spise og drikke. Objektivt er han vågen og klar. Kan sætte hagen ned mod brystet, men ømmer sig ved undersøgelsen. Der er udtalt tonsilstmlst med konfluerende hvidlige belægninger. Desuden forstørrede, ømme angulære glandler og let forstørrede lymfeknuder i axiller. Der er forhøjet P-CRP = 112 mg/l, påvirket lever med P-ALAT = 355 U/l og lymfocytose = 8.72 x 10^9^/l.\n\nHvilken ætiologi er den mest sandsynlige?',
    answer1: {
      answer: 'Epstein-Barr virus'
    },
    answer2: {
      answer: 'Streptococcus pyogenes'
    },
    answer3: {
      answer: 'Cytomegalovirus'
    },
    examSetQno: 63,
    correctAnswers: [1],
    examSet: {
      semester: {
        value: 7
      },
      id: 30,
      year: 2018,
      season: 'F'
    }
  },
  {
    text:
      'En 52-årig kvinde har været på safari i Tanzania. 6 dage efter hjemkomsten udvikler hun influenza-lignende symptomer med feber, hovedpine, muskelsmerter og tør hoste. Efter yderligere et par dage finder en veninde hende forvirret i hjemmet og tilkalder vagtlæge, som indlægger pt. akut. Ved indlæggelsen er hun højfebril og konfus, men ikke nakkerygstiv. BT = 142/88 mmHg, puls = l08/min, respirationsfrekvens = 22/min og SAT = 97 %.\n\nHvilket udsagn er korrekt?',
    answer1: {
      answer: 'Der skal tages blod fra til eventuel undersøgelse for malaria inden sepsisbehandling'
    },
    answer2: {
      answer: 'Der skal foretages akut blodundersøgelse for malaria'
    },
    answer3: {
      answer: 'Der skal gøres lumbalpunktur til mikroskopi for bakterier og malaria'
    },
    examSetQno: 26,
    correctAnswers: [2],
    examSet: {
      semester: {
        value: 7
      },
      id: 30,
      year: 2018,
      season: 'F'
    }
  },
  {
    text:
      'Hvilket af nedenstående mønstre i arteriepunktur ses ved svær, kronisk nyreinsufficiens?\n\nA\n\n- P(aB)-pH: 7,24 (7,37 - 7,45)\n- P(aB)-pCO~2~ kPA: 11,0 (4,3 - 5,7)\n- P(aB)-pO~2~ kPa: 8,1 (9,6 - 13,7)\n- P(aB)-Hydrogencarbonat (standard) mmol/l: 34 (21,8 - 26,2)\n\nB\n\n- P(aB)-pH: 7,28 (7,37 - 7,45)\n- P(aB)-pCO~2~ kPA: 3,9 (4,3 - 5,7)\n- P(aB)-pO~2~ kPa : 14,0 (9,6 -13,7)\n- P(aB)-Hydrogencarbonat (standard) mmol/l: 16 (21,8 - 26,2)\n\nC\n\n- P(aB)-pH: 7,52 (7,37 - 7,45)\n- P(aB)-pCO~2~ kPA: 3,5 (4,3 - 5,7)\n- P(aB)-pO~2 kPa: 15,8 (9,6 -13,7)\n- P(aB)-Hydrogencarbonat (standard) mmol/l: 22 (21,8 - 26,2)',
    answer1: {
      answer: 'B'
    },
    answer2: {
      answer: 'A'
    },
    answer3: {
      answer: 'C'
    },
    examSetQno: 3,
    correctAnswers: [1],
    examSet: {
      semester: {
        value: 7
      },
      id: 30,
      year: 2018,
      season: 'F'
    }
  },
  {
    text:
      'En 72-årig kvinde har i 4 dage haft smerter i højre øre og er via egen læge sat i peroral behandling med penicillin. Trods dette får hun tiltagende hovedpine, opkastninger og bliver tiltagende bevidsthedspåvirket. Hun indlægges akut efter et generaliseret krampeanfald i hjemmet.\n\nHvilken håndtering er korrekt?',
    answer1: {
      answer:
        'Opstarter empirisk behandling med steroid og antibiotika på mistanke om pneumokokmeningitis og henviser til akut CT-skanning inden evt. lumbalpunktur.'
    },
    answer2: {
      answer:
        'Opstarter parenteral behandling med benzylpenicillin og overflytter patien-ten til ørenæsehals afdelingen på mistanke om sinuitis acuta.'
    },
    answer3: {
      answer:
        'Foretager akut lumbalpunktur, og hvis spinalvæsken er purulent, opstartes empirisk behandling med steroid og antibiotika.'
    },
    examSetQno: 8,
    correctAnswers: [1],
    examSet: {
      semester: {
        value: 7
      },
      id: 30,
      year: 2018,
      season: 'F'
    }
  },
  {
    text:
      'En ikke tidligere hospimliseret 69-årig mand indlægges med 4 dages produktiv hoste, feber og gennem det sidste døgn lettere forvirring.\n\nHar ved ankomsten til akutafdelingen 39.4 grader Celsius i feber, P-CRP 219 mg/l (ref < 8) og følgende rtg af thorax:\n\nHvad fejler patienten?',
    answer1: {
      answer: 'Bronkitis'
    },
    answer2: {
      answer: 'Lungetumor'
    },
    answer3: {
      answer: 'Pneumoni'
    },
    examSetQno: 54,
    correctAnswers: [3],
    examSet: {
      semester: {
        value: 7
      },
      id: 30,
      year: 2018,
      season: 'F'
    }
  }
];

module.exports = sampleQuestions;
