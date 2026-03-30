//
// Filters for your version of the GOV.UK Prototype Kit
//

const { formatDateString, formatDate } = require("nunjucks-formatters/formatters/date");

const govukPrototypeKit = require('govuk-prototype-kit');
const addFilter = govukPrototypeKit.views.addFilter;   // ✅ correct for your kit version

// Register filters
addFilter('formatDate', (content) => {
  return formatDate(content);
});

addFilter('formatDateString', (content) => {
  return formatDateString(content);
});

console.log("✅ filters.js loaded via views.addFilter");