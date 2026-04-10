const RejectedLoanHtml = (user, reason) => {
  const frontendUrl = process.env.FRONTEND_URL
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      @media screen and (max-width: 600px) { .content { width: 100% !important; } }
    </style>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4; padding: 20px 0;">
      <tr>
        <td align="center">
          <table class="content" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; border: 1px solid #e0e0e0; overflow: hidden;">
            <tr>
              <td align="center" style="padding: 40px 0 20px 0; border-top: 6px solid #d9534f; background-color: #fffafa;">
                 <div style="font-size: 45px; margin-bottom: 10px;">📋</div>
                 <h2 style="margin: 0; font-size: 22px; color: #333333; text-transform: uppercase; letter-spacing: 1px;">Loan Application Update</h2>
              </td>
            </tr>
            <tr>
              <td style="padding: 30px 40px; text-align: left; color: #333333;">
                <p style="font-size: 16px; line-height: 24px; margin: 0 0 15px 0;">Dear <b>${user.fullname ? user.fullname : 'Valued Client'}</b>,</p>
                
                <p style="font-size: 15px; line-height: 24px; color: #555555; margin: 0 0 20px 0;">
                  Thank you for choosing <b>LOAN-APP</b> for your financial needs. After a careful review of your recent loan application, we regret to inform you that we are unable to approve your request at this time.
                </p>

                <div style="background-color: #fdf2f2; border-left: 4px solid #d9534f; padding: 15px 20px; margin: 25px 0;">
                  <p style="font-size: 12px; font-weight: bold; color: #d9534f; margin: 0 0 5px 0; text-transform: uppercase;">Reason for Decision:</p>
                  <p style="font-size: 14px; color: #333333; margin: 0; font-style: italic;">
                    "${reason ? reason : 'Your application did not meet our current internal credit requirements or documentation standards.'}"
                  </p>
                </div>
                
                <p style="font-size: 15px; line-height: 24px; color: #555555; margin: 0 0 30px 0;">
                  You are welcome to re-apply after 30 days or once the issues mentioned above have been addressed. In the meantime, you can view your application history on your dashboard.
                </p>

                <table border="0" cellspacing="0" cellpadding="0" align="center" style="margin-bottom: 20px;">
                  <tr>
                    <td align="center" bgcolor="#333333" style="border-radius: 8px;">
                      <a href="${frontendUrl}/dashboard" target="_blank" style="font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; padding: 14px 40px; display: inline-block;">View Dashboard</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 25px 40px; background-color: #f9f9f9; text-align: center;">
                <p style="font-size: 13px; color: #777777; margin: 0 0 10px 0;">
                  This is an automated notification. Please do not reply directly to this email.
                </p>
                <p style="font-size: 12px; color: #aaaaaa; margin: 0;">
                  &copy; ${new Date().getFullYear()} LOAN-APP Financial Services. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `
  return html
}

export default RejectedLoanHtml;