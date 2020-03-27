import { get } from 'lodash';

Meteor.methods({
    syncLocations: function(){
        if(get(Meteor, 'settings.public.meshNetwork.upstreamSync')){
            console.log('-----------------------------------------');
            console.log('Syncing Locations... ');
            var queryString = get(Meteor, 'settings.public.meshNetwork.upstreamSync') + "/Location";
            console.log(queryString);
            
            var result =  HTTP.get(queryString);

            var bundle = JSON.parse(result.content);

            console.log('result', bundle);
            bundle.entry.forEach(function(record){
            console.log('record', record);
            if(record.resource.resourceType === "Location"){
                if(!Locations.findOne({name:record.resource.name})){
                    Locations.insert(record.resource);
                }
            }
            });
            Meteor.call('generateDailyStat');
            return true;
        }else {
        console.log('-----------------------------------------');
        console.log('Syncing disabled... ');      
        }
    },

    // just an alias 
    initializeLocations: function(){
        this.initializeHospitals();
    },
    // These are Chicago area volunteers
  initializeVolunteers: function(){
    
    var volunteers = [{"id":1,"name":"Sabine","email":"smcward0@scientificamerican.com","gender":"Female","app_token":"29f5e8d22401359319aab898c852b4be291ebf2daf3f6045b6138cae47be0c6f","lat":41.499438,"long":-87.044913,"phone":"306-889-5325"},
        {"id":2,"name":"Jethro","email":"jbeed1@php.net","gender":"Male","app_token":"359b1b994c98df724fa7c84807923d0fe295cf22f1ba52ccc031df6e52a09b5e","lat":41.0166339,"long":-87.0368351,"phone":"481-964-7109"},
        {"id":3,"name":"Felicia","email":"fizatson2@rambler.ru","gender":"Female","app_token":"e8274c5d3670dcf0eabbdff8407cf01eb5e2006947a6b301dd10efe70c5d92ef","lat":41.984864,"long":-87.349613,"phone":"671-587-8389"},
        {"id":4,"name":"Steven","email":"smountcastle3@theglobeandmail.com","gender":"Male","app_token":"b992d6cdc6d55fce0a305cb7abf01183d83979e7a9fbb06fa99c7fa41095627a","lat":41.6612173,"long":-87.3904598,"phone":"858-415-9877"},
        {"id":5,"name":"Halley","email":"hsynan4@statcounter.com","gender":"Female","app_token":"4af073196e95ac8cd888b9432efe06e73ff1ff6bea1942a5c30207774f212316","lat":41.9481767,"long":-87.4878774,"phone":"118-851-2673"},
        {"id":6,"name":"Clemmy","email":"cbrasseur5@angelfire.com","gender":"Male","app_token":"1390948df223092ef003b7612ae3e5f1b4b01a503c566c5bc4901bcc8fb07568","lat":41.8492904,"long":-87.7371425,"phone":"488-655-5362"},
        {"id":7,"name":"Frans","email":"fboggers6@wordpress.org","gender":"Male","app_token":"55c8f70f403b21c66188274a276c403c899b67463bd7adb15cec1571c1de63a9","lat":41.654639,"long":-87.144136,"phone":"474-115-4385"},
        {"id":8,"name":"Nevsa","email":"nbromehed7@yolasite.com","gender":"Female","app_token":"3b3234f410373d397cf53f8f718e71e52b7589cfc2171f634119d1262b123b57","lat":41.3825415,"long":-87.847466,"phone":"125-644-7930"},
        {"id":9,"name":"Law","email":"lbleackly8@nymag.com","gender":"Male","app_token":"01fcb61888f1181c9bf7df508f93e98745c9081437adb6841f1f57a018a0e30c","lat":41.5365944,"long":-87.8492097,"phone":"230-504-0027"},
        {"id":10,"name":"Phaedra","email":"plednor9@tripod.com","gender":"Female","app_token":"25d8741bf5d478bc02f326c7a2632c78623a34b43e8c2bc5a7322cc4fbfd4c1b","lat":41.31628,"long":-87.73743,"phone":"812-509-2954"},
        {"id":11,"name":"Abram","email":"aolliea@infoseek.co.jp","gender":"Male","app_token":"73ef277f84396a521b4f7c519807addd2d5fae531a028118a7842032e9a13e48","lat":41.1743158,"long":-87.236243,"phone":"590-240-7503"},
        {"id":12,"name":"Martina","email":"mfawkesb@jiathis.com","gender":"Female","app_token":"0ad417379b00b963b94f947ede4b54c3b3ecae429a63d7961dc5661480d4d007","lat":41.3268743,"long":-87.2566877,"phone":"225-941-5601"},
        {"id":13,"name":"Lenard","email":"lgammidgec@hhs.gov","gender":"Male","app_token":"ab4009c58c00e472325ad77bec873d9e302e00a0dfd3b7b43cfc0f35f71121b1","lat":41.12829,"long":-87.45004,"phone":"955-877-9080"},
        {"id":14,"name":"Gertrude","email":"gmelhuishd@soup.io","gender":"Female","app_token":"c0fa489fe94a1521700e53f8d4b4b5f27838ed45ce828b39fd736c82b644ad8c","lat":41.6714312,"long":-87.003566,"phone":"771-144-3061"},
        {"id":15,"name":"Isador","email":"izamudioe@facebook.com","gender":"Male","app_token":"dc56d3337484192690ea292369d1350599dc532b9dd2a720acd3c3ddefe9dc5a","lat":41.9536614,"long":-87.3865836,"phone":"932-248-3270"},
        {"id":16,"name":"Goldi","email":"gjostf@technorati.com","gender":"Female","app_token":"a1b16724d288da245868f2788aab43dc2887ea3e462d3951a1281b374b69ca93","lat": 41.4127,"long": -87.8625,"phone":"255-265-3699"},
        {"id":17,"name":"Mommy","email":"mscrubyg@chronoengine.com","gender":"Female","app_token":"f2ce53a52bd5add54d832cb4e4c99752976c08a248e3b9f0edeb7a8bcb9eb53c","lat":41.0010539,"long":-87.0493375,"phone":"645-747-0575"},
        {"id":18,"name":"Vicky","email":"vpetroulish@amazon.de","gender":"Female","app_token":"c9bf4afd02314c1bf3e7ec19a92b7fe8271254cfce92e0b59455fd81e9185831","lat":41.2060223,"long":-87.083666,"phone":"998-156-8072"},
        {"id":19,"name":"Torey","email":"thottoni@harvard.edu","gender":"Male","app_token":"226acfc78f151b068e5d3cd91e7c2d54ee79fe91779440101a05489dd61caeae","lat":41.5390859,"long":-87.3116591,"phone":"659-500-5997"},
        {"id":20,"name":"Mikel","email":"mtewkesberriej@free.fr","gender":"Male","app_token":"1df41886670dfc162e7e4df79c9b4e7fa1a8276f3a357e3689f7fa3b30f7db8c","lat":41.453667,"long":-87.872199,"phone":"118-242-0382"},
        {"id":21,"name":"Beth","email":"brolfik@fc2.com","gender":"Female","app_token":"1058b119a0277999cf2da6def21d58ca7ca44bed3610ab42599b9deb7c1e99fe","lat":41.724692,"long":-87.900628,"phone":"764-335-2893"},
        {"id":22,"name":"Elinor","email":"ehitchensl@yandex.ru","gender":"Female","app_token":"5afd814bd83232667fd82c352557b81baa55899aa0c5d4aa0aa9bb25f07a3264","lat":41.592024,"long":-87.227305,"phone":"766-693-6089"},
        {"id":23,"name":"Gladi","email":"ghemphreym@netscape.com","gender":"Female","app_token":"7b9f7013f95ead15dbfb30835a97f4b9fb31cb0a4f5da0af88cb87a5edcb43ae","lat":41.3942118,"long":-87.6854034,"phone":"320-869-1000"},
        {"id":24,"name":"Latrina","email":"lantragn@chron.com","gender":"Female","app_token":"744bec7ce41339f67ca74e1f8e4224fd1e656951fe4d94fb9bae535766fba822","lat":41.154774,"long":-87.870383,"phone":"806-653-2281"},
        {"id":25,"name":"Norah","email":"nbelmonto@businessinsider.com","gender":"Female","app_token":"ffe7745d7be4d5711c94ed9b860a76b028d9db3d9d541420aae0858299d68f00","lat":41.3,"long":-87.983333,"phone":"508-768-8423"},
        {"id":26,"name":"Leonelle","email":"lstirtonp@sciencedirect.com","gender":"Female","app_token":"ab451a4168824d9f6457c340c73c4e4e767cf673f3ebd83f7d01bb767232f2dd","lat":41.439299,"long":-5.9885456,"phone":"667-818-1267"},
        {"id":27,"name":"Koralle","email":"kabramskiq@w3.org","gender":"Female","app_token":"4f0230104c98983d7f329afcdd00658b8c019fe3ae9b0c48e7c90e7f96d43ae0","lat":41.8760133,"long":-87.9401509,"phone":"676-548-6806"},
        {"id":28,"name":"Nobie","email":"nvedenyapinr@vinaora.com","gender":"Male","app_token":"dbae1ac755eeae050c29074474910e2381555029aab9b7e7cae51db173a5df6c","lat":41.228209,"long":-87.938814,"phone":"549-101-0529"},
        {"id":29,"name":"Welch","email":"wcollinsons@deliciousdays.com","gender":"Male","app_token":"5c1047881812ab5187fc41e9ab97cc83915284a76a20a78d4b86724261016fba","lat":41.591108,"long":-87.300474,"phone":"362-229-0258"},
        {"id":30,"name":"Patricia","email":"pormet@blog.com","gender":"Female","app_token":"b076eeccc9cceefd86bb3b75f5cf76476bb0ff7f1185b4eccab7322dd8043d91","lat":41.0573473,"long":-87.8253483,"phone":"966-953-5152"},
        {"id":31,"name":"Hillery","email":"hdurhamu@cloudflare.com","gender":"Male","app_token":"4088bf08074ac89b818e05af56f5a083504547b2cec2f3233852d4612f9a9a0e","lat":41.3292328,"long":-87.3359662,"phone":"299-102-2249"},
        {"id":32,"name":"Nevin","email":"ndeschleinv@photobucket.com","gender":"Male","app_token":"b997d075e236ff7496d1cf41f538ff609c57d44f9599006e7e23bc6627a00de2","lat":41.5752811,"long":-87.6939803,"phone":"282-527-9977"},
        {"id":33,"name":"Sapphire","email":"sbofieldw@trellian.com","gender":"Female","app_token":"32c144c2e337404d8c62447910c45b9953af8da6f8aab11eee877f526b225ff3","lat":41.1949744,"long":-87.3202769,"phone":"479-956-2447"},
        {"id":34,"name":"Dorisa","email":"dgraalmanx@yahoo.co.jp","gender":"Female","app_token":"8121ec7cc131512f3d83b64f98e797b59515b947f85fad39795bb387cf0d90d3","lat":41.573,"long":-87.474,"phone":"781-349-7662"},
        {"id":35,"name":"Rick","email":"rtolly@businessweek.com","gender":"Male","app_token":"19ae74f93a81dd3a8220342ee194a852d149cb2ed464aeaff1bd7140c350ffb1","lat":41.9747897,"long":-87.6952439,"phone":"590-243-6621"},
        {"id":36,"name":"Kayley","email":"knendz@cargocollective.com","gender":"Female","app_token":"cc7c29bbefa6d4d24150bad08310032c7e4b459c558ff7683f4bb7aa9a57b831","lat":"33.23203","long":"35.75572","phone":"929-405-5016"},
        {"id":37,"name":"Leslie","email":"lpimme10@google.co.uk","gender":"Male","app_token":"c0e26d46f800b33a0fb9d39c1585443e58963678c3633cde8a27c02e5e7d5c89","lat":41.5697306,"long":-87.3991028,"phone":"730-711-6229"},
        {"id":38,"name":"Orbadiah","email":"ogomez11@shop-pro.jp","gender":"Male","app_token":"782ad2a690166562bce6b1bbe4265f45233f7fd1642538f563da8b1286d233d4","lat":41.6281506,"long":-87.1150734,"phone":"551-792-9342"},
        {"id":39,"name":"Aggie","email":"asor12@techcrunch.com","gender":"Female","app_token":"91b9421af0a57b0dbedbd0ae81126d9864861cc1b432ec2a097493ec9113c174","lat":41.904442,"long":-87.110483,"phone":"660-842-1625"},
        {"id":40,"name":"Nial","email":"nheed13@barnesandnoble.com","gender":"Male","app_token":"ba0f18b51ef459c06edc34c72c709c84a91a137470c8d4693a316891ad17a494","lat":41.80278,"long":-87.308961,"phone":"735-456-7947"},
        {"id":41,"name":"Tuckie","email":"tmcclymond14@soundcloud.com","gender":"Male","app_token":"ab876671a05fa43fa7715c767a6e2255e01d8c85a86b15971f5eabf231aeb5b7","lat":-31.946337,"long":-87.180261,"phone":"159-279-2680"},
        {"id":42,"name":"Stefanie","email":"scornillot15@devhub.com","gender":"Female","app_token":"ddad8c6dc5026fdb78212ec00596d39036d1be6f107590cd4ae6e8e299f2a8a1","lat":41.5889431,"long":-87.2595008,"phone":"690-983-0896"},
        {"id":43,"name":"Eryn","email":"ekarczinski16@xrea.com","gender":"Female","app_token":"5d5689dc10c9f2e7cefc48fb1ba0ed9453ad7c7fd05408d8c8f84bfc2ab667c5","lat":41.073071,"long":-87.1173534,"phone":"819-698-2454"},
        {"id":44,"name":"Mella","email":"mathowe17@umn.edu","gender":"Female","app_token":"85a33c77157ab8c7de26189a74218e1f237f5017247457feab6c8fa6a9e474cd","lat":41.3692314,"long":-87.0575901,"phone":"943-496-8121"},
        {"id":45,"name":"Blondell","email":"bslobom18@npr.org","gender":"Female","app_token":"c7e999fe4a590a7aa6aa4bb3605a1b7e963239367f8ee76f5515ad3c4028853f","lat":"46.67075","long":"84.00739","phone":"445-157-2929"},
        {"id":46,"name":"Wyn","email":"wredmore19@wunderground.com","gender":"Male","app_token":"d8a313f28258b5727bc540c5d829a1eecc408030d1a7b0e02d3ba08a136f0f26","lat":41.266978,"long":-87.502213,"phone":"992-263-4301"},
        {"id":47,"name":"Dillon","email":"drojahn1a@kickstarter.com","gender":"Male","app_token":"9f86b8d5f0cb6aff1d2853d5222f570b24b962895f661b2390b28033e06164d1","lat":41.897702,"long":-87.184427,"phone":"844-872-3734"},
        {"id":48,"name":"Thom","email":"tstickney1b@aboutads.info","gender":"Male","app_token":"5ec3714b72c26b736a8c2f8d5e3e78eee13578d7d182d12572f368004fcd415c","lat":-6.7378881,"long":-87.6860723,"phone":"599-110-8522"},
        {"id":49,"name":"Hallsy","email":"hjacobi1c@t-online.de","gender":"Male","app_token":"191931285e2bbb87af473871a6724c17c3f270dc02dac4c1f14772d5c88eb9a8","lat":41.3048508,"long":-87.7739249,"phone":"646-389-7095"},
        {"id":50,"name":"Anabelle","email":"aclaiton1d@apple.com","gender":"Female","app_token":"1abe1fa12ba16f6dd5e83b9b0bd96d6e38eddd6c97cbb49c20f53293f0fdc8f6","lat":-7.5231833,"long":-77.9710098,"phone":"317-468-0203"},
        {"id":51,"name":"Lemuel","email":"lprendergrass1e@usgs.gov","gender":"Male","app_token":"d773165416a4e3818ac688f60bcd269426e72a2a1ba680378a9756e24139e34b","lat":41.0093062,"long":-87.4015536,"phone":"254-524-0983"},
        {"id":52,"name":"Crissie","email":"cbuckston1f@parallels.com","gender":"Female","app_token":"ad8624db32c7c23a82645396db11e2e34c7f4d5a9d06ff423ee24d754aa6db28","lat":"45.06685","long":"-64.16544","phone":"649-112-0193"},
        {"id":53,"name":"Ricki","email":"rhubbart1g@slate.com","gender":"Male","app_token":"e3e2bf7760fe301de94852c9386ec0964187c07106f80e6f5b305cbf9730d869","lat":41.5963366,"long":-87.4044268,"phone":"699-836-1964"},
        {"id":54,"name":"Alis","email":"abraffington1h@smugmug.com","gender":"Female","app_token":"891bc299498186592d1debe7ea730958d9f8284c6ee1726c7c6fbbdc7442d713","lat":41.8936109,"long":-87.6283278,"phone":"159-526-4870"},
        {"id":55,"name":"Odessa","email":"olammenga1i@xinhuanet.com","gender":"Female","app_token":"eb0936080b644d75c95baa26cf516317db828e05e56793e6723d9f6504a41ecc","lat":-6.8657511,"long":-87.1086346,"phone":"185-154-6470"},
        {"id":56,"name":"Ferdy","email":"fmatyas1j@wikimedia.org","gender":"Male","app_token":"9b96ef6a9cec9532492aa0725b72d6d2541f40b67320c72dda4b45b986146597","lat":41.2891838,"long":-87.719871,"phone":"305-577-7969"},
        {"id":57,"name":"Antonina","email":"adellenbrok1k@xrea.com","gender":"Female","app_token":"af796d2e5dcaa8fc72d3c8f614f34b5df8b218809a9e698b0e873c90634710ce","lat":41.068932,"long":-87.397142,"phone":"384-737-6808"},
        {"id":58,"name":"Imelda","email":"ipougher1l@epa.gov","gender":"Female","app_token":"abe2d134f5dd834b14fffe31bda54120f2b8e7cc844da69fa960f50921510f7e","lat":41.6201537,"long":-87.7406288,"phone":"759-802-1146"},
        {"id":59,"name":"Gennie","email":"gbartalot1m@barnesandnoble.com","gender":"Female","app_token":"cf65d7825f1d3d78f5d2d642cce34e13e94a142a64dd6546ab09c283df7d80f0","lat":41.1934002,"long":-87.2180188,"phone":"870-287-2864"},
        {"id":60,"name":"Marlene","email":"mbartels1n@utexas.edu","gender":"Female","app_token":"e3bd686147e55b6ffdba44477f4aecd9a1ac5d49fd1999adecca85becc390c42","lat":41.9580488,"long":-87.5847246,"phone":"463-359-0130"},
        {"id":61,"name":"Levon","email":"ltondeur1o@pinterest.com","gender":"Male","app_token":"1eab9cb570817d146a582faeb9a8a6eb97dc46b067d059cfa0ad22b044a9def5","lat":41.7740708,"long":-87.488659,"phone":"164-359-7126"},
        {"id":62,"name":"Gerry","email":"gdoulton1p@technorati.com","gender":"Male","app_token":"d9bc107d1ed93ab32e839860d64b5a7851b57e22036cd746f3ec4428f09d1fda","lat":41.5945618,"long":-87.4507193,"phone":"445-956-2687"},
        {"id":63,"name":"Errick","email":"echarlot1q@google.es","gender":"Male","app_token":"05a1c76e973ec671f992db47b63dbb41eceb278185aa1d8f3eb1810f80ddf138","lat":41.5473421,"long":-87.997522,"phone":"315-678-6128"},
        {"id":64,"name":"Win","email":"wlintin1r@bloglovin.com","gender":"Male","app_token":"bf209ba2f40805334b88973eab5646bca977a2bd02932825fe45bfe54d3b204d","lat":41.9761161,"long":-87.6550859,"phone":"458-212-5602"},
        {"id":65,"name":"Martainn","email":"mpenwell1s@dell.com","gender":"Male","app_token":"c850f6810bd7392cdd83546efedd75468dad2eb489f4d5f2749c53d909932c0e","lat":41.7975376,"long":-87.00234,"phone":"280-478-2281"},
        {"id":66,"name":"Sindee","email":"stomsen1t@jiathis.com","gender":"Female","app_token":"07747d1e0ec9ffaf5812cf224b5749f94f177a51f893e54851eddd1e2bbc001b","lat":41.813247,"long":-87.478747,"phone":"185-718-5125"},
        {"id":67,"name":"Theadora","email":"tlowndsborough1u@nhs.uk","gender":"Female","app_token":"3a33e3402fe5d173f24084ec86e32b6ffe5cb4ef71b9dfc65275525b91ca41d7","lat":41.8590398,"long":-87.6279364,"phone":"545-940-6731"},
        {"id":68,"name":"Octavius","email":"oboldock1v@amazon.co.jp","gender":"Male","app_token":"1f08cea2b35052bbaeefb3439721885577ca98cb6f41a32cd56489674dd79d40","lat":-7.8666877,"long":-87.4666099,"phone":"773-351-7976"},
        {"id":69,"name":"Damian","email":"dmethven1w@wikimedia.org","gender":"Male","app_token":"6eb8c4f04679718f8a3aad97532a2373b9af4b640b9904d55e03f12c371c3625","lat":41.793263,"long":-87.9515077,"phone":"757-232-2939"},
        {"id":70,"name":"Creighton","email":"cbuscombe1x@yandex.ru","gender":"Male","app_token":"c33c17509c07ab0381601847c1447bcf10b98dde2afd80527fcbbfd0b950d58f","lat":41.54251,"long":-87.9774,"phone":"850-364-9908"},
        {"id":71,"name":"Jobye","email":"jsabatini1y@yolasite.com","gender":"Female","app_token":"a6fbd7ca8e48c4bf7fb06f2fc24fe746974428e6a241aec505c1cb109f80448d","lat":41.6540663,"long":-87.5033087,"phone":"690-776-2763"},
        {"id":72,"name":"Magdalen","email":"mablitt1z@unicef.org","gender":"Female","app_token":"6a2555fd0dcdfbb02cf2fa1df669600ab59ee6d1de62dcfc3a2241da1b4f3010","lat":41.6488964,"long":-87.1565948,"phone":"555-718-8555"},
        {"id":73,"name":"Meggie","email":"mlazonby20@uiuc.edu","gender":"Female","app_token":"02b7ce9867bc3187c0e12f5a02f4377cad060462b2e86c460c41a0d32053a078","lat":41.8079089,"long":-87.9200321,"phone":"952-862-9623"},
        {"id":74,"name":"Jules","email":"jlambal21@marriott.com","gender":"Male","app_token":"b8545ec2115f9a66c0d2dc600538a2dfda3129c03c50021e9fb0180b3cb3a298","lat":41.6238704,"long":-87.1016044,"phone":"852-419-8613"},
        {"id":75,"name":"Holli","email":"hmeadus22@mit.edu","gender":"Female","app_token":"9f1b9aaeb6dc4559d66de5004b73d899d4d33d1f4908b125e7550bf050adc4ee","lat":8.6450352,"long":-87.7718025,"phone":"417-326-3956"},
        {"id":76,"name":"Jeff","email":"jhayball23@booking.com","gender":"Male","app_token":"5ef512a9132da82bd46383d47270ec24133aac7e708aa1ca090db1742099b305","lat":41.8424855,"long":-87.1399988,"phone":"513-200-9969"},
        {"id":77,"name":"Constantia","email":"cstonman24@seattletimes.com","gender":"Female","app_token":"36e88f9832df3c2c08d3a7076fcace9b866061cee38966535ba70ac803c9f68e","lat":"35.78333","long":"10.8","phone":"444-246-3976"},
        {"id":78,"name":"Mortie","email":"mmcilwrick25@nbcnews.com","gender":"Male","app_token":"24f1aa8d1417a0c57bb9e9311d939b98a57c759a1f65281b11f093a58d967764","lat":41.669412,"long":-87.915135,"phone":"920-543-6978"},
        {"id":79,"name":"Emilee","email":"eitscowicz26@un.org","gender":"Female","app_token":"f028840a73bc2fe435e06b6722fb4ada4e17c35dcbd606723ddb6be1743279f5","lat":41.674124,"long":-87.172529,"phone":"387-288-0482"},
        {"id":80,"name":"Farah","email":"fhowatt27@altervista.org","gender":"Female","app_token":"ac4a284980bc5461e4b59f56f77d4ff30cbf47181d5becfc36e3a081836791dd","lat":41.1109993,"long":-87.0789691,"phone":"930-671-9548"},
        {"id":81,"name":"Camile","email":"cclipson28@creativecommons.org","gender":"Female","app_token":"8eacbf7a57663dcd042954e66e29f1a96890b0b94c5dbaeae3b67032cada4bc2","lat":41.9339521,"long":-87.5404694,"phone":"452-548-0621"},
        {"id":82,"name":"Ingrim","email":"icushelly29@uiuc.edu","gender":"Male","app_token":"3d153e3c9a86b7455c278eebd0ee99cf33bd966872e082b9d7bd4377306b2b80","lat":41.0090686,"long":-87.5089907,"phone":"163-152-3394"},
        {"id":83,"name":"Zsa zsa","email":"zlaimable2a@mediafire.com","gender":"Female","app_token":"d8c54053965426f0bf11a293ff09994bde10298aaa9af2a4ce45ef7ab9f3f112","lat":41.4618994,"long":-9.1029917,"phone":"739-281-8259"},
        {"id":84,"name":"Geralda","email":"ggilbody2b@baidu.com","gender":"Female","app_token":"336169a197688a42bc6debd74b16303cae31b2bb0a3dad1b1254b508280ad589","lat":41.41667,"long":-87.13333,"phone":"414-669-2523"},
        {"id":85,"name":"Harold","email":"hkelleher2c@51.la","gender":"Male","app_token":"fb036ba65e6337e02e17cb61cd2d9f84aff0af39164d10640959559d43077c00","lat":41.8663135,"long":-87.2811579,"phone":"982-982-3053"},
        {"id":86,"name":"Brewer","email":"bshedden2d@unesco.org","gender":"Male","app_token":"c66865fc2baf23ad2e0b3606b871543c341388a52b96faba1cae493357e3bbf3","lat":41.0423558,"long":-87.6842658,"phone":"122-769-3160"},
        {"id":87,"name":"Patty","email":"pbehagg2e@altervista.org","gender":"Male","app_token":"f00e0ea8630dfa6cb462070750fb6932b02e82102c1da5b667cfab7f775e02b0","lat":41.6553932,"long":-87.1907723,"phone":"874-453-8530"},
        {"id":88,"name":"Vitoria","email":"vlemar2f@ustream.tv","gender":"Female","app_token":"42b2f430807a1673d9996ac827c7f83989db1dc1b2180acb5043350a8ba24aad","lat":41.2992508,"long":-87.0807417,"phone":"466-388-4998"},
        {"id":89,"name":"Tanner","email":"tcaillou2g@freewebs.com","gender":"Male","app_token":"2f769aa7d7b8175896a1495f572402983af29c7f88ef3cec3b9c1611863e4c7d","lat":41.8644157,"long":-87.4263048,"phone":"671-656-8408"},
        {"id":90,"name":"Ive","email":"ifollin2h@ihg.com","gender":"Male","app_token":"8f1920ab1ef3896346ca56b229ca22409069f37ac4b6ae9151f930f212f0544a","lat":41.613293,"long":-87.119491,"phone":"520-665-2448"},
        {"id":91,"name":"Bryna","email":"bleyrroyd2i@pcworld.com","gender":"Female","app_token":"26788e799505bd5230aeb25e54c329145f6031e3dbe3a2af7014cd9c4f5879fa","lat":41.638468,"long":0.129895,"phone":"514-633-6175"},
        {"id":92,"name":"Craggy","email":"cmillott2j@ameblo.jp","gender":"Male","app_token":"44c6d4f02f821cae6ba034547350bc55f8b328297aea7f8123c2061d1e7f0b93","lat":41.719806,"long":-87.257788,"phone":"257-845-9182"},
        {"id":93,"name":"Marnia","email":"mlanham2k@prlog.org","gender":"Female","app_token":"b43e07a4c8479da6c2eecb856d3071ced85e54f9d48c17b9d66c57b410ca1f34","lat":41.619032,"long":-87.627616,"phone":"378-412-9323"},
        {"id":94,"name":"Mariska","email":"mohlsen2l@irs.gov","gender":"Female","app_token":"99a2f79f2b19493f5f264a68bc49e8b907e4361cf3f3e4728fd088853e9a79fd","lat":41.5939732,"long":-87.0228043,"phone":"991-112-8271"},
        {"id":95,"name":"Falkner","email":"fagnolo2m@list-manage.com","gender":"Male","app_token":"4e0184fa20eb2910efcb0f7dd7df7b3a8fefe710ad55f4a79885ae18347f011b","lat":41.0993614,"long":-87.2778465,"phone":"972-681-6219"},
        {"id":96,"name":"Flossy","email":"fbroune2n@sourceforge.net","gender":"Female","app_token":"d5d51f155d221ddbc9156fa13327356ad86a1ee07895017af026810510db8872","lat":41.365556,"long":-87.70345,"phone":"302-516-5045"},
        {"id":97,"name":"Ethan","email":"ehindmore2o@last.fm","gender":"Male","app_token":"6b14318eadbf459288ec366dd917b594cdd2c904686463b73a3c03d0fd6b24ef","lat":41.0491557,"long":-87.2139413,"phone":"338-347-8481"},
        {"id":98,"name":"Cleveland","email":"cstaubyn2p@cpanel.net","gender":"Male","app_token":"720d7c4eb3d73a3ffb5a86ba8ac8da0ca5bea4c579d057cf843ca0efb8a21686","lat":41.5643857,"long":-87.1293312,"phone":"596-105-0090"},
        {"id":99,"name":"Thurston","email":"tfevers2q@elpais.com","gender":"Male","app_token":"179592c47d19799470d7fdc700ec2ddcd58168033f236123c89b14d44221ce7f","lat":41.8949753,"long":-87.1001629,"phone":"244-441-3228"},
        {"id":100,"name":"Carlina","email":"cschoroder2r@dailymail.co.uk","gender":"Female","app_token":"131b19d01564cd0b96432e10af3a150e9751223fccc64b4643272c44e164d2e5","lat":-11.434693,"long":-61.4566885,"phone":"563-185-0150"}
    ];
    
    volunteers.forEach(function(volunteer){
        var newLocation = {
            name: volunteer.name,
            type: {
                text: 'Volunteer'
            },
            position: {
                latitude: volunteer.lat,
                longitude: volunteer.long,
                altitude: 594,
            },
            location: {
                type: "Point",
                coordinates: [parseFloat(volunteer.long), parseFloat(volunteer.lat)]
            }
        }
        Locations.insert(newLocation);
    });
  },
            
  // These are Chicago area kits 
  initializeKits: function() {
    
        var kits = 
            [{"id":1,"first_name":"Adrea","last_name":"Shillom","kit_type":"Defibrillator","email":"ashillom0@blog.com","gender":"Female","phone":"589-703-6031"},
            {"id":2,"first_name":"Yale","last_name":"Doidge","kit_type":"First Aid","email":"ydoidge1@sbwire.com","gender":"Male","phone":"800-349-1749"},
            {"id":3,"first_name":"Kalie","last_name":"Thorndycraft","kit_type":"Defibrillator","email":"kthorndycraft2@sohu.com","gender":"Female","phone":"274-854-0253"},
            {"id":4,"first_name":"Clifford","last_name":"Pickwell","kit_type":"First Aid","email":"cpickwell3@meetup.com","gender":"Male","phone":"877-716-5188"},
            {"id":5,"first_name":"Faber","last_name":"Spaven","kit_type":"Defibrillator","email":"fspaven4@tuttocitta.it","gender":"Male","phone":"677-647-1147"},
            {"id":6,"first_name":"Konrad","last_name":"Stonhewer","kit_type":"First Aid","email":"kstonhewer5@yellowpages.com","gender":"Male","phone":"970-555-3402"},
            {"id":7,"first_name":"Elora","last_name":"Lillow","kit_type":"Defibrillator","email":"elillow6@scribd.com","gender":"Female","phone":"506-305-4795"},
            {"id":8,"first_name":"Viola","last_name":"Peirce","kit_type":"First Aid","email":"vpeirce7@omniture.com","gender":"Female","phone":"126-922-1025"},
            {"id":9,"first_name":"Augustine","last_name":"Massow","kit_type":"Defibrillator","email":"amassow8@reddit.com","gender":"Male","phone":"190-209-3547"},
            {"id":10,"first_name":"Blancha","last_name":"Stanyon","kit_type":"First Aid","email":"bstanyon9@opensource.org","gender":"Female","phone":"683-324-6116"},
            {"id":11,"first_name":"Kilian","last_name":"Rollings","kit_type":"Defibrillator","email":"krollingsa@altervista.org","gender":"Male","phone":"891-128-7737"},
            {"id":12,"first_name":"Eric","last_name":"Daouse","kit_type":"First Aid","email":"edaouseb@usgs.gov","gender":"Male","phone":"264-613-5962"},
            {"id":13,"first_name":"Meaghan","last_name":"Jeandel","kit_type":"Defibrillator","email":"mjeandelc@elpais.com","gender":"Female","phone":"265-321-0407"},
            {"id":14,"first_name":"Dare","last_name":"Goodbairn","kit_type":"First Aid","email":"dgoodbairnd@fc2.com","gender":"Male","phone":"926-592-3224"},
            {"id":15,"first_name":"Benson","last_name":"Lardner","kit_type":"Defibrillator","email":"blardnere@rambler.ru","gender":"Male","phone":"394-461-7596"},
            {"id":16,"first_name":"Siusan","last_name":"Corter","kit_type":"First Aid","email":"scorterf@blinklist.com","gender":"Female","phone":"458-594-0291"},
            {"id":17,"first_name":"Anthony","last_name":"Carnalan","kit_type":"Defibrillator","email":"acarnalang@seattletimes.com","gender":"Male","phone":"982-460-1531"},
            {"id":18,"first_name":"Cristionna","last_name":"Leythley","kit_type":"First Aid","email":"cleythleyh@scientificamerican.com","gender":"Female","phone":"591-579-9816"},
            {"id":19,"first_name":"Nanny","last_name":"Housin","kit_type":"Defibrillator","email":"nhousini@yolasite.com","gender":"Female","phone":"889-509-0427"},
            {"id":20,"first_name":"Townie","last_name":"Torbard","kit_type":"First Aid","email":"ttorbardj@eepurl.com","gender":"Male","phone":"293-340-6873"},
            {"id":21,"first_name":"Vita","last_name":"Folker","kit_type":"Defibrillator","email":"vfolkerk@blog.com","gender":"Female","phone":"330-294-8133"},
            {"id":22,"first_name":"Olivie","last_name":"Cafferty","kit_type":"First Aid","email":"ocaffertyl@imageshack.us","gender":"Female","phone":"913-480-3856"},
            {"id":23,"first_name":"Poul","last_name":"Warn","kit_type":"Defibrillator","email":"pwarnm@shop-pro.jp","gender":"Male","phone":"848-704-4706"},
            {"id":24,"first_name":"Riccardo","last_name":"Stubbington","kit_type":"First Aid","email":"rstubbingtonn@java.com","gender":"Male","phone":"872-737-6196"},
            {"id":25,"first_name":"Mano","last_name":"Parman","kit_type":"Defibrillator","email":"mparmano@icq.com","gender":"Male","phone":"436-692-8215"},
            {"id":26,"first_name":"Nap","last_name":"Evill","kit_type":"First Aid","email":"nevillp@state.tx.us","gender":"Male","phone":"122-520-1859"},
            {"id":27,"first_name":"Kalvin","last_name":"Bresson","kit_type":"Defibrillator","email":"kbressonq@youtube.com","gender":"Male","phone":"142-953-4639"},
            {"id":28,"first_name":"Rena","last_name":"Pee","kit_type":"First Aid","email":"rpeer@com.com","gender":"Female","phone":"245-904-3973"},
            {"id":29,"first_name":"Currey","last_name":"Boumphrey","kit_type":"Defibrillator","email":"cboumphreys@bloglovin.com","gender":"Male","phone":"953-429-3710"},
            {"id":30,"first_name":"Jacky","last_name":"Pettican","kit_type":"First Aid","email":"jpetticant@google.com.br","gender":"Female","phone":"208-771-0762"},
            {"id":31,"first_name":"Joyann","last_name":"Warin","kit_type":"Defibrillator","email":"jwarinu@usgs.gov","gender":"Female","phone":"191-461-4776"},
            {"id":32,"first_name":"Jesus","last_name":"Allen","kit_type":"First Aid","email":"jallenv@tumblr.com","gender":"Male","phone":"460-686-2459"},
            {"id":33,"first_name":"Dom","last_name":"Haynes","kit_type":"Defibrillator","email":"dhaynesw@reverbnation.com","gender":"Male","phone":"876-135-2316"},
            {"id":34,"first_name":"Codie","last_name":"Burchatt","kit_type":"First Aid","email":"cburchattx@cyberchimps.com","gender":"Female","phone":"323-109-9179"},
            {"id":35,"first_name":"Deck","last_name":"Dilkes","kit_type":"Defibrillator","email":"ddilkesy@paypal.com","gender":"Male","phone":"484-879-7276"},
            {"id":36,"first_name":"Parrnell","last_name":"Deelay","kit_type":"First Aid","email":"pdeelayz@arstechnica.com","gender":"Male","phone":"542-705-1411"},
            {"id":37,"first_name":"Katlin","last_name":"Barkworth","kit_type":"Defibrillator","email":"kbarkworth10@eventbrite.com","gender":"Female","phone":"696-772-8371"},
            {"id":38,"first_name":"Leonid","last_name":"Lody","kit_type":"First Aid","email":"llody11@ezinearticles.com","gender":"Male","phone":"447-311-1724"},
            {"id":39,"first_name":"Dugald","last_name":"Iveagh","kit_type":"Defibrillator","email":"diveagh12@noaa.gov","gender":"Male","phone":"592-544-7053"},
            {"id":40,"first_name":"Barnie","last_name":"Akam","kit_type":"First Aid","email":"bakam13@dropbox.com","gender":"Male","phone":"136-975-9030"},
            {"id":41,"first_name":"Dagny","last_name":"Powling","kit_type":"Defibrillator","email":"dpowling14@linkedin.com","gender":"Male","phone":"505-455-5740"},
            {"id":42,"first_name":"Bonny","last_name":"Lodden","kit_type":"First Aid","email":"blodden15@foxnews.com","gender":"Female","phone":"411-299-5700"},
            {"id":43,"first_name":"Howie","last_name":"Souttar","kit_type":"Defibrillator","email":"hsouttar16@linkedin.com","gender":"Male","phone":"479-612-4489"},
            {"id":44,"first_name":"Haroun","last_name":"Penwarden","kit_type":"First Aid","email":"hpenwarden17@hhs.gov","gender":"Male","phone":"935-744-0364"},
            {"id":45,"first_name":"Aldin","last_name":"Dedrick","kit_type":"Defibrillator","email":"adedrick18@cyberchimps.com","gender":"Male","phone":"514-482-8525"},
            {"id":46,"first_name":"Netta","last_name":"Hazeldean","kit_type":"First Aid","email":"nhazeldean19@sbwire.com","gender":"Female","phone":"509-525-1694"},
            {"id":47,"first_name":"Matthus","last_name":"Feldhuhn","kit_type":"Defibrillator","email":"mfeldhuhn1a@nbcnews.com","gender":"Male","phone":"699-452-3157"},
            {"id":48,"first_name":"Vinny","last_name":"Pickervance","kit_type":"First Aid","email":"vpickervance1b@infoseek.co.jp","gender":"Male","phone":"986-242-6716"},
            {"id":49,"first_name":"Kath","last_name":"Vaszoly","kit_type":"Defibrillator","email":"kvaszoly1c@nba.com","gender":"Female","phone":"157-553-7273"},
            {"id":50,"first_name":"Elisha","last_name":"Di Bernardo","kit_type":"First Aid","email":"edibernardo1d@alibaba.com","gender":"Female","phone":"930-831-0750"},
            {"id":51,"first_name":"Jesse","last_name":"Mousby","kit_type":"Defibrillator","email":"jmousby1e@dmoz.org","gender":"Male","phone":"465-662-9240"},
            {"id":52,"first_name":"Huntlee","last_name":"Cockley","kit_type":"First Aid","email":"hcockley1f@webnode.com","gender":"Male","phone":"132-814-3950"},
            {"id":53,"first_name":"Cathleen","last_name":"Highnam","kit_type":"Defibrillator","email":"chighnam1g@adobe.com","gender":"Female","phone":"735-427-5748"},
            {"id":54,"first_name":"Binny","last_name":"Salt","kit_type":"First Aid","email":"bsalt1h@about.me","gender":"Female","phone":"714-791-6084"},
            {"id":55,"first_name":"Barr","last_name":"Maestro","kit_type":"Defibrillator","email":"bmaestro1i@com.com","gender":"Male","phone":"284-551-2378"},
            {"id":56,"first_name":"Hertha","last_name":"Brehault","kit_type":"First Aid","email":"hbrehault1j@newsvine.com","gender":"Female","phone":"893-601-7348"},
            {"id":57,"first_name":"Andre","last_name":"O'Farrell","kit_type":"Defibrillator","email":"aofarrell1k@hud.gov","gender":"Male","phone":"742-633-5636"},
            {"id":58,"first_name":"Mechelle","last_name":"Bruni","kit_type":"First Aid","email":"mbruni1l@netvibes.com","gender":"Female","phone":"583-696-6375"},
            {"id":59,"first_name":"Tamra","last_name":"Searsby","kit_type":"Defibrillator","email":"tsearsby1m@ocn.ne.jp","gender":"Female","phone":"925-215-5786"},
            {"id":60,"first_name":"Gert","last_name":"Slowcock","kit_type":"First Aid","email":"gslowcock1n@blog.com","gender":"Female","phone":"509-222-7917"},
            {"id":61,"first_name":"Gracia","last_name":"Olive","kit_type":"Defibrillator","email":"golive1o@unesco.org","gender":"Female","phone":"257-314-4368"},
            {"id":62,"first_name":"Livvie","last_name":"Poxon","kit_type":"First Aid","email":"lpoxon1p@privacy.gov.au","gender":"Female","phone":"495-888-2064"},
            {"id":63,"first_name":"Woodie","last_name":"Degoey","kit_type":"Defibrillator","email":"wdegoey1q@clickbank.net","gender":"Male","phone":"699-743-9638"},
            {"id":64,"first_name":"Jillene","last_name":"Coorington","kit_type":"First Aid","email":"jcoorington1r@wp.com","gender":"Female","phone":"468-963-9359"},
            {"id":65,"first_name":"Roderigo","last_name":"Treuge","kit_type":"Defibrillator","email":"rtreuge1s@unblog.fr","gender":"Male","phone":"168-171-0002"},
            {"id":66,"first_name":"Faye","last_name":"Dackombe","kit_type":"First Aid","email":"fdackombe1t@statcounter.com","gender":"Female","phone":"842-946-8113"},
            {"id":67,"first_name":"Clayborne","last_name":"Haskey","kit_type":"Defibrillator","email":"chaskey1u@cpanel.net","gender":"Male","phone":"385-403-3466"},
            {"id":68,"first_name":"Alexina","last_name":"Foddy","kit_type":"First Aid","email":"afoddy1v@multiply.com","gender":"Female","phone":"262-850-3713"},
            {"id":69,"first_name":"Tim","last_name":"Freddi","kit_type":"Defibrillator","email":"tfreddi1w@jiathis.com","gender":"Male","phone":"684-234-4120"},
            {"id":70,"first_name":"Pebrook","last_name":"Cloney","kit_type":"First Aid","email":"pcloney1x@gnu.org","gender":"Male","phone":"208-723-2313"},
            {"id":71,"first_name":"Johanna","last_name":"Crolla","kit_type":"Defibrillator","email":"jcrolla1y@drupal.org","gender":"Female","phone":"144-447-9344"},
            {"id":72,"first_name":"Sonny","last_name":"St Clair","kit_type":"First Aid","email":"sstclair1z@plala.or.jp","gender":"Male","phone":"224-395-1165"},
            {"id":73,"first_name":"Lexy","last_name":"Thormann","kit_type":"Defibrillator","email":"lthormann20@yelp.com","gender":"Female","phone":"781-108-7841"},
            {"id":74,"first_name":"Carlin","last_name":"Farish","kit_type":"First Aid","email":"cfarish21@webmd.com","gender":"Male","phone":"256-560-1448"},
            {"id":75,"first_name":"Talia","last_name":"Laundon","kit_type":"Defibrillator","email":"tlaundon22@guardian.co.uk","gender":"Female","phone":"341-906-4638"},
            {"id":76,"first_name":"Viva","last_name":"Benda","kit_type":"First Aid","email":"vbenda23@i2i.jp","gender":"Female","phone":"586-111-4527"},
            {"id":77,"first_name":"Lulita","last_name":"Gilford","kit_type":"Defibrillator","email":"lgilford24@timesonline.co.uk","gender":"Female","phone":"469-628-0947"},
            {"id":78,"first_name":"Vincents","last_name":"Dannett","kit_type":"First Aid","email":"vdannett25@unicef.org","gender":"Male","phone":"296-376-3473"},
            {"id":79,"first_name":"Royal","last_name":"Knuckles","kit_type":"Defibrillator","email":"rknuckles26@issuu.com","gender":"Male","phone":"489-911-2948"},
            {"id":80,"first_name":"Haslett","last_name":"Deaconson","kit_type":"First Aid","email":"hdeaconson27@netlog.com","gender":"Male","phone":"217-434-1780"},
            {"id":81,"first_name":"Lazarus","last_name":"Delf","kit_type":"Defibrillator","email":"ldelf28@spotify.com","gender":"Male","phone":"629-804-2020"},
            {"id":82,"first_name":"Beryle","last_name":"Daye","kit_type":"First Aid","email":"bdaye29@oakley.com","gender":"Female","phone":"321-857-7447"},
            {"id":83,"first_name":"Davidde","last_name":"Osborn","kit_type":"Defibrillator","email":"dosborn2a@chron.com","gender":"Male","phone":"256-623-5865"},
            {"id":84,"first_name":"Chico","last_name":"Jeskins","kit_type":"First Aid","email":"cjeskins2b@t-online.de","gender":"Male","phone":"372-971-1649"},
            {"id":85,"first_name":"Marybelle","last_name":"Shardlow","kit_type":"Defibrillator","email":"mshardlow2c@feedburner.com","gender":"Female","phone":"127-393-1094"},
            {"id":86,"first_name":"Robers","last_name":"Swinden","kit_type":"First Aid","email":"rswinden2d@ted.com","gender":"Male","phone":"194-915-3777"},
            {"id":87,"first_name":"Sandye","last_name":"Normand","kit_type":"Defibrillator","email":"snormand2e@archive.org","gender":"Female","phone":"225-723-1698"},
            {"id":88,"first_name":"Birgitta","last_name":"Mighele","kit_type":"First Aid","email":"bmighele2f@toplist.cz","gender":"Female","phone":"467-828-9931"},
            {"id":89,"first_name":"Tersina","last_name":"Tinman","kit_type":"Defibrillator","email":"ttinman2g@xrea.com","gender":"Female","phone":"626-595-4471"},
            {"id":90,"first_name":"Evvie","last_name":"Bullas","kit_type":"First Aid","email":"ebullas2h@patch.com","gender":"Female","phone":"501-916-2504"},
            {"id":91,"first_name":"Ches","last_name":"Seefus","kit_type":"Defibrillator","email":"cseefus2i@rambler.ru","gender":"Male","phone":"740-366-0346"},
            {"id":92,"first_name":"Berta","last_name":"Domino","kit_type":"First Aid","email":"bdomino2j@omniture.com","gender":"Female","phone":"318-670-3174"},
            {"id":93,"first_name":"Timothy","last_name":"Jarrold","kit_type":"Defibrillator","email":"tjarrold2k@vkontakte.ru","gender":"Male","phone":"261-926-0763"},
            {"id":94,"first_name":"Gene","last_name":"Mulvaney","kit_type":"First Aid","email":"gmulvaney2l@alibaba.com","gender":"Female","phone":"346-520-3715"},
            {"id":95,"first_name":"Gearalt","last_name":"Hugo","kit_type":"Defibrillator","email":"ghugo2m@last.fm","gender":"Male","phone":"507-394-4592"},
            {"id":96,"first_name":"Leeanne","last_name":"Dachey","kit_type":"First Aid","email":"ldachey2n@yelp.com","gender":"Female","phone":"455-383-2416"},
            {"id":97,"first_name":"Lillian","last_name":"Benezeit","kit_type":"Defibrillator","email":"lbenezeit2o@usgs.gov","gender":"Female","phone":"822-220-4007"},
            {"id":98,"first_name":"Danyette","last_name":"Keighly","kit_type":"First Aid","email":"dkeighly2p@360.cn","gender":"Female","phone":"223-459-7777"},
            {"id":99,"first_name":"Tades","last_name":"Sibary","kit_type":"Defibrillator","email":"tsibary2q@sciencedirect.com","gender":"Male","phone":"185-575-3331"},
            {"id":100,"first_name":"Caren","last_name":"Hastler","kit_type":"First Aid","email":"chastler2r@constantcontact.com","gender":"Female","phone":"741-158-8074"}
        ];
        
        kits.forEach(function(kit){
            if(!Locations.findOne({name: kit.name})){
            var newLocation = {
                name: kit.name,
                type: {
                text: 'MedicationKit'
                },
                position: {
                    latitude: kit.lat,
                    longitude: kit.long,
                    altitude: 594,
                },
                location: {
                    type: "Point",
                    coordinates: [kit.long, kit.lat]
                }
            }
            Locations.insert(newLocation);
            }
        });
    },

    findLocationsNearMe: function(maxDistanceMeters){        
        check(maxDistanceMeters, String);

        if(typeof maxDistanceMeters === "string"){
            maxDistanceMeters = parseFloat(maxDistanceMeters);
        }        
        if(!maxDistanceMeters){
            maxDistanceMeters = 5000;
        }


        console.log('findLocationsNearMe()', maxDistanceMeters);


        process.env.DEBUG && console.log('this.userId', this.userId)

        var user = Meteor.users.findOne({_id: this.userId});

        process.env.DEBUG && console.log('user', user);

        var centroid = get(user, 'profile.locations.home');

        process.env.DEBUG && console.log('centroid', centroid);

        var coordinatesArray = [centroid.position.longitude, centroid.position.latitude];

        console.log('coordinatesArray', coordinatesArray)

        var locations = Locations.find({
            location:
            { $near :
                {
                    $geometry: { type: "Point",  coordinates: coordinatesArray },
                    $minDistance: 1000,
                    $maxDistance: maxDistanceMeters
                }
            }
        }).fetch();

        process.env.DEBUG && console.log('locations', locations)
        console.log(locations.length + ' locations found within ' + maxDistanceMeters + ' meters.')

        return locations;
    }       
});


