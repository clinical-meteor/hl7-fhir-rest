Package.describe({
  name: 'clinical:hl7-fhir-rest',
  version: '6.0.0',
  summary: 'HL7 FHIR Rest Endpoints (using JsonRoutes)',
  git: 'https://github.com/clinical-meteor/hl7-fhir-rest',
  documentation: 'README.md'
});


Package.onUse(function (api) {
  api.versionsFrom('1.1.0.3');

  api.use('meteor-base@1.4.0');
  api.use('ecmascript@0.13.0');

  api.use('mongo');

  api.use('aldeed:collection2@3.0.0');
  api.use('simple:json-routes@2.1.0');

  api.use('clinical:hl7-resource-datatypes@4.0.5');
  api.use('clinical:extended-api@2.5.0');
  api.use('matb33:collection-hooks@0.7.15');

});


Npm.depends({
  "moment": "2.22.2",
  "lodash": "4.17.13"
});

