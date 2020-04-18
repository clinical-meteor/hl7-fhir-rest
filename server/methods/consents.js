import { get } from 'lodash';
import { faker } from 'faker';

var consentCategories = [{
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "42-CFR-2",
  display: "42 CFR Part 2 Form of Written Consent"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "ACD",
  display: "advance directive"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "CRIC",
  display: "common rule informed consent"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "DNR",
  display: "do not resuscitate"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "EMRGONLY",
  display: "emergency only"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "Illinois-Minor-Procedure",
  display: "Illinois Consent by Minors to Medical Procedures"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "HCD",
  display: "health care directive"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "HIPAA-Auth",
  display: "HIPAA Authorization"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "HIPAA-NPP",
  display: "HIPAA Notice of Privacy Practices"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "HIPAA-Restrictions",
  display: "HIPAA Restrictions"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "HIPAA-Research",
  display: "HIPAA Research Authorization"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "HIPAA-Self-Pay",
  display: "HIPAA Self-Pay Restriction"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "MDHHS-5515",
  display: "Michigan MDHHS-5515 Consent to Share Behavioral Health Information for Care Coordination Purposes"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "NYSSIPP",
  display: "New York State Surgical and Invasive Procedure Protocol"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "NPP",
  display: "notice of privacy practices"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "POLST",
  display: "POLST"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "RESEARCH",
  display: "research information access"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "RSDID",
  display: "de-identified information access"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "RSREID",
  display: "re-identifiable information access"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "SSA-827",
  display: "Authorization to Disclose Information to the Social Security Administration"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "VA-10-0484",
  display: "Revocation for Release of Individually-Identifiable Health Information"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "VA-10-0485",
  display: "Request for and Authorization to Release Protected Health Information to eHealth Exchange"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "VA-10-5345",
  display: "Request for and Authorization to Release Medical Records or Health Information"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "VA-10-5345a",
  display: "Individuals' Request for a Copy of Their Own Health Information "
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "VA-10-5345a-MHV",
  display: "Individualâ€™s Request for a Copy of their own health information from MyHealtheVet"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "VA-10-10116",
  display: "Revocation of Authorization for Use and Release of Individually Identifiable Health Information for Veterans Health Administration Research"
}, {
  system: "http://hl7.org/fhir/consentcategorycodes	",
  code: "VA-21-4142",
  display: "Authorization and Consent to Release Information to the Department of Veterans Affairs (VA)"
}]




Meteor.methods({
    initializeConsents(){
      console.log('Initialize Consents...')

      var newConsent = {
          "resourceType": "Consent",
          "id": "consent-example-smartonfhir",
          "text": {
            "status": "generated",
            "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative with Details</b></p><p><b>id</b>: consent-example-smartonfhir</p><p><b>status</b>: active</p><p><b>patient</b>: <a>Patient/xcda</a></p><p><b>period</b>: 23/06/2016 5:02:33 PM --&gt; 23/06/2016 5:32:33 PM</p><p><b>dateTime</b>: 23/06/2016 5:02:33 PM</p><p><b>consentingParty</b>: <a>RelatedPerson/peter</a></p><p><b>organization</b>: <a>Organization/example</a></p><p><b>policyRule</b>: <a>http://hl7.org/fhir/ConsentPolicy/opt-in</a></p><h3>Excepts</h3><table><tr><td>-</td><td><b>Type</b></td><td><b>Action</b></td><td><b>Class</b></td></tr><tr><td>*</td><td>permit</td><td>Access <span>(Details : {http://hl7.org/fhir/consentaction code 'access' = 'Access)</span></td><td>MedicationRequest (Details: http://hl7.org/fhir/resource-types code MedicationRequest = 'MedicationRequest', stated as 'null')</td></tr></table></div>"
          },
          "status": "active",
          "patient": {
            "reference": "Patient/01-544382",
            "display": "Jane Doe"
          },
          "period": {
            "start": "2016-06-23T17:02:33+10:00",
            "end": "2016-06-23T17:32:33+10:00"
          },
          "dateTime": "2016-06-23T17:02:33+10:00",
          "consentingParty": [
            {
              "reference": "RelatedPerson/jane",
              "display": "Jane Doe"
            }
          ],
          "category": [],
          "organization": [
            {
              "reference": "Organization/example",
              "display": "All Saint's Hospital"
            }
          ],
          "policyRule": "http://hl7.org/fhir/ConsentPolicy/opt-in",
          "except": []
        };

      var newException = {
          "type": "permit",
          "action": [
            {
              "coding": [
                {
                  "system": "http://hl7.org/fhir/consentaction",
                  "code": "access"
                }
              ]
            }
          ],
          "class": [
            {
              "system": "http://hl7.org/fhir/resource-types",
              "code": "MedicationRequest"
            }
          ]
        }

        newConsent.except.push(newException)
        var consentId = Consents.insert(newConsent);
        console.log('Initialized ' + consentId)

        newConsent.patient = {
          reference: "Patient/01-567390",
          display: "Alice Doe"
        }
        newConsent.orginization = {
          display: "St. James Infirmary"
        }
        newException.class = [{
          system: "http://hl7.org/fhir/resource-types",
          code: "Observation"
        }]
        newConsent.consentingParty = [{
          reference: "Patient/01-567390",
          display: "Alice Doe"
        }]
        newConsent.category = [{
          code: "42 CFR Part 2",
          display: "42 CFR Part 2 Form of written consent"
        }]

        newConsent.except.push(newException)

        let masterPatientArray = [];
        var patients = [];        

        if(Package['clinical:hl7-resource-patient']){
          // if we can, we want to pull patient from our actual Patients colleciton
          masterPatientArray = Patients.find({}, {limit: 50}).fetch();
          if(masterPatientArray.length > 0){
            masterPatientArray.forEach(function(actualPatient){
              patients.push({
                display: get(actualPatient, 'name[0].text', ''),
                reference: "Patient/" + actualPatient._id
              })    
            })
          }
        } else {
          // otherwise, we're going to use faker.js to create simulated patients
          var numberPatients = 50;
          for (let index = 0; index < numberPatients; index++) {
            patients.push({
              display: faker.name.findName(),
              reference: "Patient/" + Random._id
            })              
          }
        }



        var organizations = [];
        var seedOrgs = [{
          reference: "Organization/zksz4EhzJzTxuZsNJ",
          display: "All Saint's Hospital"
        }, {
          reference: "Organization/cmfDFnAdCPeneuv8T",
          display: "St. James Infirmiry"
        }, {
          reference: "Organization/TQuCu5HKGizXzchM7",
          display: "Rainbow's End Retirement Home"
        }, {
          reference: "Organization/tyHFMwh45EYKgGbcz",
          display: "Blue Lagoon Geothermal Spa"
        }, {
          reference: "Organization/6ASxrJ5cAj8uMN5Gr",
          display: "Hokkaido Noboribetsu Onsen"
        }, {
          reference: "Organization/F399zhEyyLuT45hxT",
          display: "University of Pennsylvania Health System"
        }, {
          reference: "Organization/LYCzoixi8gqgeETks",
          display: "Duke University"
        }, {
          reference: "Organization/rnFeJ8ptv6cbvzk7X",
          display: "University of Chicago"
        }]
        
        organizations.push(seedOrgs[0])
        organizations.push(seedOrgs[0])
        organizations.push(seedOrgs[0])
        organizations.push(seedOrgs[1])
        organizations.push(seedOrgs[1])
        organizations.push(seedOrgs[1])
        organizations.push(seedOrgs[2])
        organizations.push(seedOrgs[3])
        organizations.push(seedOrgs[4])



        var resourceTypes = [
          "AllergyIntolerance",
          "CarePlan",
          "CareTeam",
          "Device",
          "Condition",
          "Goal",
          "MedicationStatement",
          "Observation",
          "Procedure",
          "RiskAssessment"
        ]

        if(Consents.find().count() < 2){
          var numPatients = 50;
          for (let index = 0; index < numPatients; index++) {  

            if (index % 10 === 0){
              newConsent.patient = {
                "reference": "Patient/01-544382",
                "display": "Jane Doe"
              }
            } else {
              newConsent.patient = Random.choice(patients)
            }
  
            newConsent.dateTime = new Date(Random.date('2000-01-01'));
            newConsent.organization = [];
            newConsent.organization.push(Random.choice(organizations))


            newConsent.status = Random.choice(['draft', 'proposed', 'active', 'rejected', 'inactive' , 'entered-in-error'])
            newConsent.category = [];
            newConsent.category.push({coding: [Random.choice(consentCategories)]});
    

            var randomInt = Random.cardinal(5);
            newException.class = [];
            for (let j = 0; j < randomInt; j++) {            
              newException.class.push({
                system: "http://hl7.org/fhir/resource-types",
                code: Random.choice(resourceTypes)
              });
            }
            newConsent.except.push(newException);
  
            newConsent.consentingParty = [ newConsent.patient ]

            let consentValidator = ConsentSchema.newContext();
            consentValidator.validate(newConsent)
        
            console.log('IsValid: ', consentValidator.isValid())
            console.log('ValidationErrors: ', consentValidator.validationErrors());

            console.log('newConsent', newConsent)

            var consentId = Consents.insert(newConsent, {
              validate: get(Meteor, 'settings.public.defaults.schemas.validate', false), 
              filter: get(Meteor, 'settings.public.defaults.schemas.filter', false), 
              removeEmptyStrings: get(Meteor, 'settings.public.defaults.schemas.removeEmptyStrings', false)
             }, function(error, result){
              if(error) console.log('error', error)
            });
            //console.log('Initialized ' + consentId)          
          }  
          console.log('Initialized ' + Consents.find().count() + ' records.')          
        }
    },
    dropConsents: function(){
      Consents.drop({})
    }
})