import { imageURL } from "./common";

const pdfMake = require("pdfmake/build/pdfmake.js");
const pdfFonts = require("pdfmake/build/vfs_fonts.js");

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const printQuiz = questions => {
    var docDefinition = {
        content: [],
        styles: {
            header: {
                fontSize: 22,
                bold: true
            },
            anotherStyle: {
                italic: true,
                alignment: "right"
            }
        }
    };
    questions.map((q, i) => {
        docDefinition.content.push({
            text: `Spørgsmål ${i + 1}`,
            style: "header"
        });
        docDefinition.content.push(q.question);

        if (q.image) {
            // TODO: Skal acceptere billeder fra anden host
            // Kan evt. bare gøres lokalt og uploade færdige PDF'er...
            console.log("img");

            fetch(imageURL(q.image_id)).then(res => {
                console.log("img fetched");
                console.log(res.blob());
            }); /*{
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        callback(reader.result);
                    };
                    reader.readAsDataURL(xhr.response);
                };

                xhr.send();
            }; 

            toDataUrl(imageURL(q.image_id), imgDataUrl => {
                console.log(imgDataUrl);
                docDefinition.content.push({ text: "!!!BILLEDE!!!" });
                docDefinition.content.push({ image: imgDataUrl });
            });
        }*/
        }
        //console.log(docDefinition);

        //pdfMake.createPdf(docDefinition).download("test.pdf");
    });
};
