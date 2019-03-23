// const  request = require('request-promise');
// const cheerio = require('cheerio');
// // var express = require("express");


// (async() => {

//   await request('https://www.ksl.com/')
//   .then((res) => {

//     let $ = cheerio.load(res);
//     let records = [];

//     $("div[class='queue_story']").each((i, item) => {
//         let title = $(item).find("div").find("h2").text();
//         let summary = $(item).find("div").find("h5").text();
//         let URL = $(item).find("div").find("a").attr("href");

//         var record = {
//             title,
//             summary,
//             URL: URL
//         }
//         records.push(record)
//     })
//     console.log('test', records);
//   })

})()
