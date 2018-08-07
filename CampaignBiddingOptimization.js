// MCC Script for looking at an account and deciding which bidding strategy to use.
// Works off of "Bidding_Optimization" label
// Spreadsheet for viewing the accounts/campaigns
  // Color code the Max_Clicks & VCPM recommendations
// Looks at CTR - < 0.5%
// Looks at CPC - < $2.00
// If the campaign meets that criteria, the bidding strategy should be max clicks
// If not it should be VCPM


function main() {
  // Init Spreadsheet
  var spreadsheet = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1LQoJ0Gw2KJBXr5M0m5WfjODYEPyOOjRw1peps7DK4no/edit?usp=sharing");
  var sheet = spreadsheet.getSheets()[0];

  // Init Global Variables
  var maxCpm = parseFloat(1.25);
  var maxCpc = parseFloat(2.00);
  var ctrCheck = parseFloat(.0005);
  // Get Today's Date
  var today = new Date();
  var todayDate = Utilities.formatDate(today, "EDT",'MM-dd-yyyy');
  // Bidding Recommendation
  

  // Select Accounts
  var accountSelector = MccApp
        .accounts()
        .withCondition("LabelNames CONTAINS 'Bidding_Optimization'")
        .withLimit(50);

  var accountIterator = accountSelector.get();
  // Select Current Account
  while(accountIterator.hasNext()) {
    var account = accountIterator.next();
    var accountName = account.getName();

    MccApp.select(account);

    // Select Campaign - check if enabled
    var campaignSelector = AdWordsApp
      .campaigns()
      .withCondition("Status = ENABLED");

    var campaignIterator = campaignSelector.get();

    while(campaignIterator.hasNext()) {
      var campaign = campaignIterator.next();
      var campaignName = campaign.getName();
      
      var bidRec = '';

      var stats = campaign.getStatsFor("LAST_7_DAYS");

      // Grab Metrics
      var cpc = stats.getAverageCpc();
      var cpm = stats.getAverageCpm();
      var ctr = stats.getCtr();
      Logger.log("****************");
      Logger.log("Account Name: " + accountName + " Campaign Name: " + campaignName + " cpc: " + cpc + " cpm: " + cpm + " ctr: " + ctr);
      
      // Conditional check (CTR & CPC)
	      // Max_Clicks
      if(cpc <= maxCpc) {
        Logger.log("Current Cost per Click is below Target of $2.00 - Recommended Bidding Strategy is Max Clicks");
        // Add recommendation to spreadsheet
        bidRec = 'Max_Clicks';
        campaign.bidding().setStrategy("TARGET_SPEND");

      } // VCPM
      else if(cpm >= maxCpm) {
          Logger.log("Cpm is above $5 - Recommended bidding strategy is VCPM");
          // Add recommendation to spreadsheet
          bidRec = 'VCPM';
          campaign.bidding().setStrategy("MANUAL_CPM");
        }
      else {
          Logger.log("Campaign stats are holding, no adjustment necessary");
        	bidRec = 'VCPM';
        }


      // Conditional check (CTR & CPC)
      
     Logger.log("***********************");
      sheet.appendRow([accountName, campaignName, bidRec]);
    }
  }
  sheet.appendRow(['-----','End of script Execution', '-----', todayDate]);
}