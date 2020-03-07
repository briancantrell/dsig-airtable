import * as slack from "@slack/webhook"

const WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL

interface Block {
  type: string;
  text?: {
    type: string;
    text: string;
  }
  accessory?: {
    type: string;
    image_url: string;
    alt_text: string;
  }
  elements?: object[]
}

export const sendRideReportToSlack = async (rideReport) => {
  console.log("in slack client", rideReport)
  const webhook = new slack.IncomingWebhook(WEBHOOK_URL);

  let messageblock: {blocks: Block[]} = {
    blocks: [
      {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": ":zap::zap::zap::zap::zap::zap::zap::zap::zap::zap::zap::zap::zap::zap::zap:"
        }
      },
      {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": `:pencil: :mountain_bicyclist: *${rideReport.Ride} Ride Report* :mountain_bicyclist: :pencil:`.toUpperCase()
        }
      },
      {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": `:chicken: ${rideReport.Leader.name} \n ${rideReport.Summary}`
        },
        "accessory": {
          "type": "image",
          "image_url": rideReport.Leader.photo.thumbnails.large.url,
          "alt_text": rideReport.Leader.name       
        }
      },
    ]
  }

  rideReport.Reports.forEach(report => {
    messageblock.blocks.push({ "type": "divider" })
    messageblock.blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `:hatched_chick:* ${report.Participant.name}*\n${report.Report}`
      },
      accessory: {
        type: "image",
        image_url: report.Participant.photo.thumbnails.large.url,
        alt_text: report.Participant.name
      }
    })
  });
  messageblock.blocks.push( {
    "type": "context",
    "elements": [
      {
        "type": "mrkdwn",
        "text": `@mando report id #${rideReport.Id}`
      }
    ]
  })

  return await webhook.send(messageblock)
}
