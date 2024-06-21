const algorithms = {
    "ase2016": {
        citation: {
            authors: "Nagueh, S., Smiseth, O., Appleton, C. et al.",
            title: "Recommendations for the Evaluation of Left Ventricular Diastolic Function by Echocardiography: An Update from the American Society of Echocardiography and the European Association of Cardiovascular Imaging",
            journal: " Journal of the American Society of Echocardiography, 29(4), 277–314. (2016)",
            url: "https://pubmed.ncbi.nlm.nih.gov/27037982/",
        },
        standard: {
            start: [
                {
                    question: "What is the E/e' ratio?",
                    options: [
                        {value: "positive", text: ">14"},
                        {value: "negative", text: "<= 14"},
                        {value: "unavailable", text: "Unavailable"}
                        ]
                },
                {
                    question: "What are the e' velocities?",
                    options: [
                        {value: "positive", text: "Septal < 7 OR Lateral < 10 cm/s"},
                        {value: "negative", text: "Septal >= 7 AND Lateral >= 10 cm/s"},
                        {value: "unavailable", text: "Unavailable"}
                    ]
                },
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
            ],
        }

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
            la_strain: [
                {
                    question: "What about the LA strain?",
                    options: [
                        {value: "positive", text: "LARS < 18% or Pump Strain < 8%"},
                        {value: "negative", text: "LARS >= 24% or Pump Strain >= 14%"},
                        {value: "intermediate", text: "LARS or Pump Strain is between these"}
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
                question: "What is the pulmonary vein S/D ratio?",
                options:[
                    {value: "positive", text: "S/D ratio < 1"},
                    {value: "negative", text: "S/D ratio >= 1"}
                ]
            },
            {
                question: "What about an L wave?",
                options:[
                    {value: "positive", text: "L-wave velocity > 20 cm/s"},
                    {value: "negative", text: "No L-wave or L velocity <= 20 cm/s"}
                ]
            },
            {
                question: "What is the MV E decel. time?",
                options:[
                    {value: "positive", text: "E Decel time < 150 ms"},
                    {value: "negative", text: "E Decel time >= 150 ms"}
                ]
            },
        ]
        }, // end of dysfx algo
        afib: {
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
                    question: "What is the MV Evelocity?",
                    options: [
                        {value: "positive", text: ">= 100 cm/s"},
                        {value: "negative", text: "< 100 cm/s"},
                        {value: "unavailable", text: "Unavailable"}
                            ]
                },
                {
                    question: "What is the MV E decel. time?",
                    options: [
                        {value: "positive", text: "<= 160 ms"},
                        {value: "negative", text: "> 160 ms"},
                        {value: "unavailable", text: "Unavailable"}
                        ]
                },
                {
                question: "What is the SEPTAL E/e' ratio?",
                options: [
                    {value: "positive", text: "> 11"},
                    {value: "negative", text: "<= 11"},
                    {value: "unavailable", text: "Unavailable"}
                    ]
                }
            ],
            step2: [
                {
                    question: "LA Reservoir Strain?",
                    options: [
                        {value: "positive", text: "LARS < 16% "},
                        {value: "negative", text: "LARS >= 16%"},
                        {value: "unavailable", text: "Unavailable"}
                    ]
                },
                {
                    question: "What is the BMI?",
                    options: [
                        {value: "positive", text: "BMI > 30 kg/m2 (obese)"},
                        {value: "negative", text: "BMI < 30 kg/m2"},
                        {value: "unavailable", text: "Unavailable"}
                    ]
                },
                {
                    question: "What is the pulmonary vein S/D ratio?",
                    options:[
                        {value: "positive", text: "S/D ratio < 1"},
                        {value: "negative", text: "S/D ratio >= 1"},
                        {value: "unavailable", text: "Unavailable"}
                    ]
                },
    
            ]
        }//end of afib algo
    }
};
