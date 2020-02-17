// if the database is empty on server start, create some sample data.
Meteor.startup(function () {
  if (process.env.INITIALIZE) {
    console.log('INITIALZING');
    if (Conditions.find().count() === 0) {
    console.log('No Conditions found.  Creating some...');

      var fever = {
        "resourceType": "Condition",
        "patient": {
          "reference": "Patient/f201",
          "display": "Jane Doe"
        },
        "asserter": {
          "reference": "Practitioner/f201"
        },
        "dateRecorded": "2013-04-04",
        "code": {
          "coding": [
            {
              "system": "http://snomed.info/sct",
              "code": "386661006",
              "display": "Fever"
            }
          ]
        },
        "category": {
          "coding": [
            {
              "system": "http://snomed.info/sct",
              "code": "55607006",
              "display": "Problem"
            },
            {
              "system": "http://hl7.org/fhir/condition-category",
              "code": "finding"
            }
          ]
        },
        "clinicalStatus": "active",
        "verificationStatus": "confirmed",
        "severity": {
          "coding": [
            {
              "system": "http://snomed.info/sct",
              "code": "255604002",
              "display": "Mild"
            }
          ]
        },
        "onsetDateTime": "2013-04-02",
        "evidence": [
          {
            "code": {
              "coding": [
                {
                  "system": "http://snomed.info/sct",
                  "code": "258710007",
                  "display": "degrees C"
                }
              ]
            },
            "detail": [
              {
                "reference": "Observation/f202",
                "display": "Temperature"
              }
            ]
          }
        ],
        "bodySite": [
          {
            "coding": [
              {
                "system": "http://snomed.info/sct",
                "code": "38266002",
                "display": "Entire body as a whole"
              }
            ]
          }
        ]
      };

    Conditions.insert(fever);



    }
  }
});
