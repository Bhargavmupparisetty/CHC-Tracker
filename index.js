var express = require("express")
var bodyparser = require("body-parser")
var mongoose = require("mongoose")
const MongoClient = require('mongodb').MongoClient;
const app = express()

app.use(bodyparser.json())
app.use(express.static("public"))
app.use(bodyparser.urlencoded({
    extended: true }))

app.set('view engine', 'ejs');
app.set(__dirname + '/public/receipt.html'); 

mongoose.connect('mongodb://0.0.0.0:27017/Epics');

var db = mongoose.connection;

db.once("open",()=>console.log("Connected to Database"))


  app.post('/application', (req, res) => {
    var farmerName = req.body.farmerName;
    var fatherName = req.body.fatherName;
    var phoneNumber = req.body.phoneNumber;
    var address = req.body.address;
    var aadharNumber = req.body.aadharNumber;
    var rbkid = req.body.rbkid;
    var supplement = req.body.supplement;
    var sdate = req.body.sdate;
    var rdate = req.body.rdate;
    const aadharDigits = aadharNumber.substring(0, 4);
    const phoneDigits = phoneNumber.substring(0, 4);
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    var applicationid = aadharDigits + phoneDigits + randomDigits;
    var auth = Math.floor(1000 + Math.random() * 9000);
    console.log("auth created...");

    // Saving the data to the database
    const data = {
        farmerName,
        fatherName,
        phoneNumber,
        address,
        aadharNumber,
        rbkid,
        supplement,
        sdate,
        rdate,
        applicationid,
        auth
    };

    db.collection("applications").insertOne(data, (err, collection) => {
        if (err) {
            throw err;
        }
        console.log("Record inserted");

        // Redirecting to the receipt endpoint with an identifier (applicationId)
        res.redirect(`/receipt?id=${data.applicationid}`);
    });
});











// Endpoint to handle fetching data for the receipt page
 app.get('/receipt', (req, res) => {
    const applicationId = req.query.id;

    if (applicationId) {
        // Fetch corresponding data based on the applicationId from the database
        // Use the fetched data to prepare the receipt
        db.collection("applications").findOne({ applicationid: applicationId }, (err, applicationData) => {
            if (err || !applicationData) {
                res.status(404).send('Application data not found');
            } else {
                // Prepare the receipt HTML content with the applicationData
                const receiptHTML = `<!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <title>Receipt - CHCTracker</title>
                  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js"></script>
                  <script src="https://cdn.tailwindcss.com"></script>
                
                  <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                        text-align: center;
                      }
                      
                      .receipt {
                        width: 80%;
                        margin: 0 auto;
                      }
                      
                      h1 {
                        margin-bottom: 20px;
                      }
                      
                      
                      button {
                        padding: 10px 20px;
                        background-color: #4CAF50;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                      }
                
                      body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        height: 100%;
                      }
                      
                      
                    body, html {
                        height: 100%;
                      }
                      
                      .full-height {
                        height: 100vh;
                      }
                      
                      .form-box {
                        background-color: rgb(249, 249, 249);
                        padding: 30px;
                        border-radius: 8px;
                        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
                      }
                    
                      .form-box:hover {
                        background-color:rgb(249, 249, 249);
                        padding: 30px;
                        border-radius: 8px;
                        box-shadow: 2px 2px rgba(0, 0, 0, 0.1);
                      }
                      
                      .form-group {
                        margin-bottom: 20px;
                      }
                
                      header{
                        padding:8px;
                        background-color: rgb(83, 113, 136); 
                        height:60px;
                        font-size:40px;
                        text-align: center;
                        color:white;
                        font-family: Impact;
                        box-shadow: 1px 1px 2px grey;
                        
                    }
                    
                    @media screen and (max-width: 800px) { 
                        h5 {font-size: 30px; } }
                    
                    
                    footer{
                        padding:8px;
                        background-color: rgb(83, 113, 136); 
                        height:50px;
                        font-size:18px;
                        text-align: center;
                        color:white;
                        font-family: Georgia;
                        bottom:0;
                        box-shadow: 1px 1px 2px grey;
                    }
                    
                      
                      /* Form Input Fields Styles */
                    .form-control {
                        border-radius: 0;
                        width:100%;
                    
                      }
                      
                      .form-control:focus {
                        outline: none;
                        box-shadow: 2px 2px;
                        border-color: #007bff; /* Change the color on focus if desired */
                      }
                      
                      /* Hover Effects for Form Fields */
                    .form-control:hover {
                        border-color: #007bff; 
                        box-shadow: 1px 1px;
                        
                      }
                      
                      /* Hover Effect for Submit Button */
                      .btn:hover {
                        opacity: 0.8;
                        border-color: #585e65; 
                        box-shadow: 2px 2px; /* Reduce opacity on hover if desired */
                      }
                      
                    h2, h5 {
                        margin: 10px 20px;
                    }
                    p{
                      margin-left:50px;
                      margin-right:50px;
                      margin-top:10px;
                     }
                     .topnav {
                       overflow: hidden;
                      background-color:rgb(53, 189, 234);
                      color:white;
                      box-shadow: 1px 1px 2px grey;
                  } 
                
                
                  .topnav a { 
                      float: left; 
                      display: block; 
                      color: #f2f2f2; 
                      text-align: center; 
                      padding: 10px 12px;
                      text-decoration: none;
                  } 
                
                      
                  .topnav a:hover { 
                      background:rgb(240, 19, 86); 
                      color:whitesmoke; 
                  }
                
                  table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                  }
                  
                  th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                  }
                  
                  th {
                    background-color: #f2f2f2;
                  }
                  </style>
    
                </head>
                
                
                <body>
                     <!-- NavBar -->
                     <div class="nav flex flex-col py-4 bg-blue-200">
                      <div class="md:px-12 px-8 flex justify-between items-center gap-4">
                          <div>
                              <a class="font-semibold text-lg" href="#">CHC Tracker</a>
                          </div>
                          <svg id="hamb" class="lg:hidden w-6 h-6  cursor-pointer mr-1 ease-in duration-150 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                              <path fill-rule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
                          </svg>
                          <svg class="lg:hidden w-6 h-6 hidden stroke-slate-900 cursor-pointer ease-in duration-150" id="cross" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <div class="profile lg:flex hidden justify-between items-center gap-x-2">
                              <div class="flex items-center">
                                  <a href="#" class="px-4 py-2 font-semibold text-lg hover:underline underline-offset-2">Receipt</a>
                              </div>
                          </div>
                  </div>
                
                
                
                      <!-- small screen menu -->
                      <div class="menu hidden" id="menu">
                          <div class="bg-slate-100 flex flex-col text-slate-900 p-2">
                              <div class="profile flex justify-between items-center mx-2 gap-x-2 py-2 px-2">
                                  <a href="#" class="px-4 py-2 font-semibold text-lg hover:underline underline-offset-2">Receipt</a>
                              </div>
                              
                          </div>
                      </div>
                  </div>
                  <div class="topnav">
                      <a href="Application.html">home</a>
                </div>
                  <br><br><br><br>
                  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js"></script>
                
                
                
                  <!-- receipt -->
                  <div class="receipt">
                    <h1>Receipt</h1>
                    <div class="order-details">
                      <p><strong>Application ID : </strong>${applicationData.applicationid}</p>
                      <p id="p1"><strong>Date:</strong></p><script>
                        var date = new Date();
                        document.getElementById("p1").innerHTML = date;
                    </script>
                      <!-- Add other necessary details here -->
                    </div>
                    <br>

                    <table>
                    <tr>
                    <th>Field</th>
                    <th>Value</th>
                    </tr>
                    <tr>
                    <td>Farmer name</td>
                    <td>${applicationData.farmerName}</td>
                    </tr>
                    <tr>
                    <td>father name</td>
                    <td>${applicationData.fatherName}</td>
                    </tr>
                    <tr>
                    <td>Phone number</td>
                    <td>${applicationData.phoneNumber}</td>
                    </tr>
                    <tr>
                    <td>Address</td>
                    <td>${applicationData.address}</td>
                    </tr>
                    <tr>
                    <td>RBK id</td>
                    <td>${applicationData.rbkid}</td>
                    </tr>
                    <tr>
                    <td>Supplement</td>
                    <td>${applicationData.supplement}</td>
                    </tr>
                    <tr>
                    <td>Start date</td>
                    <td>${applicationData.sdate}</td>
                    </tr>
                    <tr>
                    <td>Return date</td>
                    <td>${applicationData.rdate}</td>
                    </tr>
                    </table>
                
                    <br><br>
                    <canvas id="qrCodeCanvas"></canvas>
                    <script>
                  const qrCanvas = document.getElementById('qrCodeCanvas');
        
                  new QRious({
                      element: qrCanvas,
                      value: '${applicationData.auth}',
                      size: 120 
                  });
  
                  </script>
                  </div>
                  
    
                  <button class=" w-20 px-2 py-3 bg-slate-900 hover:shadow-sm hover:shadow-slate-700 transition-all duration-150 ease-in-out rounded-lg text-white" type="submit" onclick="printReceipt()">Receipt</button>
                </div>
                <br>
                <script>
                  function printReceipt() {
                    window.print();
                  }
                </script>
                <br> <br>
                <footer>@CHC Tracker</footer>
                </body>
                </html>
                `;

                // Send the receipt HTML content as a file
                res.setHeader('Content-Type', 'text/html');
                res.status(200).send(receiptHTML);
            }
        });
    } else {
        res.status(400).send('Invalid request');
    }
});



//Farmer signup

app.post('/fsignup', (req, res) => {
  var farmerName = req.body.farmerName;
  var fatherName = req.body.fatherName;
  var phoneNumber = req.body.phoneNumber;
  var address = req.body.address;
  var aadharNumber = req.body.aadharNumber;
  var rbkid = req.body.rbkid;
  const state = rbkid.substring(0,2);
  const aadharDigits = aadharNumber.substring(0, 4);
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  var farmerid =  state + aadharDigits + randomDigits;
  console.log("Farmer id created..");
  
  // Saving the data to the database
  const data = {
      farmerName,
      fatherName,
      phoneNumber,
      address,
      aadharNumber,
      rbkid,
      farmerid,
  };

  db.collection("farmers").insertOne(data, (err, collection) => {
      if (err) {
          throw err;
      }
      console.log(" Farmer Record inserted");

      res.redirect(`/receipt1?id=${data.farmerid}`);
  });
});



// Endpoint to handle fetching data for the receipt page
app.get('/receipt1', (req, res) => {
  const farmerid = req.query.id;

  if (farmerid) {
      db.collection("farmers").findOne({ farmerid: farmerid }, (err, farmerData) => {
          if (err || !farmerData) {
              res.status(404).send('Farmer data not found');
          } else {
              // Prepare the receipt HTML content with the applicationData
              const receiptHTML = `<!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <title>Farmer transcript - CHCTracker</title>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js"></script>
                <script src="https://cdn.tailwindcss.com"></script>
              
                <style>
                  body {
                      font-family: Arial, sans-serif;
                      margin: 0;
                      padding: 20px;
                      text-align: center;
                    }
                    
                    .receipt {
                      width: 80%;
                      margin: 0 auto;
                    }
                    
                    h1 {
                      margin-bottom: 20px;
                    }
                    
                    
                    button {
                      padding: 10px 20px;
                      background-color: #4CAF50;
                      color: white;
                      border: none;
                      border-radius: 4px;
                      cursor: pointer;
                    }
              
                    body {
                      font-family: Arial, sans-serif;
                      margin: 0;
                      padding: 0;
                      height: 100%;
                    }
                    
                    
                  body, html {
                      height: 100%;
                    }
                    
                    .full-height {
                      height: 100vh;
                    }
                    
                    .form-box {
                      background-color: rgb(249, 249, 249);
                      padding: 30px;
                      border-radius: 8px;
                      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
                    }
                  
                    .form-box:hover {
                      background-color:rgb(249, 249, 249);
                      padding: 30px;
                      border-radius: 8px;
                      box-shadow: 2px 2px rgba(0, 0, 0, 0.1);
                    }
                    
                    .form-group {
                      margin-bottom: 20px;
                    }
              
                    header{
                      padding:8px;
                      background-color: rgb(83, 113, 136); 
                      height:60px;
                      font-size:40px;
                      text-align: center;
                      color:white;
                      font-family: Impact;
                      box-shadow: 1px 1px 2px grey;
                      
                  }
                  
                  @media screen and (max-width: 800px) { 
                      h5 {font-size: 30px; } }
                  
                  
                  footer{
                      padding:8px;
                      background-color: rgb(83, 113, 136); 
                      height:50px;
                      font-size:18px;
                      text-align: center;
                      color:white;
                      font-family: Georgia;
                      bottom:0;
                      box-shadow: 1px 1px 2px grey;
                  }
                  
                    
                    /* Form Input Fields Styles */
                  .form-control {
                      border-radius: 0;
                      width:100%;
                  
                    }
                    
                    .form-control:focus {
                      outline: none;
                      box-shadow: 2px 2px;
                      border-color: #007bff; /* Change the color on focus if desired */
                    }
                    
                    /* Hover Effects for Form Fields */
                  .form-control:hover {
                      border-color: #007bff; 
                      box-shadow: 1px 1px;
                      
                    }
                    
                    /* Hover Effect for Submit Button */
                    .btn:hover {
                      opacity: 0.8;
                      border-color: #585e65; 
                      box-shadow: 2px 2px; /* Reduce opacity on hover if desired */
                    }
                    
                  h2, h5 {
                      margin: 10px 20px;
                  }
                  p{
                    margin-left:50px;
                    margin-right:50px;
                    margin-top:10px;
                   }
                   .topnav {
                     overflow: hidden;
                    background-color:rgb(53, 189, 234);
                    color:white;
                    box-shadow: 1px 1px 2px grey;
                } 
              
              
                .topnav a { 
                    float: left; 
                    display: block; 
                    color: #f2f2f2; 
                    text-align: center; 
                    padding: 10px 12px;
                    text-decoration: none;
                } 
              
                    
                .topnav a:hover { 
                    background:rgb(240, 19, 86); 
                    color:whitesmoke; 
                }
              
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 20px;
                }
                
                th, td {
                  border: 1px solid #ddd;
                  padding: 8px;
                }
                
                th {
                  background-color: #f2f2f2;
                }
                </style>
  
              </head>
              
              
              <body>
                   <!-- NavBar -->
                   <div class="nav flex flex-col py-4 bg-blue-200">
                    <div class="md:px-12 px-8 flex justify-between items-center gap-4">
                        <div>
                            <a class="font-semibold text-lg" href="#">CHC Tracker</a>
                        </div>
                        <svg id="hamb" class="lg:hidden w-6 h-6  cursor-pointer mr-1 ease-in duration-150 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path fill-rule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clip-rule="evenodd" />
                        </svg>
                        <svg class="lg:hidden w-6 h-6 hidden stroke-slate-900 cursor-pointer ease-in duration-150" id="cross" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <div class="profile lg:flex hidden justify-between items-center gap-x-2">
                            <div class="flex items-center">
                                <a href="#" class="px-4 py-2 font-semibold text-lg hover:underline underline-offset-2">Farmer Transcript</a>
                            </div>
                        </div>
                </div>
              
              
              
                    <!-- small screen menu -->
                    <div class="menu hidden" id="menu">
                        <div class="bg-slate-100 flex flex-col text-slate-900 p-2">
                            <div class="profile flex justify-between items-center mx-2 gap-x-2 py-2 px-2">
                                <a href="#" class="px-4 py-2 font-semibold text-lg hover:underline underline-offset-2">Farmer Transcript</a>
                            </div>
                            
                        </div>
                    </div>
                </div>
                <div class="topnav">
                    <a href="Farmersingup.html">home</a>
              </div>
                <br><br><br><br><br>
                
              
                <!-- receipt -->
                <div class="receipt">
                  <h1>Receipt</h1>
                  <div class="order-details">
                    <p><strong>Farmer ID : </strong>${farmerData.farmerid}</p>
                    <p id="p1"><strong>Date:</strong></p><script>
                      var date = new Date();
                      document.getElementById("p1").innerHTML = date;
                  </script>
                    <!-- Add other necessary details here -->
                  </div>
                  <br>

                  <table>
                  <tr>
                  <th>Field</th>
                  <th>Value</th>
                  </tr>
                  <tr>
                  <td>Farmer name</td>
                  <td>${farmerData.farmerName}</td>
                  </tr>
                  <tr>
                  <td>father name</td>
                  <td>${farmerData.fatherName}</td>
                  </tr>
                  <tr>
                  <td>Phone number</td>
                  <td>${farmerData.phoneNumber}</td>
                  </tr>
                  <tr>
                  <td>Address</td>
                  <td>${farmerData.address}</td>
                  </tr>
                  <tr>
                  <td>RBK id</td>
                  <td>${farmerData.rbkid}</td>
                  </tr>
                  </table>

                  <p> This page contains the information about your credentials.Do not disclose with anyone.</p>
                  <br>
                  <br>
              
                <button class=" w-20 px-2 py-3 bg-slate-900 hover:shadow-sm hover:shadow-slate-700 transition-all duration-150 ease-in-out rounded-lg text-white" type="submit" onclick="printReceipt()">Print</button>
              </div>

              
              <br><br><br><br>
              <script>
                function printReceipt() {
                  window.print();
                }
              </script>
              <br> <br><br><br>
              <footer>@CHC Tracker</footer>
              </body>
              </html>
              `;

              // Send the receipt HTML content as a file
              res.setHeader('Content-Type', 'text/html');
              res.status(200).send(receiptHTML);
          }
      });
  } else {
      res.status(400).send('Invalid request');
  }
});


//Display users between given dates 




app.get('/dataBetweenDates', async (req, res) => {
  const sdate = req.query.sdate;
  const rdate = req.query.rdate;
  try {
    const collection = db.collection('applications');
    
    // Validate dates (optional)
    if (!sdate || !rdate) {
      console.log('Invalid request: Missing start or end date');
    }

    const filter = {
      sdate: { $gte: sdate }, // Use new Date(sdate) for Mongoose-compatible format
      rdate: { $lte: rdate }
    };

    console.log(JSON.stringify(filter));

    const result = await collection.find(filter).toArray();

    if (!result || !result.length) {
      res.status(404).send('Application data not found');
      return; 
    }

    const receiptHTML = `
      <html>
        <head>
          <style>
            /* Your styles here */
          </style>
        </head>
        <body>
          <div class="topnav">
            <a href="Retrievedetails.html">back</a>
            <a href="Help.html" style="float:right">Help</a>
          </div>
          <br><br><br>
          <h4>Data Between ${sdate} and ${rdate}</h4>
          <table>
            <tr>
              <th>Farmer name</th>
              <th>Supplement</th>
              <th>Application id</th>
            </tr>`
            result.forEach(doc => {
              receiptHTML += `<tr>
                <td>${doc.farmerName}</td>
                <td>${doc.supplement}</td>
                <td>${doc.applicationid}</td>
              </tr>`;
            });
            receiptHTML += `
                </table>
              </body>
              </html>`;
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(receiptHTML);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

  







//get details about application based on application id


app.get('/applicationdetails', async (req, res) => {
  const applicationid = req.query.applicationid;

  if (applicationid) {
      db.collection("applications").findOne({ applicationid: applicationid }, (err, applicationData) => {
          if (err || !applicationData) {
              res.status(404).send('Application data not found');
          } else {
              // Prepare the receipt HTML content with the applicationData
            const receiptHTML =`<html>
      <head>
      <style>
            .topnav {
              overflow: hidden;
             background-color:rgb(53, 189, 234);
             color:white;
             box-shadow: 1px 1px 2px grey;
         } 
 
 
         .topnav a { 
             float: left; 
             display: block; 
             color: #f2f2f2; 
             text-align: center; 
             padding: 10px 12px;
             text-decoration: none;
         } 
 
             
         .topnav a:hover { 
             background:rgb(240, 19, 86); 
             color:whitesmoke; 
         }
          table {
            font-family: Arial, sans-serif;
            border-collapse: collapse;
            width: 100%;
          }

          th, td {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
          }

          th {
            background-color: blue;
            color:white;
          }
        </style>
        </head>
      <body>
        <div class="topnav">
        <a href="Retrievedetails.html">back</a>
        <a href="Help.html" style="float:right">Help</a>
          </div>
        <br><br><br>
        <h4>Details about application with id ${applicationid}</h4>
        <table>
    <tr>
      <th>Farmer name</th>
      <th>Father name</th>
      <th>Address</th>
      <th>PhoneNumber</th>
      <th>Supplement</th>
      <th>Application id</th>
    </tr>
    <tr>
      <td>${applicationData.farmerName}</td>
      <td>${applicationData.fatherName}</td>
      <td>${applicationData.address}</td>
      <td>${applicationData.phoneNumber}</td>
      <td>${applicationData.supplement}</td>
      <td>${applicationData.applicationid}</td>
    </tr>
    </table>
      </body>
    </html>`;

   res.setHeader('Content-Type', 'text/html');
   res.status(200).send(receiptHTML);
}
}
)} else {
res.status(400).send('Invalid request');
}
});





//codeverification or one time code verification


app.get('/codeverify', (req, res) => {
  const auth = req.query.code;

  if (auth) {
      db.collection("applications").findOne({ auth: auth }, (err, authData) => {
          if (err || !authData) {
              res.status(404).send('Auth data not found');
          } else {
            const receiptHTML =`<html>
      <head>
      <style>
            .topnav {
              overflow: hidden;
             background-color:rgb(53, 189, 234);
             color:white;
             box-shadow: 1px 1px 2px grey;
         } 
 
 
         .topnav a { 
             float: left; 
             display: block; 
             color: #f2f2f2; 
             text-align: center; 
             padding: 10px 12px;
             text-decoration: none;
         } 
 
             
         .topnav a:hover { 
             background:rgb(240, 19, 86); 
             color:whitesmoke; 
         }
        </style>
        </head>
      <body>
        <div class="topnav">
        <a href="Retrievedetails.html">back</a>
        <a href="Help.html" style="float:right">Help</a>
          </div>
        <br><br><br>
        <h4>Authentification has been done succesfully....!</h4>
       
      </body>
    </html>`;

   res.setHeader('Content-Type', 'text/html');
   res.status(200).send(receiptHTML);
}
}
)} else {
res.status(400).send('Invalid request');
}
});



//getting the supplement details 

app.get('/suppdetails', async (req, res) => {
  const supp = req.query.supplement;
  console.log('Successfully retrieved application data:', supp);

  try {
    const collection = db.collection('applications');
    const suppData = await collection.find({ supplement:supp }).toArray();
    console.log('Successfully retrieved application data:', suppData);

    if (!suppData || suppData.length === 0) {
      return res.status(404).send('Application data not found for the specified supplement');
    }

    let receiptHTML = `
      <html>
      <head>
        <style>
          .topnav {
            overflow: hidden;
            background-color: rgb(53, 189, 234);
            color: white;
            box-shadow: 1px 1px 2px grey;
          }
  
          .topnav a {
            float: left;
            display: block;
            color: #f2f2f2;
            text-align: center;
            padding: 10px 12px;
            text-decoration: none;
          }
  
          .topnav a:hover {
            background: rgb(240, 19, 86);
            color: whitesmoke;
          }
  
          table {
            font-family: Arial, sans-serif;
            border-collapse: collapse;
            width: 100%;
          }
  
          th, td {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
          }
  
          th {
            background-color: blue;
            color: white;
          }
        </style>
      </head>
      <body>
        <div class="topnav">
          <a href="Retrievedetails.html">back</a>
          <a href="Help.html" style="float:right">Help</a>
        </div>
        <br><br><br>
        <h4>Details about supplement :  ${supp}</h4>
        <table>
          <tr>
            <th>Farmer name</th>
            <th>Application id</th>
            <th>Address</th>
            <th>Phone Number</th>
          </tr>`;

    suppData.forEach(doc => {
      receiptHTML += `<tr>
        <td>${doc.farmerName}</td>
        <td>${doc.applicationid}</td>
        <td>${doc.address}</td>
        <td>${doc.phoneNumber}</td>
      </tr>`;
    });

    receiptHTML += `
        </table>
      </body>
      </html>`;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(receiptHTML);
  } catch (error) {
    console.error('Error retrieving application data:', error);
    res.status(500).send('Internal Server Error'); // Handle errors gracefully
  }
});





//Farmer login check

const farmerSchema = new mongoose.Schema({
  farmerid: String,
});

const Farmer = mongoose.model('farmers', farmerSchema);


app.post("/flogin", async (req, res) => {
  const { farmerid } = req.body;

  try {
    const farmer = await Farmer.findOne({ farmerid });
    if (farmer) {
      console.log("Farmer found");
      res.redirect("Farmer.html");
    } else {
      res.redirect('/Farmerlogin.html');
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});



//Create CHC Members 

app.post('/asignup', (req, res) => {
  var membername = req.body.membername;
  var email = req.body.email;
  var phonenumber = req.body.phonenumber;
  var password = req.body.password;
  
  // Saving the data to the database
  const data = {
      membername,
      email,
      phonenumber,
      password,
  };

  db.collection("members").insertOne(data, (err, collection) => {
      if (err) {
          throw err;
      }
      console.log(" Member Record inserted");

      res.redirect("Admin.html");
  });
});



//Member login check

const memberSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const Member = mongoose.model('members', memberSchema);


app.post("/alogin", async (req, res) => {
  const { email,password } = req.body;

  try {
    const member = await Member.findOne({ email,password });
    if (member) {
      console.log("Member found");
      res.redirect("Admin.html");
    } else {
      res.redirect('/Adminlogin.html');
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


    //Collecting the Newsletters
    app.post('/newsletters', async (req, res) => {
        // Saving the data to the database
      try {
          var newsletter = req.body.newsletter;
          const data = {newsletter};
          
          // Insert the newsletter into the database
          db.collection("Newsletters").insertOne(data, (err, collection) => {
              if (err) {
                  throw err;
              }
              console.log("Newsletter Record inserted");
          });
      } catch (err) {
          console.error(err);
          res.status(500).send("Internal Server Error");
      }
  });
  


  //Tracking the pages 

  const trackedPages = {};

  app.get('/generate/:id', (req, res) => {
      const id = req.params.id;
  
      const htmlContent = `
      <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Tracked Page - ${id}</title>
      <style>
  
      button {
          padding: 8px 17px;
          font-size: 15px;
          cursor: pointer;
          margin-bottom: 10px;
          border-radius: 3px;
      
      }
      
      #pageLink {
          margin-top: 20px;
      }
      
      #pageLink p {
          margin: 0;
      }
      
      #coordinatesDisplay {
          margin-top: 20px;
      }
  
      header{
          background-color: rgba(6, 206, 241, 0.964);
          padding-bottom:20px;
          padding-top:20px;
          top:0;
      }
      </style>
  </head>
  <body>
      <header>
      <h1><center>Tracked Page</center></h1>
      </header>
      <hr>
      <br><br><br>
      <p>This is a tracked page with ID: ${id}</p>
  
      <script>
          let intervalId;
  
          // Function to send location updates on button click
          function sendLocation(id) {
              intervalId = setInterval(() => {
                  navigator.geolocation.getCurrentPosition(
                      position => {
                          const { latitude, longitude } = position.coords;
                          fetch('/location', {
                              method: 'POST',
                              headers: {
                                  'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                  pageID: id,
                                  latitude: latitude,
                                  longitude: longitude,
                              }),
                          })
                          .then(response => {
                              if (!response.ok) {
                                  console.error('Error sending location:', response.statusText);
                              }
                          })
                          .catch(error => {
                              console.error('Error sending location:', error);
                          });
                      },
                      error => {
                          console.error('Error getting location:', error);
                      }
                  );
              }, 2000); // Send coordinates every 2 seconds
          }
  
          // Function to stop sending location updates
          function stopSendingLocation() {
              clearInterval(intervalId);
          }
  
      </script>
  
      <!-- Buttons -->
      <center>
      <br>
      <button onclick="sendLocation('${id}')">Start Sending Location</button>
      <button onclick="stopSendingLocation()">Stop Sending Location</button>
      <br>
      </center>
  
  </body>
  </html>`;
  
  
      trackedPages[id] = { coordinates: { latitude: null, longitude: null } };
  
      res.send(htmlContent);
  });
  
  
  
  app.get('/track/:id', (req, res) => {
      const id = req.params.id;
  
      if (trackedPages[id] && trackedPages[id].coordinates) {
          console.log(`Page with ID ${id} was accessed. Coordinates:`, trackedPages[id].coordinates);
          res.json(trackedPages[id].coordinates);
      } else {
          res.status(404).send('Location not available for the specified page.');
      }
  });
  
  
  
  app.post('/location', (req, res) => {
      const { pageID, latitude, longitude } = req.body;
      console.log(`Location received for page ${pageID}: ${latitude}, ${longitude}`);
  
      if (trackedPages[pageID]) {
          trackedPages[pageID].coordinates = { latitude, longitude };
      }
  
      res.json({ message: 'Location received successfully.', latitude, longitude });
  });
  



app.get("/",(req,res)=>{
    res.set({
        "Allow-access-Allow-Origin":'*'
    })

    return res.redirect("index.html");
}).listen(3000);

console.log("Listening on port 3000");