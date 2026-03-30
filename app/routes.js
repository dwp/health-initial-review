//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//
const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
require('./filters.js')
require('./views/v1/claimant-docs/routes/routes.js')
router.all('*', (req, res, next) => {
    res.locals.query = req.query;
    res.locals.params = req.params;
    return next();
});


router.post('/first-iteration-IR/htln-179-mvp-second-release/IR-landingPage-playback*', (req, res, next) => {    
    let errors = {
        errorList: []
    }
    for (let i = 0; i <= 10; i++) {

        if(req.body["hcpreviewpip" + i] === undefined && req.body["ir-outcomes" + i] === undefined) {
            continue;
        } 

        // if (!req.body["hcpreviewpip" + i]) {
        //     errors.errorList.push({
        //         text: "Error message for not entering hcp review",
        //         href: "#hcpreviewpip" + i
        //     });
        //     errors["hcpreviewpip" + i] = "Error message for not entering hcp review"
        // } else if (req.body["hcpreviewpip" + i].length > 7500) {
        //     errors.errorList.push({
        //         text: "Clinical review and justification must be 7500 characters or less",
        //         href: "#hcpreviewpip" + i
        //     });
        //     errors["hcpreviewpip" + i] = "Clinical review and justification must be 7500 characters or less"
        // }

        if (!req.body["ir-outcomes" + i]) {
            errors.errorList.push({
                text: "Select an outcome",
                href: "#ir-outcomes" + i
            });
            errors["ir-outcomes" + i] = "Select an outcome"
        }
        if (errors.errorList.length > 0) {
            break;
        }
    }
    if (errors.errorList.length > 0) {
        res.locals.errors = errors;
        return res.render('first-iteration-IR/htln-179-mvp-second-release/IR-landingPage-playback');
    }
    if(req.body.submit === 'Continue') {
        return res.redirect('/first-iteration-IR/htln-179-mvp-second-release/claimant-details.html');
  
    } else if (req.body.submit === 'Add another entry') {
        return res.redirect('/first-iteration-IR/htln-179-mvp-second-release/IR-landingPage-playback?viewmode=add')
    } else {
        return next();
    }
});
// Add your routes here

router.use("/v1/eventlog/v1/", (req, res, next) => {
  res.locals.formData = req.session.data || {};
  res.locals.data = req.session.data || {};
  const today = new Date();
  res.locals.todaysDate = {
    day: today.getDate(),
    month: today.getMonth() + 1,
    year: today.getFullYear()
  };

  next();
});

// ==== EVENTLOG / TIMELINE ROUTES (Corrected for Proto‑A) ====

// Adjusted require paths to match your “views/v1/eventlog/v1” structure
const { timelineData } = require("./views/v1/eventlog/v1/data");
const { en } = require("./views/v1/eventlog/v1/lang");

// Correct route prefix: /v1/eventlog/v1/timeline
router.use("/v1/eventlog/v1/timeline", (req, res, next) => {
  const pinned = req.query.pin;
  const unpinned = req.query.unpin;

  if (pinned) {
    timelineData.find(x => x.event_id === Number(pinned)).pinned = true;
  }

  if (unpinned) {
    timelineData.find(x => x.event_id === Number(unpinned)).pinned = false;
  }

  const pinnedItems = timelineData.filter(x => x.pinned === true);

  // Provide all needed template variables
  res.locals.keyDetailsBar = true;
  res.locals.timeline = timelineData;
  res.locals.pinnedItems = pinnedItems;
  res.locals.entry = req.query.entry;

  next();
});

// Reason → branching to inbound/outbound
router.post("/v1/eventlog/v1/reason", function (req, res) {
  const w = req.session.data["whatAreYouAdding"];

  if (w === "INBOUND")  return res.redirect("/v1/eventlog/v1/inbound");
  if (w === "OUTBOUND") return res.redirect("/v1/eventlog/v1/outbound");

  return res.redirect("/v1/eventlog/v1/what-updated");
});

// Posting for inbound/outbound/what-updated
router.post("/v1/eventlog/v1/inbound",  (req, res) => res.redirect("/v1/eventlog/v1/check-answers"));
router.post("/v1/eventlog/v1/outbound", (req, res) => res.redirect("/v1/eventlog/v1/check-answers"));
router.post("/v1/eventlog/v1/what-updated", (req, res) => res.redirect("/v1/eventlog/v1/check-answers"));

// Add new timeline entry
router.post("/v1/eventlog/v1/check-answers", function (req, res) {
  const date = `${req.session.data["whatAreYouAddingDate-year"]}-${req.session.data["whatAreYouAddingDate-month"]}-${req.session.data["whatAreYouAddingDate-day"]}`;

  timelineData.unshift({
    benefit_type: "ESA",
    source_system: "HAS",
    identifiers: [
      { id_type: "referral_id", id_value: "pip-123123" },
      {
        id_type: "citizen_guid",
        id_value: "88776655-1234-4321-9876-665544332211",
      },
    ],
    created_timestamp: "2022-02-22T17:30:00.000Z",
    created_by: {
      first_name: "Jane",
      last_name: "Doe",
      email: "jane.doe@dwp.gov.uk",
    },
    event_id: timelineData.length,
    action: {
      channel: [{ code: "PHONE", text: "Telephone call" }],
      contact_type: {
        code: req.session.data["whatAreYouAdding"],
        text: en.whatAreYouAdding[req.session.data["whatAreYouAdding"]],
      },
      action_type: { code: "", text: "Paper based review booked" },
      action_date: date,
      action_time_freetext: req.session.data["whatAreYouAddingTime"],
      action_user: {
        first_name: "Angela",
        last_name: "Tait",
        email: "jane.tait@dwp.gov.uk",
      },
      action_description: "A new entry here",
      action_contact: {
        code: req.session.data["whoContacted"],
        text: en.whoContacted[req.session.data["whoContacted"]],
      },
    },
    pinned: false,
  });

  res.locals.timeline = timelineData;

  // Redirect back to timeline successfully
  res.redirect("/v1/eventlog/v1/timeline?entry=true");
});

// ==== END EVENTLOG / TIMELINE ROUTES ====




router.post('/first-iteration-IR/htln-179-mvp-third-release/IR-landingPage-playback*', (req, res, next) => {    
    let errors = {
        errorList: []
    }
    for (let i = 0; i <= 10; i++) {

        if(req.body["hcpreviewpip" + i] === undefined && req.body["ir-outcomes" + i] === undefined) {
            continue;
        }

        // if (!req.body["hcpreviewpip" + i]) {
        //     errors.errorList.push({
        //         text: "Error message for not entering hcp review",
        //         href: "#hcpreviewpip" + i
        //     });
        //     errors["hcpreviewpip" + i] = "Error message for not entering hcp review"
        // } else if (req.body["hcpreviewpip" + i].length > 7500) {
        //     errors.errorList.push({
        //         text: "Clinical review and justification must be 7500 characters or less",
        //         href: "#hcpreviewpip" + i
        //     });
        //     errors["hcpreviewpip" + i] = "Clinical review and justification must be 7500 characters or less"
        // }

        if (!req.body["ir-outcomes" + i]) {
            errors.errorList.push({
                text: "Select an outcome",
                href: "#ir-outcomes" + i
            });
            errors["ir-outcomes" + i] = "Select an outcome"
        }
        if (errors.errorList.length > 0) {
            break;
        }
    }
    if (errors.errorList.length > 0) {
        res.locals.errors = errors;
        return res.render('first-iteration-IR/htln-179-mvp-third-release/IR-landingPage-playback');
    }
    if(req.body.submit === 'Continue') {
        return res.redirect('/first-iteration-IR/htln-179-mvp-third-release/claimant-details.html');
    }
    if(req.body.submit === 'Continue1') {
        return res.redirect('/first-iteration-IR/htln-179-mvp-third-release/event.html');
    }

    if(req.body.submit === 'referral') {
        return res.redirect('/first-iteration-IR/htln-179-mvp-draft-feb-26/referral-details.html');
    }

    if(req.body.submit === 'checkanswers') {
        return res.redirect('/first-iteration-IR/htln-179-mvp-draft-feb-26/check-answers.html');
        
    }


    if(req.body.submit === 'checkanswers2') {
        return res.redirect('/first-iteration-IR/htln-179-mvp-draft-mar-26/check-answers.html');
        
    }


    if(req.body.submit === 'checkanswers3') {
        return res.redirect('/v1/hcp-review/check-answers.html');
        
    }

    if(req.body.submit === 'hcpconfirm2') {
        return res.redirect('/v1/hcp-review/tasks.html');
        
    }


    if(req.body.submit === 'add hcp review') {
        return res.redirect('/first-iteration-IR/htln-179-mvp-draft-feb-26/IR-landingPage-playback-add.html');
        
    }


     if(req.body.submit === 'hcpconfirm') {
        return res.redirect('/first-iteration-IR/htln-179-mvp-draft-mar-26/tasks.html');
        
    }

    if(req.body.submit === 'add another entry2') {
        return res.redirect('/first-iteration-IR/htln-179-mvp-draft-feb-26/IR-landingPage-playback?viewmode=add');
        
    }


    if(req.body.submit === 'add another entry3') {
        return res.redirect('/first-iteration-IR/htln-179-mvp-draft-mar-26/IR-landingPage-playback?viewmode=add');
        
    }

    if(req.body.submit === 'add another entry4') {
        return res.redirect('/v1/hcp-review/IR-landingPage-playback?viewmode=add');
        
    }

           
    if(req.body.submit === 'Save and continue1') {
        return res.redirect('/first-iteration-IR/htln-179-mvp-third-release/event.html');
    }
        if(req.body.submit === 'Save and continue2') {
            return res.redirect('IR-landingPage-playback-add.html');

   

    } else if (req.body.submit === 'Add another entry') {
        return res.redirect('/first-iteration-IR/htln-179-mvp-third-release/IR-landingPage-playback?viewmode=add')
    } else {
        return next();
    }

   
    
});




// prompts release

router.post('/first-iteration-IR/htln-973-prompts/IR-landingPage-playback*', (req, res, next) => {    
    let errors = {
        errorList: []
    }
    for (let i = 0; i <= 10; i++) {

        if(req.body["hcpreviewpip" + i] === undefined && req.body["ir-outcomes" + i] === undefined) {
            continue;
        }

        // if (!req.body["hcpreviewpip" + i]) {
        //     errors.errorList.push({
        //         text: "Error message for not entering hcp review",
        //         href: "#hcpreviewpip" + i
        //     });
        //     errors["hcpreviewpip" + i] = "Error message for not entering hcp review"
        // } else if (req.body["hcpreviewpip" + i].length > 7500) {
        //     errors.errorList.push({
        //         text: "Clinical review and justification must be 7500 characters or less",
        //         href: "#hcpreviewpip" + i
        //     });
        //     errors["hcpreviewpip" + i] = "Clinical review and justification must be 7500 characters or less"
        // }

        if (!req.body["ir-outcomes" + i]) {
            errors.errorList.push({
                text: "Select an outcome",
                href: "#ir-outcomes" + i
            });
            errors["ir-outcomes" + i] = "Select an outcome"
        }
        if (errors.errorList.length > 0) {
            break;
        }
    }
    if (errors.errorList.length > 0) {
        res.locals.errors = errors;
        return res.render('first-iteration-IR/htln-973-prompts/IR-landingPage-playback');
    }
    if(req.body.submit === 'Continue') {
        return res.redirect('/first-iteration-IR/htln-973-prompts/claimant-details.html');
    }
    if(req.body.submit === 'Continue1') {
        return res.redirect('/first-iteration-IR/htln-973-prompts/event.html');
    }
    if(req.body.submit === 'Save and continue1') {
        return res.redirect('/first-iteration-IR/htln-973-prompts/event.html');
    }
        if(req.body.submit === 'Save and continue2') {
            return res.redirect('IR-landingPage-playback-add.html');

    } else if (req.body.submit === 'Add another entry') {
        return res.redirect('/first-iteration-IR/htln-973-prompts/IR-landingPage-playback?viewmode=add')
    } else {
        return next();
    }
});





