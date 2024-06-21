const algorithms = {
    "ase2016": {
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
            ],
            age_specific_e: [
                {
                    question: "What is the SEPTAL e'?",
                    options: [
                        {value: "positive", text: "18-40 yrs male: < 7 cm/sec"},
                        {value: "positive", text: "18-40 yrs female: < 8 cm/sec"},
                        {value: "positive", text: "41-65 yrs: < 5 cm/sec"},
                        {value: "positive", text: ">65 yrs: < 4 cm/sec"},
                        {value: "negative", text: "Septal e' is greater than these"}
                    ]
                },
                {
                    question: "What is the LATERAL e'?",
                    options: [
                        {value: "positive", text: "18-40 yrs male: < 9 cm/sec"},
                        {value: "positive", text: "18-40 yrs female: < 11 cm/sec"},
                        {value: "positive", text: "41-65 yrs: < 6 cm/sec"},
                        {value: "positive", text: ">65 yrs: < 5 cm/sec"},
                        {value: "negative", text: "Lateral e' is greater than these"}
                    ]
                },
            ],
            la_strain:
            [
                {
                    question: "What is the LA Strain?",
                    options: [
                        {value: "positive", text: "pump strain < 14% OR resevoir strain < 30%"},
                        {value: "negative", text: "pump strain >= 14% OR resevoir strain >= 30%"}
                    ]
                }
            ],
            lars:
            [
                {
                    question: "More specifically, What is the LARS?",
                    options: [
                        {value: "positive", text: "LARS < 18%"},
                        {value: "negative", text: "LARS >= 18%"}
                    ]
                }
            ],
            supplemental_params:
            [
                {
                    question: "What about pulmonary vein a-reversal?",
                    options:[
                        {value: "positive", text: "Ar - A duration > 30 ms"},
                        {value: "negative", text: "Ar - A duration <= 30 ms"}
                    ]
            },
            {
                question: "What about an L wave?",
                options:[
                    {value: "positive", text: "L-wave velocity > 20 cm/s"},
                    {value: "negative", text: "No L-wave or L velocity <= 20 cm/s"}
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
