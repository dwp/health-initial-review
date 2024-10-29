//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

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
