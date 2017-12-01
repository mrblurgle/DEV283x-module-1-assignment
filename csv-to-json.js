// Written by Aaron Newton on 2017-12-01.
// [Usage]:
// node csv-to-json.js [csvFilePath] [jsonFilePath]
////////////////////////////////////////////////////////////////////////////////
//
// [1. Design Notes]:
// The csvtojson documentation explained how complete 90% of this task:
// https://www.npmjs.com/package/csvtojson#from-csv-file
// Because this was so similar to what was needed, I decided not to reinvent
// the wheel.
// I used the built-in csvtojson to get the CSV rows, convert the data to an
// object and append this object to the 'output' array.
// The output array is then written to the jsonFilePath using the 'fs' module,
// while the path for the file was constructed using the `path` module,
// both of which we learned about in the tutorials. I also used the
// JSON.stringify(...), which I was already familiar with from my day job as a
// web developer.
// My design process was to write out the entire program using what we've
// learned so far an trial and error. I initially confused myself by leaving
// out the path module, however the REPL gave me the feedback I needed to
// address this.
//
////////////////////////////////////////////////////////////////////////////////
//
// [2. Testing and verification]:
// The program depends on csvtojson module which can be install with:
//
// npm i --save csvtojson
//
// However, I have included the module in the source.
//
// I used the following command to test this program:
//
// node csv-to-json.js
//
// This provided the following console log, which provides feedback to the user:
//
// Converting: customer-data.csv into customer-data.json
// Done!
//
// I was able to find the customer-data.json file in the same directory. I found
// 12,002 lines, which corresponds to 12 lines per CSV row plus the array start
// and end lines "[ ... ]". The last object has the id 1000, which I'm assuming
// was the expected outcome.
//
////////////////////////////////////////////////////////////////////////////////
//
// [3. Known issues]:
// There are no issues of note. I wanted to enhance the program, so I allowed
// the input CSV and output JSON file paths to be provided as arguments. You can
// try this like so:
//
// node csv-to-json.js customer-data-custom-path.csv customer-data-custom-path.json
// Converting: customer-data-custom-path.csv into customer-data-custom-path.json
// Done!
//
// One consequence is that the user could enter a path for a non-existent file
// like so:
//
// node csv-to-json.js doesnt-exist.csv wont-be-written.json
// Converting: doesnt-exist.csv into wont-be-written.json
// Got error: File not exists
// Error: File not exists
//    at Converter.<anonymous> (I:\<PATH-OMITTED>\Converter.js:513:26)
//    at FSReqWrap.cb [as oncomplete] (fs.js:312:19)
//
// However, as you can this is great for testing the error handling, i.e.
// "Got error: File not exists".
// One improvement I can think of is to allow the input and output paths to be
// in a different directory to the program, however I will leave that for
// another day. This is my first ever Node program, and I'm very happy with it.
//
////////////////////////////////////////////////////////////////////////////////

const fs = require('fs');
const path = require('path');
const csvToJson = require('csvtojson');

const convertCsvToJson = (
  csvFilePath = 'customer-data.csv',
  jsonFilePath = 'customer-data.json'
) => {
    console.log('Converting:', csvFilePath, 'into', jsonFilePath);
    let output = [];

    // We need to contruct the full path to read the CSV successfully.
    const fullCsvPath = path.join(__dirname, csvFilePath);

    // Initialise the csvToJson module instance.
    csvToJson()
      .fromFile(fullCsvPath) // Read the csvFile.
      .on('json', (jsonObj) => {
          // Each line in the CSV file is available as JSON as jsonObj, so
          // just push this straight on to the output array.
          output.push(jsonObj);
      })
      .on('done', (error) => {
          // Either there was an error, return that (early exit).
          if (error) return console.error(error);
          // ...or the program succeeded, so we write the file using fs.
          // Here the stringify method of the JSON module is used to convert
          // the JSON object into a file-write friendly string. I already
          // knew about the JSON module because I work as a web developer :)
          fs.writeFileSync(
            path.join(__dirname, jsonFilePath),
            // Note: the third paramater '2' is the number of spaces for the
            // JSON pretty print.
            JSON.stringify(output, null, 2));
          // Print 'Done!' to the console so that the user knows what's
          // going on.
          console.log('Done!');
      })
      .on('error', (error) => {
        // Handle generic errors as we did for the HTTP client / server.
        // I'm not 100% sure this was necessary, but at worst it's extraneous.
        // Please let me know if you think this was necessary in your comments.
        return console.error(`Got error: ${error.message}`);
      });
};

// Get the CSV file path from the command line - if empty
// default to 'customer-data.csv'.
// The second argument is the JSON file path to output to, which
// defaults to 'customer-data.json'.
convertCsvToJson(process.argv[2], process.argv[3]);
