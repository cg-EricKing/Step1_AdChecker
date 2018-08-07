// Ad Checking Script for iHeart Accounts
    // With the bulk volume of the accounts we will be servicing, need to have a catch for campaigns with no ads

// Psuedocode

// Issues so far = 
    // 50+ is always going to be an issue
    // Filtering what accounts we are looking at, it needs to be running with an enabled campaign 
    // Ended is going to be enabled = which means filtering by clicks or impressions can't work, we need to see a view of accounts with new campaigns
    // Those campaigns have just started and might not have impressions or clicks, that filter won't work
    // The API Report doesn't have the correct filters or return anything that we really need (AD Group Name, Campaign Name, Ad Group Status = all good to know...but doesn't give us an ad count)
    // The iHeart Label is always going to be over 50+ accounts, need to filter the selection down with labels
        // When a new account is created it could have the label iHeart-NEW - This script will look at those daily check for ads in the adgroup
            // If ads have been created and are live => Remove the iHeart-NEW label
            // If ads have NOT been created and the adgroup contains no ads => Notify or add to spreadsheet
    // AdWords Library can return the ads inside the campaign, it returns the type of the ad
        // Maybe I can total the ads that return and if the ads in an enabled campaign are 0 send to an array
        // USE totalNumEntities() to get how many ads are in the adgroup
        // Need to figure out a way to tie the ad to the campaign for the notification or spreadsheet
        // If the total of the adgroup is 0 notify, if the adgroup has enabled ads ignore
            // Ignore paused ads, campaigns, adgroups
            // Grab the ad status to check if ads are approved or disapproved

       // Change the Ad Selector to only look at ads in the campaign with the label "iHeart-NEW"
        


// Main Function
function main() {
  // Init Spreadsheet
  //var spreadsheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1Omq0Cj0tCoZL71lOCdicEipQ-ZC5pwe36MCq5wSsnck/edit?usp=sharing");
  //var sheet = spreadsheet.getSheets()[0];

  // Init Globals
  var accountLabel = "iHeart-NEW";
  var emailForNotify = "eric.king@comporium.com";

  
  // Notification Function
      // Email function to pass string and send through to email provided
      function notify(string) {
          // Construct email template for notifications
          // Must have to, subject, htmlBody
          var emailTemplate = {
              to: emailForNotify,
              subject: accountName,
              htmlBody: "<h1>Comporium Media Services Automation Scripts</h1>" + "<br>" + "<p>This account has encountered an issue</p>" + accountName +
              "<br>" + "<p>The issue is with this campaign: </p>" + campaignName + "<br>" + "<p>This is what is wrong - </p>" + "<br>"
              + string + "<br>" + "Ads Disapproved = " + adDisapproval +"<p>If something is incorrect with this notification please forward this email to eric.king@comporium.com. Thanks!</p>"
          }
              MailApp.sendEmail(emailTemplate);
      }

  // Select iHeart MCC Accounts with label "iHeart-NEW"
  var accountSelector = MccApp
      .accounts()
      .withCondition("LabelNames CONTAINS 'iHeart-NEW'")
      .withLimit(50);

  var accountIterator = accountSelector.get();

  while(accountIterator.hasNext()) {
      var account = accountIterator.next();
      var accountName = account.getName();
      Logger.log("Account being processed: " + accountName);
      // Select Current Account MCC
      MccApp.select(account);

  var accountLabelSelector = MccApp.accountLabels()
      .withCondition("Name CONTAINS 'iHeart-NEW'");

  var accountLabelIterator = accountLabelSelector.get();
      while (accountLabelIterator.hasNext()) {
        var accountLabel = accountLabelIterator.next();
      } 
      // Select Enabled Campaign
      var campaignSelector = AdWordsApp
          .campaigns()
          .withCondition("Status = ENABLED");

      var campaignIterator = campaignSelector.get();

      while(campaignIterator.hasNext()) {
          var campaign = campaignIterator.next();
          var campaignName = campaign.getName();
          // Print Campaign Name for Debugging
          Logger.log("Campaign Name: " + campaignName);

          var labelSelector = AdWordsApp.labels();

          var labelIterator = labelSelector.get();

          while (labelIterator.hasNext()) {
              var label = labelIterator.next();
              Logger.log("Campaign Labels: " + label.getName());
          }
      }
      var adGroupSelector = AdWordsApp
          .adGroups()
          .withCondition("Status = ENABLED")
          .forDateRange("LAST_7_DAYS");
 
      var adGroupIterator = adGroupSelector.get();
      while (adGroupIterator.hasNext()) {
          var adGroup = adGroupIterator.next();
          var ads = adGroupIterator.totalNumEntities();
      }
    
      Logger.log("Total ads in AdGroup: " + ads);
    
      var adSelector = AdWordsApp
          .ads()
          .withCondition("CampaignStatus = ENABLED")
          .withCondition("CombinedApprovalStatus = DISAPPROVED");

      var adIterator = adSelector.get();
      while (adIterator.hasNext()) {
          var ad = adIterator.next();
          var adStatus = ad.getPolicyApprovalStatus();
          Logger.log("Ad: " + ad + " Ad Status: " + adStatus);
      }
  }
          if(adStatus = "DISAPPROVED") {
          Logger.log("Disapproved ad in this live campaign");
          // notify("Disapproved ads in this new campaign");
        } else {
          Logger.log("No Disapproved ads"); 
        }
    
      

      if(ads <= 0) {
          Logger.log("Campaign is Live and Ads haven't been created for this campaign: " + campaignName);
      } else {
          Logger.log("Campaign is Live and it has creative. Removing iHeart-NEW Label from the account...");
          //label.removeLabel(accountLabel);
          accountLabel.remove();
          //notify("Campaign is Live and it has creative. Removing iHeart-NEW Label from the campaign and account...");
      }
}