const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const multiparty = require('multiparty');
const fs = require('fs');
const fileType = require('file-type');
const { google } = require('googleapis');


const env = process.env.ENVIRONMENT;
console.log('ENVIRONMENT ======= ', env);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/about', function(req, res, next) {
  res.render('about');
});

router.get('/products', function(req, res, next) {
  res.render('products/products');
});
router.get('/products/ansi-flanges', function(req, res, next) {
  res.render('products/ansi-flanges');
});
router.get('/products/api-flanges', function(req, res, next) {
  res.render('products/api-flanges');
});
router.get('/products/swivels-misalignments', function(req, res, next) {
  res.render('products/swivels-misalignments');
});
router.get('/products/long-weldneck-flanges-vessel-components', function(req, res, next) {
  res.render('products/long-weldneck-flanges-vessel-components');
});
router.get('/products/specialty-flanges-fittings', function(req, res, next) {
  res.render('products/specialty-flanges-fittings');
});
router.get('/products/custom-engineered-products', function(req, res, next) {
  res.render('products/custom-engineered-products');
});

router.get('/certifications', function(req, res, next) {
  res.render('certifications');
});

router.get('/request-for-quote', function(req, res, next) {
  res.render('request-for-quote');
});

router.get('/standards', function(req, res, next) {
  res.render('standards');
});

router.get('/contact', function(req, res, next) {
  res.render('contact');
});


let buffer;

// --- Forms
const emailFrom = "webrequest@westbrookmfg.com";
const emailProdPass = process.env.EMAIL_APP_PASS;

const emailBCC = "webrequest@westbrookmfg.com";
const emailDevTo = "dev@westbrookmfg.com";
const emailTo = 'quotes@federalconnects.com';
// const emailDevPass = process.env.EMAIL_dev_PASS;
// const emailPrevFrom = "manufacturingwestbrook@gmail.com";
// const emailProdFrom = "westbrookmfg@outlook.com";
// const emailProdPass = process.env.EMAIL_outlook_PASS;


// const oAuth2Client = new google.auth.OAuth2(
//   process.env.OAUTH_CLIENT_ID,
//   process.env.OAUTH_CLIENT_SECRET,
//   process.env.GOOGLE_GMAIL_REDIRECT_URI
// );

// oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });


async function sendMail(mailForCompany, mailForConfirm, res) {
  try {
    // const accessToken = await oAuth2Client.getAccessToken();
    // const transport = nodemailer.createTransport({
    //   service: 'gmail',
    //   auth: {
    //     type: 'OAuth2',
    //     user: emailFrom,
    //     clientId: process.env.OAUTH_CLIENT_ID,
    //     clientSecret: process.env.OAUTH_CLIENT_SECRET,
    //     refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    //     accessToken: accessToken,
    //   },
    // });

    const transport = nodemailer.createTransport({
      pool: true,
      maxConnections: 5,
      service: 'SendGrid',
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    });

		transport.sendMail(mailForCompany, function(error, info) {
			if (error) { // --- send email to Lapraim
				console.log(error);
				return res.json('error');

			} else { // --- success, then send email to the user
				if (mailForConfirm) {
					transport.sendMail(mailForConfirm, function(error, info) {
						// console.log(info);
						return res.json('done');
					});
				} else { // -- If no Confirm message needed
					// console.log(info);
					return res.json('done');
				}
			}
		});

  } catch (error) {
    console.log('error:', error)
    return res.json('error');
  }

}

router.post('/home-contact-form-submit', function(req, res) {
  var name = req.body.name
  var email = req.body.email
  var message = req.body.message

  var emailText = `
  <b>Name</b> : ${name} <br/>
  <b>Email</b> : ${email} <br/>
  <b>Message</b> :
      ${message}
  `

  var mailForCompany = {
    from: emailFrom,
    to: env === 'production' ? [emailTo] : emailDevTo,
    bcc: emailBCC,
    subject: 'Federal Flange Home Contact Form',
    html: emailText
  };

  let mailForConfirm = false;
  sendMail(mailForCompany, mailForConfirm, res);

})

// Main Contact Form
router.post('/main-contact-form-submit', function(req, res) {
  var name = req.body.name
  var email = req.body.email
  var phone = req.body.phone
  var message = req.body.message

  var emailTo = 'quotes@federalconnects.com';
  var emailText = `
  <b>Name</b> : ${name} <br/>
  <b>Email</b> : ${email} <br/>
  <b>Phone</b> : ${phone} <br/>
  <b>Message</b> :
      ${message}
  `

  var mailForCompany = {
    from: emailFrom,
    to: env === 'production' ? [emailTo] : emailDevTo,
    cc: env === 'production' ? [emailCCTo] : "",
    bcc: emailBCC,
    subject: 'Federal Flange Main Contact Form',
    html: emailText
  };

  let mailForConfirm = false;
  sendMail(mailForCompany, mailForConfirm, res);

})

// Quote Request Form
router.post('/quote-contact-form-submit', (req, res) => {
  let name = req.body.name
  let email = req.body.email
  let phone = req.body.phone
  let companyName = req.body.companyName
  let companyType = req.body.companyType
  let file = req.body.file
  let description = req.body.description

  let emailText = `
    <b>Name</b> : ${name} <br/>
    <b>Email</b> : ${email} <br/>
    <b>Phone</b> : ${phone} <br/>
    <b>Organization Name</b> : ${companyName} <br/>
    <b>Organization Type</b> : ${companyType} <br/>
    <b>RFQ Description</b> :
      ${description}
  `;

  var mailForCompany = {
    from: emailFrom,
    to: env === 'production' ? [emailTo] : emailDevTo,
    bcc: emailBCC,
    subject: 'Federal Flange - Quote Request Form - New Prospect Inquiry Submitted via Website',
    html: emailText,
    attachments: file
  };

  let mailForConfirm = false;
  sendMail(mailForCompany, mailForConfirm, res);

})

// Product Form
router.post('/product-form-submit', function(req, res) {
  let name = req.body.name
  let email = req.body.email
  let phone = req.body.phone
  let message = req.body.message
  let referral = req.body.referral

  let emailText = `
  <b>Name</b> : ${name} <br/>
  <b>Email</b> : ${email} <br/>
  <b>Phone</b> : ${phone} <br/>
  <b>Message</b> :
      ${message} <br/>

  <b>Form Submitted page referral</b> :${referral}

  `

  var mailForCompany = {
    from: emailFrom,
    to: env === 'production' ? [emailTo] : emailDevTo,
    bcc: emailBCC,
    subject: 'Federal Flange - Product Form - New Prospect Inquiry Submitted via Website',
    html: emailText,
  };

  let mailForConfirm = false;
  sendMail(mailForCompany, mailForConfirm, res);

})

module.exports = router;
