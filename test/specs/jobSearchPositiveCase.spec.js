const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;
chai.should();
const PageFactory = require('../page_objects/pageFactory');
const EC = protractor.ExpectedConditions;
const yargs = require('yargs').argv;

describe('jobs search', function() {
  beforeEach(function() {
    browser.waitForAngularEnabled(false);
    return browser.manage().window().maximize();
  });

  const keyword = yargs.keyword || 'Test';
  const location = yargs.location || 'Minsk';
  const department = yargs.department || 'Software Test Engineering';

  it(`should return job offers for ${department} positions from ${location}`, async function() {
    await PageFactory.getPage('Home').open();
    await PageFactory.getPage('Home').header.clickCareersButton();
    await PageFactory.getPage('Careers').jobSearchForm.waitForTheFormToBeVisible();
    await PageFactory.getPage('Careers').jobSearchForm.submitJobSearchForm(keyword, location, department);
    const firstSearchResultItem = PageFactory.getPage("Careers").jobSearchResults.searchResultItems.getElementByIndex(0);
    await browser.wait(EC.elementToBeClickable(firstSearchResultItem), 10000);
    const amountOfSearchResults = await PageFactory.getPage("Careers").jobSearchResults.countSearchResults();
    const searchResultsHeading = await PageFactory.getPage('Careers').jobSearchResults.getHeadingText();
    if (amountOfSearchResults > 1) {
      expect(searchResultsHeading).to.equal(`WE FOUND ${amountOfSearchResults} JOB OPENINGS RELATED TO "${keyword.toUpperCase()}"`);
    } else {
      expect(searchResultsHeading).to.equal(`WE FOUND ${amountOfSearchResults} JOB OPENING RELATED TO "${keyword.toUpperCase()}"`);
    }
    expect(amountOfSearchResults).to.be.at.least(1);
  });
});
