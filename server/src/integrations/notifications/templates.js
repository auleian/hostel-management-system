const wrap = (title, body) => `<!doctype html>
<html><head><meta charset="utf-8"><title>${title}</title></head>
<body style="font-family: Arial, sans-serif; background:#f5f5f5; padding: 24px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;padding:24px;border-radius:8px;border:1px solid #e5e7eb;">
    <h2 style="color:#111827;margin-top:0;">${title}</h2>
    ${body}
    <p style="color:#6b7280;font-size:12px;margin-top:32px;">Hostel Management System</p>
  </div>
</body></html>`;

const fmtMoney = (amount, currency = "UGX") => `${currency} ${Number(amount || 0).toLocaleString()}`;

export const templates = {
  BOOKING_CREATED: ({ user, booking, room, hostel }) => ({
    subject: `Booking received for ${hostel?.name || "hostel"}`,
    html: wrap(
      "Booking received",
      `<p>Hi ${user?.name || "there"},</p>
       <p>We've received your booking request for <strong>${hostel?.name || "the hostel"}</strong>${room ? `, room <strong>${room.roomNumber}</strong>` : ""}.</p>
       <p>Status: <strong>${booking.status}</strong>. Complete payment to confirm.</p>
       <p>Amount due: <strong>${fmtMoney(booking.amount)}</strong></p>`
    ),
    text: `Booking received for ${hostel?.name || "hostel"}. Amount due: ${fmtMoney(booking.amount)}.`,
    sms: `Booking received for ${hostel?.name || "the hostel"}. Amount due: ${fmtMoney(booking.amount)}. Pay via mobile money to confirm.`,
  }),

  BOOKING_CONFIRMED: ({ user, booking, room, hostel }) => ({
    subject: `Booking confirmed at ${hostel?.name || "hostel"}`,
    html: wrap(
      "Booking confirmed",
      `<p>Hi ${user?.name || "there"},</p>
       <p>Your booking at <strong>${hostel?.name || "the hostel"}</strong>${room ? `, room <strong>${room.roomNumber}</strong>` : ""} is confirmed.</p>
       <p>Check-in: <strong>${booking.checkInDate ? new Date(booking.checkInDate).toDateString() : "TBD"}</strong></p>`
    ),
    text: `Booking confirmed at ${hostel?.name || "hostel"}.`,
    sms: `Your booking at ${hostel?.name || "the hostel"} is confirmed. Check-in: ${booking.checkInDate ? new Date(booking.checkInDate).toDateString() : "TBD"}.`,
  }),

  PAYMENT_SUCCESSFUL: ({ user, booking, payment, hostel }) => ({
    subject: `Payment received — ${hostel?.name || "booking"}`,
    html: wrap(
      "Payment received",
      `<p>Hi ${user?.name || "there"},</p>
       <p>We've received your payment of <strong>${fmtMoney(payment.amount, payment.currency)}</strong> via <strong>${payment.provider?.toUpperCase()}</strong>.</p>
       <p>Reference: <code>${payment.transactionReference}</code></p>`
    ),
    text: `Payment of ${fmtMoney(payment.amount, payment.currency)} received via ${payment.provider}.`,
    sms: `Payment of ${fmtMoney(payment.amount, payment.currency)} received via ${payment.provider?.toUpperCase()}. Ref: ${payment.transactionReference}.`,
  }),

  PAYMENT_FAILED: ({ user, payment }) => ({
    subject: "Payment failed",
    html: wrap(
      "Payment failed",
      `<p>Hi ${user?.name || "there"},</p>
       <p>Your payment of <strong>${fmtMoney(payment.amount, payment.currency)}</strong> via <strong>${payment.provider?.toUpperCase()}</strong> did not go through.</p>
       <p>Reason: ${payment.statusReason || "Unknown"}.</p>
       <p>Please try again from your booking page.</p>`
    ),
    text: `Payment of ${fmtMoney(payment.amount, payment.currency)} via ${payment.provider} failed.`,
    sms: `Payment of ${fmtMoney(payment.amount, payment.currency)} via ${payment.provider?.toUpperCase()} failed. Please retry.`,
  }),

  NEW_BOOKING_FOR_OWNER: ({ owner, booking, user, room, hostel }) => ({
    subject: `New booking for ${hostel?.name || "your hostel"}`,
    html: wrap(
      "New booking received",
      `<p>Hi ${owner?.name || "Owner"},</p>
       <p>A new booking has been placed at <strong>${hostel?.name || "your hostel"}</strong>.</p>
       <ul>
         <li>Guest: ${user?.name || "Unknown"} (${user?.email || "n/a"})</li>
         <li>Room: ${room?.roomNumber || "n/a"}</li>
         <li>Check-in: ${booking.checkInDate ? new Date(booking.checkInDate).toDateString() : "TBD"}</li>
         <li>Amount: ${fmtMoney(booking.amount)}</li>
       </ul>`
    ),
    text: `New booking by ${user?.name} at ${hostel?.name}. Check-in ${booking.checkInDate ? new Date(booking.checkInDate).toDateString() : "TBD"}.`,
    sms: `New booking at ${hostel?.name || "your hostel"} by ${user?.name || "guest"}. Check-in ${booking.checkInDate ? new Date(booking.checkInDate).toDateString() : "TBD"}.`,
  }),
};
