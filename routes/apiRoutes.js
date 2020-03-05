const axios = require('axios');
const data = require('../public/assets/data.js').data;
const ObjectsToCsv = require('objects-to-csv');

const URLOne = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=';
const URLTwo =
  '&inputtype=textquery&fields=place_id,photos,formatted_address,name,rating,opening_hours,geometry&key=';
const Api_key = process.env.API_KEY;

module.exports = function(app) {
  getLibrariesMainInfo();
};

const getLibrariesMainInfo = function() {
  // promise.all in order to be able to map over all elements in the data array
  Promise.all(
    data.map(library => {
      const googleEndpoint = `${URLOne}${library}${URLTwo}${process.env.API_KEY}`;
      return axios(googleEndpoint).then(data => data.data.candidates);
    })

    // once the promise is done get the returned object, flatten it (contains arrays within arrays)
    // and pass it to the getSecondaryInfo function
  ).then(libraryObj => getSecondaryInfo(libraryObj.flat()));
};

const getSecondaryInfo = branches => {
  const urlFirst = 'https://maps.googleapis.com/maps/api/place/details/json?place_id=';
  const urlSecond = '&fields=name,rating,formatted_phone_number,website,url&key=';

  // promise.all in order to be able to map over all elements in the data array
  Promise.all(
    branches.map(branch => {
      return axios(`${urlFirst}${branch.place_id}${urlSecond}${Api_key}`).then(info => {
        let libraryInformation = {
          name: branch.name,
          address: branch.formatted_address,
          phone: info.data.result.formatted_phone_number,
          website: info.data.result.website,
          GoogleMaps: info.data.result.url,
          postalCode: getPostal(branch.formatted_address),
        };
        return libraryInformation;
      });
    })
  ).then(fullInformation => writeToCSV(fullInformation));
};

const getPostal = address => {
  const postalCodeAndProvince = address.match(/ON .{3}\s.{3}/);
  const postalCode =
    (postalCodeAndProvince && postalCodeAndProvince[0].replace(/ON/, '')) || 'N/A';

  //TODO:improve slice in order to get rid of the blank space at the beginning
  return postalCode.slice(1);
};

const writeToCSV = arr => {
  const target = './list.csv';
  const csv = new ObjectsToCsv(arr);
  csv.toDisk(target, {append: false});
  console.log(`Done writting ✍️  to '${target}'`);
};
