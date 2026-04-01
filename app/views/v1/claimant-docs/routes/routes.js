const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const v8 = require("v8");

// Load local data
let documents = v8.deserialize(v8.serialize(require('../data/documents.json')));
const documentNames = require('../data/documentNames.json');
const months = require('../data/months');

// ✅ FIXED: Hard coded version path
const versionPath = '/v1/claimant-docs';

// ✅ Landing redirect (was /currentVersionPath)
router.post(`${versionPath}`, (req, res) => {
    return res.redirect(`${versionPath}/claimant-details`);
});

// ✅ Reset documents
router.get(`${versionPath}/reset-documents`, (req, res) => {
    documents = v8.deserialize(v8.serialize(require('../data/documents.json')));
    return res.redirect(`${versionPath}/document-list`);
});

// ✅ GLOBAL middleware for ALL claimant-docs pages
router.all(`${versionPath}*`, (req, res, next) => {

    res.locals.documents = documents.filter(doc => !doc.archived);
    res.locals.irrelevantDocuments = documents.filter(doc => doc.archived);
    res.locals.documentNames = documentNames;

    const activeDocs = res.locals.documents.filter(x => x.isActive);

    res.locals.totalDocuments = activeDocs.length;
    res.locals.importantCount = activeDocs.filter(x => x.important).length;
    res.locals.archivedCount = activeDocs.filter(x => x.archived).length;
    res.locals.unreadCount = activeDocs.length - activeDocs.filter(x => x.read).length;

    res.locals.lastUpdatedTime = new Date().toLocaleString(
        'en-GB',
        { hour: 'numeric', minute: 'numeric', hour12: true }
    );

    return next();
});

// ✅ VIEW DOCUMENT
router.get(`${versionPath}/view-document/:id`, (req, res) => {

    const doc = documents.find(d => d.id === req.params.id);
    if (doc) doc.read = true;

    res.locals.documents = documents;
    res.locals.document = doc;

    const activeDocs = documents.filter(x => x.isActive);
    const index = activeDocs.findIndex(d => d.id === req.params.id);

    res.locals.selectedDocument = index + 1;
    res.locals.previousDocumentId = activeDocs[index - 1]?.id;
    res.locals.nextDocumentId = activeDocs[index + 1]?.id;

    return res.render(`v1/claimant-docs/view-document`);
});

// ✅ REMOVE DOCUMENT (GET)
router.get(`${versionPath}/remove-document/:id`, (req, res) => {

    const doc = documents.find(d => d.id === req.params.id);

    res.locals.document = doc;
    res.locals.documents = documents;

    return res.render(`v1/claimant-docs/remove-document`);
});




// ✅ UPDATE DOCUMENT (GET)
router.get(`${versionPath}/update-document/:id`, (req, res) => {

    const doc = documents.find(d => d.id === req.params.id);
    if (doc) doc.read = true;

    res.locals.documents = documents;
    res.locals.document = doc;

    const activeDocs = documents.filter(x => x.isActive);
    const index = activeDocs.findIndex(d => d.id === req.params.id);

    res.locals.selectedDocument = index + 1;
    res.locals.previousDocumentId = activeDocs[index - 1]?.id;
    res.locals.nextDocumentId = activeDocs[index + 1]?.id;

    return res.render(`v1/claimant-docs/update-document`);
});

// ✅ UPDATE DOCUMENT (POST)
router.post(`${versionPath}/update-document/:id`, (req, res) => {

    const doc = documents.find(d => d.id === req.params.id);

    if (!doc) return res.redirect(`${versionPath}/document-list`);

    // Update fields
    if (req.body.documentName) {
        doc.drsName = doc.drsName || doc.name;
        doc.name = req.body.documentName;
    }

    doc.dateDay = req.body.dateOfDocumentDay;
    doc.dateMonth = req.body.dateOfDocumentMonth;
    doc.dateYear = req.body.dateOfDocumentYear;
    doc.comment = req.body.comment;

    if (months[doc.dateMonth - 1]) {
        doc.dateOfDocument = `${doc.dateDay} ${months[doc.dateMonth - 1]} ${doc.dateYear}`;
    }

    doc.reviewed = true;
    doc.archived = Array.isArray(req.body.archived);

    const activeDocs = documents.filter(x => x.isActive);
    const index = activeDocs.findIndex(d => d.id === req.params.id);

    res.locals.previousDocumentId = activeDocs[index - 1]?.id;
    res.locals.nextDocumentId = activeDocs[index + 1]?.id;
    

    // ✅ Handle redirect logic
    if (req.query.irrelevant) {
        return res.redirect(`${versionPath}/document-list?irrelevant=true`);
    }

    if (!req.query.ncat) {
        return res.redirect(`${versionPath}/view-document/${req.params.id}`);
    }

    if (res.locals.nextDocumentId) {
        return res.redirect(`${versionPath}/update-document/${res.locals.nextDocumentId}?ncat=true`);
    }

    return res.redirect(`${versionPath}/document-list?ncat=true`);
});

// ✅ FILTERS
router.post(`${versionPath}/document-list`, (req, res) => {

    documents.forEach(document => {

        if (req.body.documentFilters?.includes('IMPORTANT')) {
            document.isActive = document.important;
        }
        if (req.body.documentFilters?.includes('ARCHIVED')) {
            document.isActive = document.archived;
        }
        if (req.body.documentFilters?.includes('UNREAD')) {
            document.isActive = !document.read;
        }

    });

    return res.redirect(`${versionPath}/document-list`);
});

// ✅ CLEAR FILTERS
router.get(`${versionPath}/clear-filters`, (req, res) => {

    documents.forEach(doc => doc.isActive = true);

    res.locals.documents = documents;

    const activeDocs = documents.filter(x => x.isActive);
    res.locals.totalDocuments = activeDocs.length;
    res.locals.importantCount = activeDocs.filter(x => x.important).length;
    res.locals.archivedCount = activeDocs.filter(x => x.archived).length;
    res.locals.unreadCount = activeDocs.length - activeDocs.filter(x => x.read).length;

    return res.render(`v1/claimant-docs/document-list`);
});

// ✅ AUTOSAVE
router.post(`${versionPath}/autosave`, (req, res) => {
    try {
        const doc = documents.find(d => d.id === req.body.id);

        if (!doc) return res.status(200).json({});

        if (req.body.type === 'archived') {
            doc.archived = req.body.isChecked;
        } else {
            doc.important = req.body.isChecked;
        }

        res.locals.documents = documents;
        return res.status(200).json({});

    } catch {
        return res.status(500).json({});
    }
});

module.exports = router;



// ✅ PIN A DOCUMENT
router.get(`${versionPath}/pin/:id`, (req, res) => {
    const doc = documents.find(d => d.id === req.params.id);
    if (doc) doc.pinned = true;

    const returnTo = req.query.return === "view"
        ? `${versionPath}/view-document/${doc.id}?msg=pinned&name=${encodeURIComponent(doc.name)}`
        : `${versionPath}/document-list?msg=pinned&name=${encodeURIComponent(doc.name)}`;

    return res.redirect(returnTo);
});

// ✅ UNPIN A DOCUMENT
router.get(`${versionPath}/unpin/:id`, (req, res) => {
    const doc = documents.find(d => d.id === req.params.id);
    if (doc) doc.pinned = false;

    const returnTo = req.query.return === "view"
        ? `${versionPath}/view-document/${doc.id}?msg=unpinned&name=${encodeURIComponent(doc.name)}`
        : `${versionPath}/document-list?msg=unpinned&name=${encodeURIComponent(doc.name)}`;

    return res.redirect(returnTo);
});


// ✅ UNPIN ALL DOCUMENTS
router.get(`${versionPath}/unpin-all`, (req, res) => {
    documents.forEach(d => d.pinned = false);
    return res.redirect(`${versionPath}/document-list?msg=unpinall`);
});


