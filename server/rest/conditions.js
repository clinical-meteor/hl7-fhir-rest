

//==========================================================================================
// Global Configs  

var fhirVersion = 'fhir-3.0.0';

if(typeof oAuth2Server === 'object'){
  // TODO:  double check that this is needed; and that the /api/ route is correct
  JsonRoutes.Middleware.use(
    // '/api/*',
    '/fhir-3.0.0/*',
    oAuth2Server.oauthserver.authorise()   // OAUTH FLOW - A7.1
  );
}

JsonRoutes.setResponseHeaders({
  "content-type": "application/fhir+json"
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
    var spacer = shouldPrettyPrint ? 2 : null;
    res.setHeader('Content-type', 'application/fhir+json');
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
// Step 1 - Create New Condition  

JsonRoutes.add("put", "/" + fhirVersion + "/Condition/:id", function (req, res, next) {
  process.env.DEBUG && console.log('PUT /fhir-1.6.0/Condition/' + req.params.id);
  //process.env.DEBUG && console.log('PUT /fhir-1.6.0/Condition/' + req.query._count);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("content-type", "application/fhir+json");

  var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);

  if(typeof oAuth2Server === 'object'){
    var accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});    

    if (accessToken || process.env.NOAUTH || Meteor.settings.private.disableOauth) {
      if (accessToken) {
        process.env.TRACE && console.log('accessToken', accessToken);
        process.env.TRACE && console.log('accessToken.userId', accessToken.userId);
      }


      if (req.body) {
        conditionUpdate = req.body;

        // remove id and meta, if we're recycling a resource
        delete req.body.id;
        delete req.body.meta;

        //process.env.TRACE && console.log('req.body', req.body);

        conditionUpdate.resourceType = "Condition";
        conditionUpdate = Conditions.toMongo(conditionUpdate);

        //process.env.TRACE && console.log('conditionUpdate', conditionUpdate);


        conditionUpdate = Conditions.prepForUpdate(conditionUpdate);


        process.env.DEBUG && console.log('-----------------------------------------------------------');
        process.env.DEBUG && console.log('conditionUpdate', JSON.stringify(conditionUpdate, null, 2));
        // process.env.DEBUG && console.log('newCondition', newCondition);

        var condition = Conditions.findOne(req.params.id);
        var conditionId;

        if(condition){
          process.env.DEBUG && console.log('Condition found...')
          conditionId = Conditions.update({_id: req.params.id}, {$set: conditionUpdate },  function(error, result){
            if (error) {
              process.env.TRACE && console.log('PUT /fhir/Condition/' + req.params.id + "[error]", error);

              // Bad Request
              JsonRoutes.sendResult(res, {
                code: 400
              });
            }
            if (result) {
              process.env.TRACE && console.log('result', result);
              res.setHeader("Location", "fhir/Condition/" + result);
              res.setHeader("Last-Modified", new Date());
              res.setHeader("ETag", "1.6.0");

              var conditions = Conditions.find({_id: req.params.id});
              var payload = [];

              conditions.forEach(function(record){
                payload.push(Conditions.prepForFhirTransfer(record));
              });

              console.log("payload", payload);

              // success!
              JsonRoutes.sendResult(res, {
                code: 200,
                data: Bundle.generate(payload)
              });
            }
          });
        } else {        
          process.env.DEBUG && console.log('No condition found.  Creating one.');
          conditionUpdate._id = req.params.id;
          conditionId = Conditions.insert(conditionUpdate,  function(error, result){
            if (error) {
              process.env.TRACE && console.log('PUT /fhir/Condition/' + req.params.id + "[error]", error);

              // Bad Request
              JsonRoutes.sendResult(res, {
                code: 400
              });
            }
            if (result) {
              process.env.TRACE && console.log('result', result);
              res.setHeader("Location", "fhir/Condition/" + result);
              res.setHeader("Last-Modified", new Date());
              res.setHeader("ETag", "1.6.0");

              var conditions = Conditions.find({_id: req.params.id});
              var payload = [];

              conditions.forEach(function(record){
                payload.push(Conditions.prepForFhirTransfer(record));
              });

              console.log("payload", payload);

              // success!
              JsonRoutes.sendResult(res, {
                code: 200,
                data: Bundle.generate(payload)
              });
            }
          });        
        }
      } else {
        // no body; Unprocessable Entity
        JsonRoutes.sendResult(res, {
          code: 422
        });

      }


    } else {
      // Unauthorized
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



//==========================================================================================
// Step 2 - Read Condition  

JsonRoutes.add("get", "/" + fhirVersion + "/Condition/:id", function (req, res, next) {
  process.env.DEBUG && console.log('GET /fhir-1.6.0/Condition/' + req.params.id);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("content-type", "application/fhir+json");

  var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
  if(typeof oAuth2Server === 'object'){
    var accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});

    if (accessToken || process.env.NOAUTH || Meteor.settings.private.disableOauth) {

      if (accessToken) {
        process.env.TRACE && console.log('accessToken', accessToken);
        process.env.TRACE && console.log('accessToken.userId', accessToken.userId);
      }

      var conditionData = Conditions.findOne({_id: req.params.id});
      if (conditionData) {
        conditionData.id = conditionData._id;

        delete conditionData._document;
        delete conditionData._id;

        process.env.TRACE && console.log('conditionData', conditionData);

        // Success
        JsonRoutes.sendResult(res, {
          code: 200,
          data: Conditions.prepForFhirTransfer(conditionData)
        });
      } else {
        // Gone
        JsonRoutes.sendResult(res, {
          code: 410
        });
      }
    } else {
      // Unauthorized
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

//==========================================================================================
// Step 3 - Update Condition  

JsonRoutes.add("post", "/" + fhirVersion + "/Condition", function (req, res, next) {
  process.env.DEBUG && console.log('POST /fhir/Condition/', JSON.stringify(req.body, null, 2));

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("content-type", "application/fhir+json");

  var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
  if(typeof oAuth2Server === 'object'){
    var accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});

    if (accessToken || process.env.NOAUTH || Meteor.settings.private.disableOauth) {

      if (accessToken) {
        process.env.TRACE && console.log('accessToken', accessToken);
        process.env.TRACE && console.log('accessToken.userId', accessToken.userId);
      }

      var conditionId;
      var newCondition;

      if (req.body) {
        newCondition = req.body;


        // remove id and meta, if we're recycling a resource
        delete newCondition.id;
        delete newCondition.meta;


        newCondition = Conditions.toMongo(newCondition);

        process.env.TRACE && console.log('newCondition', JSON.stringify(newCondition, null, 2));
        // process.env.DEBUG && console.log('newCondition', newCondition);

        console.log('Cleaning new condition...')
        ConditionSchema.clean(newCondition);

        var practionerContext = ConditionSchema.newContext();
        practionerContext.validate(newCondition)
        console.log('New condition is valid:', practionerContext.isValid());
        console.log('check', check(newCondition, ConditionSchema))
        


        var conditionId = Conditions.insert(newCondition,  function(error, result){
          if (error) {
            process.env.TRACE && console.log('error', error);

            // Bad Request
            JsonRoutes.sendResult(res, {
              code: 400
            });
          }
          if (result) {
            process.env.TRACE && console.log('result', result);
            res.setHeader("Location", "fhir-1.6.0/Condition/" + result);
            res.setHeader("Last-Modified", new Date());
            res.setHeader("ETag", "1.6.0");

            var conditions = Conditions.find({_id: result});
            var payload = [];

            conditions.forEach(function(record){
              payload.push(Conditions.prepForFhirTransfer(record));
            });

            //console.log("payload", payload);
            // Created
            JsonRoutes.sendResult(res, {
              code: 201,
              data: Bundle.generate(payload)
            });
          }
        });
        console.log('conditionId', conditionId);
      } else {
        // Unprocessable Entity
        JsonRoutes.sendResult(res, {
          code: 422
        });
      }

    } else {
      // Unauthorized
      JsonRoutes.sendResult(res, {
        code: 401
      });
    }
  } else {
    // Not Implemented
    JsonRoutes.sendResult(res, {
      code: 501
    });
  }
});

//==========================================================================================
// Step 4 - ConditionHistoryInstance

JsonRoutes.add("get", "/" + fhirVersion + "/Condition/:id/_history", function (req, res, next) {
  process.env.DEBUG && console.log('GET /fhir-1.6.0/Condition/', req.params);
  process.env.DEBUG && console.log('GET /fhir-1.6.0/Condition/', req.query._count);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("content-type", "application/fhir+json");

  var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
  if(typeof oAuth2Server === 'object'){
    var accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});

    if (accessToken || process.env.NOAUTH || Meteor.settings.private.disableOauth) {

      if (accessToken) {
        process.env.TRACE && console.log('accessToken', accessToken);
        process.env.TRACE && console.log('accessToken.userId', accessToken.userId);
      }

      var conditions = Conditions.find({_id: req.params.id});
      var payload = [];

      conditions.forEach(function(record){
        payload.push(Conditions.prepForFhirTransfer(record));

        // the following is a hack, to conform to the Touchstone Condition testscript
        // https://touchstone.aegis.net/touchstone/testscript?id=06313571dea23007a12ec7750a80d98ca91680eca400b5215196cd4ae4dcd6da&name=%2fFHIR1-6-0-Basic%2fP-R%2fCondition%2fClient+Assigned+Id%2fCondition-client-id-json&version=1&latestVersion=1&itemId=&spec=HL7_FHIR_STU3_C2
        // the _history query expects a different resource in the Bundle for each version of the file in the system
        // since we don't implement record versioning in Meteor on FHIR yet
        // we are simply adding two instances of the record to the payload 
        payload.push(Conditions.prepForFhirTransfer(record));
      });
      // Success
      JsonRoutes.sendResult(res, {
        code: 200,
        data: Bundle.generate(payload, 'history')
      });
    } else {
      // Unauthorized
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

//==========================================================================================
// Step 5 - Condition Version Read

// NOTE:  We've not implemented _history functionality yet; so this endpoint is mostly a duplicate of Step 2.

JsonRoutes.add("get", "/" + fhirVersion + "/Condition/:id/_history/:versionId", function (req, res, next) {
  process.env.DEBUG && console.log('GET /fhir-1.6.0/Condition/:id/_history/:versionId', req.params);
  //process.env.DEBUG && console.log('GET /fhir-1.6.0/Condition/:id/_history/:versionId', req.query._count);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("content-type", "application/fhir+json");

  var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
  if(typeof oAuth2Server === 'object'){
  
  } else {
    // no oAuth server installed; Not Implemented
    JsonRoutes.sendResult(res, {
      code: 501
    });
  }

  var accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});

  if (accessToken || process.env.NOAUTH || Meteor.settings.private.disableOauth) {

    if (accessToken) {
      process.env.TRACE && console.log('accessToken', accessToken);
      process.env.TRACE && console.log('accessToken.userId', accessToken.userId);
    }

    var conditionData = Conditions.findOne({_id: req.params.id});
    if (conditionData) {
      
      conditionData.id = conditionData._id;

      delete conditionData._document;
      delete conditionData._id;

      process.env.TRACE && console.log('conditionData', conditionData);

      JsonRoutes.sendResult(res, {
        code: 200,
        data: Conditions.prepForFhirTransfer(conditionData)
      });
    } else {
      JsonRoutes.sendResult(res, {
        code: 410
      });
    }

  } else {
    JsonRoutes.sendResult(res, {
      code: 401
    });
  }
});



generateDatabaseQuery = function(query){
  console.log("generateDatabaseQuery", query);

  var databaseQuery = {};

  if (query.family) {
    databaseQuery['name'] = {
      $elemMatch: {
        'family': query.family
      }
    };
  }
  if (query.given) {
    databaseQuery['name'] = {
      $elemMatch: {
        'given': query.given
      }
    };
  }
  if (query.name) {
    databaseQuery['name'] = {
      $elemMatch: {
        'text': {
          $regex: query.name,
          $options: 'i'
        }
      }
    };
  }
  if (query.identifier) {
    databaseQuery['identifier'] = {
      $elemMatch: {
        'value': query.identifier
      }
    };
  }
  if (query.gender) {
    databaseQuery['gender'] = query.gender;
  }
  if (query.birthdate) {
    var dateArray = query.birthdate.split("-");
    var minDate = dateArray[0] + "-" + dateArray[1] + "-" + (parseInt(dateArray[2])) + 'T00:00:00.000Z';
    var maxDate = dateArray[0] + "-" + dateArray[1] + "-" + (parseInt(dateArray[2]) + 1) + 'T00:00:00.000Z';
    console.log("minDateArray", minDate, maxDate);

    databaseQuery['birthDate'] = {
      "$gte" : new Date(minDate),
      "$lt" :  new Date(maxDate)
    };
  }

  process.env.DEBUG && console.log('databaseQuery', databaseQuery);
  return databaseQuery;
}

JsonRoutes.add("get", "/" + fhirVersion + "/Condition", function (req, res, next) {
  process.env.DEBUG && console.log('GET /fhir-1.6.0/Condition', req.query);

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("content-type", "application/fhir+json");

  var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
  if(typeof oAuth2Server === 'object'){
    var accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});

    if (accessToken || process.env.NOAUTH || Meteor.settings.private.disableOauth) {

      if (accessToken) {
        process.env.TRACE && console.log('accessToken', accessToken);
        process.env.TRACE && console.log('accessToken.userId', accessToken.userId);
      }

      var databaseQuery = generateDatabaseQuery(req.query);

      var payload = [];
      var conditions = Conditions.find(databaseQuery);

      conditions.forEach(function(record){
        payload.push(Conditions.prepForFhirTransfer(record));
      });

      // Success
      JsonRoutes.sendResult(res, {
        code: 200,
        data: Bundle.generate(payload)
      });
    } else {
      // Unauthorized
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

//==========================================================================================
// Step 6 - Condition Search Type  

JsonRoutes.add("post", "/" + fhirVersion + "/Condition/:param", function (req, res, next) {
  process.env.DEBUG && console.log('POST /fhir-1.6.0/Condition/' + JSON.stringify(req.query));

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("content-type", "application/fhir+json");

  var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
  if(typeof oAuth2Server === 'object'){
    var accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});

    if (accessToken || process.env.NOAUTH || Meteor.settings.private.disableOauth) {

      if (accessToken) {
        process.env.TRACE && console.log('accessToken', accessToken);
        process.env.TRACE && console.log('accessToken.userId', accessToken.userId);
      }

      var conditions = [];

      if (req.params.param.includes('_search')) {
        var searchLimit = 1;
        if (req && req.query && req.query._count) {
          searchLimit = parseInt(req.query._count);
        }

        var databaseQuery = generateDatabaseQuery(req.query);
        process.env.DEBUG && console.log('databaseQuery', databaseQuery);

        conditions = Conditions.find(databaseQuery, {limit: searchLimit});

        var payload = [];

        conditions.forEach(function(record){
          payload.push(Conditions.prepForFhirTransfer(record));
        });
      }

      //process.env.TRACE && console.log('conditions', conditions);

      // Success
      JsonRoutes.sendResult(res, {
        code: 200,
        data: Bundle.generate(payload)
      });
    } else {
      // Unauthorized
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




//==========================================================================================
// Step 7 - Condition Delete    

JsonRoutes.add("delete", "/" + fhirVersion + "/Condition/:id", function (req, res, next) {
  process.env.DEBUG && console.log('DELETE /fhir-1.6.0/Condition/' + req.params.id);

  res.setHeader("Access-Control-Allow-Origin", "*");

  var accessTokenStr = (req.params && req.params.access_token) || (req.query && req.query.access_token);
  if(typeof oAuth2Server === 'object'){

    var accessToken = oAuth2Server.collections.accessToken.findOne({accessToken: accessTokenStr});
    if (accessToken || process.env.NOAUTH || Meteor.settings.private.disableOauth) {

      if (accessToken) {
        process.env.TRACE && console.log('accessToken', accessToken);
        process.env.TRACE && console.log('accessToken.userId', accessToken.userId);
      }

      if (Conditions.find({_id: req.params.id}).count() === 0) {
        // Gone
        JsonRoutes.sendResult(res, {
          code: 410
        });
      } else {
        Conditions.remove({_id: req.params.id}, function(error, result){
          if (result) {
            // No Content
            JsonRoutes.sendResult(res, {
              code: 204
            });
          }
          if (error) {
            // Conflict
            JsonRoutes.sendResult(res, {
              code: 409
            });
          }
        });
      }


    } else {
      // Unauthorized
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





// WebApp.connectHandlers.use("/fhir/Condition", function(req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   return next();
// });
