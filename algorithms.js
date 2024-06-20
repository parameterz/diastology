const algorithms = {
    "ase-2016": {
        citation: {
            authors: "Nagueh, S., Smiseth, O., Appleton, C. et al.",
            title: "Recommendations for the Evaluation of Left Ventricular Diastolic Function by Echocardiography: An Update from the American Society of Echocardiography and the European Association of Cardiovascular Imaging",
            journal: " Journal of the American Society of Echocardiography, 29(4), 277–314. (2016)",
            url: "https://pubmed.ncbi.nlm.nih.gov/27037982/",
        },
        start: {
            question: 'Select the first parameter:',
            options: [
                { value: 'la-strain', text: 'LA Strain' },
                { value: 'lars', text: 'LARS' }
            ]
        },

    },
    "bse": {
        citation: {
            authors: "Robinson, S., Ring, L., Oxborough, D. et al.",
            title: "The assessment of left ventricular diastolic function: guidance and recommendations from the British Society of Echocardiography",
            journal: "Echo Res Pract 11, 16 (2024)",
            url: "https://pubmed.ncbi.nlm.nih.gov/38825710/",
        },
        //specific algorithms here
        standard: {
            start: [
                {
                question: "What is the TR Velocity?",
                options: [
                    {value: "positive", text: ">2.8 m/s"},
                    {value: "negative", text: "<= 2.8 m/s"},
                    {value: "unavailable", text: "Unavailable"}
                ]
                },
                {
                    question: "What is the indexed LA Volume?",
                    options: [
                        {value: "positive", text: ">34 ml/m2"},
                        {value: "negative", text: "<= 34 ml/m2"},
                        {value: "unavailable", text: "Unavailable"}
                        ]
                },
                {
                    question: "What is the E/e' ratio?",
                    options: [
                        {value: "positive", text: ">14"},
                        {value: "negative", text: "<= 14"},
                        {value: "unavailable", text: "Unavailable"}
                        ]
                }
            ]

        },// end of standard algo
        dysfunction: {

        }, // end of dysfx algo
        afib: {

        }//end of afib algo
    }
};
