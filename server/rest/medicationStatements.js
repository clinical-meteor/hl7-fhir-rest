

//==========================================================================================
// Global Configs  

var fhirVersion = 'fhir-3.0.0';


if(typeof oAuth2Server === 'object'){
  JsonRoutes.Middleware.use(
    '/fhir-3.0.0/*',
    oAuth2Server.oauthserver.authorise()   // OAUTH FLOW - A7.1
  );
}

JsonRoutes.setResponseHeaders({
  "content-type": "application/fhir+json; charset=utf-8"
});



//==========================================================================================
// Global Method Overrides

// this is temporary fix until PR 132 can be merged in
// https://github.com/stubailo/meteor-rest/pull/132

JsonRoutes.sendResult = function (res, options) {
  options = options || {};

  // Set status code on response
  res.statusCode = options.code || 200;

  // Set response body
  if (options.data !== undefined) {
    var shouldPrettyPrint = (process.env.NODE_ENV === 'development');
    var spacer = shouldPrettyPrint ? 2 : null;cd .
    res.setHeader('Content-type', 'application/fhir+json; charset=utf-8');
    res.write(JSON.stringify(options.data, null, spacer));
  }

  // We've already set global headers on response, but if they
  // pass in more here, we set those.
  if (options.headers) {
    //setHeaders(res, options.headers);
    options.headers.forEach(function(value, key){
      res.setHeader(key, value);
    });
  }

  // Send the response
  res.end();
};




//==========================================================================================


JsonRoutes.add("get", "/fhir/MedicationStatement/:id", function (req, res, next) { process.env.DEBUG && console.log('GET /fhir/MedicationStatement/' + req.params.id);
  res.setHeader("Access-Control-Allow-Origin", "*");

  var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);

  if(typeof oAuth2Server === 'object'){
    var accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});    

    if (accessToken || process.env.NOAUTH || Meteor.settings.private.disableOauth) {


      process.env.TRACE && console.log('accessToken', accessToken);
      process.env.TRACE && console.log('accessToken.userId', accessToken.userId);

      if (typeof SiteStatistics === "object") {
        SiteStatistics.update({_id: "configuration"}, {$inc:{
          "MedicationStatements.count.read": 1 }});
      }

      var id = req.params.id;
      var medicationStatementData = MedicationStatements.findOne(id); delete medicationStatementData._document;
      process.env.TRACE && console.log('medicationStatementData', medicationStatementData);

      JsonRoutes.sendResult(res, {
        code: 200,
        data: medicationStatementData
      });
    } else {
      JsonRoutes.sendResult(res, {
        code: 401
      });
    }

  } else {
    // no oAuth server installed; Not Implemented
    JsonRoutes.sendResult(res, {
      code: 501
    });
  }  
});



JsonRoutes.add("get", "/fhir/MedicationStatement", function (req, res, next) { process.env.DEBUG && console.log('GET /fhir/MedicationStatement', req.query);
  res.setHeader("Access-Control-Allow-Origin", "*");

  var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);

  if(typeof oAuth2Server === 'object'){
    var accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});    

    if (accessToken || process.env.NOAUTH || Meteor.settings.private.disableOauth) {

      process.env.TRACE && console.log('accessToken', accessToken);
      process.env.TRACE && console.log('accessToken.userId', accessToken.userId);

      if (typeof SiteStatistics === "object") {
        SiteStatistics.update({_id: "configuration"}, {$inc:{
          "MedicationStatements.count.search-type": 1 }});
      }

      var databaseQuery = {};

      process.env.DEBUG && console.log('databaseQuery', databaseQuery);
      process.env.DEBUG && console.log('MedicationStatements.find(id)', MedicationStatements.find(databaseQuery).fetch()); // because we're using BaseModel and a _transform() function
      // MedicationStatements returns an object instead of a pure JSON document // it stores a shadow reference of the original doc, which we're removing here
      var medicationStatementData = MedicationStatements.find(databaseQuery).fetch();
      medicationStatementData.forEach(function(patient){
        delete patient._document;
      });

      JsonRoutes.sendResult(res, {
        code: 200,
        data: medicationStatementData
      });
    } else {
      JsonRoutes.sendResult(res, {
        code: 401
      });
    }

  } else {
    // no oAuth server installed; Not Implemented
    JsonRoutes.sendResult(res, {
      code: 501
    });
  }
});
